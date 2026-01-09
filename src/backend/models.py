"""
COMPREHENSIVE DATABASE MODELS
Production-grade schema with relationships, indexes, and constraints
"""

from datetime import datetime
from backend.app import db
from sqlalchemy.dialects.postgresql import JSON, ARRAY
from sqlalchemy import Index, CheckConstraint
import bcrypt
import jwt
from datetime import timedelta
import os

# ============================================================
# USER SYSTEM
# ============================================================

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), unique=True, index=True)
    
    # User Type & Verification
    role = db.Column(db.String(20), default='traveler')  # traveler, provider, admin
    is_verified = db.Column(db.Boolean, default=False)
    verification_documents = db.Column(JSON)
    safety_score = db.Column(db.Float, default=5.0)
    
    # Profile & Preferences
    profile_image = db.Column(db.String(500))
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(20))
    nationality = db.Column(db.String(100))
    languages = db.Column(ARRAY(db.String))
    
    # Travel Personality (AI-driven profiling)
    travel_style = db.Column(db.String(50))  # solo, social, family, luxury, budget, backpacker
    pace_preference = db.Column(db.String(20))  # slow, moderate, fast
    budget_elasticity = db.Column(db.Float, default=0.5)  # 0-1 scale
    food_preferences = db.Column(ARRAY(db.String))
    interests = db.Column(ARRAY(db.String))
    
    # Medical & Emergency
    blood_group = db.Column(db.String(5))
    allergies = db.Column(ARRAY(db.String))
    medical_conditions = db.Column(db.Text)
    emergency_contact_name = db.Column(db.String(255))
    emergency_contact_phone = db.Column(db.String(20))
    emergency_contact_relation = db.Column(db.String(50))
    
    # Activity & Stats
    total_trips = db.Column(db.Integer, default=0)
    total_bookings = db.Column(db.Integer, default=0)
    total_spent = db.Column(db.Float, default=0.0)
    member_since = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Preferences
    currency_preference = db.Column(db.String(3), default='INR')
    notification_preferences = db.Column(JSON)
    privacy_settings = db.Column(JSON)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    bookings = db.relationship('Booking', backref='user', lazy='dynamic')
    reviews = db.relationship('Review', backref='user', lazy='dynamic')
    travel_buddies = db.relationship('TravelBuddy', foreign_keys='TravelBuddy.user_id', backref='user', lazy='dynamic')
    rides_offered = db.relationship('Ride', foreign_keys='Ride.driver_id', backref='driver', lazy='dynamic')
    rides_requested = db.relationship('RideRequest', backref='user', lazy='dynamic')
    sos_alerts = db.relationship('SOSAlert', backref='user', lazy='dynamic')
    itineraries = db.relationship('Itinerary', backref='user', lazy='dynamic')
    
    __table_args__ = (
        Index('idx_user_email', 'email'),
        Index('idx_user_role', 'role'),
        Index('idx_user_verified', 'is_verified'),
    )
    
    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def generate_token(self):
        payload = {
            'user_id': self.id,
            'email': self.email,
            'role': self.role,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }
        return jwt.encode(payload, os.getenv('JWT_SECRET_KEY', 'secret'), algorithm='HS256')

# ============================================================
# DESTINATION & CITY SYSTEM
# ============================================================

class Destination(db.Model):
    __tablename__ = 'destinations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True, index=True)
    state = db.Column(db.String(100), nullable=False)
    region = db.Column(db.String(100))
    
    # Geolocation
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    
    # Destination Info
    description = db.Column(db.Text)
    highlights = db.Column(ARRAY(db.String))
    best_time_to_visit = db.Column(db.String(100))
    average_budget_per_day = db.Column(db.Float)
    typical_stay_duration = db.Column(db.Integer)  # in days
    
    # Tourism Data
    category = db.Column(db.String(100))  # heritage, adventure, pilgrimage, beach, hill-station
    popularity_score = db.Column(db.Float, default=0.0)
    safety_rating = db.Column(db.Float, default=4.5)
    
    # Media
    hero_image = db.Column(db.String(500))
    gallery_images = db.Column(ARRAY(db.String))
    video_url = db.Column(db.String(500))
    
    # Climate
    climate_type = db.Column(db.String(50))
    temperature_range = db.Column(JSON)  # {min: 15, max: 35, season: 'summer'}
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    hotels = db.relationship('Hotel', backref='destination', lazy='dynamic')
    activities = db.relationship('Activity', backref='destination', lazy='dynamic')
    restaurants = db.relationship('Restaurant', backref='destination', lazy='dynamic')
    
    __table_args__ = (
        Index('idx_destination_name', 'name'),
        Index('idx_destination_location', 'latitude', 'longitude'),
    )

# ============================================================
# HOTEL SYSTEM (ULTRA COMPREHENSIVE)
# ============================================================

class Hotel(db.Model):
    __tablename__ = 'hotels'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, index=True)
    brand = db.Column(db.String(100))
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=False, index=True)
    provider_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)
    
    # Location
    address = db.Column(db.Text)
    zone = db.Column(db.String(100))  # e.g., "City Center", "Airport Area"
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    
    # Classification
    property_type = db.Column(db.String(50))  # hotel, resort, homestay, hostel, villa
    star_rating = db.Column(db.Integer)  # 1-5
    
    # Pricing (Base rates - actual pricing is dynamic)
    base_price_per_night = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='INR')
    
    # Ratings & Scores
    overall_rating = db.Column(db.Float, default=0.0)
    total_reviews = db.Column(db.Integer, default=0)
    safety_rating = db.Column(db.Float, default=4.5)
    hygiene_rating = db.Column(db.Float, default=4.5)
    sustainability_score = db.Column(db.Float, default=3.0)
    
    # Amenities (Boolean flags for filtering)
    amenities = db.Column(JSON)  # {wifi: true, pool: true, gym: true, spa: false, ...}
    
    # Policies
    check_in_time = db.Column(db.String(10), default='14:00')
    check_out_time = db.Column(db.String(10), default='11:00')
    cancellation_policy = db.Column(db.Text)
    refund_policy = db.Column(db.Text)
    allows_pets = db.Column(db.Boolean, default=False)
    allows_smoking = db.Column(db.Boolean, default=False)
    
    # Media
    images = db.Column(ARRAY(db.String))
    videos = db.Column(ARRAY(db.String))
    virtual_tour_url = db.Column(db.String(500))
    
    # Verification & Compliance
    is_verified = db.Column(db.Boolean, default=False)
    license_number = db.Column(db.String(100))
    compliance_certificates = db.Column(ARRAY(db.String))
    
    # Stats
    total_bookings = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    rooms = db.relationship('RoomType', backref='hotel', lazy='dynamic', cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='hotel', lazy='dynamic')
    bookings = db.relationship('Booking', backref='hotel', lazy='dynamic')
    
    __table_args__ = (
        Index('idx_hotel_destination', 'destination_id'),
        Index('idx_hotel_location', 'latitude', 'longitude'),
        Index('idx_hotel_rating', 'overall_rating'),
        Index('idx_hotel_price', 'base_price_per_night'),
    )

class RoomType(db.Model):
    __tablename__ = 'room_types'
    
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False, index=True)
    
    # Room Info
    name = db.Column(db.String(100), nullable=False)  # "Deluxe Room", "Suite", etc.
    description = db.Column(db.Text)
    max_occupancy = db.Column(db.Integer, nullable=False)
    bed_type = db.Column(db.String(50))
    room_size_sqft = db.Column(db.Integer)
    
    # Pricing
    base_price = db.Column(db.Float, nullable=False)
    weekend_multiplier = db.Column(db.Float, default=1.2)
    peak_season_multiplier = db.Column(db.Float, default=1.5)
    
    # Availability
    total_rooms = db.Column(db.Integer, nullable=False)
    
    # Features
    amenities = db.Column(JSON)
    images = db.Column(ARRAY(db.String))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    bookings = db.relationship('Booking', backref='room_type', lazy='dynamic')

# ============================================================
# ACTIVITY & ITINERARY SYSTEM
# ============================================================

class Activity(db.Model):
    __tablename__ = 'activities'
    
    id = db.Column(db.Integer, primary_key=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=False, index=True)
    
    # Basic Info
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))  # sightseeing, adventure, cultural, religious, shopping
    
    # Location
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    address = db.Column(db.Text)
    
    # Timing & Duration
    opening_time = db.Column(db.String(10))
    closing_time = db.Column(db.String(10))
    typical_duration_minutes = db.Column(db.Integer)  # How long people spend here
    
    # Cost
    entry_fee = db.Column(db.Float, default=0.0)
    estimated_additional_cost = db.Column(db.Float, default=0.0)
    
    # Planning Metrics (for algorithm)
    energy_level_required = db.Column(db.Integer)  # 1-5 scale
    crowd_density_score = db.Column(db.Float, default=3.0)  # 1-5 scale
    best_time_of_day = db.Column(db.String(20))  # morning, afternoon, evening, night
    seasonality = db.Column(JSON)  # {peak: ['Dec', 'Jan'], low: ['Jul', 'Aug']}
    
    # Ratings
    popularity_score = db.Column(db.Float, default=4.0)
    total_visitors_annual = db.Column(db.Integer)
    
    # Media
    images = db.Column(ARRAY(db.String))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_activity_destination', 'destination_id'),
        Index('idx_activity_category', 'category'),
    )

class Itinerary(db.Model):
    __tablename__ = 'itineraries'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=False, index=True)
    
    # Trip Details
    trip_name = db.Column(db.String(255))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    number_of_days = db.Column(db.Integer)
    
    # Generated Plan (JSON structure with day-by-day breakdown)
    plan = db.Column(JSON)  # Detailed hour-by-hour plan
    total_estimated_cost = db.Column(db.Float)
    
    # Customization
    is_custom = db.Column(db.Boolean, default=False)
    is_shared = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# ============================================================
# BOOKING SYSTEM
# ============================================================

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    booking_reference = db.Column(db.String(20), unique=True, nullable=False, index=True)
    
    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False, index=True)
    room_type_id = db.Column(db.Integer, db.ForeignKey('room_types.id'), nullable=False, index=True)
    
    # Dates
    check_in_date = db.Column(db.Date, nullable=False)
    check_out_date = db.Column(db.Date, nullable=False)
    number_of_nights = db.Column(db.Integer, nullable=False)
    
    # Guest Info
    number_of_guests = db.Column(db.Integer, nullable=False)
    guest_details = db.Column(JSON)  # {names: [], phone: [], email: []}
    
    # Pricing
    room_price_per_night = db.Column(db.Float, nullable=False)
    total_room_cost = db.Column(db.Float, nullable=False)
    taxes = db.Column(db.Float, default=0.0)
    service_charges = db.Column(db.Float, default=0.0)
    discount = db.Column(db.Float, default=0.0)
    final_amount = db.Column(db.Float, nullable=False)
    
    # Payment
    payment_status = db.Column(db.String(20), default='pending')  # pending, paid, refunded
    payment_method = db.Column(db.String(50))
    payment_transaction_id = db.Column(db.String(100))
    payment_timestamp = db.Column(db.DateTime)
    
    # Status
    booking_status = db.Column(db.String(20), default='confirmed')  # confirmed, cancelled, completed, no-show
    cancellation_reason = db.Column(db.Text)
    cancelled_at = db.Column(db.DateTime)
    
    # QR Code
    qr_code_url = db.Column(db.String(500))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_booking_user', 'user_id'),
        Index('idx_booking_hotel', 'hotel_id'),
        Index('idx_booking_dates', 'check_in_date', 'check_out_date'),
        Index('idx_booking_status', 'booking_status'),
    )

# ============================================================
# REVIEW SYSTEM
# ============================================================

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False, index=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'))
    
    # Ratings (1-5 scale)
    overall_rating = db.Column(db.Float, nullable=False)
    cleanliness_rating = db.Column(db.Float)
    service_rating = db.Column(db.Float)
    location_rating = db.Column(db.Float)
    value_for_money_rating = db.Column(db.Float)
    amenities_rating = db.Column(db.Float)
    
    # Content
    review_title = db.Column(db.String(255))
    review_text = db.Column(db.Text)
    images = db.Column(ARRAY(db.String))
    
    # AI Sentiment Analysis
    sentiment_score = db.Column(db.Float)  # -1 to 1
    is_verified_stay = db.Column(db.Boolean, default=False)
    
    # Credibility
    helpfulness_score = db.Column(db.Integer, default=0)
    is_moderated = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_review_hotel', 'hotel_id'),
        Index('idx_review_rating', 'overall_rating'),
    )

# ============================================================
# SOCIAL TRAVEL BUDDY SYSTEM
# ============================================================

class TravelBuddy(db.Model):
    __tablename__ = 'travel_buddies'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=False, index=True)
    
    # Trip Details
    travel_start_date = db.Column(db.Date, nullable=False)
    travel_end_date = db.Column(db.Date, nullable=False)
    trip_duration_days = db.Column(db.Integer)
    
    # Preferences
    looking_for = db.Column(db.String(50))  # buddy, group, companion
    max_group_size = db.Column(db.Integer, default=4)
    budget_range = db.Column(JSON)  # {min: 5000, max: 15000}
    interests = db.Column(ARRAY(db.String))
    
    # Status
    status = db.Column(db.String(20), default='active')  # active, matched, cancelled
    
    # Match Details
    matched_with = db.Column(ARRAY(db.Integer))  # Array of user IDs
    compatibility_scores = db.Column(JSON)
    
    # Additional Info
    description = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_buddy_destination_dates', 'destination_id', 'travel_start_date', 'travel_end_date'),
        Index('idx_buddy_status', 'status'),
    )

# ============================================================
# RIDE SHARING SYSTEM
# ============================================================

class Ride(db.Model):
    __tablename__ = 'rides'
    
    id = db.Column(db.Integer, primary_key=True)
    driver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Route
    from_location = db.Column(db.String(255), nullable=False)
    to_location = db.Column(db.String(255), nullable=False)
    from_latitude = db.Column(db.Float)
    from_longitude = db.Column(db.Float)
    to_latitude = db.Column(db.Float)
    to_longitude = db.Column(db.Float)
    
    # Timing
    departure_datetime = db.Column(db.DateTime, nullable=False)
    estimated_arrival_datetime = db.Column(db.DateTime)
    distance_km = db.Column(db.Float)
    
    # Vehicle
    vehicle_type = db.Column(db.String(50))
    vehicle_model = db.Column(db.String(100))
    vehicle_number = db.Column(db.String(20))
    
    # Capacity & Cost
    available_seats = db.Column(db.Integer, nullable=False)
    cost_per_seat = db.Column(db.Float, nullable=False)
    
    # Status
    ride_status = db.Column(db.String(20), default='available')  # available, in_progress, completed, cancelled
    
    # Safety
    is_verified_driver = db.Column(db.Boolean, default=False)
    driver_rating = db.Column(db.Float, default=5.0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    ride_requests = db.relationship('RideRequest', backref='ride', lazy='dynamic')
    
    __table_args__ = (
        Index('idx_ride_route', 'from_location', 'to_location'),
        Index('idx_ride_departure', 'departure_datetime'),
        Index('idx_ride_status', 'ride_status'),
    )

class RideRequest(db.Model):
    __tablename__ = 'ride_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    ride_id = db.Column(db.Integer, db.ForeignKey('rides.id'), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Request Details
    number_of_seats = db.Column(db.Integer, default=1)
    total_cost = db.Column(db.Float)
    
    # Status
    request_status = db.Column(db.String(20), default='pending')  # pending, accepted, rejected, completed
    
    # Payment
    payment_status = db.Column(db.String(20), default='pending')
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# ============================================================
# SOS EMERGENCY SYSTEM
# ============================================================

class SOSAlert(db.Model):
    __tablename__ = 'sos_alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    alert_code = db.Column(db.String(20), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Emergency Type
    emergency_type = db.Column(db.String(50))  # medical, accident, theft, harassment, lost
    description = db.Column(db.Text)
    
    # Location
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    location_address = db.Column(db.Text)
    
    # Status Lifecycle
    alert_status = db.Column(db.String(20), default='triggered')  # triggered, acknowledged, in_progress, resolved
    
    # Response
    acknowledged_by_admin_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    response_notes = db.Column(db.Text)
    
    # Contacts Notified
    emergency_contacts_notified = db.Column(ARRAY(db.String))
    
    # Timestamps
    triggered_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    acknowledged_at = db.Column(db.DateTime)
    resolved_at = db.Column(db.DateTime)
    
    __table_args__ = (
        Index('idx_sos_user', 'user_id'),
        Index('idx_sos_status', 'alert_status'),
        Index('idx_sos_triggered', 'triggered_at'),
    )

# ============================================================
# RESTAURANT SYSTEM
# ============================================================

class Restaurant(db.Model):
    __tablename__ = 'restaurants'
    
    id = db.Column(db.Integer, primary_key=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=False, index=True)
    
    # Basic Info
    name = db.Column(db.String(255), nullable=False)
    cuisine_types = db.Column(ARRAY(db.String))
    
    # Location
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    address = db.Column(db.Text)
    
    # Pricing
    average_cost_for_two = db.Column(db.Float)
    price_category = db.Column(db.String(20))  # budget, mid-range, premium
    
    # Ratings
    overall_rating = db.Column(db.Float, default=4.0)
    total_reviews = db.Column(db.Integer, default=0)
    
    # Timing
    opening_time = db.Column(db.String(10))
    closing_time = db.Column(db.String(10))
    
    # Features
    is_vegetarian = db.Column(db.Boolean, default=False)
    is_vegan_friendly = db.Column(db.Boolean, default=False)
    accepts_reservations = db.Column(db.Boolean, default=False)
    
    # Media
    images = db.Column(ARRAY(db.String))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ============================================================
# AUDIT LOG SYSTEM
# ============================================================

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)
    
    # Action Details
    action_type = db.Column(db.String(50), nullable=False)  # login, booking, sos, etc.
    entity_type = db.Column(db.String(50))  # user, hotel, booking, etc.
    entity_id = db.Column(db.Integer)
    
    # Request Info
    ip_address = db.Column(db.String(50))
    user_agent = db.Column(db.Text)
    
    # Changes
    old_values = db.Column(JSON)
    new_values = db.Column(JSON)
    
    # Timestamp
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    __table_args__ = (
        Index('idx_audit_user_action', 'user_id', 'action_type'),
        Index('idx_audit_timestamp', 'created_at'),
    )
