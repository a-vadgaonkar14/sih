import os

class Config:
    ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(ROOT_DIR, "avia.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAX_CONCURRENT_SCRAPES = 2
    USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
