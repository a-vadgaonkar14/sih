"""
AVIA / APIx India Analytics & Preprocessing Pipelines Package
Statistical Airfare Price Index computation and outlier detection models.
"""

from .analytics import (
    calculate_jevons_index,
    calculate_dutot_index,
    calculate_carli_index,
    calculate_laspeyres_basket_index,
    compute_route_index,
)

from .preprocessing import (
    calculate_z_scores,
    calculate_modified_z_score,
    annotate_observations_with_outliers,
    get_outlier_summary_stats,
)

__all__ = [
    "calculate_jevons_index",
    "calculate_dutot_index",
    "calculate_carli_index",
    "calculate_laspeyres_basket_index",
    "compute_route_index",
    "calculate_z_scores",
    "calculate_modified_z_score",
    "annotate_observations_with_outliers",
    "get_outlier_summary_stats",
]
