"""
AVIA / APIx India Data Constants
Static reference data for airports, routes, carriers, and configuration.
"""

AIRPORTS = {
    "DEL": {"name": "Indira Gandhi Intl, Delhi", "city": "Delhi", "tier": "Metro", "region": "North", "coords": [28.5562, 77.1000]},
    "BOM": {"name": "Chhatrapati Shivaji Maharaj Intl, Mumbai", "city": "Mumbai", "tier": "Metro", "region": "West", "coords": [19.0896, 72.8656]},
    "BLR": {"name": "Kempegowda Intl, Bengaluru", "city": "Bengaluru", "tier": "Metro", "region": "South", "coords": [13.1986, 77.7066]},
    "CCU": {"name": "Netaji Subhash Chandra Bose Intl, Kolkata", "city": "Kolkata", "tier": "Metro", "region": "East", "coords": [22.6547, 88.4467]},
    "HYD": {"name": "Rajiv Gandhi Intl, Hyderabad", "city": "Hyderabad", "tier": "Metro", "region": "South", "coords": [17.2403, 78.4294]},
    "MAA": {"name": "Chennai Intl, Chennai", "city": "Chennai", "tier": "Metro", "region": "South", "coords": [12.9941, 80.1709]},
    "PNQ": {"name": "Pune Airport, Pune", "city": "Pune", "tier": "Tier-2", "region": "West", "coords": [18.5822, 73.9197]},
    "GOI": {"name": "Dabolim / Manohar Intl, Goa", "city": "Goa", "tier": "Leisure", "region": "West", "coords": [15.3808, 73.8314]},
    "GAU": {"name": "Lokpriya Gopinath Bordoloi Intl, Guwahati", "city": "Guwahati", "tier": "Regional", "region": "Northeast", "coords": [26.1061, 91.5859]},
    "ATQ": {"name": "Sri Guru Ram Dass Jee Intl, Amritsar", "city": "Amritsar", "tier": "Tier-2", "region": "North", "coords": [31.7096, 74.7973]},
    "JAI": {"name": "Jaipur Intl, Jaipur", "city": "Jaipur", "tier": "Tier-2", "region": "North", "coords": [26.8242, 75.8122]},
    "COK": {"name": "Cochin Intl, Kochi", "city": "Kochi", "tier": "Tier-2", "region": "South", "coords": [10.1556, 76.4019]}
}

ROUTE_PAIRS = [
    ("DEL", "BOM", 0.165, "Heavy Metro Business"),
    ("BOM", "DEL", 0.160, "Heavy Metro Business"),
    ("DEL", "BLR", 0.138, "Inter-Metro High Density"),
    ("BLR", "DEL", 0.135, "Inter-Metro High Density"),
    ("BOM", "BLR", 0.130, "Tech Corridor Metro"),
    ("BLR", "BOM", 0.125, "Tech Corridor Metro"),
    ("DEL", "CCU", 0.086, "North-East Trunk"),
    ("CCU", "DEL", 0.082, "North-East Trunk"),
    ("BLR", "HYD", 0.074, "South Tech Corridor"),
    ("HYD", "BLR", 0.070, "South Tech Corridor"),
    ("MAA", "DEL", 0.069, "Coastal Metro Trunk"),
    ("DEL", "MAA", 0.065, "Coastal Metro Trunk"),
    ("BOM", "CCU", 0.050, "West-East Trunk"),
    ("BOM", "HYD", 0.045, "West-South Trunk"),
    ("DEL", "GOI", 0.040, "Leisure High Volatility")
]

CARRIERS = [
    {"name": "IndiGo", "code": "6E", "market_share": 0.61, "color": "#002060", "type": "LCC (Low Cost Carrier)"},
    {"name": "Air India", "code": "AI", "market_share": 0.15, "color": "#E11D48", "type": "FSC (Full Service Carrier)"},
    {"name": "Air India Express", "code": "IX", "market_share": 0.09, "color": "#D97706", "type": "LCC (Low Cost Subsidiary)"},
    {"name": "Akasa Air", "code": "QP", "market_share": 0.09, "color": "#FF4500", "type": "LCC (Low Cost Carrier)"},
    {"name": "SpiceJet", "code": "SG", "market_share": 0.06, "color": "#FF2B06", "type": "LCC (Low Cost Carrier)"}
]

SOURCES = [
    {"name": "Air India Direct Portal", "id": "airindia_direct", "type": "Direct Airline Engine", "weight": 0.35, "reliability": 99.9},
    {"name": "IndiGo Direct Engine", "id": "indigo_direct", "type": "Direct Airline Engine", "weight": 0.35, "reliability": 99.8},
    {"name": "Google Flights Aggregator", "id": "googleflights", "type": "Meta Search GDS", "weight": 0.20, "reliability": 99.5},
    {"name": "Air India NDC API GDS", "id": "airindia_ndc", "type": "Direct Airline API", "weight": 0.10, "reliability": 100.0}
]

LEAD_WINDOWS = [
    {"label": "T+1", "days": 1, "weight": 0.20, "multiplier": 1.78, "desc": "Last Minute Emergency / Corporate"},
    {"label": "T+7", "days": 7, "weight": 0.25, "multiplier": 1.18, "desc": "1-Week Standard Booking"},
    {"label": "T+15", "days": 15, "weight": 0.30, "multiplier": 1.00, "desc": "Mid-Range Booking Window (Baseline)"},
    {"label": "T+30", "days": 30, "weight": 0.15, "multiplier": 0.88, "desc": "Planned Advance Purchase"},
    {"label": "T+45", "days": 45, "weight": 0.10, "multiplier": 0.82, "desc": "Early Vacation / Long Range Planner"}
]

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
DAY_FACTORS = {
    "Monday": 1.04,
    "Tuesday": 0.97,
    "Wednesday": 0.96,
    "Thursday": 1.01,
    "Friday": 1.09,
    "Saturday": 1.02,
    "Sunday": 1.08
}
