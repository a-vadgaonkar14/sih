import math
from typing import List, Dict, Optional
from datetime import datetime
from backend.database.db import db
from backend.models import FlightObservation, IndexObservation, Route


def calculate_jevons_index(current_prices: List[float], base_price: float) -> float:
    """
    Calculates the Jevons elementary index (geometric mean of price relatives).
    I = 100 * exp( mean( ln( P_current / P_base ) ) )
    Recommended by ILO for CPI elementary aggregates.
    """
    if not current_prices or base_price <= 0:
        return 0.0

    log_relatives = [math.log(p / base_price) for p in current_prices if p > 0]
    if not log_relatives:
        return 0.0

    mean_log_relatives = sum(log_relatives) / len(log_relatives)
    index_value = 100.0 * math.exp(mean_log_relatives)
    return round(index_value, 2)


def calculate_dutot_index(current_prices: List[float], base_price: float) -> float:
    """
    Calculates the Dutot elementary index (ratio of arithmetic mean prices).
    I = 100 * ( mean(P_current) / P_base )
    """
    if not current_prices or base_price <= 0:
        return 0.0
    valid = [p for p in current_prices if p > 0]
    if not valid:
        return 0.0
    return round(100.0 * (sum(valid) / len(valid)) / base_price, 2)


def calculate_carli_index(current_prices: List[float], base_price: float) -> float:
    """
    Calculates the Carli elementary index (arithmetic mean of price relatives).
    I = 100 * mean( P_current / P_base )
    """
    if not current_prices or base_price <= 0:
        return 0.0
    relatives = [(p / base_price) for p in current_prices if p > 0]
    if not relatives:
        return 0.0
    return round(100.0 * (sum(relatives) / len(relatives)), 2)


def calculate_laspeyres_basket_index(route_indices: Dict[str, float], route_weights: Dict[str, float]) -> float:
    """
    Calculates the higher-level Laspeyres index aggregating route elementary indices
    weighted by historical expenditure/passenger volume share.
    I_L = sum( w_r * I_r ) / sum( w_r )
    """
    if not route_indices:
        return 0.0
    total_w = sum(route_weights.get(r, 1.0) for r in route_indices)
    if total_w == 0:
        return 0.0
    weighted_sum = sum(route_indices[r] * route_weights.get(r, 1.0) for r in route_indices)
    return round(weighted_sum / total_w, 2)


def compute_route_index(
    route_id: str,
    date: str,
    base_period: str = "2026-01",
    base_price: float = 5000.0,
    app_context=None
) -> Optional[IndexObservation]:
    """
    Computes the daily index for a specific route based on real observed flights.
    """
    def _do():
        origin, destination = route_id.split("-")
        observations = FlightObservation.query.filter_by(
            origin=origin,
            destination=destination,
            travel_date=date,
            availability_status="OBSERVED",
            is_synthetic=False,
            is_replay=False
        ).all()

        prices = [obs.total_fare for obs in observations if obs.total_fare is not None and obs.total_fare > 0]

        # IQR outlier rejection
        if len(prices) > 4:
            sorted_prices = sorted(prices)
            q1 = sorted_prices[int(len(sorted_prices) * 0.25)]
            q3 = sorted_prices[int(len(sorted_prices) * 0.75)]
            iqr = q3 - q1
            lower_bound = q1 - 1.5 * iqr
            upper_bound = q3 + 1.5 * iqr
            prices = [p for p in prices if lower_bound <= p <= upper_bound]

        if not prices:
            return None

        index_value = calculate_jevons_index(prices, base_price)

        idx_obs = IndexObservation(
            date=date,
            frequency="DAILY",
            route=route_id,
            index_value=index_value,
            base_period=base_period,
            base_price=base_price,
            observation_count=len(prices)
        )
        try:
            db.session.add(idx_obs)
            db.session.commit()
        except Exception:
            db.session.rollback()

        return idx_obs

    if app_context:
        with app_context():
            return _do()
    return _do()
