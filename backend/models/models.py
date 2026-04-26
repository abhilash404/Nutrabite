from datetime import datetime
from . import db
import uuid

def generate_cuid():
    # Helper to generate unique IDs similar to cuid
    return "c" + uuid.uuid4().hex[:24]

class User(db.Model):
    __tablename__ = 'User'
    id = db.Column(db.String, primary_key=True, default=generate_cuid)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    phone = db.Column(db.String, nullable=True)
    dailyCaloriesLimit = db.Column(db.Integer, default=2000, nullable=False)
    budgetInPaise = db.Column(db.Integer, nullable=True)
    goal = db.Column(db.String, default="Maintenance", nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    logs = db.relationship('LogEntry', backref='user', lazy=True)

class Kitchen(db.Model):
    __tablename__ = 'Kitchen'
    id = db.Column(db.String, primary_key=True, default=generate_cuid)
    name = db.Column(db.String, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    deliveryTime = db.Column(db.String, nullable=False)
    tags = db.Column(db.String, nullable=False)
    image = db.Column(db.String, nullable=False)
    
    menuItems = db.relationship('MenuItem', backref='kitchen', lazy=True)

class MenuItem(db.Model):
    __tablename__ = 'MenuItem'
    id = db.Column(db.String, primary_key=True, default=generate_cuid)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)
    priceInPaise = db.Column(db.Integer, nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    protein = db.Column(db.Integer, nullable=False)
    carbs = db.Column(db.Integer, nullable=False)
    fat = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String, nullable=False)
    image = db.Column(db.String, nullable=False)
    isPopular = db.Column(db.Boolean, default=False, nullable=False)
    kitchenId = db.Column(db.String, db.ForeignKey('Kitchen.id'), nullable=False)

class LogEntry(db.Model):
    __tablename__ = 'LogEntry'
    id = db.Column(db.String, primary_key=True, default=generate_cuid)
    userId = db.Column(db.String, db.ForeignKey('User.id'), nullable=False)
    itemName = db.Column(db.String, nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    priceInPaise = db.Column(db.Integer, nullable=False)
    loggedAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
