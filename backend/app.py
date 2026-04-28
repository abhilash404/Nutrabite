from flask import Flask
from config import Config
from models import db
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    db.init_app(app)
    
    with app.app_context():
        # Import routes down here to avoid circular imports during init
        from routes.routes import main_bp
        from routes.auth import auth_bp
        from routes.cart import cart_bp
        from routes.checkout import checkout_bp
        
        app.register_blueprint(main_bp, url_prefix='/api')
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(cart_bp, url_prefix='/api/cart')
        app.register_blueprint(checkout_bp, url_prefix='/api/checkout')
        
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
