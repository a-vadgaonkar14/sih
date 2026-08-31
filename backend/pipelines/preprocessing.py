"""
AVIA / APIx India Data Preprocessing & Outlier Detection Pipeline
================================================================
Implements:
1. Standard Z-Score Normalization: Z = (X - μ) / σ
2. Boris Iglewicz & David Hoaglin Modified Z-Score using MAD (Median Absolute Deviation)
3. Sector-Specific & Lead-Window Stratified Anomaly Detection
4. Outlier Tagging & Directional Classification (Surge vs. Flash Anomaly)
"""

import math
import statistics
from typing import List, Dict, Any, Optional, Tuple


def calculate_modified_z_score(prices: List[float]) -> List[Tuple[float, float, bool]]:
    """
    Calculates the Modified Z-score using Median Absolute Deviation (MAD).
    Returns list of tuples: (price, modified_z_score, is_outlier)
    Threshold: |M_i| > 3.0 is classified as an outlier.
    """
    if not prices:
        return []
    if len(prices) == 1:
        return [(prices[0], 0.0, False)]

    med = statistics.median(prices)
    deviations = [abs(p - med) for p in prices]
    mad = statistics.median(deviations)

    results = []
    for p in prices:
        if mad > 0:
            m_score = 0.6745 * (p - med) / mad
        else:
            # Fallback to standard deviation if MAD is zero (all prices nearly identical)
            std_dev = statistics.stdev(prices) if len(prices) > 1 else 1.0
            m_score = (p - med) / std_dev if std_dev > 0 else 0.0

        is_outlier = abs(m_score) > 3.0
        results.append((p, round(m_score, 3), is_outlier))

    return results


def calculate_z_scores(prices: List[float], threshold: float = 2.0) -> List[Tuple[float, float, bool]]:
    """
    Calculates standard Z-scores: Z = (X - μ) / σ
    Returns list of tuples: (price, z_score, is_outlier)
    Threshold: |Z| > 2.0 is classified as an outlier.
    """
    if not prices:
        return []
    if len(prices) == 1:
        return [(prices[0], 0.0, False)]

    mean = statistics.mean(prices)
    std_dev = statistics.stdev(prices) if len(prices) > 1 else 0.0

    results = []
    for p in prices:
        z = (p - mean) / std_dev if std_dev > 0 else 0.0
        is_outlier = abs(z) > threshold
        results.append((p, round(z, 3), is_outlier))

    return results


def annotate_observations_with_outliers(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Stratifies observations by route (origin-dest) and lead window (e.g. T+1, T+7),
    computes Z-score and Modified Z-score for each observation's total_fare,
    and enriches each record with outlier metrics.
    """
    if not records:
        return []

    # If items are FlightObservation instances, convert to dicts
    dict_records = []
    for r in records:
        if hasattr(r, "to_dict"):
            d = r.to_dict()
            if not d.get("lead_window") and hasattr(r, "_lead_window"):
                d["lead_window"] = r._lead_window()
            dict_records.append(d)
        elif isinstance(r, dict):
            dict_records.append(dict(r))
        else:
            dict_records.append(dict(r.__dict__))

    records = dict_records

    # Group by (origin, destination, lead_window)
    groups: Dict[Tuple[str, str, str], List[int]] = {}
    for idx, r in enumerate(records):
        origin = r.get("origin", "")
        dest = r.get("destination", "")
        lead = r.get("lead_window", "T+?")
        key = (origin, dest, lead)
        if key not in groups:
            groups[key] = []
        groups[key].append(idx)

    # Process each stratum
    for key, indices in groups.items():
        fares = [float(records[i].get("total_fare", 0.0) or 0.0) for i in indices]
        
        if len(fares) >= 3:
            mean = statistics.mean(fares)
            std_dev = statistics.stdev(fares) if len(fares) > 1 else 0.0
            med = statistics.median(fares)
            mad = statistics.median([abs(f - med) for f in fares])
        else:
            mean = fares[0] if fares else 0.0
            std_dev = 0.0
            med = mean
            mad = 0.0

        for i in indices:
            fare = float(records[i].get("total_fare", 0.0) or 0.0)
            
            # Standard Z-Score
            z = (fare - mean) / std_dev if std_dev > 0 else 0.0
            
            # Modified Z-Score (Iglewicz & Hoaglin)
            if mad > 0:
                mod_z = 0.6745 * (fare - med) / mad
            else:
                mod_z = z

            # Outlier Classification
            abs_z = abs(z)
            abs_mod_z = abs(mod_z)
            
            is_outlier = abs_z > 2.5 or abs_mod_z > 3.0
            
            if abs_z > 3.0 or abs_mod_z > 3.5:
                severity = "EXTREME_OUTLIER"
            elif abs_z > 2.0 or abs_mod_z > 2.5:
                severity = "MILD_OUTLIER"
            else:
                severity = "NORMAL"

            if fare > mean and (abs_z > 2.0 or abs_mod_z > 2.5):
                direction = "HIGH_PRICE_SURGE"
            elif fare < mean and (abs_z > 2.0 or abs_mod_z > 2.5):
                direction = "LOW_PRICE_ANOMALY"
            else:
                direction = None

            # Enrich record
            records[i]["z_score"] = round(z, 2)
            records[i]["modified_z_score"] = round(mod_z, 2)
            records[i]["is_outlier"] = is_outlier
            records[i]["outlier_severity"] = severity
            records[i]["outlier_direction"] = direction
            records[i]["stratum_mean_fare"] = round(mean, 2)
            records[i]["stratum_median_fare"] = round(med, 2)
            records[i]["stratum_std_dev"] = round(std_dev, 2)

    return records


def get_outlier_summary_stats(records: Any) -> Dict[str, Any]:
    """
    Computes global outlier statistics across the dataset.
    """
    if not records:
        return {
            "total_records": 0,
            "outlier_count": 0,
            "outlier_percentage": 0.0,
            "extreme_outliers": 0,
            "mild_outliers": 0,
            "high_surges": 0,
            "low_anomalies": 0,
            "clean_records": 0,
        }

    # Ensure records are annotated
    if records and not isinstance(records[0], dict):
        records = annotate_observations_with_outliers(records)
    elif records and "is_outlier" not in records[0]:
        records = annotate_observations_with_outliers(records)

    total = len(records)
    outliers = [r for r in records if r.get("is_outlier")]
    extreme = [r for r in records if r.get("outlier_severity") == "EXTREME_OUTLIER"]
    mild = [r for r in records if r.get("outlier_severity") == "MILD_OUTLIER"]
    high = [r for r in records if r.get("outlier_direction") == "HIGH_PRICE_SURGE"]
    low = [r for r in records if r.get("outlier_direction") == "LOW_PRICE_ANOMALY"]

    return {
        "total_records": total,
        "outlier_count": len(outliers),
        "outlier_percentage": round((len(outliers) / total) * 100, 2),
        "extreme_outliers": len(extreme),
        "mild_outliers": len(mild),
        "high_surges": len(high),
        "low_anomalies": len(low),
        "clean_records": total - len(outliers),
    }
