import os
from app import create_app
from models import db
from models.models import User, Kitchen, MenuItem, LogEntry, UserDailyStats, Cart, CartItem, Order, OrderItem
import uuid
from datetime import datetime, timedelta, date
import uuid

app = create_app()

def generate_cuid():
    return "c" + uuid.uuid4().hex[:24]

with app.app_context():
    db.create_all()
    # Clear existing data first
    CartItem.query.delete()
    Cart.query.delete()
    OrderItem.query.delete()
    Order.query.delete()
    MenuItem.query.delete()
    Kitchen.query.delete()
    LogEntry.query.delete()
    UserDailyStats.query.delete()
    User.query.delete()

    # Create dummy user
    u = User(id="user_1", name="John Doe", email="john@example.com", phone="1234567890", dailyCaloriesLimit=2200, budgetInPaise=50000)
    db.session.add(u)

    k1 = Kitchen(id="r1", name="Green Bowl Cloud Kitchen", rating=4.8, deliveryTime="20-30 min", tags="Healthy,Salads,Vegan", image="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80")
    k2 = Kitchen(id="r2", name="Protein Box Deli", rating=4.6, deliveryTime="25-40 min", tags="Keto,High Protein,Grill", image="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80")
    k3 = Kitchen(id="r3", name="Sprout & Spice", rating=4.5, deliveryTime="30-45 min", tags="Indian,Vegetarian,Curry", image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80")
    k4 = Kitchen(id="r4", name="FitBite Central", rating=4.9, deliveryTime="15-25 min", tags="Smoothies,Snacks,Breakfast", image="https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80")
    
    db.session.add_all([k1, k2, k3, k4])
    
    m1 = MenuItem(id="f1", name="Avocado Toast with Poached Egg", description="Whole grain toast topped with fresh avocado and a soft poached egg.", category="Breakfast", priceInPaise=35000, calories=350, protein=14, carbs=28, fat=20, type="Non-veg", image="https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80", isPopular=True, kitchenId="r4")
    m2 = MenuItem(id="f2", name="Vegan Protein Oat Bowl", description="Oats loaded with chia seeds, berries, and almond butter.", category="Breakfast", priceInPaise=25000, calories=420, protein=20, carbs=55, fat=16, type="Vegan", image="https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80", isPopular=False, kitchenId="r4")
    m3 = MenuItem(id="f3", name="Grilled Chicken Quinoa Salad", description="Lean chicken breast strips over a bed of quinoa, cherry tomatoes, and cucumber.", category="Lunch", priceInPaise=45000, calories=480, protein=45, carbs=40, fat=15, type="Non-veg", image="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80", isPopular=True, kitchenId="r1")
    m4 = MenuItem(id="f4", name="Lentil & Sweet Potato Curry", description="Rich, warming curry packed with plant-based protein and fiber.", category="Lunch", priceInPaise=39000, calories=410, protein=18, carbs=65, fat=10, type="Vegan", image="https://images.unsplash.com/photo-1565557612666-ac563604e389?w=800&q=80", isPopular=False, kitchenId="r3")
    m5 = MenuItem(id="f5", name="Baked Salmon with Asparagus", description="Omega-3 rich salmon fillet baked with lemon and served with roasted asparagus.", category="Dinner", priceInPaise=89000, calories=450, protein=42, carbs=10, fat=26, type="Non-veg", image="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80", isPopular=True, kitchenId="r2")
    m6 = MenuItem(id="f6", name="Paneer Tikka Wrap", description="Whole wheat wrap featuring spiced grilled paneer, peppers, and mint chutney.", category="Snacks", priceInPaise=22000, calories=380, protein=16, carbs=35, fat=20, type="Veg", image="https://images.unsplash.com/photo-1629814402631-01f1437198a2?w=800&q=80", isPopular=False, kitchenId="r3")
    m7 = MenuItem(id="f7", name="Protein Bliss Bites", description="Energy balls made from dates, nuts, and whey isolates.", category="Snacks", priceInPaise=15000, calories=220, protein=12, carbs=25, fat=9, type="Veg", image="https://images.unsplash.com/photo-1528751014936-863e6e8a3ee2?w=800&q=80", isPopular=False, kitchenId="r2")

    db.session.add_all([m1, m2, m3, m4, m5, m6, m7])
    
    # Generate 7 days of mock tracking data for user_1
    today = date.today()
    now = datetime.utcnow()
    
    stats_to_add = []
    logs_to_add = []
    
    for i in range(7):
        day = today - timedelta(days=6 - i)
        # Weight decreases slightly, steps and workout fluctuate
        weight = 80.5 - (i * 0.1) 
        steps = 6000 + (i * 500) + (1000 if i%2==0 else -500)
        workout = 30 + (i * 5)
        
        stat = UserDailyStats(userId="user_1", date=day, weight=weight, steps=steps, workoutMins=workout)
        stats_to_add.append(stat)
        
        # Add 3 meals per day
        log_time = now - timedelta(days=6 - i)
        l1 = LogEntry(userId="user_1", itemName="Morning Oats", calories=350, protein=15, carbs=45, fat=10, priceInPaise=15000, loggedAt=log_time.replace(hour=8))
        l2 = LogEntry(userId="user_1", itemName="Chicken Salad", calories=450, protein=40, carbs=20, fat=15, priceInPaise=35000, loggedAt=log_time.replace(hour=13))
        l3 = LogEntry(userId="user_1", itemName="Dinner Soup", calories=300, protein=10, carbs=40, fat=5, priceInPaise=20000, loggedAt=log_time.replace(hour=19))
        logs_to_add.extend([l1, l2, l3])
        
    db.session.add_all(stats_to_add)
    db.session.add_all(logs_to_add)
    
    db.session.commit()
    print("Database seeded completely!")
