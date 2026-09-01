"""
DGCA Domestic Market Share Constants (December 2024)
====================================================
Used for weighting Airfare Price Index (APIx) computations
to reflect true national inflation impact based on passenger volume.
"""

# Weights based on DGCA official December 2024 Domestic Traffic Report
DGCA_MARKET_SHARE_2024 = {
    "6E": 0.644,  # IndiGo
    "AI": 0.132,  # Air India
    "UK": 0.088,  # Vistara
    "IX": 0.044,  # Air India Express
    "QP": 0.046,  # Akasa Air
    "SG": 0.033,  # SpiceJet
    "OTHER": 0.013 # Google Flights aggregates or other minor carriers
}

def get_weighted_average(fare_dict: dict) -> float:
    """
    Computes a DGCA market-share weighted average.
    fare_dict: mapping of carrier_code to average fare for that carrier.
    Example: {"6E": 8500, "AI": 9200}
    """
    if not fare_dict:
        return 0.0
        
    total_weighted_fare = 0.0
    total_weight = 0.0
    
    for carrier, avg_fare in fare_dict.items():
        # Treat GF (Google Flights) or unknown carriers as 'OTHER'
        weight = DGCA_MARKET_SHARE_2024.get(carrier, DGCA_MARKET_SHARE_2024["OTHER"])
        total_weighted_fare += avg_fare * weight
        total_weight += weight
        
    if total_weight == 0:
        return 0.0
        
    # Redistribute weights proportionally if we don't have all airlines represented
    return total_weighted_fare / total_weight
