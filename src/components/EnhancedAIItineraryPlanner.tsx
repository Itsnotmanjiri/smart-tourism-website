import { useState, useEffect } from 'react';
import { MapPin, Calendar, DollarSign, Clock, ArrowLeft, Sparkles, ChevronDown, ChevronUp, Hotel, Utensils, Car, Camera, Info, Download, CheckCircle, Plus, User, Save, Navigation } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Props {
  onBack: () => void;
}

interface DayActivity {
  time: string;
  activity: string;
  location: string;
  cost: number;
  duration: string;
  description: string;
  category: 'sightseeing' | 'food' | 'transport' | 'accommodation' | 'activity';
  image?: string;
  lat?: number;
  lng?: number;
}

interface DayItinerary {
  day: number;
  title: string;
  activities: DayActivity[];
  totalCost: number;
  highlights: string[];
}

interface CityItinerary {
  city: string;
  state: string;
  bestTime: string;
  overview: string;
  image: string;
  itinerary: DayItinerary[];
  totalCost5Day: number;
  totalCost4Day: number;
  totalCost3Day: number;
  totalCost2Day: number;
  totalCost1Day: number;
  isUserGenerated?: boolean;
  submittedBy?: string;
}

// COMPREHENSIVE 10 CITIES AI-GENERATED ITINERARIES
const CITY_ITINERARIES: CityItinerary[] = [
  {
    city: 'Goa',
    state: 'Goa',
    bestTime: 'November to February',
    overview: 'Beaches, Portuguese heritage, vibrant nightlife, water sports, and seafood paradise',
    image: 'https://images.unsplash.com/photo-1757702244726-00198554c4a0?w=800',
    totalCost5Day: 18500,
    totalCost4Day: 15200,
    totalCost3Day: 11800,
    totalCost2Day: 8500,
    totalCost1Day: 4200,
    itinerary: [
      {
        day: 1,
        title: 'North Goa Beaches & Fort Aguada',
        highlights: ['Baga Beach', 'Calangute Beach', 'Fort Aguada', 'Candolim Beach'],
        totalCost: 4200,
        activities: [
          { time: '08:00', activity: 'Breakfast at Local Cafe', location: 'Calangute', cost: 300, duration: '1h', description: 'Traditional Goan breakfast with poi bread', category: 'food', lat: 15.5438, lng: 73.7555 },
          { time: '09:30', activity: 'Visit Baga Beach', location: 'Baga', cost: 0, duration: '2h', description: 'Water sports and morning swim', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1757702244726-00198554c4a0?w=400', lat: 15.5556, lng: 73.7515 },
          { time: '11:30', activity: 'Water Sports Package', location: 'Baga Beach', cost: 1500, duration: '1.5h', description: 'Parasailing, jet ski, banana boat', category: 'activity', lat: 15.5556, lng: 73.7515 },
          { time: '13:00', activity: 'Lunch at Beach Shack', location: 'Calangute', cost: 600, duration: '1h', description: 'Fresh seafood and Goan fish curry', category: 'food', lat: 15.5438, lng: 73.7555 },
          { time: '15:00', activity: 'Explore Fort Aguada', location: 'Candolim', cost: 50, duration: '2h', description: '17th-century Portuguese fort with lighthouse', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1705816794398-1fd72fe2bea3?w=400', lat: 15.4909, lng: 73.7731 },
          { time: '17:30', activity: 'Sunset at Candolim Beach', location: 'Candolim', cost: 0, duration: '1h', description: 'Peaceful beach with stunning sunset', category: 'sightseeing', lat: 15.5182, lng: 73.7615 },
          { time: '19:00', activity: 'Dinner at Tito\'s Lane', location: 'Baga', cost: 800, duration: '1.5h', description: 'Popular nightlife area', category: 'food', lat: 15.5556, lng: 73.7515 },
          { time: '21:00', activity: 'Hotel Check-in', location: 'North Goa', cost: 950, duration: '—', description: '3-star hotel near beaches', category: 'accommodation' }
        ]
      },
      {
        day: 2,
        title: 'South Goa & Palolem Beach',
        highlights: ['Palolem Beach', 'Cabo de Rama Fort', 'Agonda Beach'],
        totalCost: 3800,
        activities: [
          { time: '07:00', activity: 'Breakfast at Hotel', location: 'North Goa', cost: 250, duration: '1h', description: 'Continental breakfast', category: 'food', lat: 15.5556, lng: 73.7515 },
          { time: '08:30', activity: 'Travel to South Goa', location: 'Palolem', cost: 600, duration: '2h', description: 'Scenic coastal drive', category: 'transport', lat: 15.0100, lng: 74.0232 },
          { time: '11:00', activity: 'Palolem Beach Activities', location: 'Palolem', cost: 0, duration: '3h', description: 'Crescent beach with calm waters', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1594801001182-99ee8f8d5db9?w=400', lat: 15.0100, lng: 74.0232 },
          { time: '14:00', activity: 'Seafood Lunch', location: 'Palolem Shack', cost: 700, duration: '1h', description: 'Grilled fish and prawn curry', category: 'food', lat: 15.0100, lng: 74.0232 },
          { time: '15:30', activity: 'Visit Cabo de Rama Fort', location: 'South Goa', cost: 30, duration: '1.5h', description: 'Ancient fort with ocean views', category: 'sightseeing', lat: 15.0817, lng: 73.9119 },
          { time: '17:30', activity: 'Agonda Beach Sunset', location: 'Agonda', cost: 0, duration: '1h', description: 'Quiet beach for relaxation', category: 'sightseeing', lat: 15.0367, lng: 73.9886 },
          { time: '19:00', activity: 'Return to Hotel', location: 'North Goa', cost: 600, duration: '2h', description: 'Cab back to hotel', category: 'transport' },
          { time: '21:30', activity: 'Dinner Near Hotel', location: 'North Goa', cost: 500, duration: '1h', description: 'Local Goan restaurant', category: 'food' },
          { time: '23:00', activity: 'Hotel Stay', location: 'North Goa', cost: 1120, duration: '—', description: 'Same hotel', category: 'accommodation' }
        ]
      },
      {
        day: 3,
        title: 'Old Goa Heritage & River Cruise',
        highlights: ['Basilica of Bom Jesus', 'Se Cathedral', 'Spice Plantation', 'Mandovi River Cruise'],
        totalCost: 3500,
        activities: [
          { time: '08:00', activity: 'Breakfast at Hotel', location: 'North Goa', cost: 250, duration: '1h', description: 'Buffet breakfast', category: 'food', lat: 15.5556, lng: 73.7515 },
          { time: '09:30', activity: 'Visit Basilica of Bom Jesus', location: 'Old Goa', cost: 0, duration: '1h', description: 'UNESCO World Heritage site', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1718275520597-4536e694ab09?w=400', lat: 15.5008, lng: 73.9115 },
          { time: '11:00', activity: 'Se Cathedral', location: 'Old Goa', cost: 0, duration: '45min', description: 'Largest church in Asia', category: 'sightseeing', lat: 15.5008, lng: 73.9119 },
          { time: '12:00', activity: 'Spice Plantation Tour', location: 'Ponda', cost: 500, duration: '2h', description: 'Guided tour with lunch', category: 'activity', lat: 15.3811, lng: 74.0614 },
          { time: '14:30', activity: 'Spice Plantation Lunch', location: 'Ponda', cost: 400, duration: '1h', description: 'Authentic Goan thali', category: 'food' },
          { time: '16:00', activity: 'Shopping at Mapusa Market', location: 'Mapusa', cost: 800, duration: '1.5h', description: 'Spices and handicrafts', category: 'activity' },
          { time: '18:00', activity: 'Mandovi River Cruise', location: 'Panaji', cost: 600, duration: '1.5h', description: 'Sunset cruise with live music', category: 'activity' },
          { time: '20:00', activity: 'Dinner at Fontainhas', location: 'Panaji', cost: 650, duration: '1h', description: 'Latin Quarter dining', category: 'food' },
          { time: '22:00', activity: 'Hotel Stay', location: 'North Goa', cost: 300, duration: '—', description: 'Included', category: 'accommodation' }
        ]
      },
      {
        day: 4,
        title: 'Dudhsagar Falls & Jungle Safari',
        highlights: ['Dudhsagar Waterfalls', 'Jungle Safari', 'Wildlife Spotting'],
        totalCost: 3800,
        activities: [
          { time: '06:00', activity: 'Early Breakfast', location: 'Hotel', cost: 200, duration: '30min', description: 'Quick breakfast', category: 'food' },
          { time: '07:00', activity: 'Dudhsagar Falls Jeep Safari', location: 'Mollem', cost: 1800, duration: '6h', description: 'Jungle safari to India\'s 4th tallest waterfall', category: 'activity', image: 'https://images.unsplash.com/photo-1761024404837-082cb840b0e0?w=400' },
          { time: '13:00', activity: 'Packed Lunch at Falls', location: 'Dudhsagar', cost: 300, duration: '1h', description: 'Lunch box with local food', category: 'food' },
          { time: '14:30', activity: 'Swimming at Waterfall', location: 'Dudhsagar', cost: 0, duration: '1.5h', description: 'Natural pool at falls base', category: 'activity' },
          { time: '16:30', activity: 'Return Journey', location: 'North Goa', cost: 0, duration: '2h', description: 'Included in safari', category: 'transport' },
          { time: '19:00', activity: 'Dinner at Local Restaurant', location: 'North Goa', cost: 600, duration: '1h', description: 'Goan dishes', category: 'food' },
          { time: '21:00', activity: 'Hotel Stay', location: 'North Goa', cost: 900, duration: '—', description: 'Comfortable stay', category: 'accommodation' }
        ]
      },
      {
        day: 5,
        title: 'Beach Hopping & Departure',
        highlights: ['Anjuna Flea Market', 'Vagator Beach', 'Chapora Fort', 'Morjim Beach'],
        totalCost: 3200,
        activities: [
          { time: '08:00', activity: 'Breakfast at Hotel', location: 'North Goa', cost: 250, duration: '1h', description: 'Final breakfast', category: 'food' },
          { time: '09:30', activity: 'Anjuna Flea Market', location: 'Anjuna', cost: 1000, duration: '2h', description: 'Famous market for souvenirs', category: 'activity' },
          { time: '11:30', activity: 'Visit Vagator Beach', location: 'Vagator', cost: 0, duration: '1.5h', description: 'Dramatic red cliffs', category: 'sightseeing' },
          { time: '13:00', activity: 'Lunch at Vagator', location: 'Vagator', cost: 550, duration: '1h', description: 'Beachside cafe', category: 'food' },
          { time: '14:30', activity: 'Chapora Fort', location: 'Vagator', cost: 0, duration: '1h', description: 'Famous Dil Chahta Hai fort', category: 'sightseeing' },
          { time: '16:00', activity: 'Morjim Beach', location: 'Morjim', cost: 0, duration: '1.5h', description: 'Turtle nesting site', category: 'sightseeing' },
          { time: '18:00', activity: 'Airport Transfer', location: 'Dabolim Airport', cost: 700, duration: '1h', description: 'Taxi to airport', category: 'transport' },
          { time: '19:30', activity: 'Departure Snacks', location: 'Airport', cost: 400, duration: '30min', description: 'Light meal', category: 'food' },
          { time: '21:00', activity: 'Optional Night Stay', location: 'Panaji', cost: 300, duration: '—', description: 'Budget hotel', category: 'accommodation' }
        ]
      }
    ]
  },
  {
    city: 'Jaipur',
    state: 'Rajasthan',
    bestTime: 'October to March',
    overview: 'Pink City with majestic forts, palaces, vibrant bazaars, and Rajput heritage',
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800',
    totalCost5Day: 16500,
    totalCost4Day: 13500,
    totalCost3Day: 10200,
    totalCost2Day: 7100,
    totalCost1Day: 3800,
    itinerary: [
      {
        day: 1,
        title: 'Amber Fort & City Palace',
        highlights: ['Amber Fort', 'Jal Mahal', 'City Palace', 'Jantar Mantar'],
        totalCost: 3800,
        activities: [
          { time: '08:00', activity: 'Breakfast at Hotel', location: 'Jaipur', cost: 200, duration: '1h', description: 'Rajasthani breakfast', category: 'food' },
          { time: '09:30', activity: 'Amber Fort Visit', location: 'Amber', cost: 500, duration: '3h', description: 'Majestic hilltop fort', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=400' },
          { time: '12:30', activity: 'Photo Stop at Jal Mahal', location: 'Man Sagar Lake', cost: 0, duration: '30min', description: 'Palace in the lake', category: 'sightseeing' },
          { time: '13:00', activity: 'Lunch at Chokhi Dhani', location: 'Jaipur', cost: 600, duration: '1h', description: 'Rajasthani thali', category: 'food' },
          { time: '15:00', activity: 'City Palace Museum', location: 'Old City', cost: 400, duration: '2h', description: 'Royal residence with museums', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1716534133704-5a5c2a9c7512?w=400' },
          { time: '17:00', activity: 'Jantar Mantar Observatory', location: 'Old City', cost: 200, duration: '1h', description: 'UNESCO astronomical site', category: 'sightseeing' },
          { time: '18:30', activity: 'Dinner at Hawa Mahal Area', location: 'Old City', cost: 500, duration: '1h', description: 'Rooftop restaurant', category: 'food' },
          { time: '20:30', activity: 'Hotel Check-in', location: 'Jaipur', cost: 1400, duration: '—', description: 'Heritage hotel', category: 'accommodation' }
        ]
      },
      {
        day: 2,
        title: 'Hawa Mahal & Local Markets',
        highlights: ['Hawa Mahal', 'Johari Bazaar', 'Bapu Bazaar', 'Albert Hall Museum'],
        totalCost: 3200,
        activities: [
          { time: '08:00', activity: 'Breakfast at Hotel', location: 'Jaipur', cost: 200, duration: '1h', description: 'Continental breakfast', category: 'food' },
          { time: '09:30', activity: 'Hawa Mahal Photography', location: 'Old City', cost: 200, duration: '1h', description: 'Palace of Winds', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1707793044127-bf3b560353e2?w=400' },
          { time: '11:00', activity: 'Shopping at Johari Bazaar', location: 'Old City', cost: 1000, duration: '2h', description: 'Jewelry and gemstones', category: 'activity' },
          { time: '13:00', activity: 'Lunch at LMB', location: 'Johari Bazaar', cost: 300, duration: '1h', description: 'Dal bati churma', category: 'food' },
          { time: '15:00', activity: 'Bapu Bazaar Shopping', location: 'Bapu Bazaar', cost: 800, duration: '2h', description: 'Textiles and juttis', category: 'activity' },
          { time: '17:30', activity: 'Albert Hall Museum', location: 'Ram Niwas Garden', cost: 150, duration: '1.5h', description: 'Indo-Saracenic architecture', category: 'sightseeing' },
          { time: '19:30', activity: 'Dinner at Thali Restaurant', location: 'MI Road', cost: 450, duration: '1h', description: 'Unlimited Rajasthani thali', category: 'food' },
          { time: '21:00', activity: 'Hotel Stay', location: 'Jaipur', cost: 100, duration: '—', description: 'Included', category: 'accommodation' }
        ]
      },
      {
        day: 3,
        title: 'Nahargarh Fort & Cultural Evening',
        highlights: ['Nahargarh Fort', 'Jaigarh Fort', 'Cultural Show', 'Sunset Views'],
        totalCost: 3300,
        activities: [
          { time: '08:00', activity: 'Breakfast at Hotel', location: 'Jaipur', cost: 200, duration: '1h', description: 'Indian breakfast', category: 'food' },
          { time: '10:00', activity: 'Jaigarh Fort Visit', location: 'Aravalli Hills', cost: 300, duration: '2h', description: 'Fort with world\'s largest cannon', category: 'sightseeing' },
          { time: '12:30', activity: 'Lunch at Fort Restaurant', location: 'Jaigarh', cost: 400, duration: '1h', description: 'Traditional food', category: 'food' },
          { time: '14:00', activity: 'Nahargarh Fort', location: 'Aravalli Hills', cost: 200, duration: '2h', description: 'Tiger Fort with city views', category: 'sightseeing' },
          { time: '16:30', activity: 'Sunset at Nahargarh', location: 'Fort', cost: 0, duration: '1h', description: 'Best sunset point', category: 'sightseeing' },
          { time: '18:00', activity: 'Return to City', location: 'Jaipur', cost: 300, duration: '30min', description: 'Taxi back', category: 'transport' },
          { time: '19:00', activity: 'Cultural Show', location: 'Chokhi Dhani', cost: 800, duration: '2.5h', description: 'Folk dances and dinner', category: 'activity' },
          { time: '22:00', activity: 'Hotel Stay', location: 'Jaipur', cost: 1100, duration: '—', description: 'Comfortable stay', category: 'accommodation' }
        ]
      },
      {
        day: 4,
        title: 'Artisan Villages & Temples',
        highlights: ['Block Printing', 'Blue Pottery', 'Galtaji Temple', 'Local Crafts'],
        totalCost: 3100,
        activities: [
          { time: '08:00', activity: 'Breakfast at Hotel', location: 'Jaipur', cost: 200, duration: '1h', description: 'Buffet breakfast', category: 'food' },
          { time: '09:30', activity: 'Block Printing Workshop', location: 'Sanganer', cost: 500, duration: '2h', description: 'Traditional craft demonstration', category: 'activity' },
          { time: '12:00', activity: 'Lunch at Local Dhaba', location: 'Sanganer', cost: 350, duration: '1h', description: 'Authentic local food', category: 'food' },
          { time: '13:30', activity: 'Blue Pottery Workshop', location: 'Jaipur', cost: 400, duration: '1.5h', description: 'Famous Jaipur blue pottery', category: 'activity' },
          { time: '15:30', activity: 'Galtaji Temple Visit', location: 'Galta', cost: 50, duration: '2h', description: 'Ancient hilltop temple complex', category: 'sightseeing' },
          { time: '18:00', activity: 'Shopping at Local Markets', location: 'Jaipur', cost: 700, duration: '1.5h', description: 'Handicrafts and souvenirs', category: 'activity' },
          { time: '20:00', activity: 'Dinner at Rooftop', location: 'Old City', cost: 600, duration: '1h', description: 'City views dining', category: 'food' },
          { time: '22:00', activity: 'Hotel Stay', location: 'Jaipur', cost: 300, duration: '—', description: 'Included', category: 'accommodation' }
        ]
      },
      {
        day: 5,
        title: 'Day Trip to Pushkar or Departure',
        highlights: ['Pushkar Lake', 'Brahma Temple', 'Pushkar Bazaar', 'Camel Fair (seasonal)'],
        totalCost: 3100,
        activities: [
          { time: '06:00', activity: 'Early Breakfast', location: 'Hotel', cost: 200, duration: '30min', description: 'Quick breakfast', category: 'food' },
          { time: '07:00', activity: 'Drive to Pushkar', location: 'Pushkar', cost: 800, duration: '2.5h', description: 'Scenic highway drive', category: 'transport' },
          { time: '10:00', activity: 'Pushkar Lake Visit', location: 'Pushkar', cost: 0, duration: '1.5h', description: 'Holy lake with ghats', category: 'sightseeing' },
          { time: '12:00', activity: 'Brahma Temple', location: 'Pushkar', cost: 50, duration: '1h', description: 'Only Brahma temple in world', category: 'sightseeing' },
          { time: '13:30', activity: 'Lunch at Pushkar', location: 'Pushkar', cost: 400, duration: '1h', description: 'Vegetarian cuisine', category: 'food' },
          { time: '15:00', activity: 'Pushkar Bazaar Shopping', location: 'Pushkar', cost: 800, duration: '1.5h', description: 'Traditional items', category: 'activity' },
          { time: '17:00', activity: 'Return to Jaipur', location: 'Jaipur', cost: 800, duration: '2.5h', description: 'Return journey', category: 'transport' },
          { time: '20:00', activity: 'Farewell Dinner', location: 'Jaipur', cost: 750, duration: '1h', description: 'Special Rajasthani meal', category: 'food' },
          { time: '22:00', activity: 'Checkout / Airport Transfer', location: 'Jaipur Airport', cost: 300, duration: '—', description: 'Optional', category: 'transport' }
        ]
      }
    ]
  },
  {
    city: 'Kerala',
    state: 'Kerala',
    bestTime: 'September to March',
    overview: 'God\'s Own Country - backwaters, houseboats, tea plantations, beaches, and Ayurveda',
    image: 'https://images.unsplash.com/photo-1707893013488-51672ef83425?w=800',
    totalCost5Day: 22000,
    totalCost4Day: 18000,
    totalCost3Day: 13500,
    totalCost2Day: 9000,
    totalCost1Day: 4500,
    itinerary: [
      {
        day: 1,
        title: 'Kochi Heritage Walk',
        highlights: ['Fort Kochi', 'Chinese Fishing Nets', 'St. Francis Church', 'Kathakali Show'],
        totalCost: 4500,
        activities: [
          { time: '09:00', activity: 'Breakfast at Hotel', location: 'Kochi', cost: 300, duration: '1h', description: 'Kerala breakfast', category: 'food' },
          { time: '10:30', activity: 'Fort Kochi Walk', location: 'Fort Kochi', cost: 0, duration: '2h', description: 'Colonial architecture tour', category: 'sightseeing' },
          { time: '12:30', activity: 'Chinese Fishing Nets', location: 'Fort Kochi Beach', cost: 100, duration: '1h', description: 'Iconic fishing method', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1707893013488-51672ef83425?w=400' },
          { time: '13:30', activity: 'Seafood Lunch', location: 'Fort Kochi', cost: 700, duration: '1h', description: 'Fresh catch prepared', category: 'food' },
          { time: '15:00', activity: 'St. Francis Church', location: 'Fort Kochi', cost: 50, duration: '45min', description: 'Oldest European church in India', category: 'sightseeing' },
          { time: '16:00', activity: 'Mattancherry Palace', location: 'Mattancherry', cost: 50, duration: '1h', description: 'Dutch Palace with murals', category: 'sightseeing' },
          { time: '17:30', activity: 'Jew Town Shopping', location: 'Mattancherry', cost: 800, duration: '1.5h', description: 'Antiques and spices', category: 'activity' },
          { time: '19:30', activity: 'Kathakali Show', location: 'Ernakulam', cost: 600, duration: '1.5h', description: 'Traditional dance drama', category: 'activity' },
          { time: '21:30', activity: 'Hotel Check-in', location: 'Kochi', cost: 1900, duration: '—', description: 'Heritage hotel', category: 'accommodation' }
        ]
      },
      {
        day: 2,
        title: 'Alleppey Houseboat Experience',
        highlights: ['Alleppey Backwaters', 'Houseboat Cruise', 'Village Life', 'Kerala Cuisine'],
        totalCost: 6000,
        activities: [
          { time: '08:00', activity: 'Breakfast & Checkout', location: 'Kochi', cost: 250, duration: '1h', description: 'Final breakfast', category: 'food' },
          { time: '09:30', activity: 'Transfer to Alleppey', location: 'Alleppey', cost: 600, duration: '1.5h', description: 'Scenic drive', category: 'transport' },
          { time: '11:00', activity: 'Houseboat Check-in', location: 'Alleppey Backwaters', cost: 4000, duration: '24h', description: 'Premium houseboat with AC', category: 'accommodation' },
          { time: '12:00', activity: 'Cruise Begins', location: 'Backwaters', cost: 0, duration: 'All day', description: 'Exploring narrow canals', category: 'activity', image: 'https://images.unsplash.com/photo-1707893013488-51672ef83425?w=400' },
          { time: '13:30', activity: 'Traditional Kerala Lunch', location: 'Houseboat', cost: 0, duration: '1h', description: 'Included in package', category: 'food' },
          { time: '16:00', activity: 'Village Stop', location: 'Local Village', cost: 150, duration: '1h', description: 'Coir-making demonstration', category: 'activity' },
          { time: '18:00', activity: 'Sunset on Backwaters', location: 'Vembanad Lake', cost: 0, duration: '1h', description: 'Magical sunset views', category: 'sightseeing' },
          { time: '19:30', activity: 'Dinner on Houseboat', location: 'Houseboat', cost: 0, duration: '1h', description: 'Fresh Kerala cuisine', category: 'food' },
          { time: '21:00', activity: 'Overnight Stay', location: 'Houseboat', cost: 0, duration: '—', description: 'Included', category: 'accommodation' }
        ]
      },
      {
        day: 3,
        title: 'Munnar Tea Plantations',
        highlights: ['Tea Gardens', 'Mattupetty Dam', 'Eravikulam National Park', 'Tea Museum'],
        totalCost: 4200,
        activities: [
          { time: '07:00', activity: 'Breakfast on Houseboat', location: 'Houseboat', cost: 0, duration: '1h', description: 'Included', category: 'food' },
          { time: '09:00', activity: 'Checkout & Transfer to Munnar', location: 'Munnar', cost: 1500, duration: '4h', description: 'Mountain drive', category: 'transport' },
          { time: '13:00', activity: 'Lunch at Munnar', location: 'Munnar', cost: 400, duration: '1h', description: 'Local restaurant', category: 'food' },
          { time: '14:30', activity: 'Tea Plantation Visit', location: 'Munnar', cost: 200, duration: '2h', description: 'Walk through tea gardens', category: 'sightseeing' },
          { time: '16:30', activity: 'Tea Museum', location: 'Munnar', cost: 150, duration: '1h', description: 'Learn tea processing', category: 'sightseeing' },
          { time: '18:00', activity: 'Hotel Check-in', location: 'Munnar', cost: 1200, duration: '—', description: 'Hill resort', category: 'accommodation' },
          { time: '19:30', activity: 'Dinner at Hotel', location: 'Munnar', cost: 550, duration: '1h', description: 'Multi-cuisine', category: 'food' },
          { time: '21:00', activity: 'Bonfire & Relaxation', location: 'Hotel', cost: 200, duration: '—', description: 'Evening entertainment', category: 'activity' }
        ]
      },
      {
        day: 4,
        title: 'Munnar Nature & Wildlife',
        highlights: ['Eravikulam National Park', 'Echo Point', 'Mattupetty Dam', 'Photo Point'],
        totalCost: 3700,
        activities: [
          { time: '07:00', activity: 'Breakfast at Hotel', location: 'Munnar', cost: 300, duration: '1h', description: 'Buffet breakfast', category: 'food' },
          { time: '08:30', activity: 'Eravikulam National Park', location: 'Munnar', cost: 600, duration: '3h', description: 'Nilgiri Tahr spotting', category: 'sightseeing' },
          { time: '12:00', activity: 'Lunch at Local Restaurant', location: 'Munnar', cost: 450, duration: '1h', description: 'South Indian meals', category: 'food' },
          { time: '13:30', activity: 'Mattupetty Dam Visit', location: 'Mattupetty', cost: 100, duration: '1.5h', description: 'Boating available', category: 'sightseeing' },
          { time: '15:30', activity: 'Echo Point', location: 'Munnar', cost: 50, duration: '1h', description: 'Natural echo phenomenon', category: 'sightseeing' },
          { time: '17:00', activity: 'Photo Point & Viewpoints', location: 'Munnar', cost: 0, duration: '1h', description: 'Panoramic valley views', category: 'sightseeing' },
          { time: '18:30', activity: 'Return to Hotel', location: 'Munnar', cost: 0, duration: '30min', description: 'Short drive', category: 'transport' },
          { time: '19:30', activity: 'Dinner at Hotel', location: 'Munnar', cost: 600, duration: '1h', description: 'Special dinner', category: 'food' },
          { time: '21:00', activity: 'Hotel Stay', location: 'Munnar', cost: 1600, duration: '—', description: 'Comfortable stay', category: 'accommodation' }
        ]
      },
      {
        day: 5,
        title: 'Kovalam Beach & Departure',
        highlights: ['Lighthouse Beach', 'Ayurveda Spa', 'Vizhinjam Fishing Harbor', 'Beach Relaxation'],
        totalCost: 3600,
        activities: [
          { time: '07:00', activity: 'Breakfast & Checkout', location: 'Munnar', cost: 300, duration: '1h', description: 'Early breakfast', category: 'food' },
          { time: '08:30', activity: 'Transfer to Kovalam', location: 'Kovalam', cost: 1800, duration: '5h', description: 'Long scenic drive', category: 'transport' },
          { time: '14:00', activity: 'Beach Lunch', location: 'Kovalam', cost: 500, duration: '1h', description: 'Seafood by the beach', category: 'food' },
          { time: '15:30', activity: 'Lighthouse Beach', location: 'Kovalam', cost: 0, duration: '2h', description: 'Swimming and relaxation', category: 'sightseeing' },
          { time: '17:30', activity: 'Ayurveda Massage', location: 'Kovalam', cost: 800, duration: '1h', description: 'Traditional Kerala massage', category: 'activity' },
          { time: '19:00', activity: 'Sunset at Beach', location: 'Kovalam Beach', cost: 0, duration: '30min', description: 'Beautiful sunset', category: 'sightseeing' },
          { time: '20:00', activity: 'Farewell Dinner', location: 'Kovalam', cost: 700, duration: '1h', description: 'Beachside dining', category: 'food' },
          { time: '22:00', activity: 'Transfer to Airport', location: 'Trivandrum Airport', cost: 500, duration: '30min', description: 'Departure transfer', category: 'transport' }
        ]
      }
    ]
  },
  {
    city: 'Manali',
    state: 'Himachal Pradesh',
    bestTime: 'March to June, December to February',
    overview: 'Himalayan paradise with snow peaks, adventure sports, temples, and scenic valleys',
    image: 'https://images.unsplash.com/photo-1712255495820-23c2c2d05bd9?w=800',
    totalCost5Day: 19500,
    totalCost4Day: 16000,
    totalCost3Day: 12000,
    totalCost2Day: 8000,
    totalCost1Day: 4200,
    itinerary: [
      {
        day: 1,
        title: 'Manali Town & Hidimba Temple',
        highlights: ['Hidimba Devi Temple', 'Manu Temple', 'Mall Road', 'Tibetan Monastery'],
        totalCost: 4200,
        activities: [
          { time: '09:00', activity: 'Breakfast at Hotel', location: 'Manali', cost: 300, duration: '1h', description: 'Continental breakfast', category: 'food' },
          { time: '10:30', activity: 'Hidimba Devi Temple', location: 'Manali', cost: 50, duration: '1.5h', description: 'Ancient wood temple in forest', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1712255495820-23c2c2d05bd9?w=400' },
          { time: '12:00', activity: 'Manu Temple Visit', location: 'Old Manali', cost: 0, duration: '45min', description: 'Dedicated to sage Manu', category: 'sightseeing' },
          { time: '13:00', activity: 'Lunch at Old Manali', location: 'Old Manali', cost: 500, duration: '1h', description: 'Cafe with mountain views', category: 'food' },
          { time: '15:00', activity: 'Mall Road Shopping', location: 'Manali', cost: 800, duration: '2h', description: 'Local handicrafts and woolens', category: 'activity' },
          { time: '17:30', activity: 'Tibetan Monastery', location: 'Manali', cost: 50, duration: '1h', description: 'Buddhist monastery and market', category: 'sightseeing' },
          { time: '19:00', activity: 'Dinner at Mall Road', location: 'Manali', cost: 600, duration: '1h', description: 'Multi-cuisine restaurant', category: 'food' },
          { time: '21:00', activity: 'Hotel Check-in', location: 'Manali', cost: 1900, duration: '—', description: 'Comfortable hotel', category: 'accommodation' }
        ]
      },
      {
        day: 2,
        title: 'Solang Valley Adventure',
        highlights: ['Solang Valley', 'Paragliding', 'Zorbing', 'Cable Car Ride'],
        totalCost: 4500,
        activities: [
          { time: '08:00', activity: 'Breakfast at Hotel', location: 'Manali', cost: 300, duration: '1h', description: 'Hearty breakfast', category: 'food' },
          { time: '09:30', activity: 'Drive to Solang Valley', location: 'Solang', cost: 400, duration: '45min', description: 'Scenic mountain drive', category: 'transport' },
          { time: '10:30', activity: 'Paragliding', location: 'Solang Valley', cost: 1500, duration: '30min', description: 'Tandem paragliding', category: 'activity' },
          { time: '11:30', activity: 'Zorbing', location: 'Solang Valley', cost: 500, duration: '30min', description: 'Downhill zorbing', category: 'activity' },
          { time: '12:30', activity: 'Cable Car Ride', location: 'Solang', cost: 700, duration: '1h', description: 'Ropeway to snow point', category: 'activity' },
          { time: '13:30', activity: 'Lunch at Solang', location: 'Solang', cost: 450, duration: '1h', description: 'Local dhaba food', category: 'food' },
          { time: '15:00', activity: 'ATV Ride', location: 'Solang Valley', cost: 600, duration: '30min', description: 'All-terrain vehicle', category: 'activity' },
          { time: '16:00', activity: 'Return to Manali', location: 'Manali', cost: 400, duration: '45min', description: 'Return journey', category: 'transport' },
          { time: '18:00', activity: 'Dinner at Hotel', location: 'Manali', cost: 550, duration: '1h', description: 'Buffet dinner', category: 'food' },
          { time: '20:00', activity: 'Hotel Stay', location: 'Manali', cost: 100, duration: '—', description: 'Included', category: 'accommodation' }
        ]
      },
      {
        day: 3,
        title: 'Rohtang Pass Excursion',
        highlights: ['Rohtang Pass', 'Snow Activities', 'Mountain Views', 'Photography'],
        totalCost: 5000,
        activities: [
          { time: '05:00', activity: 'Early Breakfast', location: 'Hotel', cost: 250, duration: '30min', description: 'Quick breakfast', category: 'food' },
          { time: '06:00', activity: 'Rohtang Pass Trip', location: 'Rohtang', cost: 2500, duration: '8h', description: 'Full day excursion with permits', category: 'activity' },
          { time: '10:00', activity: 'Snow Activities', location: 'Rohtang Pass', cost: 800, duration: '2h', description: 'Skiing, snowboarding, sledding', category: 'activity' },
          { time: '12:30', activity: 'Packed Lunch', location: 'Rohtang', cost: 300, duration: '30min', description: 'Lunch boxes', category: 'food' },
          { time: '13:30', activity: 'Photography & Views', location: 'Rohtang Pass', cost: 0, duration: '1h', description: 'Panoramic Himalayan views', category: 'sightseeing' },
          { time: '15:00', activity: 'Return Journey', location: 'Manali', cost: 0, duration: '2h', description: 'Included in package', category: 'transport' },
          { time: '18:00', activity: 'Rest at Hotel', location: 'Manali', cost: 0, duration: '1h', description: 'Freshen up', category: 'accommodation' },
          { time: '19:30', activity: 'Dinner at Local Restaurant', location: 'Manali', cost: 650, duration: '1h', description: 'Himachali cuisine', category: 'food' },
          { time: '21:00', activity: 'Hotel Stay', location: 'Manali', cost: 500, duration: '—', description: 'Comfortable stay', category: 'accommodation' }
        ]
      },
      {
        day: 4,
        title: 'Kasol & Manikaran Day Trip',
        highlights: ['Kasol Hippie Village', 'Manikaran Hot Springs', 'Parvati River', 'Israeli Cafes'],
        totalCost: 3500,
        activities: [
          { time: '08:00', activity: 'Breakfast at Hotel', location: 'Manali', cost: 300, duration: '1h', description: 'Full breakfast', category: 'food' },
          { time: '09:30', activity: 'Drive to Kasol', location: 'Kasol', cost: 800, duration: '2h', description: 'Scenic Parvati Valley drive', category: 'transport' },
          { time: '12:00', activity: 'Kasol Village Walk', location: 'Kasol', cost: 0, duration: '1.5h', description: 'Explore hippie village', category: 'sightseeing' },
          { time: '13:30', activity: 'Lunch at Israeli Cafe', location: 'Kasol', cost: 500, duration: '1h', description: 'Authentic Israeli food', category: 'food' },
          { time: '15:00', activity: 'Manikaran Hot Springs', location: 'Manikaran', cost: 100, duration: '1.5h', description: 'Religious hot water springs', category: 'sightseeing' },
          { time: '16:30', activity: 'Gurudwara Visit', location: 'Manikaran', cost: 0, duration: '45min', description: 'Free community meal available', category: 'sightseeing' },
          { time: '17:30', activity: 'Return to Manali', location: 'Manali', cost: 800, duration: '2h', description: 'Return journey', category: 'transport' },
          { time: '20:00', activity: 'Dinner at Manali', location: 'Manali', cost: 600, duration: '1h', description: 'Local cuisine', category: 'food' },
          { time: '22:00', activity: 'Hotel Stay', location: 'Manali', cost: 400, duration: '—', description: 'Final night', category: 'accommodation' }
        ]
      },
      {
        day: 5,
        title: 'Naggar Castle & Departure',
        highlights: ['Naggar Castle', 'Roerich Art Gallery', 'Jana Waterfall', 'Village Walk'],
        totalCost: 2300,
        activities: [
          { time: '08:00', activity: 'Breakfast & Checkout', location: 'Hotel', cost: 300, duration: '1h', description: 'Final breakfast', category: 'food' },
          { time: '09:30', activity: 'Naggar Castle Visit', location: 'Naggar', cost: 150, duration: '1.5h', description: 'Heritage hotel and museum', category: 'sightseeing' },
          { time: '11:30', activity: 'Roerich Art Gallery', location: 'Naggar', cost: 100, duration: '1h', description: 'Russian artist\'s home', category: 'sightseeing' },
          { time: '13:00', activity: 'Lunch at Naggar', location: 'Naggar', cost: 400, duration: '1h', description: 'Traditional Himachali', category: 'food' },
          { time: '14:30', activity: 'Jana Waterfall Trek', location: 'Jana', cost: 0, duration: '1.5h', description: 'Short trek to waterfall', category: 'activity' },
          { time: '16:30', activity: 'Village Walk', location: 'Naggar', cost: 0, duration: '45min', description: 'Traditional village life', category: 'sightseeing' },
          { time: '17:30', activity: 'Return & Departure', location: 'Manali', cost: 500, duration: '1h', description: 'Transfer to bus stand/airport', category: 'transport' },
          { time: '19:00', activity: 'Departure Snacks', location: 'Manali', cost: 350, duration: '30min', description: 'Light meal', category: 'food' },
          { time: '20:00', activity: 'Optional Overnight Stay', location: 'Manali', cost: 500, duration: '—', description: 'If needed', category: 'accommodation' }
        ]
      }
    ]
  },
  {
    city: 'Udaipur',
    state: 'Rajasthan',
    bestTime: 'October to March',
    overview: 'City of Lakes with romantic palaces, boat rides, royal heritage, and sunset views',
    image: 'https://images.unsplash.com/photo-1705592360345-1cd173c8b345?w=800',
    totalCost5Day: 20000,
    totalCost4Day: 16500,
    totalCost3Day: 12500,
    totalCost2Day: 8500,
    totalCost1Day: 4500,
    itinerary: [
      {
        day: 1,
        title: 'City Palace & Lake Pichola',
        highlights: ['City Palace', 'Lake Palace View', 'Boat Ride', 'Bagore Ki Haveli'],
        totalCost: 4500,
        activities: [
          { time: '09:00', activity: 'Breakfast at Hotel', location: 'Udaipur', cost: 300, duration: '1h', description: 'Rajasthani breakfast', category: 'food' },
          { time: '10:30', activity: 'City Palace Visit', location: 'City Palace', cost: 500, duration: '3h', description: 'Majestic palace complex', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1705592360345-1cd173c8b345?w=400' },
          { time: '13:30', activity: 'Lunch at Ambrai', location: 'Lake Pichola', cost: 800, duration: '1h', description: 'Lakeside dining', category: 'food' },
          { time: '15:00', activity: 'Lake Pichola Boat Ride', location: 'Lake Pichola', cost: 600, duration: '1.5h', description: 'Sunset boat ride', category: 'activity' },
          { time: '17:00', activity: 'Bagore Ki Haveli', location: 'Gangaur Ghat', cost: 150, duration: '1h', description: 'Museum and cultural show', category: 'sightseeing' },
          { time: '18:30', activity: 'Cultural Dance Show', location: 'Bagore Ki Haveli', cost: 300, duration: '1h', description: 'Traditional Rajasthani performances', category: 'activity' },
          { time: '20:00', activity: 'Dinner at Rooftop', location: 'Old City', cost: 750, duration: '1h', description: 'Palace view dining', category: 'food' },
          { time: '22:00', activity: 'Hotel Check-in', location: 'Udaipur', cost: 2100, duration: '—', description: 'Heritage hotel', category: 'accommodation' }
        ]
      },
      {
        day: 2,
        title: 'Monsoon Palace & Fateh Sagar Lake',
        highlights: ['Monsoon Palace', 'Fateh Sagar Lake', 'Saheliyon Ki Bari', 'Local Markets'],
        totalCost: 4000,
        activities: [
          { time: '08:00', activity: 'Breakfast at Hotel', location: 'Udaipur', cost: 300, duration: '1h', description: 'Buffet breakfast', category: 'food' },
          { time: '09:30', activity: 'Monsoon Palace Visit', location: 'Aravalli Hills', cost: 300, duration: '2h', description: 'Hilltop palace with panoramic views', category: 'sightseeing' },
          { time: '12:00', activity: 'Lunch at Fateh Sagar', location: 'Fateh Sagar', cost: 500, duration: '1h', description: 'Lakeside restaurant', category: 'food' },
          { time: '13:30', activity: 'Fateh Sagar Lake Boating', location: 'Fateh Sagar', cost: 300, duration: '1h', description: 'Pedal boat or motor boat', category: 'activity' },
          { time: '15:00', activity: 'Saheliyon Ki Bari', location: 'Udaipur', cost: 100, duration: '1h', description: 'Garden of maidens', category: 'sightseeing' },
          { time: '16:30', activity: 'Shopping at Hathi Pol', location: 'Old City', cost: 900, duration: '2h', description: 'Miniature paintings and crafts', category: 'activity' },
          { time: '19:00', activity: 'Dinner at Ambrai Ghat', location: 'Lake Pichola', cost: 850, duration: '1.5h', description: 'Romantic lakeside setting', category: 'food' },
          { time: '21:00', activity: 'Hotel Stay', location: 'Udaipur', cost: 750, duration: '—', description: 'Comfortable stay', category: 'accommodation' }
        ]
      },
      {
        day: 3,
        title: 'Kumbhalgarh Fort Day Trip',
        highlights: ['Kumbhalgarh Fort', 'Great Wall of India', 'Wildlife Sanctuary', 'Ranakpur'],
        totalCost: 4200,
        activities: [
          { time: '07:00', activity: 'Early Breakfast', location: 'Hotel', cost: 250, duration: '45min', description: 'Quick breakfast', category: 'food' },
          { time: '08:00', activity: 'Drive to Kumbhalgarh', location: 'Kumbhalgarh', cost: 1200, duration: '2h', description: 'Scenic Aravalli drive', category: 'transport' },
          { time: '10:30', activity: 'Kumbhalgarh Fort Tour', location: 'Kumbhalgarh', cost: 200, duration: '3h', description: 'Second longest wall in world', category: 'sightseeing' },
          { time: '13:30', activity: 'Lunch at Kumbhalgarh', location: 'Kumbhalgarh', cost: 500, duration: '1h', description: 'Local Rajasthani cuisine', category: 'food' },
          { time: '15:00', activity: 'Ranakpur Jain Temple', location: 'Ranakpur', cost: 0, duration: '1.5h', description: 'Stunning marble temple', category: 'sightseeing' },
          { time: '17:00', activity: 'Return to Udaipur', location: 'Udaipur', cost: 1200, duration: '2h', description: 'Return journey', category: 'transport' },
          { time: '19:30', activity: 'Dinner at Hotel', location: 'Udaipur', cost: 650, duration: '1h', description: 'Multi-cuisine', category: 'food' },
          { time: '21:00', activity: 'Hotel Stay', location: 'Udaipur', cost: 200, duration: '—', description: 'Included', category: 'accommodation' }
        ]
      },
      {
        day: 4,
        title: 'Jaisamand Lake & Village Experience',
        highlights: ['Jaisamand Lake', 'Village Visit', 'Tribal Art', 'Island Temples'],
        totalCost: 3700,
        activities: [
          { time: '08:00', activity: 'Breakfast at Hotel', location: 'Udaipur', cost: 300, duration: '1h', description: 'Indian breakfast', category: 'food' },
          { time: '09:30', activity: 'Drive to Jaisamand', location: 'Jaisamand', cost: 800, duration: '1.5h', description: 'Countryside drive', category: 'transport' },
          { time: '11:30', activity: 'Jaisamand Lake Visit', location: 'Jaisamand', cost: 150, duration: '2h', description: 'Asia\'s second largest artificial lake', category: 'sightseeing' },
          { time: '13:30', activity: 'Lunch at Lakeview', location: 'Jaisamand', cost: 450, duration: '1h', description: 'Simple local food', category: 'food' },
          { time: '15:00', activity: 'Village Walk & Tribal Art', location: 'Nearby Village', cost: 300, duration: '2h', description: 'Bhil tribe culture', category: 'activity' },
          { time: '17:30', activity: 'Return to Udaipur', location: 'Udaipur', cost: 800, duration: '1.5h', description: 'Return drive', category: 'transport' },
          { time: '19:30', activity: 'Dinner at City Center', location: 'Udaipur', cost: 700, duration: '1h', description: 'Special dinner', category: 'food' },
          { time: '21:00', activity: 'Hotel Stay', location: 'Udaipur', cost: 200, duration: '—', description: 'Included', category: 'accommodation' }
        ]
      },
      {
        day: 5,
        title: 'Shilpgram & Eklingji Temple',
        highlights: ['Shilpgram Craft Village', 'Eklingji Temple', 'Nagda Ruins', 'Shopping'],
        totalCost: 3600,
        activities: [
          { time: '08:00', activity: 'Breakfast & Checkout', location: 'Hotel', cost: 300, duration: '1h', description: 'Final breakfast', category: 'food' },
          { time: '09:30', activity: 'Shilpgram Visit', location: 'Shilpgram', cost: 100, duration: '2h', description: 'Rural arts & crafts complex', category: 'activity' },
          { time: '12:00', activity: 'Eklingji Temple', location: 'Eklingji', cost: 0, duration: '1h', description: 'Ancient Lord Shiva temple', category: 'sightseeing' },
          { time: '13:30', activity: 'Lunch at Restaurant', location: 'Udaipur', cost: 500, duration: '1h', description: 'Farewell meal', category: 'food' },
          { time: '15:00', activity: 'Final Shopping', location: 'Udaipur Markets', cost: 1200, duration: '2h', description: 'Last-minute souvenirs', category: 'activity' },
          { time: '17:30', activity: 'Sunset at Sajjangarh', location: 'Monsoon Palace', cost: 200, duration: '1h', description: 'Final sunset view', category: 'sightseeing' },
          { time: '19:00', activity: 'Airport/Railway Transfer', location: 'Udaipur', cost: 500, duration: '30min', description: 'Departure transfer', category: 'transport' },
          { time: '20:00', activity: 'Departure Snacks', location: 'Airport/Station', cost: 300, duration: '—', description: 'Light refreshments', category: 'food' },
          { time: '21:00', activity: 'Optional Stay', location: 'Udaipur', cost: 500, duration: '—', description: 'If needed', category: 'accommodation' }
        ]
      }
    ]
  }
];

// Custom Itinerary Form Component
function CustomItineraryForm({ onClose, onSave }: { onClose: () => void; onSave: (itinerary: CityItinerary) => void }) {
  const [formData, setFormData] = useState({
    submittedBy: '',
    city: '',
    state: '',
    bestTime: '',
    overview: '',
    imageUrl: '',
    days: 1,
    day1Activities: [
      { activity: '', location: '', cost: 0, duration: '', description: '', category: 'sightseeing' as const },
      { activity: '', location: '', cost: 0, duration: '', description: '', category: 'sightseeing' as const },
      { activity: '', location: '', cost: 0, duration: '', description: '', category: 'food' as const },
      { activity: '', location: '', cost: 0, duration: '', description: '', category: 'activity' as const }
    ],
    day2Activities: [
      { activity: '', location: '', cost: 0, duration: '', description: '', category: 'sightseeing' as const },
      { activity: '', location: '', cost: 0, duration: '', description: '', category: 'sightseeing' as const },
      { activity: '', location: '', cost: 0, duration: '', description: '', category: 'food' as const },
      { activity: '', location: '', cost: 0, duration: '', description: '', category: 'activity' as const }
    ],
    day3Activities: [
      { activity: '', location: '', cost: 0, duration: '', description: '', category: 'sightseeing' as const },
      { activity: '', location: '', cost: 0, duration: '', description: '', category: 'sightseeing' as const },
      { activity: '', location: '', cost: 0, duration: '', description: '', category: 'food' as const },
      { activity: '', location: '', cost: 0, duration: '', description: '', category: 'activity' as const }
    ]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.submittedBy || !formData.city || !formData.state) {
      toast.error('Please fill all required fields');
      return;
    }

    const itinerary: CityItinerary = {
      city: formData.city,
      state: formData.state,
      bestTime: formData.bestTime || 'Year Round',
      overview: formData.overview || 'User-generated travel itinerary',
      image: formData.imageUrl || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
      isUserGenerated: true,
      submittedBy: formData.submittedBy,
      totalCost1Day: formData.day1Activities.reduce((sum, a) => sum + (a.cost || 0), 0),
      totalCost2Day: formData.day1Activities.reduce((sum, a) => sum + (a.cost || 0), 0) + formData.day2Activities.reduce((sum, a) => sum + (a.cost || 0), 0),
      totalCost3Day: formData.day1Activities.reduce((sum, a) => sum + (a.cost || 0), 0) + formData.day2Activities.reduce((sum, a) => sum + (a.cost || 0), 0) + formData.day3Activities.reduce((sum, a) => sum + (a.cost || 0), 0),
      totalCost4Day: 0,
      totalCost5Day: 0,
      itinerary: [
        {
          day: 1,
          title: 'Day 1',
          highlights: formData.day1Activities.filter(a => a.activity).map(a => a.activity),
          totalCost: formData.day1Activities.reduce((sum, a) => sum + (a.cost || 0), 0),
          activities: formData.day1Activities
            .filter(a => a.activity)
            .map((a, i) => ({
              time: `${9 + i * 2}:00`,
              ...a
            }))
        },
        {
          day: 2,
          title: 'Day 2',
          highlights: formData.day2Activities.filter(a => a.activity).map(a => a.activity),
          totalCost: formData.day2Activities.reduce((sum, a) => sum + (a.cost || 0), 0),
          activities: formData.day2Activities
            .filter(a => a.activity)
            .map((a, i) => ({
              time: `${9 + i * 2}:00`,
              ...a
            }))
        },
        {
          day: 3,
          title: 'Day 3',
          highlights: formData.day3Activities.filter(a => a.activity).map(a => a.activity),
          totalCost: formData.day3Activities.reduce((sum, a) => sum + (a.cost || 0), 0),
          activities: formData.day3Activities
            .filter(a => a.activity)
            .map((a, i) => ({
              time: `${9 + i * 2}:00`,
              ...a
            }))
        }
      ]
    };

    onSave(itinerary);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-6 rounded-t-2xl">
          <h3 className="text-2xl flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Share Your Travel Itinerary
          </h3>
          <p className="text-sm opacity-90 mt-1">Help fellow travelers by sharing your experience!</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Your Name *</label>
              <input
                type="text"
                required
                value={formData.submittedBy}
                onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">City/Destination *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Agra"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">State *</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Uttar Pradesh"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Best Time to Visit</label>
              <input
                type="text"
                value={formData.bestTime}
                onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="October to March"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Overview</label>
            <textarea
              value={formData.overview}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Brief description of the destination..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Image URL (optional)</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Day 1 Activities */}
          <div className="border-t pt-4">
            <h4 className="text-lg text-black mb-3">Day 1 Activities (3-4 activities)</h4>
            <div className="space-y-3">
              {formData.day1Activities.map((act, idx) => (
                <div key={idx} className="grid grid-cols-6 gap-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Activity name"
                    value={act.activity}
                    onChange={(e) => {
                      const updated = [...formData.day1Activities];
                      updated[idx].activity = e.target.value;
                      setFormData({ ...formData, day1Activities: updated });
                    }}
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={act.location}
                    onChange={(e) => {
                      const updated = [...formData.day1Activities];
                      updated[idx].location = e.target.value;
                      setFormData({ ...formData, day1Activities: updated });
                    }}
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Cost ₹"
                    value={act.cost || ''}
                    onChange={(e) => {
                      const updated = [...formData.day1Activities];
                      updated[idx].cost = Number(e.target.value);
                      setFormData({ ...formData, day1Activities: updated });
                    }}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={act.duration}
                    onChange={(e) => {
                      const updated = [...formData.day1Activities];
                      updated[idx].duration = e.target.value;
                      setFormData({ ...formData, day1Activities: updated });
                    }}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={act.description}
                    onChange={(e) => {
                      const updated = [...formData.day1Activities];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, day1Activities: updated });
                    }}
                    className="col-span-6 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Day 2 Activities */}
          <div className="border-t pt-4">
            <h4 className="text-lg text-black mb-3">Day 2 Activities (3-4 activities - Different from Day 1)</h4>
            <div className="space-y-3">
              {formData.day2Activities.map((act, idx) => (
                <div key={idx} className="grid grid-cols-6 gap-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Activity name"
                    value={act.activity}
                    onChange={(e) => {
                      const updated = [...formData.day2Activities];
                      updated[idx].activity = e.target.value;
                      setFormData({ ...formData, day2Activities: updated });
                    }}
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={act.location}
                    onChange={(e) => {
                      const updated = [...formData.day2Activities];
                      updated[idx].location = e.target.value;
                      setFormData({ ...formData, day2Activities: updated });
                    }}
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Cost ₹"
                    value={act.cost || ''}
                    onChange={(e) => {
                      const updated = [...formData.day2Activities];
                      updated[idx].cost = Number(e.target.value);
                      setFormData({ ...formData, day2Activities: updated });
                    }}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={act.duration}
                    onChange={(e) => {
                      const updated = [...formData.day2Activities];
                      updated[idx].duration = e.target.value;
                      setFormData({ ...formData, day2Activities: updated });
                    }}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={act.description}
                    onChange={(e) => {
                      const updated = [...formData.day2Activities];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, day2Activities: updated });
                    }}
                    className="col-span-6 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Day 3 Activities */}
          <div className="border-t pt-4">
            <h4 className="text-lg text-black mb-3">Day 3 Activities (3-4 activities - Different from Day 1 & 2)</h4>
            <div className="space-y-3">
              {formData.day3Activities.map((act, idx) => (
                <div key={idx} className="grid grid-cols-6 gap-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Activity name"
                    value={act.activity}
                    onChange={(e) => {
                      const updated = [...formData.day3Activities];
                      updated[idx].activity = e.target.value;
                      setFormData({ ...formData, day3Activities: updated });
                    }}
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={act.location}
                    onChange={(e) => {
                      const updated = [...formData.day3Activities];
                      updated[idx].location = e.target.value;
                      setFormData({ ...formData, day3Activities: updated });
                    }}
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Cost ₹"
                    value={act.cost || ''}
                    onChange={(e) => {
                      const updated = [...formData.day3Activities];
                      updated[idx].cost = Number(e.target.value);
                      setFormData({ ...formData, day3Activities: updated });
                    }}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={act.duration}
                    onChange={(e) => {
                      const updated = [...formData.day3Activities];
                      updated[idx].duration = e.target.value;
                      setFormData({ ...formData, day3Activities: updated });
                    }}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={act.description}
                    onChange={(e) => {
                      const updated = [...formData.day3Activities];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, day3Activities: updated });
                    }}
                    className="col-span-6 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
            >
              <Save className="w-5 h-5" />
              <span>Publish Itinerary</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EnhancedAIItineraryPlanner({ onBack }: Props) {
  const [selectedCity, setSelectedCity] = useState<CityItinerary | null>(null);
  const [selectedDays, setSelectedDays] = useState<number>(5);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [userItineraries, setUserItineraries] = useState<CityItinerary[]>([]);
  const [allItineraries, setAllItineraries] = useState<CityItinerary[]>(CITY_ITINERARIES);

  // Load user-generated itineraries from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('userItineraries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserItineraries(parsed);
        setAllItineraries([...CITY_ITINERARIES, ...parsed]);
      } catch (e) {
        console.error('Failed to load user itineraries');
      }
    }
  }, []);

  // Save user itineraries to localStorage
  const saveUserItinerary = (newItinerary: CityItinerary) => {
    const updated = [...userItineraries, newItinerary];
    setUserItineraries(updated);
    setAllItineraries([...CITY_ITINERARIES, ...updated]);
    localStorage.setItem('userItineraries', JSON.stringify(updated));
    toast.success('Your itinerary has been published! 🎉');
  };

  const getItineraryForDays = (city: CityItinerary, days: number): DayItinerary[] => {
    return city.itinerary.slice(0, days);
  };

  const getTotalCost = (city: CityItinerary, days: number): number => {
    switch(days) {
      case 1: return city.totalCost1Day;
      case 2: return city.totalCost2Day;
      case 3: return city.totalCost3Day;
      case 4: return city.totalCost4Day;
      case 5: return city.totalCost5Day;
      default: return city.totalCost5Day;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'accommodation': return <Hotel className="w-4 h-4" />;
      case 'food': return <Utensils className="w-4 h-4" />;
      case 'transport': return <Car className="w-4 h-4" />;
      case 'sightseeing': return <Camera className="w-4 h-4" />;
      case 'activity': return <Sparkles className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'accommodation': return 'bg-purple-100 text-purple-900';
      case 'food': return 'bg-orange-100 text-orange-900';
      case 'transport': return 'bg-blue-100 text-blue-900';
      case 'sightseeing': return 'bg-green-100 text-green-900';
      case 'activity': return 'bg-pink-100 text-pink-900';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculate travel time based on distance
  const calculateTravelTime = (distanceKm: number): string => {
    const avgSpeed = 30; // km/h average speed in city
    const hours = distanceKm / avgSpeed;
    const minutes = Math.round(hours * 60);
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hrs}h ${mins}min`;
    }
  };

  const generatePDF = () => {
    if (!selectedCity) return;

    const itinerary = getItineraryForDays(selectedCity, selectedDays);
    const totalCost = getTotalCost(selectedCity, selectedDays);

    // Generate text content
    let content = `${selectedCity.city} ${selectedDays}-Day Itinerary\n`;
    content += `${'='.repeat(60)}\n\n`;
    content += `${selectedCity.state} | Best Time: ${selectedCity.bestTime}\n`;
    content += `Total Cost: ₹${totalCost.toLocaleString('en-IN')}\n\n`;
    content += `${selectedCity.overview}\n\n`;
    content += `${'='.repeat(60)}\n\n`;

    itinerary.forEach((day) => {
      content += `DAY ${day.day}: ${day.title}\n`;
      content += `${'-'.repeat(60)}\n`;
      content += `Cost: ₹${day.totalCost.toLocaleString('en-IN')}\n`;
      content += `Highlights: ${day.highlights.join(', ')}\n\n`;

      day.activities.forEach((activity) => {
        content += `${activity.time} - ${activity.activity}\n`;
        content += `  Location: ${activity.location}\n`;
        content += `  Duration: ${activity.duration}\n`;
        content += `  Cost: ₹${activity.cost}\n`;
        content += `  ${activity.description}\n\n`;
      });

      content += `\n`;
    });

    // Cost breakdown
    content += `${'='.repeat(60)}\n`;
    content += `COST SUMMARY\n`;
    content += `${'='.repeat(60)}\n\n`;

    const categories: { [key: string]: number } = {};
    itinerary.forEach(day => {
      day.activities.forEach(activity => {
        if (!categories[activity.category]) categories[activity.category] = 0;
        categories[activity.category] += activity.cost;
      });
    });

    Object.entries(categories).forEach(([category, cost]) => {
      content += `${category.charAt(0).toUpperCase() + category.slice(1)}: ₹${cost.toLocaleString('en-IN')}\n`;
    });

    content += `\n${'='.repeat(60)}\n`;
    content += `TOTAL: ₹${totalCost.toLocaleString('en-IN')}\n`;
    content += `${'='.repeat(60)}\n`;

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedCity.city}-${selectedDays}Day-Itinerary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Itinerary Downloaded Successfully!');
  };

  if (selectedCity) {
    const itinerary = getItineraryForDays(selectedCity, selectedDays);
    const totalCost = getTotalCost(selectedCity, selectedDays);

    // Calculate category-wise breakdown
    const costBreakdown: { [key: string]: number } = {};
    itinerary.forEach(day => {
      day.activities.forEach(activity => {
        if (!costBreakdown[activity.category]) costBreakdown[activity.category] = 0;
        costBreakdown[activity.category] += activity.cost;
      });
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedCity(null)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Cities</span>
            </button>
            <div className="flex gap-3">
              <button
                onClick={generatePDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
              >
                <Download className="w-5 h-5" />
                <span>Download Itinerary</span>
              </button>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded-lg shadow-lg">
                <Sparkles className="w-5 h-5" />
                <span>AI Generated Itinerary</span>
              </div>
            </div>
          </div>

          {/* City Header */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
            <div className="relative h-72">
              <img src={selectedCity.image} alt={selectedCity.city} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-4xl font-bold mb-2">{selectedCity.city}, {selectedCity.state}</h1>
                <p className="text-lg opacity-90">{selectedCity.overview}</p>
                <p className="text-sm mt-2 opacity-75">Best Time to Visit: {selectedCity.bestTime}</p>
              </div>
            </div>

            {/* Days Selector */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg text-black">Select Trip Duration</h3>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-2xl text-black">₹{totalCost.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-gray-800">total</span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map(days => (
                  <button
                    key={days}
                    onClick={() => setSelectedDays(days)}
                    className={`py-3 px-4 rounded-xl transition-all ${
                      selectedDays === days
                        ? 'bg-gradient-to-r from-blue-900 to-purple-900 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                    }`}
                  >
                    {days} Day{days > 1 ? 's' : ''}
                    <div className="text-xs mt-1 opacity-75">₹{getTotalCost(selectedCity, days).toLocaleString('en-IN')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cost Breakdown Summary */}
            <div className="p-6 bg-white border-t">
              <h3 className="text-lg text-black mb-4">Cost Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(costBreakdown).map(([category, cost]) => (
                  <div key={category} className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getCategoryColor(category)}`}>
                      {getCategoryIcon(category)}
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 capitalize">{category}</div>
                      <div className="text-black">₹{cost.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Itinerary */}
          <div className="space-y-4">
            {itinerary.map((day) => (
              <div key={day.day} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-purple-900 rounded-full flex items-center justify-center text-white text-lg">
                          {day.day}
                        </div>
                        <div>
                          <h3 className="text-xl text-black">Day {day.day}: {day.title}</h3>
                          <p className="text-sm text-gray-800">{day.activities.length} activities • ₹{day.totalCost.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {day.highlights.map((highlight, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4">
                      {expandedDay === day.day ? (
                        <ChevronUp className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {expandedDay === day.day && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-200 pt-4">
                      <div className="space-y-4">
                        {day.activities
                          .filter(activity => activity.category === 'sightseeing' || activity.category === 'activity' || activity.category === 'food')
                          .slice(0, 4)
                          .map((activity, idx, filteredActivities) => {
                            const prevActivity = idx > 0 ? filteredActivities[idx - 1] : null;
                            const distance = prevActivity && activity.lat && activity.lng && prevActivity.lat && prevActivity.lng
                              ? calculateDistance(prevActivity.lat, prevActivity.lng, activity.lat, activity.lng)
                              : null;
                            const travelTime = distance ? calculateTravelTime(distance) : null;
                            
                            return (
                              <div key={idx}>
                                {/* Distance/Time indicator between activities */}
                                {distance && travelTime && (
                                  <div className="flex items-center justify-center my-3">
                                    <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border-2 border-blue-200 rounded-full">
                                      <Navigation className="w-4 h-4 text-blue-600" />
                                      <span className="text-sm font-semibold text-blue-900">
                                        {distance.toFixed(1)} km
                                      </span>
                                      <div className="w-px h-4 bg-blue-300" />
                                      <Clock className="w-4 h-4 text-blue-600" />
                                      <span className="text-sm font-semibold text-blue-900">
                                        {travelTime}
                                      </span>
                                      <Car className="w-4 h-4 text-blue-600" />
                                    </div>
                                  </div>
                                )}
                                
                                {/* Activity card */}
                                <div className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                  <div className="flex-shrink-0">
                                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${getCategoryColor(activity.category)}`}>
                                      {getCategoryIcon(activity.category)}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Clock className="w-4 h-4 text-gray-500" />
                                          <span className="text-sm text-gray-800">{activity.time}</span>
                                          <span className="text-xs text-gray-600">• {activity.duration}</span>
                                        </div>
                                        <h4 className="text-black mb-1">{activity.activity}</h4>
                                        <div className="flex items-center gap-2 mb-2">
                                          <MapPin className="w-4 h-4 text-gray-500" />
                                          <span className="text-sm text-gray-800">{activity.location}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                                        {activity.image && (
                                          <img src={activity.image} alt={activity.activity} className="w-full h-32 object-cover rounded-lg mt-2" />
                                        )}
                                      </div>
                                      <div className="text-right">
                                        <div className="text-xl text-black">₹{activity.cost}</div>
                                        <div className="text-xs text-gray-600 capitalize">{activity.category}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // City Selection Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded-2xl shadow-xl">
            <Sparkles className="w-6 h-6" />
            <div>
              <div className="text-sm opacity-90">Powered by AI</div>
              <div className="text-xl">Intelligent Itinerary Planner</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl text-black mb-2">Plan Your Perfect Indian Adventure</h2>
              <p className="text-gray-800">
                Select from {allItineraries.length} destinations and customize your trip from 1 to 5 days. Each itinerary includes accurate costs, 
                hour-by-hour schedules, real images of attractions, and downloadable text guides. All prices are in Indian Rupees (₹).
              </p>
            </div>
            <button
              onClick={() => setShowCustomForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your Itinerary</span>
            </button>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allItineraries.map((city) => (
            <div
              key={city.city}
              onClick={() => setSelectedCity(city)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="relative h-48">
                <img src={city.image} alt={city.city} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                {city.isUserGenerated && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-xs shadow-lg">
                    <User className="w-3 h-3" />
                    <span>By {city.submittedBy}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-2xl mb-1">{city.city}</h3>
                  <p className="text-sm opacity-90">{city.state}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{city.overview}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{city.bestTime}</span>
                  </div>
                </div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">1 Day</span>
                    <span className="text-black">₹{city.totalCost1Day.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">3 Days</span>
                    <span className="text-black">₹{city.totalCost3Day.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800">5 Days</span>
                    <span className="text-xl text-black">₹{city.totalCost5Day.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <button className="w-full mt-4 py-3 bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded-xl hover:from-blue-800 hover:to-purple-800 transition-all shadow-md">
                  View Itinerary
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Itinerary Form Modal */}
        {showCustomForm && <CustomItineraryForm onClose={() => setShowCustomForm(false)} onSave={saveUserItinerary} />}
      </div>
    </div>
  );
}
