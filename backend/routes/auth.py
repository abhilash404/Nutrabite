from flask import Blueprint, jsonify, request
from models import db
from models.models import User, UserDailyStats, LogEntry

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify(success=False, message="User not found"), 404
        
    return jsonify(success=True, user={
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'dailyCaloriesLimit': user.dailyCaloriesLimit,
        'budget': user.budgetInPaise / 100 if user.budgetInPaise else None,
        'goal': user.goal
    })

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    
    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify(success=False, message="Email already registered"), 400
        
    user = User(
        name=data.get('name'),
        email=email,
        phone=data.get('phone')
    )
    db.session.add(user)
    db.session.commit()
    
    return jsonify(success=True, user={
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'dailyCaloriesLimit': user.dailyCaloriesLimit,
        'budget': user.budgetInPaise / 100 if user.budgetInPaise else None,
        'goal': user.goal
    })

@auth_bp.route('/<user_id>/stats', methods=['GET'])
def get_user_stats(user_id):
    user = User.query.get(user_id)
    if not user:
         return jsonify(success=False), 404
         
    stats = UserDailyStats.query.filter_by(userId=user_id).order_by(UserDailyStats.date.asc()).all()
    
    weight_data = []
    activity_data = []
    
    for s in stats:
        date_str = s.date.strftime("%a")
        weight_data.append({"day": date_str, "weight": s.weight})
        activity_data.append({"day": date_str, "steps": s.steps, "workout": s.workoutMins})
        
    limit = user.dailyCaloriesLimit
    calorie_data = []
    
    logs = LogEntry.query.filter_by(userId=user_id).order_by(LogEntry.loggedAt.asc()).all()
    
    from collections import defaultdict
    cal_by_date = defaultdict(int)
    prot_total = 0
    carb_total = 0
    fat_total = 0
    
    for l in logs:
        d_str = l.loggedAt.strftime("%a")
        cal_by_date[d_str] += l.calories
        prot_total += l.protein
        carb_total += l.carbs
        fat_total += l.fat
        
    for s in stats:
        d_str = s.date.strftime("%a")
        calorie_data.append({
            "day": d_str,
            "consumed": cal_by_date[d_str],
            "limit": limit
        })
        
    macro_data = [
        {"name": "Protein", "value": prot_total, "fill": "#22c55e"},
        {"name": "Carbs", "value": carb_total, "fill": "#3b82f6"},
        {"name": "Fats", "value": fat_total, "fill": "#f59e0b"}
    ]
    
    return jsonify(
        success=True,
        weightData=weight_data,
        activityData=activity_data,
        calorieData=calorie_data,
        macroData=macro_data
    )
