from flask import Blueprint, jsonify, request
from models import db
from models.models import User, Cart, CartItem, MenuItem

cart_bp = Blueprint('cart', __name__)

def get_or_create_cart(user_id):
    cart = Cart.query.filter_by(userId=user_id).first()
    if not cart:
        cart = Cart(userId=user_id)
        db.session.add(cart)
        db.session.commit()
    return cart

@cart_bp.route('/<user_id>', methods=['GET'])
def get_cart(user_id):
    cart = get_or_create_cart(user_id)
    result = []
    total = 0
    for item in cart.items:
        m = item.menuItem
        result.append({
            'id': m.id,
            'name': m.name,
            'price': m.priceInPaise / 100,
            'calories': m.calories,
            'protein': m.protein,
            'carbs': m.carbs,
            'fat': m.fat,
            'image': m.image,
            'quantity': item.quantity
        })
        total += (m.priceInPaise / 100) * item.quantity
        
    return jsonify(success=True, items=result, total=total)

@cart_bp.route('/<user_id>/add', methods=['POST'])
def add_to_cart(user_id):
    data = request.json
    menu_item_id = data.get('menuItemId')
    qty = data.get('quantity', 1)
    
    cart = get_or_create_cart(user_id)
    
    # Check if item already exists in cart
    existing_item = CartItem.query.filter_by(cartId=cart.id, menuItemId=menu_item_id).first()
    if existing_item:
        existing_item.quantity += qty
    else:
        new_item = CartItem(cartId=cart.id, menuItemId=menu_item_id, quantity=qty)
        db.session.add(new_item)
        
    db.session.commit()
    return jsonify(success=True)

@cart_bp.route('/<user_id>/update', methods=['POST'])
def update_cart(user_id):
    data = request.json
    menu_item_id = data.get('menuItemId')
    qty = data.get('quantity', 0)
    
    cart = get_or_create_cart(user_id)
    item = CartItem.query.filter_by(cartId=cart.id, menuItemId=menu_item_id).first()
    
    if item:
        if qty <= 0:
            db.session.delete(item)
        else:
            item.quantity = qty
        db.session.commit()
        
    return jsonify(success=True)

@cart_bp.route('/<user_id>/clear', methods=['POST'])
def clear_cart(user_id):
    cart = get_or_create_cart(user_id)
    CartItem.query.filter_by(cartId=cart.id).delete()
    db.session.commit()
    return jsonify(success=True)
