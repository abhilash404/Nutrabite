from flask import Blueprint, jsonify, request
from models import db
from models.models import User, Kitchen, MenuItem, LogEntry
import random

main_bp = Blueprint('main', __name__)

# Basic error handler
@main_bp.errorhandler(404)
def not_found(e):
    return jsonify(error="Not found"), 404

# ----------------------------------------
# 1. Kitchens and Restaurants
# ----------------------------------------
@main_bp.route('/kitchens', methods=['GET'])
def get_kitchens():
    kitchens = Kitchen.query.all()
    result = []
    for k in kitchens:
        result.append({
            'id': k.id,
            'name': k.name,
            'rating': k.rating,
            'deliveryTime': k.deliveryTime,
            'tags': k.tags.split(',') if k.tags else [],
            'image': k.image
        })
    return jsonify(result)

# ----------------------------------------
# 2. Menu and Food Items
# ----------------------------------------
@main_bp.route('/menu', methods=['GET'])
def get_menu():
    category = request.args.get('category')
    query = MenuItem.query
    if category:
        query = query.filter_by(category=category)
        
    items = query.all()
    result = []
    for item in items:
        result.append({
            'id': item.id,
            'name': item.name,
            'description': item.description,
            'category': item.category,
            'price': item.priceInPaise / 100, # Converting paise to regular format for frontend
            'calories': item.calories,
            'protein': item.protein,
            'carbs': item.carbs,
            'fat': item.fat,
            'type': item.type,
            'image': item.image,
            'isPopular': item.isPopular,
            'kitchenId': item.kitchenId
        })
    return jsonify(result)

# ----------------------------------------
# 3. User & Logs
# ----------------------------------------
@main_bp.route('/user/profile', methods=['GET'])
def get_user_profile():
    # Return the first user for simplicity, since we have no auth
    user = User.query.first()
    if not user:
        return jsonify(error="User not found"), 404
        
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'dailyCaloriesLimit': user.dailyCaloriesLimit,
        'budget': user.budgetInPaise / 100 if user.budgetInPaise else None,
        'goal': user.goal
    })

@main_bp.route('/user/logs', methods=['GET'])
def get_user_logs():
    user = User.query.first()
    if not user:
        return jsonify(error="User not found"), 404
        
    logs = LogEntry.query.filter_by(userId=user.id).order_by(LogEntry.loggedAt.desc()).all()
    result = []
    for log in logs:
        result.append({
            'id': log.id,
            'itemName': log.itemName,
            'calories': log.calories,
            'price': log.priceInPaise / 100,
            'loggedAt': log.loggedAt.isoformat()
        })
    return jsonify(result)

@main_bp.route('/user/logs', methods=['POST'])
def add_user_log():
    data = request.json
    user = User.query.first()
    if not user:
        return jsonify(error="User not found"), 404
        
    new_log = LogEntry(
        userId=user.id,
        itemName=data.get('itemName', 'Unknown Item'),
        calories=data.get('calories', 0),
        priceInPaise=int(data.get('price', 0) * 100)
    )
    db.session.add(new_log)
    db.session.commit()
    
    return jsonify({'success': True, 'id': new_log.id}), 201

# ----------------------------------------
# 4. AI Routes
# ----------------------------------------
import time
import os
import requests
import re
import math
import random

@main_bp.route('/ai-parse-food', methods=['POST'])
def ai_parse_food():
    data = request.json
    query = data.get('query')
    if not query:
        return jsonify(success=False, message="Please provide a food description."), 400
        
    api_key = os.environ.get('OPENAI_API_KEY')
    if api_key:
        try:
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {api_key}'
            }
            body = {
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {'role': 'system', 'content': 'You are an expert nutritionist specialized in Indian and global cuisine. Extract the food name, calories, protein (in g), carbs (in g), fats (in g) and portion string from the user\'s natural language input. Return ONLY a valid JSON object: { "name": "...", "calories": 0, "protein": 0, "carbs": 0, "fats": 0, "portion": "..." }'},
                    {'role': 'user', 'content': query}
                ],
                'temperature': 0.1
            }
            resp = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=body)
            if resp.ok:
                resp_json = resp.json()
                import json
                parsed = json.loads(resp_json['choices'][0]['message']['content'])
                return jsonify(success=True, data=parsed)
        except Exception as e:
            print("OpenAI mapping failed, falling back to local heuristic alg.")

    time.sleep(1.2)
    calories = 250; protein = 10; carbs = 30; fats = 8; portion = "1 serving"
    q = query.lower()
    
    if 'pizza' in q: calories=800; protein=35; carbs=90; fats=30
    elif 'paneer' in q or 'cheese' in q: calories+=200; protein+=15; fats+=20
    elif 'chicken' in q or 'egg' in q: calories+=150; protein+=25; carbs-=10; fats+=5
    elif 'rice' in q or 'biryani' in q: calories+=250; carbs+=45
    elif 'roti' in q or 'naan' in q: calories=120; protein=3; carbs=20; fats=2; portion="1 piece"
    elif 'dosa' in q or 'idli' in q: calories=150; protein=4; carbs=30; portion="1 piece"
    elif 'salad' in q: calories=100; protein=2; carbs=10; fats=5
    
    match = re.match(r'^(\d+)', query)
    if match:
        qty = int(match.group(1))
        if 0 < qty < 10:
            calories *= qty; protein *= qty; carbs *= qty; fats *= qty; portion = f"{qty} servings"
            
    return jsonify(success=True, data={
        'name': query.capitalize(),
        'calories': round(calories),
        'protein': round(protein),
        'carbs': round(carbs),
        'fats': round(fats),
        'portion': portion
    })

@main_bp.route('/ai-recommend', methods=['POST'])
def ai_recommend():
    data = request.json
    remaining = data.get('remainingCalories', 2000)
    budget = data.get('budgetInPaise', 1000000)
    preference = data.get('preference')
    mealType = data.get('mealType')
    
    time.sleep(1.5)
    
    query = MenuItem.query.filter(MenuItem.calories <= remaining)
    if mealType:
        query = query.filter(MenuItem.category == mealType)
    if preference in ['Veg', 'Vegan']:
        query = query.filter(MenuItem.type.in_(['Veg', 'Vegan']))
        
    available = query.all()
    if not available:
        return jsonify(success=False, message=f"No {mealType or 'items'} found matching your criteria under ₹{budget}.")
        
    available.sort(key=lambda x: x.protein / x.calories if x.calories else 0, reverse=True)
    
    kitchens = Kitchen.query.all()
    recs = []
    
    for i in range(min(3, len(available))):
        root = available[i]
        combo = [root]
        cur_cals = root.calories
        cur_price = root.priceInPaise
        
        for j in range(len(available)):
            if i != j:
                second = available[j]
                if cur_cals + second.calories <= remaining and cur_price + second.priceInPaise <= budget:
                    combo.append(second)
                    break
                    
        kitchen = random.choice(kitchens) if kitchens else None
        kitchen_data = {
            'id': kitchen.id,
            'name': kitchen.name,
            'rating': kitchen.rating,
            'deliveryTime': kitchen.deliveryTime,
            'tags': kitchen.tags.split(',') if kitchen.tags else [],
            'image': kitchen.image
        } if kitchen else None
        
        items_data = [{
            'id': it.id, 'name': it.name, 'description': it.description,
            'category': it.category, 'price': it.priceInPaise / 100,
            'calories': it.calories, 'protein': it.protein, 
            'carbs': it.carbs, 'fat': it.fat, 'type': it.type,
            'image': it.image, 'kitchenId': it.kitchenId
        } for it in combo]
            
        recs.append({
            'id': f'rec-{i}',
            'message': f"Option {i+1}: High protein blend specifically optimized for {mealType or 'your goal'}.",
            'kitchen': kitchen_data,
            'items': items_data,
            'totalPrice': sum(it.priceInPaise for it in combo) / 100,
            'totalCalories': sum(it.calories for it in combo),
            'macros': {
                'protein': sum(it.protein for it in combo),
                'carbs': sum(it.carbs for it in combo),
                'fat': sum(it.fat for it in combo)
            }
        })
        
    return jsonify(success=True, recommendations=recs)
