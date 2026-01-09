"""
MASSIVE DATABASE SEEDING SCRIPT
Creates realistic, production-scale datasets
"""

from backend.app import create_app, db
from backend.models import *
from datetime import datetime, timedelta
import random

def seed_database():
    """Seed database with comprehensive data"""
    app = create_app()
    
    with app.app_context():
        print("🌱 Starting database seeding...")
        
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # ===== DESTINATIONS =====
        print("📍 Seeding destinations...")
        destinations_data = [
            {
                'name': 'Jaipur', 'state': 'Rajasthan', 'region': 'North',
                'latitude': 26.9124, 'longitude': 75.7873,
                'category': 'heritage', 'popularity_score': 9.2,
                'description': 'The Pink City - Capital of Rajasthan known for magnificent forts and palaces',
                'highlights': ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar'],
                'best_time_to_visit': 'October to March',
                'average_budget_per_day': 2500, 'typical_stay_duration': 3,
                'climate_type': 'Semi-arid', 'safety_rating': 4.6
            },
            {
                'name': 'Goa', 'state': 'Goa', 'region': 'West',
                'latitude': 15.2993, 'longitude': 74.1240,
                'category': 'beach', 'popularity_score': 9.5,
                'description': 'Beach paradise with Portuguese heritage and vibrant nightlife',
                'highlights': ['Calangute Beach', 'Baga Beach', 'Basilica of Bom Jesus', 'Fort Aguada'],
                'best_time_to_visit': 'November to February',
                'average_budget_per_day': 3000, 'typical_stay_duration': 4,
                'climate_type': 'Tropical', 'safety_rating': 4.5
            },
            {
                'name': 'Varanasi', 'state': 'Uttar Pradesh', 'region': 'North',
                'latitude': 25.3176, 'longitude': 82.9739,
                'category': 'pilgrimage', 'popularity_score': 8.8,
                'description': 'Oldest living city - Spiritual capital on the banks of Ganges',
                'highlights': ['Dashashwamedh Ghat', 'Kashi Vishwanath Temple', 'Sarnath', 'Ganga Aarti'],
                'best_time_to_visit': 'October to March',
                'average_budget_per_day': 1800, 'typical_stay_duration': 2,
                'climate_type': 'Subtropical', 'safety_rating': 4.3
            },
            {
                'name': 'Manali', 'state': 'Himachal Pradesh', 'region': 'North',
                'latitude': 32.2432, 'longitude': 77.1892,
                'category': 'hill-station', 'popularity_score': 9.0,
                'description': 'Himalayan resort town - Adventure capital with snow-capped peaks',
                'highlights': ['Rohtang Pass', 'Solang Valley', 'Hadimba Temple', 'Old Manali'],
                'best_time_to_visit': 'October to June',
                'average_budget_per_day': 3500, 'typical_stay_duration': 4,
                'climate_type': 'Alpine', 'safety_rating': 4.7
            },
            {
                'name': 'Kerala Backwaters', 'state': 'Kerala', 'region': 'South',
                'latitude': 9.4981, 'longitude': 76.3388,
                'category': 'nature', 'popularity_score': 9.3,
                'description': 'Network of lagoons and lakes - Gods Own Country',
                'highlights': ['Houseboat Cruise', 'Alleppey', 'Kumarakom', 'Vembanad Lake'],
                'best_time_to_visit': 'September to March',
                'average_budget_per_day': 4000, 'typical_stay_duration': 3,
                'climate_type': 'Tropical', 'safety_rating': 4.8
            },
            {
                'name': 'Udaipur', 'state': 'Rajasthan', 'region': 'North',
                'latitude': 24.5854, 'longitude': 73.7125,
                'category': 'heritage', 'popularity_score': 8.9,
                'description': 'City of Lakes - Romantic palaces and stunning lakeside views',
                'highlights': ['Lake Pichola', 'City Palace', 'Jag Mandir', 'Saheliyon Ki Bari'],
                'best_time_to_visit': 'September to March',
                'average_budget_per_day': 3000, 'typical_stay_duration': 3,
                'climate_type': 'Semi-arid', 'safety_rating': 4.6
            },
            {
                'name': 'Rishikesh', 'state': 'Uttarakhand', 'region': 'North',
                'latitude': 30.0869, 'longitude': 78.2676,
                'category': 'adventure', 'popularity_score': 8.7,
                'description': 'Yoga capital of the world - Gateway to the Himalayas',
                'highlights': ['Lakshman Jhula', 'Ram Jhula', 'River Rafting', 'Beatles Ashram'],
                'best_time_to_visit': 'September to November, March to May',
                'average_budget_per_day': 2000, 'typical_stay_duration': 3,
                'climate_type': 'Subtropical', 'safety_rating': 4.5
            },
            {
                'name': 'Amritsar', 'state': 'Punjab', 'region': 'North',
                'latitude': 31.6340, 'longitude': 74.8723,
                'category': 'pilgrimage', 'popularity_score': 8.6,
                'description': 'Home of Golden Temple - Spiritual heart of Sikhism',
                'highlights': ['Golden Temple', 'Jallianwala Bagh', 'Wagah Border', 'Partition Museum'],
                'best_time_to_visit': 'November to March',
                'average_budget_per_day': 2200, 'typical_stay_duration': 2,
                'climate_type': 'Subtropical', 'safety_rating': 4.7
            },
            {
                'name': 'Hampi', 'state': 'Karnataka', 'region': 'South',
                'latitude': 15.3350, 'longitude': 76.4600,
                'category': 'heritage', 'popularity_score': 8.4,
                'description': 'Ancient ruins of Vijayanagara Empire - UNESCO World Heritage Site',
                'highlights': ['Virupaksha Temple', 'Vittala Temple', 'Stone Chariot', 'Matanga Hill'],
                'best_time_to_visit': 'October to February',
                'average_budget_per_day': 1500, 'typical_stay_duration': 2,
                'climate_type': 'Tropical', 'safety_rating': 4.5
            },
            {
                'name': 'Darjeeling', 'state': 'West Bengal', 'region': 'East',
                'latitude': 27.0410, 'longitude': 88.2663,
                'category': 'hill-station', 'popularity_score': 8.8,
                'description': 'Queen of the Hills - Tea gardens and Kanchenjunga views',
                'highlights': ['Tiger Hill', 'Toy Train', 'Tea Gardens', 'Batasia Loop'],
                'best_time_to_visit': 'March to May, October to November',
                'average_budget_per_day': 2800, 'typical_stay_duration': 3,
                'climate_type': 'Subtropical Highland', 'safety_rating': 4.6
            }
        ]
        
        destinations = []
        for dest_data in destinations_data:
            dest = Destination(**dest_data)
            destinations.append(dest)
            db.session.add(dest)
        
        db.session.commit()
        print(f"✅ Created {len(destinations)} destinations")
        
        # ===== USERS =====
        print("👥 Seeding users...")
        users = []
        travel_styles = ['solo', 'social', 'family', 'luxury', 'budget', 'backpacker']
        paces = ['slow', 'moderate', 'fast']
        
        for i in range(500):  # Create 500 users
            user = User(
                email=f'user{i}@example.com',
                full_name=f'User {i}',
                phone=f'+91{9000000000 + i}',
                role='traveler',
                is_verified=random.choice([True, False]),
                safety_score=round(random.uniform(3.5, 5.0), 1),
                travel_style=random.choice(travel_styles),
                pace_preference=random.choice(paces),
                budget_elasticity=round(random.uniform(0.3, 0.9), 2),
                food_preferences=random.sample(['vegetarian', 'non-veg', 'vegan', 'jain'], k=random.randint(1, 2)),
                interests=random.sample(['adventure', 'culture', 'food', 'photography', 'history'], k=random.randint(2, 4)),
                total_trips=random.randint(0, 50),
                total_bookings=random.randint(0, 100),
                member_since=datetime.utcnow() - timedelta(days=random.randint(1, 1095))
            )
            user.set_password('password123')
            users.append(user)
            db.session.add(user)
        
        db.session.commit()
        print(f"✅ Created {len(users)} users")
        
        # ===== HOTELS =====
        print("🏨 Seeding hotels (100+ per city)...")
        hotel_count = 0
        
        property_types = ['hotel', 'resort', 'homestay', 'hostel', 'villa']
        hotel_names = ['Taj', 'Oberoi', 'ITC', 'Radisson', 'Holiday Inn', 'Lemon Tree', 'FabHotel', 'Treebo', 'OYO', 'Zostel']
        zones = ['City Center', 'Airport Area', 'Railway Station', 'Old Town', 'Business District']
        
        for dest in destinations:
            for i in range(120):  # 120 hotels per destination
                hotel = Hotel(
                    name=f'{random.choice(hotel_names)} {dest.name} {i+1}',
                    brand=random.choice(hotel_names),
                    destination_id=dest.id,
                    property_type=random.choice(property_types),
                    star_rating=random.randint(2, 5),
                    zone=random.choice(zones),
                    latitude=dest.latitude + random.uniform(-0.1, 0.1),
                    longitude=dest.longitude + random.uniform(-0.1, 0.1),
                    base_price_per_night=random.randint(800, 8000),
                    overall_rating=round(random.uniform(3.0, 5.0), 1),
                    total_reviews=random.randint(10, 5000),
                    safety_rating=round(random.uniform(3.5, 5.0), 1),
                    hygiene_rating=round(random.uniform(3.5, 5.0), 1),
                    sustainability_score=round(random.uniform(2.0, 4.5), 1),
                    amenities={
                        'wifi': random.choice([True, False]),
                        'pool': random.choice([True, False]),
                        'gym': random.choice([True, False]),
                        'spa': random.choice([True, False]),
                        'restaurant': True,
                        'parking': random.choice([True, False]),
                        'ac': True
                    },
                    is_verified=random.choice([True, False]),
                    total_bookings=random.randint(50, 5000)
                )
                db.session.add(hotel)
                hotel_count += 1
                
                # Add 3-5 room types per hotel
                for j in range(random.randint(3, 5)):
                    room_names = ['Standard Room', 'Deluxe Room', 'Suite', 'Executive Room', 'Family Room']
                    room = RoomType(
                        hotel_id=hotel.id,
                        name=random.choice(room_names),
                        max_occupancy=random.randint(2, 6),
                        bed_type=random.choice(['Single', 'Double', 'Queen', 'King']),
                        room_size_sqft=random.randint(200, 600),
                        base_price=hotel.base_price_per_night + random.randint(-500, 2000),
                        weekend_multiplier=1.2,
                        peak_season_multiplier=1.5,
                        total_rooms=random.randint(5, 30),
                        amenities={'tv': True, 'minibar': random.choice([True, False])}
                    )
                    db.session.add(room)
        
        db.session.commit()
        print(f"✅ Created {hotel_count} hotels")
        
        # ===== ACTIVITIES =====
        print("🎯 Seeding activities (50-150 per city)...")
        activity_count = 0
        
        categories = ['sightseeing', 'adventure', 'cultural', 'religious', 'shopping', 'nature']
        
        for dest in destinations:
            for i in range(random.randint(50, 150)):
                activity = Activity(
                    destination_id=dest.id,
                    name=f'Activity {i+1} in {dest.name}',
                    description=f'Amazing {random.choice(categories)} experience',
                    category=random.choice(categories),
                    latitude=dest.latitude + random.uniform(-0.1, 0.1),
                    longitude=dest.longitude + random.uniform(-0.1, 0.1),
                    opening_time=random.choice(['06:00', '08:00', '09:00', '10:00']),
                    closing_time=random.choice(['18:00', '20:00', '22:00']),
                    typical_duration_minutes=random.choice([60, 90, 120, 180]),
                    entry_fee=random.choice([0, 50, 100, 200, 500]),
                    estimated_additional_cost=random.randint(0, 500),
                    energy_level_required=random.randint(1, 5),
                    crowd_density_score=round(random.uniform(2.0, 5.0), 1),
                    best_time_of_day=random.choice(['morning', 'afternoon', 'evening', 'night']),
                    popularity_score=round(random.uniform(3.0, 5.0), 1)
                )
                db.session.add(activity)
                activity_count += 1
        
        db.session.commit()
        print(f"✅ Created {activity_count} activities")
        
        # ===== RESTAURANTS =====
        print("🍽️ Seeding restaurants...")
        restaurant_count = 0
        
        cuisines = ['North Indian', 'South Indian', 'Chinese', 'Continental', 'Italian', 'Street Food']
        
        for dest in destinations:
            for i in range(50):
                restaurant = Restaurant(
                    destination_id=dest.id,
                    name=f'Restaurant {i+1} {dest.name}',
                    cuisine_types=random.sample(cuisines, k=random.randint(1, 3)),
                    latitude=dest.latitude + random.uniform(-0.1, 0.1),
                    longitude=dest.longitude + random.uniform(-0.1, 0.1),
                    average_cost_for_two=random.randint(300, 3000),
                    price_category=random.choice(['budget', 'mid-range', 'premium']),
                    overall_rating=round(random.uniform(3.0, 5.0), 1),
                    total_reviews=random.randint(10, 1000),
                    is_vegetarian=random.choice([True, False]),
                    is_vegan_friendly=random.choice([True, False])
                )
                db.session.add(restaurant)
                restaurant_count += 1
        
        db.session.commit()
        print(f"✅ Created {restaurant_count} restaurants")
        
        print("\n🎉 Database seeding completed successfully!")
        print(f"Total records created:")
        print(f"  - {len(destinations)} destinations")
        print(f"  - {len(users)} users")
        print(f"  - {hotel_count} hotels")
        print(f"  - {activity_count} activities")
        print(f"  - {restaurant_count} restaurants")

if __name__ == '__main__':
    seed_database()
