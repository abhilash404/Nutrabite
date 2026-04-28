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
    cart = db.relationship('Cart', backref='user', uselist=False)
    orders = db.relationship('Order', backref='user', lazy=True)
    dailyStats = db.relationship('UserDailyStats', backref='user', lazy=True)

class UserDailyStats(db.Model):
    __tablename__ = 'UserDailyStats'
    id = db.Column(db.String, primary_key=True, default=generate_cuid)
    userId = db.Column(db.String, db.ForeignKey('User.id'), nullable=False)
    date = db.Column(db.Date, nullable=False) # e.g. 2026-04-20
    weight = db.Column(db.Float, nullable=True)
    steps = db.Column(db.Integer, default=0)
    workoutMins = db.Column(db.Integer, default=0)

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
    protein = db.Column(db.Integer, default=0, nullable=False)
    carbs = db.Column(db.Integer, default=0, nullable=False)
    fat = db.Column(db.Integer, default=0, nullable=False)
    priceInPaise = db.Column(db.Integer, nullable=False)
    loggedAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class Cart(db.Model):
    __tablename__ = 'Cart'
    id = db.Column(db.String, primary_key=True, default=generate_cuid)
    userId = db.Column(db.String, db.ForeignKey('User.id'), nullable=False, unique=True)
    items = db.relationship('CartItem', backref='cart', lazy=True, cascade="all, delete-orphan")

class CartItem(db.Model):
    __tablename__ = 'CartItem'
    id = db.Column(db.String, primary_key=True, default=generate_cuid)
    cartId = db.Column(db.String, db.ForeignKey('Cart.id'), nullable=False)
    menuItemId = db.Column(db.String, db.ForeignKey('MenuItem.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)
    
    menuItem = db.relationship('MenuItem')

class Order(db.Model):
    __tablename__ = 'Order'
    id = db.Column(db.String, primary_key=True, default=generate_cuid)
    userId = db.Column(db.String, db.ForeignKey('User.id'), nullable=False)
    status = db.Column(db.String, default='Pending', nullable=False)
    totalInPaise = db.Column(db.Integer, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan")

class OrderItem(db.Model):
    __tablename__ = 'OrderItem'
    id = db.Column(db.String, primary_key=True, default=generate_cuid)
    orderId = db.Column(db.String, db.ForeignKey('Order.id'), nullable=False)
    menuItemId = db.Column(db.String, db.ForeignKey('MenuItem.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    priceAtTimeInPaise = db.Column(db.Integer, nullable=False)
    
    menuItem = db.relationship('MenuItem')
