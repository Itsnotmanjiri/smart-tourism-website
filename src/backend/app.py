"""
AI SMART TOURISM PLATFORM - MAIN APPLICATION
Production-grade Flask application with microservice-style architecture
"""

from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from redis import Redis
import os
from datetime import timedelta

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cache = Cache()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

def create_app(config_name='development'):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL', 
        'postgresql://localhost/smart_tourism'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    
    # Redis configuration
    app.config['CACHE_TYPE'] = 'redis'
    app.config['CACHE_REDIS_URL'] = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    
    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cache.init_app(app)
    limiter.init_app(app)
    
    # Register blueprints
    from backend.routes import auth, destinations, hotels, bookings, itineraries, \
        social, rides, emergency, providers, admin, chatbot, analytics
    
    app.register_blueprint(auth.bp, url_prefix='/api/auth')
    app.register_blueprint(destinations.bp, url_prefix='/api/destinations')
    app.register_blueprint(hotels.bp, url_prefix='/api/hotels')
    app.register_blueprint(bookings.bp, url_prefix='/api/bookings')
    app.register_blueprint(itineraries.bp, url_prefix='/api/itineraries')
    app.register_blueprint(social.bp, url_prefix='/api/social')
    app.register_blueprint(rides.bp, url_prefix='/api/rides')
    app.register_blueprint(emergency.bp, url_prefix='/api/emergency')
    app.register_blueprint(providers.bp, url_prefix='/api/providers')
    app.register_blueprint(admin.bp, url_prefix='/api/admin')
    app.register_blueprint(chatbot.bp, url_prefix='/api/chatbot')
    app.register_blueprint(analytics.bp, url_prefix='/api/analytics')
    
    # Health check
    @app.route('/api/health')
    def health():
        return jsonify({
            'status': 'healthy',
            'version': '1.0.0',
            'environment': config_name
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
