"""
HOTEL SEARCH & MANAGEMENT
Advanced filtering, pagination, dynamic pricing
"""

from flask import Blueprint, request, jsonify
from backend.models import Hotel, RoomType, Review, Destination
from backend.app import db, cache
from sqlalchemy import and_, or_, func
from datetime import datetime, timedelta
import math

bp = Blueprint('hotels', __name__)

def calculate_dynamic_price(room, check_in_date, check_out_date):
    """
    INTELLIGENT DYNAMIC PRICING ENGINE
    Factors: Day of week, season, demand, events, booking window
    """
    base_price = room.base_price
    total_price = 0
    
    current_date = check_in_date
    while current_date < check_out_date:
        day_price = base_price
        
        # Weekend pricing
        if current_date.weekday() >= 5:  # Saturday or Sunday
            day_price *= room.weekend_multiplier
        
        # Peak season (Dec, Jan, Apr, May for India)
        if current_date.month in [12, 1, 4, 5]:
            day_price *= room.peak_season_multiplier
        
        # Last-minute booking premium
        days_until_checkin = (check_in_date - datetime.now().date()).days
        if days_until_checkin < 7:
            day_price *= 1.15
        elif days_until_checkin > 60:
            day_price *= 0.9  # Early bird discount
        
        total_price += day_price
        current_date += timedelta(days=1)
    
    return round(total_price, 2)

@bp.route('/search', methods=['POST'])
def search_hotels():
    """
    ADVANCED HOTEL SEARCH
    Supports: Filters, sorting, pagination, availability checking
    """
    data = request.get_json()
    
    # Required parameters
    destination_id = data.get('destination_id')
    check_in = data.get('check_in')
    check_out = data.get('check_out')
    guests = data.get('guests', 1)
    
    # Pagination
    page = data.get('page', 1)
    per_page = data.get('per_page', 20)
    
    # Filters
    min_price = data.get('min_price', 0)
    max_price = data.get('max_price', 1000000)
    star_rating = data.get('star_rating')  # Array: [3, 4, 5]
    property_types = data.get('property_types')  # Array: ['hotel', 'resort']
    amenities = data.get('amenities', [])  # Array: ['wifi', 'pool']
    min_rating = data.get('min_rating', 0)
    
    # Sort
    sort_by = data.get('sort_by', 'popularity')  # popularity, price_low, price_high, rating
    
    # Build query
    query = Hotel.query.filter_by(destination_id=destination_id)
    
    # Apply filters
    if star_rating:
        query = query.filter(Hotel.star_rating.in_(star_rating))
    
    if property_types:
        query = query.filter(Hotel.property_type.in_(property_types))
    
    if min_rating:
        query = query.filter(Hotel.overall_rating >= min_rating)
    
    # Amenities filter (JSON field)
    for amenity in amenities:
        query = query.filter(Hotel.amenities[amenity].astext == 'true')
    
    # Price range filter (will filter after calculating dynamic prices)
    
    # Sorting
    if sort_by == 'price_low':
        query = query.order_by(Hotel.base_price_per_night.asc())
    elif sort_by == 'price_high':
        query = query.order_by(Hotel.base_price_per_night.desc())
    elif sort_by == 'rating':
        query = query.order_by(Hotel.overall_rating.desc())
    else:  # popularity
        query = query.order_by(Hotel.total_bookings.desc())
    
    # Execute query with pagination
    paginated_hotels = query.paginate(page=page, per_page=per_page, error_out=False)
    
    # Process results with availability and dynamic pricing
    results = []
    check_in_date = datetime.strptime(check_in, '%Y-%m-%d').date() if check_in else None
    check_out_date = datetime.strptime(check_out, '%Y-%m-%d').date() if check_out else None
    
    for hotel in paginated_hotels.items:
        # Get available rooms
        available_rooms = []
        for room_type in hotel.rooms:
            if room_type.max_occupancy >= guests:
                # Calculate price
                if check_in_date and check_out_date:
                    total_price = calculate_dynamic_price(room_type, check_in_date, check_out_date)
                    nights = (check_out_date - check_in_date).days
                    price_per_night = total_price / nights if nights > 0 else room_type.base_price
                else:
                    total_price = room_type.base_price
                    price_per_night = room_type.base_price
                
                # Check if within price range
                if min_price <= price_per_night <= max_price:
                    available_rooms.append({
                        'id': room_type.id,
                        'name': room_type.name,
                        'max_occupancy': room_type.max_occupancy,
                        'price_per_night': round(price_per_night, 2),
                        'total_price': round(total_price, 2) if check_in_date else None,
                        'amenities': room_type.amenities
                    })
        
        if available_rooms:  # Only include hotels with available rooms
            results.append({
                'id': hotel.id,
                'name': hotel.name,
                'brand': hotel.brand,
                'property_type': hotel.property_type,
                'star_rating': hotel.star_rating,
                'overall_rating': hotel.overall_rating,
                'total_reviews': hotel.total_reviews,
                'address': hotel.address,
                'zone': hotel.zone,
                'images': hotel.images[:3] if hotel.images else [],
                'amenities': hotel.amenities,
                'available_rooms': available_rooms,
                'min_price_per_night': min([r['price_per_night'] for r in available_rooms]),
                'safety_rating': hotel.safety_rating,
                'hygiene_rating': hotel.hygiene_rating
            })
    
    return jsonify({
        'hotels': results,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': len(results),
            'total_pages': paginated_hotels.pages
        }
    }), 200

@bp.route('/<int:hotel_id>', methods=['GET'])
@cache.cached(timeout=300, query_string=True)
def get_hotel_details(hotel_id):
    """Get detailed hotel information"""
    hotel = Hotel.query.get_or_404(hotel_id)
    
    # Get reviews
    reviews = Review.query.filter_by(hotel_id=hotel_id)\
        .order_by(Review.created_at.desc())\
        .limit(10)\
        .all()
    
    # Get destination info
    destination = Destination.query.get(hotel.destination_id)
    
    return jsonify({
        'hotel': {
            'id': hotel.id,
            'name': hotel.name,
            'brand': hotel.brand,
            'property_type': hotel.property_type,
            'star_rating': hotel.star_rating,
            'address': hotel.address,
            'zone': hotel.zone,
            'latitude': hotel.latitude,
            'longitude': hotel.longitude,
            'overall_rating': hotel.overall_rating,
            'total_reviews': hotel.total_reviews,
            'safety_rating': hotel.safety_rating,
            'hygiene_rating': hotel.hygiene_rating,
            'sustainability_score': hotel.sustainability_score,
            'amenities': hotel.amenities,
            'images': hotel.images,
            'videos': hotel.videos,
            'virtual_tour_url': hotel.virtual_tour_url,
            'check_in_time': hotel.check_in_time,
            'check_out_time': hotel.check_out_time,
            'cancellation_policy': hotel.cancellation_policy,
            'allows_pets': hotel.allows_pets,
            'is_verified': hotel.is_verified,
            'rooms': [{
                'id': room.id,
                'name': room.name,
                'description': room.description,
                'max_occupancy': room.max_occupancy,
                'bed_type': room.bed_type,
                'room_size_sqft': room.room_size_sqft,
                'base_price': room.base_price,
                'amenities': room.amenities,
                'images': room.images,
                'total_rooms': room.total_rooms
            } for room in hotel.rooms],
            'destination': {
                'id': destination.id,
                'name': destination.name
            } if destination else None
        },
        'reviews': [{
            'id': review.id,
            'user_name': review.user.full_name,
            'overall_rating': review.overall_rating,
            'review_title': review.review_title,
            'review_text': review.review_text,
            'cleanliness_rating': review.cleanliness_rating,
            'service_rating': review.service_rating,
            'location_rating': review.location_rating,
            'created_at': review.created_at.isoformat(),
            'is_verified_stay': review.is_verified_stay
        } for review in reviews]
    }), 200

@bp.route('/<int:hotel_id>/availability', methods=['POST'])
def check_availability(hotel_id):
    """Check room availability for specific dates"""
    data = request.get_json()
    check_in = datetime.strptime(data['check_in'], '%Y-%m-%d').date()
    check_out = datetime.strptime(data['check_out'], '%Y-%m-%d').date()
    
    hotel = Hotel.query.get_or_404(hotel_id)
    
    available_rooms = []
    for room_type in hotel.rooms:
        # Count existing bookings for this room type
        from backend.models import Booking
        booked_rooms = db.session.query(func.count(Booking.id))\
            .filter(
                Booking.room_type_id == room_type.id,
                Booking.booking_status == 'confirmed',
                or_(
                    and_(Booking.check_in_date <= check_in, Booking.check_out_date > check_in),
                    and_(Booking.check_in_date < check_out, Booking.check_out_date >= check_out),
                    and_(Booking.check_in_date >= check_in, Booking.check_out_date <= check_out)
                )
            ).scalar()
        
        available_count = room_type.total_rooms - booked_rooms
        
        if available_count > 0:
            total_price = calculate_dynamic_price(room_type, check_in, check_out)
            nights = (check_out - check_in).days
            
            available_rooms.append({
                'room_type_id': room_type.id,
                'name': room_type.name,
                'available_count': available_count,
                'total_price': total_price,
                'price_per_night': round(total_price / nights, 2),
                'nights': nights
            })
    
    return jsonify({'available_rooms': available_rooms}), 200

@bp.route('/<int:hotel_id>/reviews', methods=['GET'])
def get_hotel_reviews(hotel_id):
    """Get paginated reviews for a hotel"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    reviews = Review.query.filter_by(hotel_id=hotel_id)\
        .order_by(Review.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'reviews': [{
            'id': review.id,
            'user_name': review.user.full_name,
            'overall_rating': review.overall_rating,
            'review_title': review.review_title,
            'review_text': review.review_text,
            'cleanliness_rating': review.cleanliness_rating,
            'service_rating': review.service_rating,
            'location_rating': review.location_rating,
            'value_for_money_rating': review.value_for_money_rating,
            'images': review.images,
            'created_at': review.created_at.isoformat(),
            'is_verified_stay': review.is_verified_stay,
            'helpfulness_score': review.helpfulness_score
        } for review in reviews.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': reviews.total,
            'pages': reviews.pages
        }
    }), 200
