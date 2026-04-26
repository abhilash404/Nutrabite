import os

class Config:
    # Use the same SQLite database as the Next.js Prisma setup
    BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    PRISMA_DB = os.path.join(BASE_DIR, 'frontend', 'prisma', 'dev.db')
    
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{PRISMA_DB}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-123')
