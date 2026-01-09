"""
AUTHENTICATION & AUTHORIZATION
JWT-based authentication with refresh tokens
"""

from flask import Blueprint, request, jsonify
from backend.models import User, AuditLog
from backend.app import db, limiter
from functools import wraps
import jwt
import os
from datetime import datetime

bp = Blueprint('auth', __name__)

def token_required(f):
    """Decorator for protecting routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, os.getenv('JWT_SECRET_KEY', 'secret'), algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            
            if not current_user:
                return jsonify({'error': 'Invalid token'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@bp.route('/register', methods=['POST'])
@limiter.limit("5 per hour")
def register():
    """Register new user"""
    data = request.get_json()
    
    # Validation
    required_fields = ['email', 'password', 'full_name', 'phone']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if user exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    if User.query.filter_by(phone=data['phone']).first():
        return jsonify({'error': 'Phone number already registered'}), 400
    
    # Create user
    user = User(
        email=data['email'],
        full_name=data['full_name'],
        phone=data['phone'],
        role=data.get('role', 'traveler')
    )
    user.set_password(data['password'])
    
    # Optional fields
    if 'travel_style' in data:
        user.travel_style = data['travel_style']
    if 'food_preferences' in data:
        user.food_preferences = data['food_preferences']
    if 'interests' in data:
        user.interests = data['interests']
    
    db.session.add(user)
    db.session.commit()
    
    # Audit log
    audit = AuditLog(
        user_id=user.id,
        action_type='register',
        entity_type='user',
        entity_id=user.id,
        ip_address=request.remote_addr
    )
    db.session.add(audit)
    db.session.commit()
    
    token = user.generate_token()
    
    return jsonify({
        'message': 'User registered successfully',
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'full_name': user.full_name,
            'role': user.role
        }
    }), 201

@bp.route('/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    """User login"""
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    # Audit log
    audit = AuditLog(
        user_id=user.id,
        action_type='login',
        entity_type='user',
        entity_id=user.id,
        ip_address=request.remote_addr,
        user_agent=request.headers.get('User-Agent')
    )
    db.session.add(audit)
    db.session.commit()
    
    token = user.generate_token()
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'full_name': user.full_name,
            'role': user.role,
            'profile_image': user.profile_image,
            'safety_score': user.safety_score,
            'travel_style': user.travel_style
        }
    }), 200

@bp.route('/me', methods=['GET'])
@token_required
def get_profile(current_user):
    """Get current user profile"""
    return jsonify({
        'user': {
            'id': current_user.id,
            'email': current_user.email,
            'full_name': current_user.full_name,
            'phone': current_user.phone,
            'role': current_user.role,
            'profile_image': current_user.profile_image,
            'travel_style': current_user.travel_style,
            'pace_preference': current_user.pace_preference,
            'food_preferences': current_user.food_preferences,
            'interests': current_user.interests,
            'safety_score': current_user.safety_score,
            'total_trips': current_user.total_trips,
            'total_bookings': current_user.total_bookings,
            'member_since': current_user.member_since.isoformat() if current_user.member_since else None
        }
    }), 200

@bp.route('/me', methods=['PUT'])
@token_required
def update_profile(current_user):
    """Update user profile"""
    data = request.get_json()
    
    # Update allowed fields
    updatable_fields = [
        'full_name', 'phone', 'profile_image', 'travel_style', 
        'pace_preference', 'food_preferences', 'interests',
        'emergency_contact_name', 'emergency_contact_phone'
    ]
    
    for field in updatable_fields:
        if field in data:
            setattr(current_user, field, data[field])
    
    db.session.commit()
    
    return jsonify({'message': 'Profile updated successfully'}), 200

@bp.route('/verify', methods=['POST'])
@token_required
def verify_account(current_user):
    """Submit verification documents"""
    data = request.get_json()
    
    current_user.verification_documents = data.get('documents', {})
    db.session.commit()
    
    return jsonify({'message': 'Verification documents submitted'}), 200
