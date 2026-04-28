from flask import Blueprint, jsonify, request
from models import db
from models.models import User, Cart, CartItem, Order, OrderItem
import qrcode
import io
import base64

checkout_bp = Blueprint('checkout', __name__)

@checkout_bp.route('/<user_id>/process', methods=['POST'])
def process_checkout(user_id):
    cart = Cart.query.filter_by(userId=user_id).first()
    if not cart or not cart.items:
        return jsonify(success=False, message="Cart is empty"), 400
        
    total_in_paise = 0
    for item in cart.items:
        total_in_paise += item.menuItem.priceInPaise * item.quantity
        
    order = Order(userId=user_id, totalInPaise=total_in_paise)
    db.session.add(order)
    db.session.flush() # Get order ID
    
    for item in cart.items:
        order_item = OrderItem(
            orderId=order.id,
            menuItemId=item.menuItemId,
            quantity=item.quantity,
            priceAtTimeInPaise=item.menuItem.priceInPaise
        )
        db.session.add(order_item)
        
    # Clear cart
    CartItem.query.filter_by(cartId=cart.id).delete()
    db.session.commit()
    
    return jsonify(success=True, orderId=order.id)

@checkout_bp.route('/<order_id>/qr', methods=['GET'])
def get_payment_qr(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify(success=False, message="Order not found"), 404
        
    # Generate QR Code linking to mock payment URI
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(f"nutrabite://pay/{order_id}?amount={order.totalInPaise}")
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    return jsonify(success=True, qrCodeBase64=img_str, total=order.totalInPaise / 100)

@checkout_bp.route('/<order_id>/confirm', methods=['POST'])
def confirm_payment(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify(success=False, message="Order not found"), 404
        
    order.status = 'Paid'
    db.session.commit()
    
    return jsonify(success=True, message="Payment successful")

@checkout_bp.route('/<user_id>/orders', methods=['GET'])
def get_user_orders(user_id):
    orders = Order.query.filter_by(userId=user_id).order_by(Order.createdAt.desc()).all()
    result = []
    for order in orders:
        items_str = ", ".join([f"{i.quantity}x {i.menuItem.name}" for i in order.items])
        result.append({
            'id': order.id,
            'items': items_str,
            'total': order.totalInPaise / 100,
            'status': order.status,
            'date': order.createdAt.strftime("%b %d, %Y")
        })
    return jsonify(success=True, orders=result)
