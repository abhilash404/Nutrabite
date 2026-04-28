from app import create_app
from models import db
from models.models import UserDailyStats, LogEntry
from datetime import datetime, timedelta, date

USER_ID = "cb255a485d15d44159e2d8c25"

app = create_app()

with app.app_context():
    # Clear existing stats/logs for this user only
    UserDailyStats.query.filter_by(userId=USER_ID).delete()
    LogEntry.query.filter_by(userId=USER_ID).delete()

    today = date.today()
    now = datetime.utcnow()

    for i in range(7):
        day = today - timedelta(days=6 - i)
        weight = 80.5 - (i * 0.1)
        steps = 6000 + (i * 500) + (1000 if i % 2 == 0 else -500)
        workout = 30 + (i * 5)

        db.session.add(UserDailyStats(
            userId=USER_ID,
            date=day,
            weight=weight,
            steps=steps,
            workoutMins=workout
        ))

        log_time = now - timedelta(days=6 - i)
        db.session.add(LogEntry(userId=USER_ID, itemName="Morning Oats",   calories=350, protein=15, carbs=45, fat=10, priceInPaise=15000, loggedAt=log_time.replace(hour=8)))
        db.session.add(LogEntry(userId=USER_ID, itemName="Chicken Salad",  calories=450, protein=40, carbs=20, fat=15, priceInPaise=35000, loggedAt=log_time.replace(hour=13)))
        db.session.add(LogEntry(userId=USER_ID, itemName="Dinner Soup",    calories=300, protein=10, carbs=40, fat=5,  priceInPaise=20000, loggedAt=log_time.replace(hour=19)))

    db.session.commit()
    print("Stats and logs seeded for", USER_ID)