import os

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    
    # Uses PostgreSQL on Render, falls back to local SQLite for dev
    DATABASE_URL = os.environ.get('DATABASE_URL')
    
    if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
        # Render gives postgres:// but SQLAlchemy needs postgresql://
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    
    SQLALCHEMY_DATABASE_URI = DATABASE_URL or f'sqlite:///{os.path.join(BASE_DIR, "dev.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-123')