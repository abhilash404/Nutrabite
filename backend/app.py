from flask import Flask, request, jsonify
from config import Config
from models import db
from flask_cors import CORS
import os, json, re, random, requests

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)

    with app.app_context():
        from routes.routes import main_bp
        from routes.auth import auth_bp
        from routes.cart import cart_bp
        from routes.checkout import checkout_bp

        app.register_blueprint(main_bp, url_prefix='/api')
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(cart_bp, url_prefix='/api/cart')
        app.register_blueprint(checkout_bp, url_prefix='/api/checkout')

    # ── AI Parse Food ──────────────────────────────────────
    @app.route('/api/ai-parse-food', methods=['POST'])
    def ai_parse_food():
        data = request.get_json()
        query = data.get('query', '')

        if not query:
            return jsonify({'success': False, 'message': 'Please provide a food description.'}), 400

        openai_key = os.environ.get('OPENAI_API_KEY')
        if openai_key:
            try:
                resp = requests.post('https://api.openai.com/v1/chat/completions',
                    headers={'Authorization': f'Bearer {openai_key}', 'Content-Type': 'application/json'},
                    json={
                        'model': 'gpt-3.5-turbo',
                        'messages': [
                            {'role': 'system', 'content': 'You are an expert nutritionist. Extract food name, calories, protein (g), carbs (g), fats (g) and portion from the input. Return ONLY valid JSON: { "name": "...", "calories": 0, "protein": 0, "carbs": 0, "fats": 0, "portion": "..." }'},
                            {'role': 'user', 'content': query}
                        ],
                        'temperature': 0.1
                    })
                if resp.ok:
                    parsed = json.loads(resp.json()['choices'][0]['message']['content'])
                    return jsonify({'success': True, 'data': parsed})
            except Exception as e:
                print(f"OpenAI failed, using fallback: {e}")

        # Fallback heuristic
        calories, protein, carbs, fats, portion = 250, 10, 30, 8, "1 serving"
        q = query.lower()

        if 'pizza' in q:                        calories, protein, carbs, fats = 800, 35, 90, 30
        elif 'paneer' in q:                     calories += 200; protein += 15; fats += 20
        elif 'chicken' in q or 'egg' in q:      calories += 150; protein += 25; carbs -= 10; fats += 5
        elif 'rice' in q or 'biryani' in q:     calories += 250; carbs += 45
        elif 'roti' in q or 'naan' in q:        calories, protein, carbs, fats, portion = 120, 3, 20, 2, "1 piece"
        elif 'dosa' in q or 'idli' in q:        calories, protein, carbs, portion = 150, 4, 30, "1 piece"
        elif 'salad' in q:                      calories, protein, carbs, fats = 100, 2, 10, 5

        match = re.match(r'^(\d+)', query)
        if match:
            qty = int(match.group(1))
            if 0 < qty < 10:
                calories *= qty; protein *= qty; carbs *= qty; fats *= qty
                portion = f"{qty} servings"

        return jsonify({'success': True, 'data': {
            'name': query[0].upper() + query[1:],
            'calories': round(calories), 'protein': round(protein),
            'carbs': round(carbs), 'fats': round(fats), 'portion': portion
        }})

    # ── AI Recommend ───────────────────────────────────────
    @app.route('/api/ai-recommend', methods=['POST'])
    def ai_recommend():
        from routes.routes import get_mock_data  # we'll add this below
        mock_restaurants, mock_food_items = get_mock_data()

        data = request.get_json()
        remaining_calories = data.get('remainingCalories', 500)
        budget = data.get('budgetInPaise', 10000)
        preference = data.get('preference', '')
        meal_type = data.get('mealType', '')

        available = [f for f in mock_food_items if f['calories'] <= remaining_calories]
        if meal_type:
            available = [f for f in available if f.get('category') == meal_type]
        if preference in ('Veg', 'Vegan'):
            available = [f for f in available if f.get('type') in ('Veg', 'Vegan')]

        if not available:
            return jsonify({'success': False, 'message': 'No items found matching your criteria.'})

        available.sort(key=lambda f: f['protein'] / f['calories'], reverse=True)

        recommendations = []
        for i in range(min(3, len(available))):
            root = available[i]
            combo = [root]
            cur_cals, cur_total = root['calories'], root['price']
            for j, item in enumerate(available):
                if j != i and cur_cals + item['calories'] <= remaining_calories and cur_total + item['price'] <= budget:
                    combo.append(item)
                    break
            kitchen = random.choice(mock_restaurants)
            recommendations.append({
                'id': f'rec-{i}',
                'message': f'Option {i+1}: High protein blend for {meal_type or "your goal"}.',
                'kitchen': kitchen,
                'items': combo,
                'totalPrice': sum(it['price'] for it in combo),
                'totalCalories': sum(it['calories'] for it in combo),
                'macros': {
                    'protein': sum(it['protein'] for it in combo),
                    'carbs': sum(it['carbs'] for it in combo),
                    'fat': sum(it.get('fat', 0) for it in combo)
                }
            })

        return jsonify({'success': True, 'recommendations': recommendations})

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)