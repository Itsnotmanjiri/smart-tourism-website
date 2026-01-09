import { useState, useEffect, useRef } from 'react';
import {
  Map, MapPin, Navigation, Search, X, ArrowLeft, Phone, 
  Share2, Star, Clock, DollarSign, Locate, Navigation2,
  Hotel, Utensils, Camera, ShoppingBag, ExternalLink,
  Heart, Layers, Filter, TrendingUp, Award,
  Car, Bus, Bike, Footprints, Timer, Compass
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import L from 'leaflet@1.9.4';

type LocationType = 
  | 'luxury-hotel' | 'budget-hotel' | 'resort' 
  | 'fine-dining' | 'street-food' | 'cafe' | 'bar'
  | 'fort' | 'palace' | 'temple' | 'mosque' | 'church' | 'museum' | 'park' | 'beach' | 'mountain' | 'monument'
  | 'mall' | 'market' | 'boutique';

interface Location {
  id: string;
  name: string;
  type: LocationType;
  lat: number;
  lng: number;
  address: string;
  rating: number;
  priceRange: string;
  phone: string;
  isOpen: boolean;
  description: string;
  city: string;
  category: 'hotels' | 'food' | 'attractions' | 'shopping';
  featured: boolean;
  distance?: number;
  bearing?: number;
  travelTime?: {
    walking: string;
    driving: string;
    transit: string;
  };
}

interface City {
  name: string;
  lat: number;
  lng: number;
  emoji: string;
}

interface WorldClassGoogleMapsProps {
  onBack?: () => void;
  centerCity?: string;
}

export function WorldClassGoogleMaps({ onBack, centerCity = 'Mumbai' }: WorldClassGoogleMapsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(centerCity);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);

  const cities: City[] = [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, emoji: '🏙️' },
    { name: 'Delhi', lat: 28.6139, lng: 77.2090, emoji: '🕌' },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946, emoji: '🌳' },
    { name: 'Goa', lat: 15.2993, lng: 74.1240, emoji: '🏖️' },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873, emoji: '🏰' },
    { name: 'Agra', lat: 27.1767, lng: 78.0081, emoji: '🕌' },
    { name: 'Kerala', lat: 10.8505, lng: 76.2711, emoji: '🌴' },
    { name: 'Varanasi', lat: 25.3176, lng: 82.9739, emoji: '🛕' },
    { name: 'Udaipur', lat: 24.5854, lng: 73.7125, emoji: '🏰' },
    { name: 'Manali', lat: 32.2396, lng: 77.1887, emoji: '⛰️' },
    { name: 'Rishikesh', lat: 30.0869, lng: 78.2676, emoji: '🧘' },
  ];

  const locations: Location[] = [
    // MUMBAI - 50 famous places
    { id: 'm1', name: 'Gateway of India', type: 'monument', lat: 18.9220, lng: 72.8347, address: 'Apollo Bandar, Colaba', rating: 4.6, priceRange: 'Free', phone: '+91-22-22844040', isOpen: true, description: 'Iconic monument overlooking the Arabian Sea', city: 'Mumbai', category: 'attractions', featured: true },
    { id: 'm2', name: 'Marine Drive', type: 'beach', lat: 18.9432, lng: 72.8239, address: 'Marine Drive, Churchgate', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Beautiful promenade along the coast', city: 'Mumbai', category: 'attractions', featured: true },
    { id: 'm3', name: 'Taj Mahal Palace', type: 'luxury-hotel', lat: 18.9216, lng: 72.8330, address: 'Apollo Bunder', rating: 4.8, priceRange: '₹25,000+', phone: '+91-22-66653366', isOpen: true, description: 'Iconic luxury hotel since 1903', city: 'Mumbai', category: 'hotels', featured: true },
    { id: 'm4', name: 'Elephanta Caves', type: 'temple', lat: 18.9633, lng: 72.9315, address: 'Elephanta Island', rating: 4.4, priceRange: '₹40', phone: '', isOpen: true, description: 'Ancient rock-cut cave temples', city: 'Mumbai', category: 'attractions', featured: false },
    { id: 'm5', name: 'Haji Ali Dargah', type: 'mosque', lat: 18.9826, lng: 72.8089, address: 'Haji Ali', rating: 4.5, priceRange: 'Free', phone: '+91-22-23524384', isOpen: true, description: 'Floating mosque on the sea', city: 'Mumbai', category: 'attractions', featured: true },
    { id: 'm6', name: 'Chhatrapati Shivaji Terminus', type: 'monument', lat: 18.9398, lng: 72.8355, address: 'Fort, CST', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'UNESCO World Heritage railway station', city: 'Mumbai', category: 'attractions', featured: false },
    { id: 'm7', name: 'Juhu Beach', type: 'beach', lat: 19.0948, lng: 72.8262, address: 'Juhu', rating: 4.2, priceRange: 'Free', phone: '', isOpen: true, description: 'Famous beach with street food', city: 'Mumbai', category: 'attractions', featured: false },
    { id: 'm8', name: 'Siddhivinayak Temple', type: 'temple', lat: 19.0176, lng: 72.8305, address: 'Prabhadevi', rating: 4.6, priceRange: 'Free', phone: '+91-22-24306695', isOpen: true, description: 'Famous Ganesh temple', city: 'Mumbai', category: 'attractions', featured: false },
    { id: 'm9', name: 'Bandra-Worli Sea Link', type: 'monument', lat: 19.0368, lng: 72.8187, address: 'Bandra-Worli', rating: 4.6, priceRange: '₹75 toll', phone: '', isOpen: true, description: 'Iconic cable-stayed bridge', city: 'Mumbai', category: 'attractions', featured: true },
    { id: 'm10', name: 'Colaba Causeway', type: 'market', lat: 18.9185, lng: 72.8269, address: 'Colaba', rating: 4.3, priceRange: '₹₹', phone: '', isOpen: true, description: 'Famous shopping street', city: 'Mumbai', category: 'shopping', featured: false },
    // More MUMBAI - Hotels, Food, Shopping  
    { id: 'mb11', name: 'The Taj Lands End', type: 'luxury-hotel', lat: 19.0351, lng: 72.8208, address: 'Bandra West', rating: 4.6, priceRange: '₹18,000+', phone: '+91-22-66681234', isOpen: true, description: 'Luxury seafront hotel', city: 'Mumbai', category: 'hotels', featured: true },
    { id: 'mb12', name: 'Trident Nariman Point', type: 'luxury-hotel', lat: 18.9249, lng: 72.8237, address: 'Nariman Point', rating: 4.5, priceRange: '₹15,000+', phone: '+91-22-66323939', isOpen: true, description: 'Business luxury hotel', city: 'Mumbai', category: 'hotels', featured: false },
    { id: 'mb13', name: 'ITC Maratha', type: 'luxury-hotel', lat: 19.0896, lng: 72.8656, address: 'Andheri East', rating: 4.6, priceRange: '₹16,000+', phone: '+91-22-28303030', isOpen: true, description: 'Airport luxury hotel', city: 'Mumbai', category: 'hotels', featured: false },
    { id: 'mb14', name: 'Hotel Marine Plaza', type: 'budget-hotel', lat: 18.9432, lng: 72.8239, address: 'Marine Drive', rating: 4.2, priceRange: '₹6,000+', phone: '+91-22-22851212', isOpen: true, description: 'Mid-range sea-facing hotel', city: 'Mumbai', category: 'hotels', featured: false },
    { id: 'mb15', name: 'Fariyas Hotel', type: 'budget-hotel', lat: 18.9216, lng: 72.8330, address: 'Colaba', rating: 4.1, priceRange: '₹5,500+', phone: '+91-22-22044911', isOpen: true, description: 'Comfortable heritage hotel', city: 'Mumbai', category: 'hotels', featured: false },
    { id: 'mb16', name: 'Britannia & Co', type: 'fine-dining', lat: 18.9571, lng: 72.8314, address: 'Ballard Estate', rating: 4.6, priceRange: '₹₹', phone: '+91-22-22615264', isOpen: true, description: 'Legendary Parsi restaurant', city: 'Mumbai', category: 'food', featured: true },
    { id: 'mb17', name: 'Leopold Cafe', type: 'cafe', lat: 18.9216, lng: 72.8313, address: 'Colaba Causeway', rating: 4.4, priceRange: '₹₹', phone: '+91-22-22870131', isOpen: true, description: 'Iconic historic cafe', city: 'Mumbai', category: 'food', featured: true },
    { id: 'mb18', name: 'Trishna Restaurant', type: 'fine-dining', lat: 18.9503, lng: 72.8327, address: 'Fort', rating: 4.5, priceRange: '₹₹₹', phone: '+91-22-22703213', isOpen: true, description: 'Famous seafood restaurant', city: 'Mumbai', category: 'food', featured: true },
    { id: 'mb19', name: 'Bademiya', type: 'street-food', lat: 18.9216, lng: 72.8313, address: 'Colaba', rating: 4.5, priceRange: '₹', phone: '', isOpen: true, description: 'Iconic kebab stall', city: 'Mumbai', category: 'food', featured: true },
    { id: 'mb20', name: 'Sardar Pav Bhaji', type: 'street-food', lat: 18.9636, lng: 72.8119, address: 'Tardeo', rating: 4.6, priceRange: '₹', phone: '', isOpen: true, description: 'Best pav bhaji in Mumbai', city: 'Mumbai', category: 'food', featured: true },
    { id: 'mb21', name: 'Cafe Mondegar', type: 'cafe', lat: 18.9216, lng: 72.8313, address: 'Colaba', rating: 4.3, priceRange: '₹₹', phone: '+91-22-22032591', isOpen: true, description: 'Art deco cafe-bar', city: 'Mumbai', category: 'food', featured: false },
    { id: 'mb22', name: 'The Table', type: 'fine-dining', lat: 18.9216, lng: 72.8313, address: 'Colaba', rating: 4.6, priceRange: '₹₹₹₹', phone: '+91-22-22173564', isOpen: true, description: 'Upscale global cuisine', city: 'Mumbai', category: 'food', featured: false },
    { id: 'mb23', name: 'Bombay Canteen', type: 'fine-dining', lat: 19.0100, lng: 72.8439, address: 'Lower Parel', rating: 4.5, priceRange: '₹₹₹', phone: '+91-22-49666666', isOpen: true, description: 'Modern Indian dining', city: 'Mumbai', category: 'food', featured: true },
    { id: 'mb24', name: 'Kyani & Co', type: 'cafe', lat: 18.9388, lng: 72.8357, address: 'Dhobi Talao', rating: 4.4, priceRange: '₹', phone: '', isOpen: true, description: 'Old Irani cafe', city: 'Mumbai', category: 'food', featured: false },
    { id: 'mb25', name: 'Linking Road', type: 'market', lat: 19.0538, lng: 72.8293, address: 'Bandra West', rating: 4.3, priceRange: '₹₹', phone: '', isOpen: true, description: 'Street shopping paradise', city: 'Mumbai', category: 'shopping', featured: true },
    { id: 'mb26', name: 'Crawford Market', type: 'market', lat: 18.9490, lng: 72.8348, address: 'Lokmanya Tilak Marg', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Historic wholesale market', city: 'Mumbai', category: 'shopping', featured: false },
    { id: 'mb27', name: 'Phoenix Palladium', type: 'mall', lat: 19.0100, lng: 72.8439, address: 'Lower Parel', rating: 4.4, priceRange: '₹₹₹₹', phone: '+91-22-43339933', isOpen: true, description: 'Luxury shopping mall', city: 'Mumbai', category: 'shopping', featured: true },
    { id: 'mb28', name: 'High Street Phoenix', type: 'mall', lat: 19.0100, lng: 72.8439, address: 'Lower Parel', rating: 4.4, priceRange: '₹₹₹', phone: '+91-22-40989898', isOpen: true, description: 'Open-air shopping mall', city: 'Mumbai', category: 'shopping', featured: false },
    { id: 'mb29', name: 'Chor Bazaar', type: 'market', lat: 18.9595, lng: 72.8293, address: 'Mutton Street', rating: 4.0, priceRange: '₹', phone: '', isOpen: true, description: 'Antique flea market', city: 'Mumbai', category: 'shopping', featured: true },
    { id: 'mb30', name: 'Fashion Street', type: 'market', lat: 18.9302, lng: 72.8311, address: 'Azad Maidan', rating: 4.1, priceRange: '₹', phone: '', isOpen: true, description: 'Budget clothing market', city: 'Mumbai', category: 'shopping', featured: false },
    { id: 'mb31', name: 'Mahesh Lunch Home', type: 'fine-dining', lat: 18.9503, lng: 72.8327, address: 'Fort', rating: 4.5, priceRange: '₹₹₹', phone: '+91-22-22871438', isOpen: true, description: 'Mangalorean seafood', city: 'Mumbai', category: 'food', featured: false },
    { id: 'mb32', name: 'Mohammed Ali Road', type: 'street-food', lat: 18.9550, lng: 72.8310, address: 'Bhendi Bazaar', rating: 4.6, priceRange: '₹', phone: '', isOpen: true, description: 'Ramadan food street', city: 'Mumbai', category: 'food', featured: true },
    { id: 'mb33', name: 'Grand Hyatt Mumbai', type: 'luxury-hotel', lat: 19.0728, lng: 72.8682, address: 'BKC', rating: 4.5, priceRange: '₹17,000+', phone: '+91-22-66761234', isOpen: true, description: 'Luxury business hotel', city: 'Mumbai', category: 'hotels', featured: false },
    { id: 'mb34', name: 'JW Marriott Juhu', type: 'luxury-hotel', lat: 19.0948, lng: 72.8262, address: 'Juhu', rating: 4.6, priceRange: '₹16,000+', phone: '+91-22-66930000', isOpen: true, description: 'Beach luxury hotel', city: 'Mumbai', category: 'hotels', featured: false },
    { id: 'mb35', name: 'Aer Lounge', type: 'bar', lat: 18.9596, lng: 72.8130, address: 'Worli', rating: 4.5, priceRange: '₹₹₹₹', phone: '+91-22-66396666', isOpen: true, description: 'Rooftop bar with views', city: 'Mumbai', category: 'food', featured: true },
    { id: 'mb36', name: 'Kala Ghoda Art District', type: 'market', lat: 18.9273, lng: 72.8319, address: 'Kala Ghoda', rating: 4.4, priceRange: '₹₹₹', phone: '', isOpen: true, description: 'Art galleries and boutiques', city: 'Mumbai', category: 'shopping', featured: true },
    { id: 'mb37', name: 'Sanjay Gandhi National Park', type: 'park', lat: 19.2183, lng: 72.9094, address: 'Borivali East', rating: 4.4, priceRange: '₹50', phone: '+91-22-28860362', isOpen: true, description: 'Urban forest with Kanheri Caves', city: 'Mumbai', category: 'attractions', featured: true },
    { id: 'mb38', name: 'Global Vipassana Pagoda', type: 'temple', lat: 19.2333, lng: 72.8689, address: 'Gorai', rating: 4.7, priceRange: 'Free', phone: '+91-22-62427544', isOpen: true, description: 'Massive meditation hall', city: 'Mumbai', category: 'attractions', featured: true },
    { id: 'mb39', name: 'Mahalaxmi Temple', type: 'temple', lat: 18.9765, lng: 72.8114, address: 'Mahalaxmi', rating: 4.5, priceRange: 'Free', phone: '+91-22-23524084', isOpen: true, description: 'Ancient goddess temple', city: 'Mumbai', category: 'attractions', featured: false },
    { id: 'mb40', name: 'Worli Sea Face', type: 'beach', lat: 19.0100, lng: 72.8150, address: 'Worli', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'Waterfront promenade', city: 'Mumbai', category: 'attractions', featured: false },
    
    // DELHI - 30 famous places
    { id: 'd1', name: 'Red Fort', type: 'fort', lat: 28.6562, lng: 77.2410, address: 'Netaji Subhash Marg, Chandni Chowk', rating: 4.5, priceRange: '₹50', phone: '+91-11-23277705', isOpen: true, description: 'Historic Mughal fort and UNESCO site', city: 'Delhi', category: 'attractions', featured: true },
    { id: 'd2', name: 'Qutub Minar', type: 'monument', lat: 28.5244, lng: 77.1855, address: 'Mehrauli', rating: 4.4, priceRange: '₹40', phone: '+91-11-26643856', isOpen: true, description: 'World&#39;s tallest brick minaret', city: 'Delhi', category: 'attractions', featured: true },
    { id: 'd3', name: 'India Gate', type: 'monument', lat: 28.6129, lng: 77.2295, address: 'Rajpath', rating: 4.6, priceRange: 'Free', phone: '', isOpen: true, description: 'War memorial and iconic landmark', city: 'Delhi', category: 'attractions', featured: true },
    { id: 'd4', name: 'Lotus Temple', type: 'temple', lat: 28.5535, lng: 77.2588, address: 'Bahapur, Kalkaji', rating: 4.5, priceRange: 'Free', phone: '+91-11-26444029', isOpen: true, description: 'Flower-shaped Bah&#225;&#39;&#237; House of Worship', city: 'Delhi', category: 'attractions', featured: false },
    { id: 'd5', name: 'Humayun&#39;s Tomb', type: 'monument', lat: 28.5933, lng: 77.2507, address: 'Nizamuddin', rating: 4.5, priceRange: '₹50', phone: '', isOpen: true, description: 'Mughal architectural masterpiece', city: 'Delhi', category: 'attractions', featured: true },
    { id: 'd6', name: 'Chandni Chowk', type: 'market', lat: 28.6506, lng: 77.2303, address: 'Old Delhi', rating: 4.3, priceRange: '₹₹', phone: '', isOpen: true, description: 'Historic market in Old Delhi', city: 'Delhi', category: 'shopping', featured: false },
    { id: 'd7', name: 'Akshardham Temple', type: 'temple', lat: 28.6127, lng: 77.2773, address: 'Noida Mor', rating: 4.7, priceRange: 'Free', phone: '+91-11-43442344', isOpen: true, description: 'Magnificent Hindu temple complex', city: 'Delhi', category: 'attractions', featured: true },
    { id: 'd8', name: 'Connaught Place', type: 'mall', lat: 28.6304, lng: 77.2177, address: 'CP, New Delhi', rating: 4.4, priceRange: '₹₹₹', phone: '', isOpen: true, description: 'Commercial and business hub', city: 'Delhi', category: 'shopping', featured: false },
    { id: 'd9', name: 'Lodhi Garden', type: 'park', lat: 28.5932, lng: 77.2197, address: 'Lodhi Road', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Historic park with tombs', city: 'Delhi', category: 'attractions', featured: false },
    { id: 'd10', name: 'Jama Masjid', type: 'mosque', lat: 28.6507, lng: 77.2334, address: 'Chandni Chowk', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'India&#39;s largest mosque', city: 'Delhi', category: 'attractions', featured: false },
    { id: 'd11', name: 'Rashtrapati Bhavan', type: 'monument', lat: 28.6143, lng: 77.1995, address: 'Rajpath', rating: 4.6, priceRange: '₹50', phone: '', isOpen: true, description: 'Presidential residence', city: 'Delhi', category: 'attractions', featured: true },
    { id: 'd12', name: 'Raj Ghat', type: 'monument', lat: 28.6414, lng: 77.2507, address: 'Ring Road', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'Mahatma Gandhi memorial', city: 'Delhi', category: 'attractions', featured: false },
    { id: 'd13', name: 'National Museum', type: 'museum', lat: 28.6119, lng: 77.2197, address: 'Janpath', rating: 4.4, priceRange: '₹20', phone: '+91-11-23019272', isOpen: true, description: 'Largest museum in India', city: 'Delhi', category: 'attractions', featured: false },
    { id: 'd14', name: 'Purana Qila', type: 'fort', lat: 28.6096, lng: 77.2428, address: 'Mathura Road', rating: 4.3, priceRange: '₹25', phone: '+91-11-24356475', isOpen: true, description: 'Old Fort with boating lake', city: 'Delhi', category: 'attractions', featured: false },
    { id: 'd15', name: 'Gurudwara Bangla Sahib', type: 'temple', lat: 28.6261, lng: 77.2090, address: 'Ashoka Road', rating: 4.7, priceRange: 'Free', phone: '+91-11-23365208', isOpen: true, description: 'Prominent Sikh temple', city: 'Delhi', category: 'attractions', featured: true },
    { id: 'd16', name: 'Sarojini Nagar Market', type: 'market', lat: 28.5715, lng: 77.1991, address: 'Sarojini Nagar', rating: 4.2, priceRange: '₹', phone: '', isOpen: true, description: 'Budget shopping paradise', city: 'Delhi', category: 'shopping', featured: true },
    { id: 'd17', name: 'Dilli Haat', type: 'market', lat: 28.5494, lng: 77.2185, address: 'INA', rating: 4.3, priceRange: '₹₹', phone: '', isOpen: true, description: 'Handicrafts and food market', city: 'Delhi', category: 'shopping', featured: false },
    { id: 'd18', name: 'Select Citywalk', type: 'mall', lat: 28.5244, lng: 77.2172, address: 'Saket', rating: 4.4, priceRange: '₹₹₹', phone: '+91-11-47132100', isOpen: true, description: 'Premium shopping mall', city: 'Delhi', category: 'shopping', featured: false },
    { id: 'd19', name: 'The Leela Palace', type: 'luxury-hotel', lat: 28.5941, lng: 77.2438, address: 'Chanakyapuri', rating: 4.8, priceRange: '₹30,000+', phone: '+91-11-39331234', isOpen: true, description: 'Ultra-luxury hotel', city: 'Delhi', category: 'hotels', featured: true },
    { id: 'd20', name: 'Karims', type: 'fine-dining', lat: 28.6507, lng: 77.2334, address: 'Jama Masjid', rating: 4.5, priceRange: '₹₹', phone: '+91-11-23264981', isOpen: true, description: 'Legendary Mughlai restaurant', city: 'Delhi', category: 'food', featured: true },
    { id: 'd21', name: 'Paranthe Wali Gali', type: 'street-food', lat: 28.6517, lng: 77.2306, address: 'Chandni Chowk', rating: 4.4, priceRange: '₹', phone: '', isOpen: true, description: 'Famous paratha street', city: 'Delhi', category: 'food', featured: true },
    { id: 'd22', name: 'Garden of Five Senses', type: 'park', lat: 28.5221, lng: 77.2071, address: 'Saket', rating: 4.3, priceRange: '₹35', phone: '', isOpen: true, description: 'Themed garden park', city: 'Delhi', category: 'attractions', featured: false },
    { id: 'd23', name: 'Hauz Khas Village', type: 'market', lat: 28.5509, lng: 77.1986, address: 'Hauz Khas', rating: 4.3, priceRange: '₹₹₹', phone: '', isOpen: true, description: 'Trendy shopping and dining', city: 'Delhi', category: 'shopping', featured: false },
    { id: 'd24', name: 'Jantar Mantar', type: 'monument', lat: 28.6271, lng: 77.2166, address: 'Connaught Place', rating: 4.2, priceRange: '₹25', phone: '', isOpen: true, description: 'Astronomical observatory', city: 'Delhi', category: 'attractions', featured: false },
    { id: 'd25', name: 'Safdarjung Tomb', type: 'monument', lat: 28.5933, lng: 77.2068, address: 'Safdarjung', rating: 4.3, priceRange: '₹25', phone: '', isOpen: true, description: 'Mughal-era garden tomb', city: 'Delhi', category: 'attractions', featured: false },
    { id: 'd26', name: 'Nizamuddin Dargah', type: 'mosque', lat: 28.5930, lng: 77.2503, address: 'Nizamuddin', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Sufi saint shrine', city: 'Delhi', category: 'attractions', featured: false },
    { id: 'd27', name: 'Khari Baoli', type: 'market', lat: 28.6583, lng: 77.2282, address: 'Old Delhi', rating: 4.1, priceRange: '₹', phone: '', isOpen: true, description: 'Asias largest spice market', city: 'Delhi', category: 'shopping', featured: true },
    { id: 'd28', name: 'ISKCON Temple', type: 'temple', lat: 28.5567, lng: 77.2518, address: 'East of Kailash', rating: 4.5, priceRange: 'Free', phone: '+91-11-26235133', isOpen: true, description: 'Hare Krishna temple', city: 'Delhi', category: 'attractions', featured: false },
    { id: 'd29', name: 'Tughlaqabad Fort', type: 'fort', lat: 28.5052, lng: 77.2728, address: 'Tughlaqabad', rating: 4.0, priceRange: '₹25', phone: '', isOpen: true, description: 'Ruined medieval fort', city: 'Delhi', category: 'attractions', featured: false },
    { id: 'd30', name: 'DLF Mall of India', type: 'mall', lat: 28.5677, lng: 77.0681, address: 'Noida', rating: 4.3, priceRange: '₹₹₹', phone: '+91-120-6766666', isOpen: true, description: 'Largest mall in India', city: 'Delhi', category: 'shopping', featured: false },
    // More DELHI - Hotels, Food, Shopping
    { id: 'dl31', name: 'The Imperial Delhi', type: 'luxury-hotel', lat: 28.6244, lng: 77.2172, address: 'Janpath', rating: 4.7, priceRange: '₹25,000+', phone: '+91-11-23341234', isOpen: true, description: 'Heritage colonial luxury', city: 'Delhi', category: 'hotels', featured: true },
    { id: 'dl32', name: 'ITC Maurya', type: 'luxury-hotel', lat: 28.5954, lng: 77.1638, address: 'Diplomatic Enclave', rating: 4.6, priceRange: '₹20,000+', phone: '+91-11-26112233', isOpen: true, description: 'Luxury diplomatic hotel', city: 'Delhi', category: 'hotels', featured: false },
    { id: 'dl33', name: 'Taj Palace', type: 'luxury-hotel', lat: 28.5954, lng: 77.1638, address: 'Diplomatic Enclave', rating: 4.6, priceRange: '₹22,000+', phone: '+91-11-26110202', isOpen: true, description: 'Grand luxury hotel', city: 'Delhi', category: 'hotels', featured: false },
    { id: 'dl34', name: 'The Lodhi', type: 'luxury-hotel', lat: 28.5932, lng: 77.2197, address: 'Lodhi Road', rating: 4.7, priceRange: '₹28,000+', phone: '+91-11-43633333', isOpen: true, description: 'Contemporary luxury hotel', city: 'Delhi', category: 'hotels', featured: true },
    { id: 'dl35', name: 'Hotel Broadway', type: 'budget-hotel', lat: 28.6506, lng: 77.2303, address: 'Asaf Ali Road', rating: 4.2, priceRange: '₹4,000+', phone: '+91-11-43663600', isOpen: true, description: 'Historic budget hotel', city: 'Delhi', category: 'hotels', featured: false },
    { id: 'dl36', name: 'Bukhara ITC Maurya', type: 'fine-dining', lat: 28.5954, lng: 77.1638, address: 'Sardar Patel Marg', rating: 4.8, priceRange: '₹₹₹₹', phone: '+91-11-26112233', isOpen: true, description: 'World-famous dal bukhara', city: 'Delhi', category: 'food', featured: true },
    { id: 'dl37', name: 'Indian Accent', type: 'fine-dining', lat: 28.5929, lng: 77.2197, address: 'Lodhi Hotel', rating: 4.7, priceRange: '₹₹₹₹', phone: '+91-11-43633333', isOpen: true, description: 'Modern Indian cuisine', city: 'Delhi', category: 'food', featured: true },
    { id: 'dl38', name: 'Dum Pukht', type: 'fine-dining', lat: 28.5954, lng: 77.1638, address: 'ITC Maurya', rating: 4.7, priceRange: '₹₹₹₹', phone: '+91-11-26112233', isOpen: true, description: 'Awadhi royal cuisine', city: 'Delhi', category: 'food', featured: true },
    { id: 'dl39', name: 'Cafe Lota', type: 'cafe', lat: 28.6119, lng: 77.2197, address: 'National Crafts Museum', rating: 4.5, priceRange: '₹₹', phone: '+91-11-24699992', isOpen: true, description: 'Museum cafe regional food', city: 'Delhi', category: 'food', featured: false },
    { id: 'dl40', name: 'Karim Hotel', type: 'street-food', lat: 28.6507, lng: 77.2334, address: 'Jama Masjid', rating: 4.5, priceRange: '₹₹', phone: '+91-11-23264981', isOpen: true, description: 'Mughlai legacy since 1913', city: 'Delhi', category: 'food', featured: true },
    { id: 'dl41', name: 'Gali Paranthe Wali', type: 'street-food', lat: 28.6517, lng: 77.2306, address: 'Chandni Chowk', rating: 4.4, priceRange: '₹', phone: '', isOpen: true, description: 'Historic paratha lane', city: 'Delhi', category: 'food', featured: true },
    { id: 'dl42', name: 'Kuremal Mohan Lal Kulfi', type: 'street-food', lat: 28.6517, lng: 77.2306, address: 'Chandni Chowk', rating: 4.6, priceRange: '₹', phone: '+91-11-23944058', isOpen: true, description: 'Stuffed kulfi specialists', city: 'Delhi', category: 'food', featured: true },
    { id: 'dl43', name: 'Big Chill Cafe', type: 'cafe', lat: 28.5370, lng: 77.2090, address: 'Khan Market', rating: 4.4, priceRange: '₹₹₹', phone: '+91-11-24690099', isOpen: true, description: 'Popular cafe and bakery', city: 'Delhi', category: 'food', featured: false },
    { id: 'dl44', name: 'Olive Bar & Kitchen', type: 'fine-dining', lat: 28.5509, lng: 77.1986, address: 'Mehrauli', rating: 4.5, priceRange: '₹₹₹₹', phone: '+91-11-29574444', isOpen: true, description: 'Mediterranean with Qutub view', city: 'Delhi', category: 'food', featured: false },
    { id: 'dl45', name: 'Andaz Delhi', type: 'luxury-hotel', lat: 28.5501, lng: 77.2700, address: 'Aerocity', rating: 4.5, priceRange: '₹16,000+', phone: '+91-11-49341234', isOpen: true, description: 'Modern luxury airport hotel', city: 'Delhi', category: 'hotels', featured: false },
    { id: 'dl46', name: 'Khan Market', type: 'market', lat: 28.5370, lng: 77.2274, address: 'Khan Market', rating: 4.4, priceRange: '₹₹₹₹', phone: '', isOpen: true, description: 'Premium retail district', city: 'Delhi', category: 'shopping', featured: true },
    { id: 'dl47', name: 'Lajpat Nagar Market', type: 'market', lat: 28.5678, lng: 77.2437, address: 'Lajpat Nagar', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Ethnic wear shopping', city: 'Delhi', category: 'shopping', featured: false },
    { id: 'dl48', name: 'Emporio Mall', type: 'mall', lat: 28.5486, lng: 77.2342, address: 'Vasant Kunj', rating: 4.3, priceRange: '₹₹₹₹', phone: '+91-11-46464646', isOpen: true, description: 'Luxury international brands', city: 'Delhi', category: 'shopping', featured: false },
    { id: 'dl49', name: 'Janpath Market', type: 'market', lat: 28.6248, lng: 77.2172, address: 'Janpath', rating: 4.1, priceRange: '₹', phone: '', isOpen: true, description: 'Budget shopping street', city: 'Delhi', category: 'shopping', featured: false },
    { id: 'dl50', name: 'Aerocity', type: 'mall', lat: 28.5501, lng: 77.1142, address: 'Hospitality District', rating: 4.4, priceRange: '₹₹₹₹', phone: '', isOpen: true, description: 'Premium dining and shopping', city: 'Delhi', category: 'shopping', featured: true },
    
    // BANGALORE - 30 famous places
    { id: 'b1', name: 'Lalbagh Botanical Garden', type: 'park', lat: 12.9507, lng: 77.5848, address: 'Mavalli, Bangalore', rating: 4.4, priceRange: '₹25', phone: '+91-80-26567760', isOpen: true, description: 'Historic botanical garden', city: 'Bangalore', category: 'attractions', featured: true },
    { id: 'b2', name: 'Cubbon Park', type: 'park', lat: 12.9762, lng: 77.5929, address: 'Kasturba Road', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Sprawling urban park', city: 'Bangalore', category: 'attractions', featured: true },
    { id: 'b3', name: 'Bangalore Palace', type: 'palace', lat: 12.9980, lng: 77.5920, address: 'Vasanth Nagar', rating: 4.3, priceRange: '₹280', phone: '+91-80-23567940', isOpen: true, description: 'Tudor-style palace', city: 'Bangalore', category: 'attractions', featured: true },
    { id: 'b4', name: 'ISKCON Temple', type: 'temple', lat: 13.0096, lng: 77.5503, address: 'Rajajinagar', rating: 4.6, priceRange: 'Free', phone: '+91-80-23471956', isOpen: true, description: 'Radha Krishna temple', city: 'Bangalore', category: 'attractions', featured: false },
    { id: 'b5', name: 'Vidhana Soudha', type: 'monument', lat: 12.9796, lng: 77.5910, address: 'Dr. Ambedkar Veedhi', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'State legislature building', city: 'Bangalore', category: 'attractions', featured: false },
    { id: 'b6', name: 'UB City Mall', type: 'mall', lat: 12.9717, lng: 77.5938, address: 'Vittal Mallya Road', rating: 4.3, priceRange: '₹₹₹₹', phone: '+91-80-49339999', isOpen: true, description: 'Luxury shopping destination', city: 'Bangalore', category: 'shopping', featured: true },
    { id: 'b7', name: 'Commercial Street', type: 'market', lat: 12.9808, lng: 77.6078, address: 'Shivaji Nagar', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Famous shopping street', city: 'Bangalore', category: 'shopping', featured: false },
    { id: 'b8', name: 'Wonderla', type: 'park', lat: 12.8347, lng: 77.4006, address: 'Bidadi', rating: 4.5, priceRange: '₹1,199', phone: '+91-80-22019333', isOpen: true, description: 'Amusement and water park', city: 'Bangalore', category: 'attractions', featured: false },
    { id: 'b9', name: 'Nandi Hills', type: 'mountain', lat: 13.3703, lng: 77.6838, address: 'Chikkaballapur', rating: 4.4, priceRange: '₹20', phone: '', isOpen: true, description: 'Hill station near Bangalore', city: 'Bangalore', category: 'attractions', featured: true },
    { id: 'b10', name: 'Bannerghatta National Park', type: 'park', lat: 12.8005, lng: 77.5773, address: 'Bannerghatta', rating: 4.3, priceRange: '₹100', phone: '+91-80-22960732', isOpen: true, description: 'Wildlife park and zoo', city: 'Bangalore', category: 'attractions', featured: false },
    { id: 'b11', name: 'The Leela Palace', type: 'luxury-hotel', lat: 12.9631, lng: 77.6451, address: 'HAL Airport Road', rating: 4.7, priceRange: '₹22,000+', phone: '+91-80-25211234', isOpen: true, description: 'Ultra-luxury hotel', city: 'Bangalore', category: 'hotels', featured: true },
    { id: 'b12', name: 'ITC Gardenia', type: 'luxury-hotel', lat: 12.9980, lng: 77.6150, address: 'Residency Road', rating: 4.6, priceRange: '₹18,000+', phone: '+91-80-49991234', isOpen: true, description: 'Luxury business hotel', city: 'Bangalore', category: 'hotels', featured: false },
    { id: 'b13', name: 'MTR Restaurant', type: 'fine-dining', lat: 12.9619, lng: 77.5841, address: 'Lalbagh Road', rating: 4.4, priceRange: '₹₹', phone: '+91-80-22220022', isOpen: true, description: 'Legendary South Indian food', city: 'Bangalore', category: 'food', featured: true },
    { id: 'b14', name: 'Koshy\'s', type: 'cafe', lat: 12.9716, lng: 77.6067, address: 'St. Marks Road', rating: 4.3, priceRange: '₹₹', phone: '+91-80-22211308', isOpen: true, description: 'Iconic old Bangalore cafe', city: 'Bangalore', category: 'food', featured: false },
    { id: 'b15', name: 'VV Puram Food Street', type: 'street-food', lat: 12.9415, lng: 77.5701, address: 'VV Puram', rating: 4.5, priceRange: '₹', phone: '', isOpen: true, description: 'Famous street food hub', city: 'Bangalore', category: 'food', featured: true },
    { id: 'b16', name: 'Tipu Sultan Palace', type: 'palace', lat: 12.9591, lng: 77.5737, address: 'Kalasipalayam', rating: 4.2, priceRange: '₹20', phone: '', isOpen: true, description: 'Historic wooden palace', city: 'Bangalore', category: 'attractions', featured: false },
    { id: 'b17', name: 'Bull Temple', type: 'temple', lat: 12.9419, lng: 77.5650, address: 'Basavanagudi', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'Temple with giant Nandi', city: 'Bangalore', category: 'attractions', featured: false },
    { id: 'b18', name: 'Orion Mall', type: 'mall', lat: 13.0106, lng: 77.5550, address: 'Brigade Gateway', rating: 4.3, priceRange: '₹₹₹', phone: '+91-80-43446666', isOpen: true, description: 'Popular shopping mall', city: 'Bangalore', category: 'shopping', featured: false },
    { id: 'b19', name: 'National Gallery of Modern Art', type: 'museum', lat: 12.9772, lng: 77.5960, address: 'Manikyavelu Mansion', rating: 4.3, priceRange: '₹20', phone: '+91-80-22342338', isOpen: true, description: 'Modern art museum', city: 'Bangalore', category: 'attractions', featured: false },
    { id: 'b20', name: 'Jayanagar 4th Block', type: 'market', lat: 12.9250, lng: 77.5913, address: 'Jayanagar', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Shopping and food area', city: 'Bangalore', category: 'shopping', featured: false },
    { id: 'b21', name: 'Ulsoor Lake', type: 'park', lat: 12.9816, lng: 77.6205, address: 'Ulsoor', rating: 4.1, priceRange: 'Free', phone: '', isOpen: true, description: 'Urban lake with boating', city: 'Bangalore', category: 'attractions', featured: false },
    { id: 'b22', name: 'Innovative Film City', type: 'park', lat: 12.8419, lng: 77.3988, address: 'Bidadi', rating: 4.0, priceRange: '₹600', phone: '+91-80-27263939', isOpen: true, description: 'Film-themed amusement park', city: 'Bangalore', category: 'attractions', featured: false },
    { id: 'b23', name: 'Phoenix Marketcity', type: 'mall', lat: 12.9983, lng: 77.6971, address: 'Whitefield', rating: 4.4, priceRange: '₹₹₹', phone: '+91-80-67153000', isOpen: true, description: 'Massive shopping mall', city: 'Bangalore', category: 'shopping', featured: false },
    { id: 'b24', name: 'HAL Aerospace Museum', type: 'museum', lat: 12.9579, lng: 77.6647, address: 'HAL Airport', rating: 4.2, priceRange: '₹60', phone: '+91-80-25229926', isOpen: true, description: 'Aviation museum', city: 'Bangalore', category: 'attractions', featured: false },
    { id: 'b25', name: 'Freedom Park', type: 'park', lat: 12.9762, lng: 77.5907, address: 'Seshadri Road', rating: 4.1, priceRange: 'Free', phone: '', isOpen: true, description: 'Historic park', city: 'Bangalore', category: 'attractions', featured: false },
    { id: 'b26', name: 'Indiranagar 100 Feet Road', type: 'market', lat: 12.9719, lng: 77.6412, address: 'Indiranagar', rating: 4.3, priceRange: '₹₹₹', phone: '', isOpen: true, description: 'Trendy dining and shopping', city: 'Bangalore', category: 'shopping', featured: true },
    { id: 'b27', name: 'Art of Living Ashram', type: 'temple', lat: 12.9438, lng: 77.5013, address: 'Udayapura', rating: 4.5, priceRange: 'Free', phone: '+91-80-28432273', isOpen: true, description: 'Meditation and yoga center', city: 'Bangalore', category: 'attractions', featured: false },
    { id: 'b28', name: 'Visvesvaraya Museum', type: 'museum', lat: 12.9764, lng: 77.5966, address: 'Kasturba Road', rating: 4.2, priceRange: '₹60', phone: '+91-80-22238458', isOpen: true, description: 'Science and technology museum', city: 'Bangalore', category: 'attractions', featured: false },
    { id: 'b29', name: 'Sankey Tank', type: 'park', lat: 13.0055, lng: 77.5701, address: 'Sadashivanagar', rating: 4.2, priceRange: 'Free', phone: '', isOpen: true, description: 'Scenic lake', city: 'Bangalore', category: 'attractions', featured: false },
    { id: 'b30', name: 'Meenakshi Temple', type: 'temple', lat: 12.9423, lng: 77.5634, address: 'Ulsoor', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'South Indian temple', city: 'Bangalore', category: 'attractions', featured: false },
    // More BANGALORE - Hotels, Food, Shopping
    { id: 'blr31', name: 'Taj West End', type: 'luxury-hotel', lat: 12.9962, lng: 77.5969, address: 'Race Course Road', rating: 4.7, priceRange: '₹20,000+', phone: '+91-80-66605660', isOpen: true, description: 'Heritage garden hotel', city: 'Bangalore', category: 'hotels', featured: true },
    { id: 'blr32', name: 'Oberoi Bangalore', type: 'luxury-hotel', lat: 12.9962, lng: 77.5969, address: 'MG Road', rating: 4.6, priceRange: '₹18,000+', phone: '+91-80-25585858', isOpen: true, description: 'Central luxury hotel', city: 'Bangalore', category: 'hotels', featured: false },
    { id: 'blr33', name: 'JW Marriott Bengaluru', type: 'luxury-hotel', lat: 12.9631, lng: 77.7393, address: 'Vittal Mallya Road', rating: 4.6, priceRange: '₹17,000+', phone: '+91-80-49522222', isOpen: true, description: 'Luxury business hotel', city: 'Bangalore', category: 'hotels', featured: false },
    { id: 'blr34', name: 'The Ritz-Carlton', type: 'luxury-hotel', lat: 12.9716, lng: 77.6412, address: 'Residency Road', rating: 4.7, priceRange: '₹22,000+', phone: '+91-80-22210000', isOpen: true, description: 'Ultra-luxury hotel', city: 'Bangalore', category: 'hotels', featured: true },
    { id: 'blr35', name: 'Karavalli', type: 'fine-dining', lat: 18.9596, lng: 72.8130, address: 'Gateway Hotel', rating: 4.6, priceRange: '₹₹₹', phone: '+91-80-66604545', isOpen: true, description: 'Coastal cuisine specialist', city: 'Bangalore', category: 'food', featured: true },
    { id: 'blr36', name: 'Toit Brewpub', type: 'bar', lat: 12.9716, lng: 77.6412, address: 'Indiranagar', rating: 4.5, priceRange: '₹₹₹', phone: '+91-80-41124455', isOpen: true, description: 'Famous craft brewery', city: 'Bangalore', category: 'food', featured: true },
    { id: 'blr37', name: 'Vidyarthi Bhavan', type: 'street-food', lat: 12.9423, lng: 77.5650, address: 'Basavanagudi', rating: 4.5, priceRange: '₹', phone: '+91-80-26677588', isOpen: true, description: 'Iconic masala dosa since 1943', city: 'Bangalore', category: 'food', featured: true },
    { id: 'blr38', name: 'CTR Malleswaram', type: 'street-food', lat: 13.0010, lng: 77.5696, address: 'Malleswaram', rating: 4.6, priceRange: '₹', phone: '+91-80-23340514', isOpen: true, description: 'Legendary benne masala dosa', city: 'Bangalore', category: 'food', featured: true },
    { id: 'blr39', name: 'Brahmin\'s Coffee Bar', type: 'cafe', lat: 12.9423, lng: 77.5650, address: 'Basavanagudi', rating: 4.5, priceRange: '₹', phone: '', isOpen: true, description: 'Filter coffee and idli vada', city: 'Bangalore', category: 'food', featured: false },
    { id: 'blr40', name: 'Veena Stores', type: 'street-food', lat: 13.0010, lng: 77.5696, address: 'Malleswaram', rating: 4.5, priceRange: '₹', phone: '', isOpen: true, description: 'Morning tiffin institution', city: 'Bangalore', category: 'food', featured: false },
    { id: 'blr41', name: 'Truffles', type: 'cafe', lat: 12.9719, lng: 77.6412, address: 'Koramangala', rating: 4.4, priceRange: '₹₹', phone: '+91-80-25534497', isOpen: true, description: 'Burgers and Continental', city: 'Bangalore', category: 'food', featured: false },
    { id: 'blr42', name: 'Commercial Street', type: 'market', lat: 12.9808, lng: 77.6078, address: 'Shivaji Nagar', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Historic shopping street', city: 'Bangalore', category: 'shopping', featured: true },
    { id: 'blr43', name: 'Brigade Road', type: 'market', lat: 12.9716, lng: 77.6067, address: 'MG Road', rating: 4.3, priceRange: '₹₹₹', phone: '', isOpen: true, description: 'Premium shopping area', city: 'Bangalore', category: 'shopping', featured: false },
    { id: 'blr44', name: 'Chickpet Market', type: 'market', lat: 12.9618, lng: 77.5775, address: 'Chickpet', rating: 4.1, priceRange: '₹₹', phone: '', isOpen: true, description: 'Wholesale textile market', city: 'Bangalore', category: 'shopping', featured: false },
    { id: 'blr45', name: 'Koshy\'s Parade Cafe', type: 'cafe', lat: 12.9716, lng: 77.6067, address: 'MG Road', rating: 4.3, priceRange: '₹₹', phone: '+91-80-22211308', isOpen: true, description: 'Heritage cafe since 1940', city: 'Bangalore', category: 'food', featured: true },
    { id: 'blr46', name: 'Maplai', type: 'fine-dining', lat: 12.9716, lng: 77.6412, address: 'Indiranagar', rating: 4.4, priceRange: '₹₹₹', phone: '+91-80-25208500', isOpen: true, description: 'Tamil cuisine', city: 'Bangalore', category: 'food', featured: false },
    { id: 'blr47', name: 'The 13th Floor', type: 'bar', lat: 12.9762, lng: 77.5929, address: 'MG Road', rating: 4.4, priceRange: '₹₹₹₹', phone: '+91-80-30554466', isOpen: true, description: 'Rooftop bar', city: 'Bangalore', category: 'food', featured: false },
    { id: 'blr48', name: 'Sheraton Grand Bangalore', type: 'luxury-hotel', lat: 13.0106, lng: 77.5550, address: 'Brigade Gateway', rating: 4.5, priceRange: '₹15,000+', phone: '+91-80-42521000', isOpen: true, description: 'Business luxury hotel', city: 'Bangalore', category: 'hotels', featured: false },
    { id: 'blr49', name: 'Garuda Mall', type: 'mall', lat: 12.9716, lng: 77.6067, address: 'Magrath Road', rating: 4.2, priceRange: '₹₹₹', phone: '+91-80-41256000', isOpen: true, description: 'Central shopping mall', city: 'Bangalore', category: 'shopping', featured: false },
    { id: 'blr50', name: 'Central World', type: 'mall', lat: 13.0055, lng: 77.5502, address: 'JP Nagar', rating: 4.1, priceRange: '₹₹', phone: '+91-80-43010000', isOpen: true, description: 'Neighborhood mall', city: 'Bangalore', category: 'shopping', featured: false },
    
    // GOA - 30 famous places
    { id: 'g1', name: 'Baga Beach', type: 'beach', lat: 15.5556, lng: 73.7515, address: 'Baga, North Goa', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'Popular beach with nightlife', city: 'Goa', category: 'attractions', featured: true },
    { id: 'g2', name: 'Calangute Beach', type: 'beach', lat: 15.5438, lng: 73.7555, address: 'Calangute', rating: 4.2, priceRange: 'Free', phone: '', isOpen: true, description: 'Queen of beaches', city: 'Goa', category: 'attractions', featured: true },
    { id: 'g3', name: 'Anjuna Beach', type: 'beach', lat: 15.5733, lng: 73.7400, address: 'Anjuna', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'Hippie beach with flea market', city: 'Goa', category: 'attractions', featured: true },
    { id: 'g4', name: 'Fort Aguada', type: 'fort', lat: 15.4909, lng: 73.7731, address: 'Candolim', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'Portuguese fort with lighthouse', city: 'Goa', category: 'attractions', featured: true },
    { id: 'g5', name: 'Basilica of Bom Jesus', type: 'church', lat: 15.5008, lng: 73.9115, address: 'Old Goa', rating: 4.6, priceRange: 'Free', phone: '', isOpen: true, description: 'UNESCO World Heritage church', city: 'Goa', category: 'attractions', featured: true },
    { id: 'g6', name: 'Dudhsagar Falls', type: 'mountain', lat: 15.3144, lng: 74.3144, address: 'Mollem', rating: 4.5, priceRange: '₹100', phone: '', isOpen: true, description: 'Spectacular four-tier waterfall', city: 'Goa', category: 'attractions', featured: true },
    { id: 'g7', name: 'Palolem Beach', type: 'beach', lat: 15.0100, lng: 74.0232, address: 'Canacona', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Crescent-shaped paradise beach', city: 'Goa', category: 'attractions', featured: true },
    { id: 'g8', name: 'Chapora Fort', type: 'fort', lat: 15.6004, lng: 73.7364, address: 'Vagator', rating: 4.2, priceRange: 'Free', phone: '', isOpen: true, description: 'Dil Chahta Hai fort', city: 'Goa', category: 'attractions', featured: false },
    { id: 'g9', name: 'Saturday Night Market', type: 'market', lat: 15.5646, lng: 73.7456, address: 'Arpora', rating: 4.3, priceRange: '₹₹', phone: '', isOpen: true, description: 'Famous weekend market', city: 'Goa', category: 'shopping', featured: true },
    { id: 'g10', name: 'Titos Lane', type: 'bar', lat: 15.5556, lng: 73.7515, address: 'Baga', rating: 4.4, priceRange: '₹₹₹', phone: '+91-832-2276662', isOpen: true, description: 'Iconic nightclub street', city: 'Goa', category: 'food', featured: true },
    { id: 'g11', name: 'Taj Exotica', type: 'resort', lat: 15.4008, lng: 73.8279, address: 'Benaulim', rating: 4.7, priceRange: '₹18,000+', phone: '+91-832-6683333', isOpen: true, description: 'Luxury beach resort', city: 'Goa', category: 'hotels', featured: true },
    { id: 'g12', name: 'Vagator Beach', type: 'beach', lat: 15.5994, lng: 73.7372, address: 'Vagator', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'Red cliff beach', city: 'Goa', category: 'attractions', featured: false },
    { id: 'g13', name: 'Spice Plantation', type: 'park', lat: 15.3811, lng: 74.0614, address: 'Ponda', rating: 4.4, priceRange: '₹500', phone: '', isOpen: true, description: 'Tropical spice farm tour', city: 'Goa', category: 'attractions', featured: false },
    { id: 'g14', name: 'Morjim Beach', type: 'beach', lat: 15.6292, lng: 73.7302, address: 'Morjim', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'Turtle nesting beach', city: 'Goa', category: 'attractions', featured: false },
    { id: 'g15', name: 'Curlies Beach Shack', type: 'cafe', lat: 15.5733, lng: 73.7400, address: 'Anjuna', rating: 4.4, priceRange: '₹₹', phone: '+91-832-2274694', isOpen: true, description: 'Famous beach restaurant', city: 'Goa', category: 'food', featured: true },
    { id: 'g16', name: 'Grand Island', type: 'beach', lat: 15.4667, lng: 73.7833, address: 'Vasco', rating: 4.4, priceRange: '₹2,500', phone: '', isOpen: true, description: 'Snorkeling and diving spot', city: 'Goa', category: 'attractions', featured: false },
    { id: 'g17', name: 'Reis Magos Fort', type: 'fort', lat: 15.5181, lng: 73.8256, address: 'Reis Magos', rating: 4.2, priceRange: '₹25', phone: '', isOpen: true, description: 'Restored Portuguese fort', city: 'Goa', category: 'attractions', featured: false },
    { id: 'g18', name: 'Mandrem Beach', type: 'beach', lat: 15.6942, lng: 73.7142, address: 'Mandrem', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'Peaceful secluded beach', city: 'Goa', category: 'attractions', featured: false },
    { id: 'g19', name: 'Fishermans Wharf', type: 'fine-dining', lat: 15.4916, lng: 73.8279, address: 'Cavelossim', rating: 4.4, priceRange: '₹₹₹', phone: '+91-832-2880099', isOpen: true, description: 'Waterfront dining', city: 'Goa', category: 'food', featured: false },
    { id: 'g20', name: 'Arambol Beach', type: 'beach', lat: 15.6867, lng: 73.7042, address: 'Arambol', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'Bohemian beach paradise', city: 'Goa', category: 'attractions', featured: true },
    { id: 'g21', name: 'Cabo de Rama Fort', type: 'fort', lat: 15.0817, lng: 73.9119, address: 'Canacona', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'Historic hilltop fort', city: 'Goa', category: 'attractions', featured: false },
    { id: 'g22', name: 'Butterfly Beach', type: 'beach', lat: 15.0114, lng: 73.9994, address: 'Palolem', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Hidden gem beach', city: 'Goa', category: 'attractions', featured: false },
    { id: 'g23', name: 'Agonda Beach', type: 'beach', lat: 15.0367, lng: 73.9886, address: 'Agonda', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'Quiet family beach', city: 'Goa', category: 'attractions', featured: false },
    { id: 'g24', name: 'Casino Deltin Royale', type: 'bar', lat: 15.4856, lng: 73.8219, address: 'Panjim', rating: 4.3, priceRange: '₹₹₹₹', phone: '+91-832-6645555', isOpen: true, description: 'Floating casino', city: 'Goa', category: 'attractions', featured: true },
    { id: 'g25', name: 'Colva Beach', type: 'beach', lat: 15.2799, lng: 73.9139, address: 'Colva', rating: 4.1, priceRange: 'Free', phone: '', isOpen: true, description: 'Longest beach in Goa', city: 'Goa', category: 'attractions', featured: false },
    { id: 'g26', name: 'Shacks at Candolim', type: 'street-food', lat: 15.5182, lng: 73.7615, address: 'Candolim', rating: 4.3, priceRange: '₹₹', phone: '', isOpen: true, description: 'Beach shack dining', city: 'Goa', category: 'food', featured: false },
    { id: 'g27', name: 'Panaji Market', type: 'market', lat: 15.4909, lng: 73.8278, address: 'Panaji', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Local market shopping', city: 'Goa', category: 'shopping', featured: false },
    { id: 'g28', name: 'Se Cathedral', type: 'church', lat: 15.5008, lng: 73.9119, address: 'Old Goa', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Largest church in Asia', city: 'Goa', category: 'attractions', featured: false },
    { id: 'g29', name: 'Ashwem Beach', type: 'beach', lat: 15.6542, lng: 73.7242, address: 'Ashwem', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'Upscale quiet beach', city: 'Goa', category: 'attractions', featured: false },
    { id: 'g30', name: 'Majorda Beach', type: 'beach', lat: 15.3439, lng: 73.9186, address: 'Majorda', rating: 4.2, priceRange: 'Free', phone: '', isOpen: true, description: 'Family-friendly beach', city: 'Goa', category: 'attractions', featured: false },
    // More GOA - Hotels, Food, Shopping
    { id: 'goa31', name: 'Leela Goa', type: 'resort', lat: 15.4008, lng: 73.8279, address: 'Mobor Beach', rating: 4.7, priceRange: '₹20,000+', phone: '+91-832-6621234', isOpen: true, description: 'Luxury beachfront resort', city: 'Goa', category: 'hotels', featured: true },
    { id: 'goa32', name: 'Grand Hyatt Goa', type: 'resort', lat: 15.4305, lng: 73.8464, address: 'Bambolim', rating: 4.6, priceRange: '₹15,000+', phone: '+91-832-2725555', isOpen: true, description: 'Beach resort with casino', city: 'Goa', category: 'hotels', featured: false },
    { id: 'goa33', name: 'Park Hyatt Goa', type: 'resort', lat: 15.4135, lng: 73.8279, address: 'Cansaulim', rating: 4.6, priceRange: '₹18,000+', phone: '+91-832-2721234', isOpen: true, description: 'Village resort style', city: 'Goa', category: 'hotels', featured: false },
    { id: 'goa34', name: 'W Goa', type: 'resort', lat: 15.5146, lng: 73.7565, address: 'Vagator', rating: 4.5, priceRange: '₹22,000+', phone: '+91-832-7177777', isOpen: true, description: 'Designer beach resort', city: 'Goa', category: 'hotels', featured: true },
    { id: 'goa35', name: 'Alila Diwa Goa', type: 'resort', lat: 15.2701, lng: 73.9206, address: 'Majorda', rating: 4.6, priceRange: '₹16,000+', phone: '+91-832-2746800', isOpen: true, description: 'Paddy field resort', city: 'Goa', category: 'hotels', featured: false },
    { id: 'goa36', name: 'Gunpowder', type: 'fine-dining', lat: 15.0100, lng: 74.0232, address: 'Assagao', rating: 4.6, priceRange: '₹₹₹', phone: '+91-832-2268244', isOpen: true, description: 'Kerala cuisine in garden', city: 'Goa', category: 'food', featured: true },
    { id: 'goa37', name: 'Bomras', type: 'fine-dining', lat: 15.5733, lng: 73.7400, address: 'Candolim', rating: 4.5, priceRange: '₹₹₹', phone: '+91-832-3985838', isOpen: true, description: 'Asian fusion by the sea', city: 'Goa', category: 'food', featured: false },
    { id: 'goa38', name: 'Vinayak Family Restaurant', type: 'street-food', lat: 15.5733, lng: 73.7400, address: 'Assagao', rating: 4.5, priceRange: '₹', phone: '+91-832-2268244', isOpen: true, description: 'Authentic Goan thali', city: 'Goa', category: 'food', featured: true },
    { id: 'goa39', name: 'Souza Lobo', type: 'fine-dining', lat: 15.5438, lng: 73.7555, address: 'Calangute', rating: 4.4, priceRange: '₹₹₹', phone: '+91-832-2276463', isOpen: true, description: 'Beachfront seafood since 1932', city: 'Goa', category: 'food', featured: true },
    { id: 'goa40', name: 'Infantaria', type: 'cafe', lat: 15.5438, lng: 73.7555, address: 'Calangute', rating: 4.3, priceRange: '₹₹', phone: '+91-832-2279045', isOpen: true, description: 'Bakery and cafe', city: 'Goa', category: 'food', featured: false },
    { id: 'goa41', name: 'Britto\'s', type: 'cafe', lat: 15.5556, lng: 73.7515, address: 'Baga Beach', rating: 4.3, priceRange: '₹₹', phone: '+91-832-2277331', isOpen: true, description: 'Iconic beach shack', city: 'Goa', category: 'food', featured: true },
    { id: 'goa42', name: 'Pousada by the Beach', type: 'fine-dining', lat: 15.5438, lng: 73.7555, address: 'Calangute', rating: 4.4, priceRange: '₹₹₹', phone: '+91-832-2276044', isOpen: true, description: 'Portuguese-Goan fine dining', city: 'Goa', category: 'food', featured: false },
    { id: 'goa43', name: 'Navtara', type: 'street-food', lat: 15.5733, lng: 73.7400, address: 'Mapusa Market', rating: 4.4, priceRange: '₹', phone: '', isOpen: true, description: 'Local vegetarian food', city: 'Goa', category: 'food', featured: false },
    { id: 'goa44', name: 'Mapusa Market', type: 'market', lat: 15.5936, lng: 73.8065, address: 'Mapusa', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Friday flea market', city: 'Goa', category: 'shopping', featured: true },
    { id: 'goa45', name: 'Anjuna Flea Market', type: 'market', lat: 15.5733, lng: 73.7400, address: 'Anjuna', rating: 4.3, priceRange: '₹₹', phone: '', isOpen: true, description: 'Wednesday beach market', city: 'Goa', category: 'shopping', featured: true },
    { id: 'goa46', name: 'Calangute Market', type: 'market', lat: 15.5438, lng: 73.7555, address: 'Calangute', rating: 4.1, priceRange: '₹₹', phone: '', isOpen: true, description: 'Daily beach shopping', city: 'Goa', category: 'shopping', featured: false },
    { id: 'goa47', name: 'Cavala', type: 'bar', lat: 15.5556, lng: 73.7515, address: 'Baga', rating: 4.4, priceRange: '₹₹₹', phone: '+91-832-2279796', isOpen: true, description: 'Legendary nightclub', city: 'Goa', category: 'food', featured: true },
    { id: 'goa48', name: 'Antares Beach Club', type: 'bar', lat: 15.5994, lng: 73.7372, address: 'Vagator', rating: 4.5, priceRange: '₹₹₹₹', phone: '+91-832-2273757', isOpen: true, description: 'Cliffside sunset lounge', city: 'Goa', category: 'food', featured: true },
    { id: 'goa49', name: 'Zaara The Luxury Collection', type: 'resort', lat: 15.5733, lng: 73.7400, address: 'Candolim', rating: 4.5, priceRange: '₹14,000+', phone: '+91-832-6716000', isOpen: true, description: 'Beach luxury resort', city: 'Goa', category: 'hotels', featured: false },
    { id: 'goa50', name: 'Casa de Goa', type: 'boutique', lat: 15.4909, lng: 73.8278, address: 'Panaji', rating: 4.3, priceRange: '₹₹₹', phone: '+91-832-2226291', isOpen: true, description: 'Goan handicrafts emporium', city: 'Goa', category: 'shopping', featured: false },
    
    // JAIPUR - 25 famous places
    { id: 'j1', name: 'Hawa Mahal', type: 'palace', lat: 26.9239, lng: 75.8267, address: 'Hawa Mahal Road', rating: 4.5, priceRange: '₹50', phone: '+91-141-2618862', isOpen: true, description: 'Palace of Winds', city: 'Jaipur', category: 'attractions', featured: true },
    { id: 'j2', name: 'Amber Fort', type: 'fort', lat: 26.9855, lng: 75.8513, address: 'Devisinghpura', rating: 4.6, priceRange: '₹100', phone: '+91-141-2530293', isOpen: true, description: 'Majestic hilltop fort', city: 'Jaipur', category: 'attractions', featured: true },
    { id: 'j3', name: 'City Palace', type: 'palace', lat: 26.9258, lng: 75.8237, address: 'Tripolia Bazaar', rating: 4.5, priceRange: '₹200', phone: '+91-141-4088888', isOpen: true, description: 'Royal residence museum', city: 'Jaipur', category: 'attractions', featured: true },
    { id: 'j4', name: 'Jantar Mantar', type: 'monument', lat: 26.9247, lng: 75.8249, address: 'Gangori Bazaar', rating: 4.4, priceRange: '₹50', phone: '', isOpen: true, description: 'Astronomical observatory', city: 'Jaipur', category: 'attractions', featured: true },
    { id: 'j5', name: 'Jal Mahal', type: 'palace', lat: 26.9539, lng: 75.8461, address: 'Man Sagar Lake', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Water palace in lake', city: 'Jaipur', category: 'attractions', featured: true },
    { id: 'j6', name: 'Nahargarh Fort', type: 'fort', lat: 26.9374, lng: 75.8154, address: 'Krishna Nagar', rating: 4.4, priceRange: '₹50', phone: '', isOpen: true, description: 'Tiger Fort with city views', city: 'Jaipur', category: 'attractions', featured: false },
    { id: 'j7', name: 'Jaigarh Fort', type: 'fort', lat: 26.9850, lng: 75.8614, address: 'Devisinghpura', rating: 4.3, priceRange: '₹35', phone: '', isOpen: true, description: 'Fort with worlds largest cannon', city: 'Jaipur', category: 'attractions', featured: false },
    { id: 'j8', name: 'Albert Hall Museum', type: 'museum', lat: 26.9105, lng: 75.8188, address: 'Ram Niwas Garden', rating: 4.4, priceRange: '₹150', phone: '+91-141-2570099', isOpen: true, description: 'State museum', city: 'Jaipur', category: 'attractions', featured: false },
    { id: 'j9', name: 'Birla Mandir', type: 'temple', lat: 26.8954, lng: 75.8006, address: 'Tilak Nagar', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'White marble temple', city: 'Jaipur', category: 'attractions', featured: false },
    { id: 'j10', name: 'Johari Bazaar', type: 'market', lat: 26.9212, lng: 75.8245, address: 'Old City', rating: 4.3, priceRange: '₹₹', phone: '', isOpen: true, description: 'Jewelry market', city: 'Jaipur', category: 'shopping', featured: true },
    { id: 'j11', name: 'Bapu Bazaar', type: 'market', lat: 26.9180, lng: 75.8076, address: 'Bapu Bazaar', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Textiles and handicrafts', city: 'Jaipur', category: 'shopping', featured: false },
    { id: 'j12', name: 'The Oberoi Rajvilas', type: 'luxury-hotel', lat: 26.8922, lng: 75.7558, address: 'Goner Road', rating: 4.8, priceRange: '₹35,000+', phone: '+91-141-2680101', isOpen: true, description: 'Ultra-luxury resort', city: 'Jaipur', category: 'hotels', featured: true },
    { id: 'j13', name: 'Chokhi Dhani', type: 'park', lat: 26.7907, lng: 75.7945, address: 'Tonk Road', rating: 4.3, priceRange: '₹700', phone: '+91-141-5156600', isOpen: true, description: 'Rajasthani village resort', city: 'Jaipur', category: 'attractions', featured: true },
    { id: 'j14', name: 'Galtaji Temple', type: 'temple', lat: 26.9289, lng: 75.8651, address: 'Galtaji Road', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'Monkey temple complex', city: 'Jaipur', category: 'attractions', featured: false },
    { id: 'j15', name: 'LMB Restaurant', type: 'fine-dining', lat: 26.9212, lng: 75.8242, address: 'Johari Bazaar', rating: 4.4, priceRange: '₹₹', phone: '+91-141-2565844', isOpen: true, description: 'Legendary Rajasthani food', city: 'Jaipur', category: 'food', featured: true },
    { id: 'j16', name: 'Rambagh Palace', type: 'luxury-hotel', lat: 26.8956, lng: 75.7913, address: 'Bhawani Singh Road', rating: 4.7, priceRange: '₹30,000+', phone: '+91-141-2211919', isOpen: true, description: 'Heritage palace hotel', city: 'Jaipur', category: 'hotels', featured: true },
    { id: 'j17', name: 'Sisodia Rani Garden', type: 'park', lat: 26.8583, lng: 75.8911, address: 'Agra Road', rating: 4.2, priceRange: '₹20', phone: '', isOpen: true, description: 'Terraced Mughal garden', city: 'Jaipur', category: 'attractions', featured: false },
    { id: 'j18', name: 'Jaipur Zoo', type: 'park', lat: 26.9105, lng: 75.8188, address: 'Ram Niwas Garden', rating: 3.9, priceRange: '₹50', phone: '', isOpen: true, description: 'City zoo', city: 'Jaipur', category: 'attractions', featured: false },
    { id: 'j19', name: 'Tripolia Bazaar', type: 'market', lat: 26.9258, lng: 75.8237, address: 'Tripolia', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Traditional market', city: 'Jaipur', category: 'shopping', featured: false },
    { id: 'j20', name: 'Rawat Mishthan Bhandar', type: 'street-food', lat: 26.9205, lng: 75.7678, address: 'Station Road', rating: 4.5, priceRange: '₹', phone: '+91-141-2365435', isOpen: true, description: 'Famous for sweets', city: 'Jaipur', category: 'food', featured: true },
    { id: 'j21', name: 'Govind Dev Ji Temple', type: 'temple', lat: 26.9258, lng: 75.8237, address: 'City Palace', rating: 4.6, priceRange: 'Free', phone: '', isOpen: true, description: 'Krishna temple', city: 'Jaipur', category: 'attractions', featured: false },
    { id: 'j22', name: 'Jawahar Circle Garden', type: 'park', lat: 26.8991, lng: 75.7616, address: 'Jawahar Nagar', rating: 4.2, priceRange: 'Free', phone: '', isOpen: true, description: 'Asias largest circular park', city: 'Jaipur', category: 'attractions', featured: false },
    { id: 'j23', name: 'World Trade Park', type: 'mall', lat: 26.8932, lng: 75.7889, address: 'Malviya Nagar', rating: 4.3, priceRange: '₹₹₹', phone: '+91-141-6661111', isOpen: true, description: 'Shopping mall', city: 'Jaipur', category: 'shopping', featured: false },
    { id: 'j24', name: 'Panna Meena ka Kund', type: 'monument', lat: 26.9851, lng: 75.8514, address: 'Amber', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'Stepwell near Amber Fort', city: 'Jaipur', category: 'attractions', featured: false },
    { id: 'j25', name: 'Anokhi Museum', type: 'museum', lat: 26.9244, lng: 75.8241, address: 'Kheri Gate', rating: 4.3, priceRange: '₹50', phone: '+91-141-2380116', isOpen: true, description: 'Textile printing museum', city: 'Jaipur', category: 'attractions', featured: false },
    // More JAIPUR - Hotels, Food, Shopping
    { id: 'jp26', name: 'Fairmont Jaipur', type: 'luxury-hotel', lat: 26.9124, lng: 75.8013, address: 'Kukas', rating: 4.6, priceRange: '₹18,000+', phone: '+91-141-7141111', isOpen: true, description: 'Mughal-style palace hotel', city: 'Jaipur', category: 'hotels', featured: true },
    { id: 'jp27', name: 'ITC Rajputana', type: 'luxury-hotel', lat: 26.9081, lng: 75.8066, address: 'Palace Road', rating: 4.5, priceRange: '₹14,000+', phone: '+91-141-5100100', isOpen: true, description: 'Rajasthani luxury hotel', city: 'Jaipur', category: 'hotels', featured: false },
    { id: 'jp28', name: 'Samode Haveli', type: 'luxury-hotel', lat: 26.9258, lng: 75.8237, address: 'Gangapole', rating: 4.6, priceRange: '₹16,000+', phone: '+91-141-2632407', isOpen: true, description: 'Heritage haveli hotel', city: 'Jaipur', category: 'hotels', featured: true },
    { id: 'jp29', name: 'Suvarna Mahal', type: 'fine-dining', lat: 26.8956, lng: 75.7913, address: 'Rambagh Palace', rating: 4.7, priceRange: '₹₹₹₹', phone: '+91-141-2211919', isOpen: true, description: 'Royal dining at Rambagh', city: 'Jaipur', category: 'food', featured: true },
    { id: 'jp30', name: 'Peacock Rooftop', type: 'fine-dining', lat: 26.9212, lng: 75.8245, address: 'Hathroi Fort', rating: 4.5, priceRange: '₹₹₹', phone: '+91-141-2373737', isOpen: true, description: 'Rooftop Rajasthani dining', city: 'Jaipur', category: 'food', featured: false },
    { id: 'jp31', name: 'Lassiwala', type: 'street-food', lat: 26.9212, lng: 75.8071, address: 'MI Road', rating: 4.6, priceRange: '₹', phone: '', isOpen: true, description: 'Famous lassi since 1944', city: 'Jaipur', category: 'food', featured: true },
    { id: 'jp32', name: 'Masala Chowk', type: 'street-food', lat: 26.9212, lng: 75.8071, address: 'Jaipur Junction', rating: 4.4, priceRange: '₹', phone: '', isOpen: true, description: 'Street food court', city: 'Jaipur', category: 'food', featured: true },
    { id: 'jp33', name: 'Nehru Bazaar', type: 'market', lat: 26.9212, lng: 75.8071, address: 'Old City', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Traditional footwear and textiles', city: 'Jaipur', category: 'shopping', featured: false },
    { id: 'jp34', name: 'Anokhi', type: 'boutique', lat: 26.9212, lng: 75.8071, address: 'Tilak Nagar', rating: 4.4, priceRange: '₹₹₹', phone: '+91-141-2380116', isOpen: true, description: 'Block print clothing', city: 'Jaipur', category: 'shopping', featured: true },
    { id: 'jp35', name: 'Crystal Palm Mall', type: 'mall', lat: 26.8488, lng: 75.8013, address: 'JLN Marg', rating: 4.2, priceRange: '₹₹₹', phone: '+91-141-4023333', isOpen: true, description: 'Modern shopping mall', city: 'Jaipur', category: 'shopping', featured: false },
    
    // AGRA - 20 famous places
    { id: 'a1', name: 'Taj Mahal', type: 'monument', lat: 27.1751, lng: 78.0421, address: 'Dharmapuri', rating: 4.8, priceRange: '₹50', phone: '+91-562-2227261', isOpen: true, description: 'Wonder of the World', city: 'Agra', category: 'attractions', featured: true },
    { id: 'a2', name: 'Agra Fort', type: 'fort', lat: 27.1795, lng: 78.0211, address: 'Rakabganj', rating: 4.5, priceRange: '₹50', phone: '+91-562-2226431', isOpen: true, description: 'UNESCO red sandstone fort', city: 'Agra', category: 'attractions', featured: true },
    { id: 'a3', name: 'Fatehpur Sikri', type: 'fort', lat: 27.0945, lng: 77.6619, address: 'Fatehpur Sikri', rating: 4.5, priceRange: '₹50', phone: '', isOpen: true, description: 'Abandoned Mughal city', city: 'Agra', category: 'attractions', featured: true },
    { id: 'a4', name: 'Mehtab Bagh', type: 'park', lat: 27.1807, lng: 78.0462, address: 'Nagla Devjit', rating: 4.4, priceRange: '₹25', phone: '', isOpen: true, description: 'Moonlight garden with Taj view', city: 'Agra', category: 'attractions', featured: true },
    { id: 'a5', name: 'Itmad-ud-Daulah', type: 'monument', lat: 27.1830, lng: 78.0264, address: 'Moti Bagh', rating: 4.4, priceRange: '₹20', phone: '', isOpen: true, description: 'Baby Taj marble tomb', city: 'Agra', category: 'attractions', featured: false },
    { id: 'a6', name: 'Akbars Tomb', type: 'monument', lat: 27.2221, lng: 77.9489, address: 'Sikandra', rating: 4.3, priceRange: '₹35', phone: '', isOpen: true, description: 'Mughal emperors mausoleum', city: 'Agra', category: 'attractions', featured: false },
    { id: 'a7', name: 'Sadar Bazaar', type: 'market', lat: 27.1833, lng: 78.0064, address: 'Sadar Bazaar', rating: 4.1, priceRange: '₹₹', phone: '', isOpen: true, description: 'Local shopping market', city: 'Agra', category: 'shopping', featured: false },
    { id: 'a8', name: 'Jama Masjid', type: 'mosque', lat: 27.1776, lng: 78.0159, address: 'Mantola', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'Large mosque by Shah Jahan', city: 'Agra', category: 'attractions', featured: false },
    { id: 'a9', name: 'Wildlife SOS', type: 'park', lat: 27.2644, lng: 77.8569, address: 'Mathura Road', rating: 4.6, priceRange: '₹500', phone: '+91-562-2640740', isOpen: true, description: 'Bear rescue center', city: 'Agra', category: 'attractions', featured: false },
    { id: 'a10', name: 'Taj Museum', type: 'museum', lat: 27.1751, lng: 78.0421, address: 'Taj Mahal', rating: 4.2, priceRange: 'Free', phone: '', isOpen: true, description: 'Museum inside Taj complex', city: 'Agra', category: 'attractions', featured: false },
    { id: 'a11', name: 'The Oberoi Amarvilas', type: 'luxury-hotel', lat: 27.1745, lng: 78.0428, address: 'Taj East Gate Road', rating: 4.8, priceRange: '₹50,000+', phone: '+91-562-2231515', isOpen: true, description: 'Luxury hotel with Taj view', city: 'Agra', category: 'hotels', featured: true },
    { id: 'a12', name: 'ITC Mughal', type: 'luxury-hotel', lat: 27.1672, lng: 78.0462, address: 'Taj Ganj', rating: 4.6, priceRange: '₹15,000+', phone: '+91-562-4025700', isOpen: true, description: 'Mughal-themed luxury hotel', city: 'Agra', category: 'hotels', featured: false },
    { id: 'a13', name: 'Pinch of Spice', type: 'fine-dining', lat: 27.1900, lng: 78.0070, address: 'Fatehabad Road', rating: 4.3, priceRange: '₹₹', phone: '+91-562-4018000', isOpen: true, description: 'Popular multi-cuisine', city: 'Agra', category: 'food', featured: false },
    { id: 'a14', name: 'Panchhi Petha Store', type: 'street-food', lat: 27.1833, lng: 78.0064, address: 'Sadar Bazaar', rating: 4.4, priceRange: '₹', phone: '+91-562-2460437', isOpen: true, description: 'Famous Agra sweet', city: 'Agra', category: 'food', featured: true },
    { id: 'a15', name: 'Kalakriti Cultural Center', type: 'museum', lat: 27.1716, lng: 78.0430, address: 'Taj Ganj', rating: 4.4, priceRange: '₹500', phone: '+91-562-6510080', isOpen: true, description: 'Mohabbat The Taj show', city: 'Agra', category: 'attractions', featured: false },
    { id: 'a16', name: 'Chini Ka Rauza', type: 'monument', lat: 27.1871, lng: 78.0303, address: 'Etmadpur Road', rating: 4.0, priceRange: '₹25', phone: '', isOpen: true, description: 'Persian glazed tile tomb', city: 'Agra', category: 'attractions', featured: false },
    { id: 'a17', name: 'Ram Bagh', type: 'park', lat: 27.2006, lng: 78.0251, address: 'Ram Bagh', rating: 4.1, priceRange: '₹20', phone: '', isOpen: true, description: 'Oldest Mughal garden', city: 'Agra', category: 'attractions', featured: false },
    { id: 'a18', name: 'Kinari Bazaar', type: 'market', lat: 27.1776, lng: 78.0159, address: 'Kinari Bazaar', rating: 4.0, priceRange: '₹₹', phone: '', isOpen: true, description: 'Traditional shopping street', city: 'Agra', category: 'shopping', featured: false },
    { id: 'a19', name: 'Mariam Tomb', type: 'monument', lat: 27.0942, lng: 77.6617, address: 'Fatehpur Sikri', rating: 4.2, priceRange: 'Free', phone: '', isOpen: true, description: 'Tomb of Akbars wife', city: 'Agra', category: 'attractions', featured: false },
    { id: 'a20', name: 'Jodha Bai Palace', type: 'palace', lat: 27.0945, lng: 77.6619, address: 'Fatehpur Sikri', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'Queens palace', city: 'Agra', category: 'attractions', featured: false },
    // More AGRA - Hotels, Food, Shopping
    { id: 'agr21', name: 'Trident Agra', type: 'luxury-hotel', lat: 27.1672, lng: 78.0462, address: 'Taj Ganj', rating: 4.5, priceRange: '₹10,000+', phone: '+91-562-2331818', isOpen: true, description: 'Luxury hotel near Taj', city: 'Agra', category: 'hotels', featured: true },
    { id: 'agr22', name: 'Jaypee Palace', type: 'luxury-hotel', lat: 27.1672, lng: 78.0462, address: 'Fatehabad Road', rating: 4.4, priceRange: '₹8,000+', phone: '+91-562-4010101', isOpen: true, description: 'Mughal palace hotel', city: 'Agra', category: 'hotels', featured: false },
    { id: 'agr23', name: 'Courtyard Marriott', type: 'luxury-hotel', lat: 27.1672, lng: 78.0462, address: 'Taj East Gate', rating: 4.5, priceRange: '₹9,000+', phone: '+91-562-4020000', isOpen: true, description: 'Modern luxury hotel', city: 'Agra', category: 'hotels', featured: false },
    { id: 'agr24', name: 'Esphahan ITC Mughal', type: 'fine-dining', lat: 27.1672, lng: 78.0462, address: 'ITC Mughal', rating: 4.6, priceRange: '₹₹₹₹', phone: '+91-562-4025700', isOpen: true, description: 'Royal Northwest Frontier cuisine', city: 'Agra', category: 'food', featured: true },
    { id: 'agr25', name: 'Joney\'s Place', type: 'cafe', lat: 27.1751, lng: 78.0421, address: 'Taj Ganj', rating: 4.3, priceRange: '₹₹', phone: '', isOpen: true, description: 'Rooftop cafe with Taj view', city: 'Agra', category: 'food', featured: false },
    { id: 'agr26', name: 'Dasaprakash', type: 'street-food', lat: 27.1833, lng: 78.0064, address: 'Gwalior Road', rating: 4.2, priceRange: '₹', phone: '+91-562-2363535', isOpen: true, description: 'Pure vegetarian South Indian', city: 'Agra', category: 'food', featured: false },
    { id: 'agr27', name: 'Deviram Sweets', type: 'street-food', lat: 27.1833, lng: 78.0064, address: 'Raja Ki Mandi', rating: 4.4, priceRange: '₹', phone: '', isOpen: true, description: 'Famous for petha', city: 'Agra', category: 'food', featured: true },
    { id: 'agr28', name: 'Subhash Bazaar', type: 'market', lat: 27.1833, lng: 78.0064, address: 'Subhash Bazaar', rating: 4.0, priceRange: '₹₹', phone: '', isOpen: true, description: 'Local shopping market', city: 'Agra', category: 'shopping', featured: false },
    { id: 'agr29', name: 'Taj Mahal Shopping Complex', type: 'market', lat: 27.1751, lng: 78.0421, address: 'Taj Ganj', rating: 4.1, priceRange: '₹₹₹', phone: '', isOpen: true, description: 'Tourist shopping area', city: 'Agra', category: 'shopping', featured: false },
    { id: 'agr30', name: 'Shilpgram Agra', type: 'market', lat: 27.1672, lng: 78.0462, address: 'Taj East Gate Road', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Handicrafts village', city: 'Agra', category: 'shopping', featured: true },
    
    // KERALA - 20 famous places
    { id: 'k1', name: 'Munnar Tea Gardens', type: 'mountain', lat: 10.0889, lng: 77.0595, address: 'Munnar', rating: 4.7, priceRange: '₹500', phone: '', isOpen: true, description: 'Scenic tea plantations', city: 'Kerala', category: 'attractions', featured: true },
    { id: 'k2', name: 'Alleppey Backwaters', type: 'beach', lat: 9.4981, lng: 76.3388, address: 'Alappuzha', rating: 4.6, priceRange: '₹8,000', phone: '', isOpen: true, description: 'Houseboat cruises', city: 'Kerala', category: 'attractions', featured: true },
    { id: 'k3', name: 'Varkala Beach', type: 'beach', lat: 8.7379, lng: 76.7163, address: 'Varkala', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Cliff beach with springs', city: 'Kerala', category: 'attractions', featured: true },
    { id: 'k4', name: 'Kovalam Beach', type: 'beach', lat: 8.4004, lng: 76.9790, address: 'Thiruvananthapuram', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'Crescent beach paradise', city: 'Kerala', category: 'attractions', featured: true },
    { id: 'k5', name: 'Athirapally Falls', type: 'mountain', lat: 10.2852, lng: 76.5702, address: 'Thrissur', rating: 4.5, priceRange: '₹30', phone: '', isOpen: true, description: 'Spectacular waterfall', city: 'Kerala', category: 'attractions', featured: true },
    { id: 'k6', name: 'Kumarakom Bird Sanctuary', type: 'park', lat: 9.6177, lng: 76.4275, address: 'Kottayam', rating: 4.4, priceRange: '₹50', phone: '', isOpen: true, description: 'Migratory bird haven', city: 'Kerala', category: 'attractions', featured: false },
    { id: 'k7', name: 'Periyar Wildlife Sanctuary', type: 'park', lat: 9.4650, lng: 77.2311, address: 'Thekkady', rating: 4.5, priceRange: '₹300', phone: '+91-4869-222027', isOpen: true, description: 'Elephant and tiger reserve', city: 'Kerala', category: 'attractions', featured: true },
    { id: 'k8', name: 'Fort Kochi', type: 'fort', lat: 9.9648, lng: 76.2429, address: 'Kochi', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Historic colonial area', city: 'Kerala', category: 'attractions', featured: true },
    { id: 'k9', name: 'Mattancherry Palace', type: 'palace', lat: 9.9583, lng: 76.2597, address: 'Kochi', rating: 4.3, priceRange: '₹5', phone: '+91-484-2226085', isOpen: true, description: 'Dutch Palace with murals', city: 'Kerala', category: 'attractions', featured: false },
    { id: 'k10', name: 'Cherai Beach', type: 'beach', lat: 10.1350, lng: 76.1792, address: 'Kochi', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'Serene beach near Kochi', city: 'Kerala', category: 'attractions', featured: false },
    { id: 'k11', name: 'Wayanad Wildlife Sanctuary', type: 'park', lat: 11.6854, lng: 76.0832, address: 'Wayanad', rating: 4.4, priceRange: '₹300', phone: '', isOpen: true, description: 'Rich biodiversity sanctuary', city: 'Kerala', category: 'attractions', featured: false },
    { id: 'k12', name: 'Padmanabhaswamy Temple', type: 'temple', lat: 8.4829, lng: 76.9470, address: 'Thiruvananthapuram', rating: 4.6, priceRange: 'Free', phone: '', isOpen: true, description: 'Ancient temple treasure', city: 'Kerala', category: 'attractions', featured: true },
    { id: 'k13', name: 'Chinese Fishing Nets', type: 'monument', lat: 9.9676, lng: 76.2430, address: 'Fort Kochi', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'Iconic fishing method', city: 'Kerala', category: 'attractions', featured: false },
    { id: 'k14', name: 'Tea Museum Munnar', type: 'museum', lat: 10.0889, lng: 77.0595, address: 'Munnar', rating: 4.3, priceRange: '₹125', phone: '+91-4865-230561', isOpen: true, description: 'Tea processing history', city: 'Kerala', category: 'attractions', featured: false },
    { id: 'k15', name: 'Lulu Mall', type: 'mall', lat: 10.0271, lng: 76.3128, address: 'Kochi', rating: 4.3, priceRange: '₹₹₹', phone: '+91-484-3056666', isOpen: true, description: 'Largest mall in India', city: 'Kerala', category: 'shopping', featured: false },
    { id: 'k16', name: 'Spice Market Kochi', type: 'market', lat: 9.9648, lng: 76.2429, address: 'Mattancherry', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Historic spice trading hub', city: 'Kerala', category: 'shopping', featured: true },
    { id: 'k17', name: 'Brunton Boatyard', type: 'luxury-hotel', lat: 9.9676, lng: 76.2430, address: 'Fort Kochi', rating: 4.7, priceRange: '₹18,000+', phone: '+91-484-2215221', isOpen: true, description: 'Heritage waterfront hotel', city: 'Kerala', category: 'hotels', featured: true },
    { id: 'k18', name: 'Paragon Restaurant', type: 'fine-dining', lat: 11.2588, lng: 75.7804, address: 'Kozhikode', rating: 4.5, priceRange: '₹₹', phone: '+91-495-2766020', isOpen: true, description: 'Famous Malabar cuisine', city: 'Kerala', category: 'food', featured: true },
    { id: 'k19', name: 'Houseboat Stay', type: 'resort', lat: 9.4981, lng: 76.3388, address: 'Alleppey', rating: 4.6, priceRange: '₹8,000+', phone: '', isOpen: true, description: 'Overnight backwater cruise', city: 'Kerala', category: 'hotels', featured: true },
    { id: 'k20', name: 'Marari Beach', type: 'beach', lat: 9.6028, lng: 76.3060, address: 'Mararikulam', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Pristine quiet beach', city: 'Kerala', category: 'attractions', featured: false },
    // More KERALA - Hotels, Food, Shopping
    { id: 'ker21', name: 'Kumarakom Lake Resort', type: 'resort', lat: 9.6177, lng: 76.4275, address: 'Kumarakom', rating: 4.7, priceRange: '₹20,000+', phone: '+91-481-2524900', isOpen: true, description: 'Heritage luxury backwater resort', city: 'Kerala', category: 'hotels', featured: true },
    { id: 'ker22', name: 'Taj Malabar Kochi', type: 'luxury-hotel', lat: 9.9676, lng: 76.2430, address: 'Willingdon Island', rating: 4.6, priceRange: '₹12,000+', phone: '+91-484-6643000', isOpen: true, description: 'Harbor luxury hotel', city: 'Kerala', category: 'hotels', featured: false },
    { id: 'ker23', name: 'Niraamaya Surya Samudra', type: 'resort', lat: 8.4004, lng: 76.9790, address: 'Kovalam', rating: 4.7, priceRange: '₹22,000+', phone: '+91-471-2267333', isOpen: true, description: 'Cliffside luxury cottages', city: 'Kerala', category: 'hotels', featured: true },
    { id: 'ker24', name: 'Vivanta by Taj', type: 'resort', lat: 9.6177, lng: 76.4275, address: 'Kumarakom', rating: 4.5, priceRange: '₹15,000+', phone: '+91-481-2525711', isOpen: true, description: 'Backwater luxury resort', city: 'Kerala', category: 'hotels', featured: false },
    { id: 'ker25', name: 'Kayees Rahmathulla Cafe', type: 'street-food', lat: 11.2588, lng: 75.7804, address: 'Kozhikode', rating: 4.6, priceRange: '₹', phone: '', isOpen: true, description: 'Legendary biryani since 1957', city: 'Kerala', category: 'food', featured: true },
    { id: 'ker26', name: 'Fort House Restaurant', type: 'fine-dining', lat: 9.9676, lng: 76.2430, address: 'Fort Kochi', rating: 4.5, priceRange: '₹₹₹', phone: '+91-484-2217103', isOpen: true, description: 'Waterfront seafood', city: 'Kerala', category: 'food', featured: true },
    { id: 'ker27', name: 'Dhe Puttu', type: 'street-food', lat: 9.9648, lng: 76.2429, address: 'Kochi', rating: 4.5, priceRange: '₹₹', phone: '+91-484-2391919', isOpen: true, description: 'Modern puttu restaurant', city: 'Kerala', category: 'food', featured: false },
    { id: 'ker28', name: 'Coconut Lagoon Dining', type: 'fine-dining', lat: 9.6177, lng: 76.4275, address: 'Kumarakom', rating: 4.6, priceRange: '₹₹₹₹', phone: '+91-481-2524491', isOpen: true, description: 'Traditional Kerala cuisine', city: 'Kerala', category: 'food', featured: false },
    { id: 'ker29', name: 'Broadway Kochi', type: 'market', lat: 9.9648, lng: 76.2834, address: 'Ernakulam', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Main shopping street', city: 'Kerala', category: 'shopping', featured: false },
    { id: 'ker30', name: 'Princess Street', type: 'market', lat: 9.9648, lng: 76.2834, address: 'Kochi', rating: 4.1, priceRange: '₹₹', phone: '', isOpen: true, description: 'Jewelry and textiles', city: 'Kerala', category: 'shopping', featured: false },
    { id: 'ker31', name: 'Fabindia Fort Kochi', type: 'boutique', lat: 9.9648, lng: 76.2429, address: 'Fort Kochi', rating: 4.3, priceRange: '₹₹₹', phone: '+91-484-2217537', isOpen: true, description: 'Ethnic wear', city: 'Kerala', category: 'shopping', featured: false },
    { id: 'ker32', name: 'Oberon Mall', type: 'mall', lat: 9.9648, lng: 76.2834, address: 'Edappally', rating: 4.2, priceRange: '₹₹₹', phone: '+91-484-2803000', isOpen: true, description: 'Modern shopping mall', city: 'Kerala', category: 'shopping', featured: false },
    { id: 'ker33', name: 'Thekkady Spice Market', type: 'market', lat: 9.4650, lng: 77.2311, address: 'Thekkady', rating: 4.3, priceRange: '₹₹', phone: '', isOpen: true, description: 'Fresh spices direct', city: 'Kerala', category: 'shopping', featured: true },
    { id: 'ker34', name: 'Sree Krishna Cafe', type: 'cafe', lat: 8.4829, lng: 76.9470, address: 'East Fort', rating: 4.4, priceRange: '₹', phone: '', isOpen: true, description: 'Famous banana chips and snacks', city: 'Kerala', category: 'food', featured: false },
    { id: 'ker35', name: 'Villa Maya', type: 'fine-dining', lat: 8.4829, lng: 76.9470, address: 'Trivandrum', rating: 4.6, priceRange: '₹₹₹₹', phone: '+91-471-2466776', isOpen: true, description: 'Heritage mansion dining', city: 'Kerala', category: 'food', featured: true },
    
    // VARANASI, UDAIPUR, MANALI, RISHIKESH - 15 each
    { id: 'v1', name: 'Kashi Vishwanath Temple', type: 'temple', lat: 25.3109, lng: 83.0107, address: 'Lahori Tola', rating: 4.7, priceRange: 'Free', phone: '', isOpen: true, description: 'Holiest Shiva temple', city: 'Varanasi', category: 'attractions', featured: true },
    { id: 'v2', name: 'Dashashwamedh Ghat', type: 'monument', lat: 25.3081, lng: 83.0111, address: 'Dashashwamedh Road', rating: 4.6, priceRange: 'Free', phone: '', isOpen: true, description: 'Main ghat with evening aarti', city: 'Varanasi', category: 'attractions', featured: true },
    { id: 'v3', name: 'Assi Ghat', type: 'monument', lat: 25.2805, lng: 83.0067, address: 'Assi', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Southern ghat for rituals', city: 'Varanasi', category: 'attractions', featured: false },
    { id: 'v4', name: 'Sarnath', type: 'temple', lat: 25.3790, lng: 83.0280, address: 'Sarnath', rating: 4.6, priceRange: '₹25', phone: '', isOpen: true, description: 'Buddhist pilgrimage site', city: 'Varanasi', category: 'attractions', featured: true },
    { id: 'v5', name: 'Manikarnika Ghat', type: 'monument', lat: 25.3095, lng: 83.0133, address: 'Manikarnika', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'Cremation ghat', city: 'Varanasi', category: 'attractions', featured: false },
    { id: 'v6', name: 'Ramnagar Fort', type: 'fort', lat: 25.2949, lng: 83.0335, address: 'Ramnagar', rating: 4.2, priceRange: '₹50', phone: '', isOpen: true, description: 'Maharaja palace and museum', city: 'Varanasi', category: 'attractions', featured: false },
    { id: 'v7', name: 'BHU Campus', type: 'park', lat: 25.2677, lng: 82.9913, address: 'Banaras Hindu University', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'University with Vishwanath Temple', city: 'Varanasi', category: 'attractions', featured: false },
    { id: 'v8', name: 'Blue Lassi', type: 'cafe', lat: 25.3109, lng: 83.0107, address: 'Kachori Gali', rating: 4.6, priceRange: '₹', phone: '', isOpen: true, description: 'Famous lassi shop', city: 'Varanasi', category: 'food', featured: true },
    { id: 'v9', name: 'Kashi Chat Bhandar', type: 'street-food', lat: 25.3109, lng: 83.0107, address: 'Godowlia', rating: 4.5, priceRange: '₹', phone: '', isOpen: true, description: 'Iconic chaat shop', city: 'Varanasi', category: 'food', featured: true },
    { id: 'v10', name: 'Taj Ganges', type: 'luxury-hotel', lat: 25.3009, lng: 83.0060, address: 'Nadesar Palace Grounds', rating: 4.4, priceRange: '₹8,000+', phone: '+91-542-6661111', isOpen: true, description: 'Luxury hotel near ghats', city: 'Varanasi', category: 'hotels', featured: false },
    { id: 'v11', name: 'Tulsi Ghat', type: 'monument', lat: 25.2990, lng: 83.0075, address: 'Tulsi Ghat', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'Peaceful ghat', city: 'Varanasi', category: 'attractions', featured: false },
    { id: 'v12', name: 'Dhamek Stupa', type: 'monument', lat: 25.3790, lng: 83.0280, address: 'Sarnath', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Ancient Buddhist stupa', city: 'Varanasi', category: 'attractions', featured: false },
    { id: 'v13', name: 'Sankat Mochan Temple', type: 'temple', lat: 25.2805, lng: 82.9914, address: 'Durga Kund', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Hanuman temple', city: 'Varanasi', category: 'attractions', featured: false },
    { id: 'v14', name: 'Vishwanath Gali', type: 'market', lat: 25.3109, lng: 83.0107, address: 'Godowlia', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Temple street market', city: 'Varanasi', category: 'shopping', featured: false },
    { id: 'v15', name: 'Alamgir Mosque', type: 'mosque', lat: 25.3095, lng: 83.0127, address: 'Panchaganga Ghat', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'Aurangzebs mosque', city: 'Varanasi', category: 'attractions', featured: false },
    // More VARANASI - Hotels, Food, Shopping
    { id: 'var16', name: 'Brijrama Palace', type: 'luxury-hotel', lat: 25.3009, lng: 83.0060, address: 'Darbhanga Ghat', rating: 4.6, priceRange: '₹12,000+', phone: '+91-542-2503302', isOpen: true, description: 'Heritage ghat palace hotel', city: 'Varanasi', category: 'hotels', featured: true },
    { id: 'var17', name: 'Suryauday Haveli', type: 'luxury-hotel', lat: 25.3009, lng: 83.0060, address: 'Shivala Ghat', rating: 4.5, priceRange: '₹9,000+', phone: '+91-542-2451050', isOpen: true, description: 'Ganga-facing heritage hotel', city: 'Varanasi', category: 'hotels', featured: false },
    { id: 'var18', name: 'Ganges View Hotel', type: 'budget-hotel', lat: 25.3095, lng: 83.0133, address: 'Assi Ghat', rating: 4.2, priceRange: '₹3,000+', phone: '+91-542-2313218', isOpen: true, description: 'Budget ghat hotel', city: 'Varanasi', category: 'hotels', featured: false },
    { id: 'var19', name: 'Brown Bread Bakery', type: 'cafe', lat: 25.2805, lng: 83.0067, address: 'Assi Ghat', rating: 4.5, priceRange: '₹₹', phone: '+91-542-2452551', isOpen: true, description: 'NGO cafe with rooftop', city: 'Varanasi', category: 'food', featured: true },
    { id: 'var20', name: 'Deena Chaat Bhandar', type: 'street-food', lat: 25.3109, lng: 83.0107, address: 'Godowlia', rating: 4.6, priceRange: '₹', phone: '', isOpen: true, description: 'Famous tamatar chaat', city: 'Varanasi', category: 'food', featured: true },
    { id: 'var21', name: 'Pizzeria Vatika Cafe', type: 'cafe', lat: 25.2805, lng: 83.0067, address: 'Assi', rating: 4.4, priceRange: '₹₹', phone: '+91-542-2366099', isOpen: true, description: 'Rooftop garden cafe', city: 'Varanasi', category: 'food', featured: false },
    { id: 'var22', name: 'Vishwanath Lane Market', type: 'market', lat: 25.3109, lng: 83.0107, address: 'Godowlia', rating: 4.1, priceRange: '₹₹', phone: '', isOpen: true, description: 'Temple street shopping', city: 'Varanasi', category: 'shopping', featured: true },
    { id: 'var23', name: 'Banaras Silk Emporium', type: 'boutique', lat: 25.3109, lng: 83.0107, address: 'Kabir Chaura', rating: 4.3, priceRange: '₹₹₹₹', phone: '+91-542-2220089', isOpen: true, description: 'Authentic Banarasi silk', city: 'Varanasi', category: 'shopping', featured: true },
    { id: 'var24', name: 'Thatheri Bazaar', type: 'market', lat: 25.3109, lng: 83.0107, address: 'Old City', rating: 4.0, priceRange: '₹₹', phone: '', isOpen: true, description: 'Brass and copper market', city: 'Varanasi', category: 'shopping', featured: false },
    { id: 'var25', name: 'Varuna River Bridge', type: 'monument', lat: 25.3176, lng: 83.0739, address: 'Varuna', rating: 4.1, priceRange: 'Free', phone: '', isOpen: true, description: 'Scenic river crossing', city: 'Varanasi', category: 'attractions', featured: false },
    
    { id: 'u1', name: 'City Palace Udaipur', type: 'palace', lat: 24.5764, lng: 73.6833, address: 'City Palace Complex', rating: 4.6, priceRange: '₹300', phone: '+91-294-2528016', isOpen: true, description: 'Majestic lakeside palace', city: 'Udaipur', category: 'attractions', featured: true },
    { id: 'u2', name: 'Lake Pichola', type: 'park', lat: 24.5764, lng: 73.6791, address: 'Pichola', rating: 4.7, priceRange: '₹400', phone: '', isOpen: true, description: 'Scenic boat rides', city: 'Udaipur', category: 'attractions', featured: true },
    { id: 'u3', name: 'Jag Mandir', type: 'palace', lat: 24.5708, lng: 73.6810, address: 'Lake Pichola', rating: 4.5, priceRange: '₹450', phone: '', isOpen: true, description: 'Island palace', city: 'Udaipur', category: 'attractions', featured: true },
    { id: 'u4', name: 'Saheliyon ki Bari', type: 'park', lat: 24.5930, lng: 73.6863, address: 'Saheli Marg', rating: 4.3, priceRange: '₹50', phone: '', isOpen: true, description: 'Garden of maidens', city: 'Udaipur', category: 'attractions', featured: false },
    { id: 'u5', name: 'Fateh Sagar Lake', type: 'park', lat: 24.5906, lng: 73.6773, address: 'Fateh Sagar', rating: 4.4, priceRange: '₹30', phone: '', isOpen: true, description: 'Artificial lake with islands', city: 'Udaipur', category: 'attractions', featured: false },
    { id: 'u6', name: 'Monsoon Palace', type: 'palace', lat: 24.5907, lng: 73.6473, address: 'Sajjangarh', rating: 4.4, priceRange: '₹80', phone: '', isOpen: true, description: 'Hilltop sunset palace', city: 'Udaipur', category: 'attractions', featured: true },
    { id: 'u7', name: 'Jagdish Temple', type: 'temple', lat: 24.5796, lng: 73.6836, address: 'Jagdish Chowk', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Vishnu temple in city center', city: 'Udaipur', category: 'attractions', featured: false },
    { id: 'u8', name: 'Bagore ki Haveli', type: 'museum', lat: 24.5806, lng: 73.6820, address: 'Gangaur Ghat', rating: 4.4, priceRange: '₹100', phone: '+91-294-2420525', isOpen: true, description: 'Cultural museum with dance show', city: 'Udaipur', category: 'attractions', featured: false },
    { id: 'u9', name: 'Hathi Pol Bazaar', type: 'market', lat: 24.5806, lng: 73.6836, address: 'Old City', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Traditional market', city: 'Udaipur', category: 'shopping', featured: false },
    { id: 'u10', name: 'Taj Lake Palace', type: 'luxury-hotel', lat: 24.5743, lng: 73.6795, address: 'Lake Pichola', rating: 4.9, priceRange: '₹45,000+', phone: '+91-294-2428800', isOpen: true, description: 'Iconic floating palace hotel', city: 'Udaipur', category: 'hotels', featured: true },
    { id: 'u11', name: 'The Oberoi Udaivilas', type: 'luxury-hotel', lat: 24.5764, lng: 73.6756, address: 'Haridasji ki Magri', rating: 4.9, priceRange: '₹50,000+', phone: '+91-294-2433300', isOpen: true, description: 'Ultra-luxury lakeside resort', city: 'Udaipur', category: 'hotels', featured: true },
    { id: 'u12', name: 'Ambrai Restaurant', type: 'fine-dining', lat: 24.5806, lng: 73.6820, address: 'Hanuman Ghat', rating: 4.6, priceRange: '₹₹₹', phone: '+91-294-2431085', isOpen: true, description: 'Lakeside dining with palace view', city: 'Udaipur', category: 'food', featured: true },
    { id: 'u13', name: 'Shilpgram', type: 'market', lat: 24.5568, lng: 73.6541, address: 'Havala Village', rating: 4.2, priceRange: '₹50', phone: '', isOpen: true, description: 'Rural arts and crafts', city: 'Udaipur', category: 'shopping', featured: false },
    { id: 'u14', name: 'Vintage Car Museum', type: 'museum', lat: 24.5907, lng: 73.6832, address: 'Gulab Bagh', rating: 4.3, priceRange: '₹150', phone: '+91-294-2528016', isOpen: true, description: 'Royal car collection', city: 'Udaipur', category: 'attractions', featured: false },
    { id: 'u15', name: 'Eklingji Temple', type: 'temple', lat: 24.6364, lng: 73.6447, address: 'Eklingji', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Ancient Shiva temple complex', city: 'Udaipur', category: 'attractions', featured: false },
    // More UDAIPUR - Hotels, Food, Shopping
    { id: 'udp16', name: 'Leela Palace Udaipur', type: 'luxury-hotel', lat: 24.5743, lng: 73.6795, address: 'Lake Pichola', rating: 4.8, priceRange: '₹38,000+', phone: '+91-294-6391818', isOpen: true, description: 'Island palace luxury hotel', city: 'Udaipur', category: 'hotels', featured: true },
    { id: 'udp17', name: 'Radisson Blu', type: 'luxury-hotel', lat: 24.5764, lng: 73.6833, address: 'Rani Road', rating: 4.5, priceRange: '₹10,000+', phone: '+91-294-3001111', isOpen: true, description: 'Modern lakeside hotel', city: 'Udaipur', category: 'hotels', featured: false },
    { id: 'udp18', name: 'Trident Udaipur', type: 'luxury-hotel', lat: 24.5764, lng: 73.6791, address: 'Haridasji ki Magri', rating: 4.5, priceRange: '₹12,000+', phone: '+91-294-2432200', isOpen: true, description: 'Lake Palace view hotel', city: 'Udaipur', category: 'hotels', featured: false },
    { id: 'udp19', name: 'Upre by 1559 AD', type: 'fine-dining', lat: 24.5806, lng: 73.6820, address: 'Hanuman Ghat', rating: 4.7, priceRange: '₹₹₹₹', phone: '+91-294-2431199', isOpen: true, description: 'Royal rooftop dining', city: 'Udaipur', category: 'food', featured: true },
    { id: 'udp20', name: 'Charcoal by Carlsson', type: 'fine-dining', lat: 24.5806, lng: 73.6820, address: 'Hanuman Ghat', rating: 4.5, priceRange: '₹₹₹₹', phone: '+91-294-2431199', isOpen: true, description: 'BBQ with lake view', city: 'Udaipur', category: 'food', featured: false },
    { id: 'udp21', name: 'Jheel\'s Ginger Coffee Bar', type: 'cafe', lat: 24.5806, lng: 73.6820, address: 'Gangaur Ghat', rating: 4.4, priceRange: '₹₹', phone: '+91-294-2431699', isOpen: true, description: 'Lakeside coffee shop', city: 'Udaipur', category: 'food', featured: false },
    { id: 'udp22', name: 'Bapu Bazaar Udaipur', type: 'market', lat: 24.5806, lng: 73.6836, address: 'Old City', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Textiles and handicrafts', city: 'Udaipur', category: 'shopping', featured: true },
    { id: 'udp23', name: 'Bada Bazaar', type: 'market', lat: 24.5806, lng: 73.6836, address: 'City Palace Road', rating: 4.1, priceRange: '₹₹', phone: '', isOpen: true, description: 'Jewelry and antiques', city: 'Udaipur', category: 'shopping', featured: false },
    { id: 'udp24', name: 'Celebration Mall', type: 'mall', lat: 24.5906, lng: 73.6773, address: 'Rani Road', rating: 4.2, priceRange: '₹₹₹', phone: '+91-294-3014000', isOpen: true, description: 'Modern shopping center', city: 'Udaipur', category: 'shopping', featured: false },
    { id: 'udp25', name: 'Rang De Rajasthan', type: 'boutique', lat: 24.5806, lng: 73.6820, address: 'Gangaur Ghat', rating: 4.3, priceRange: '₹₹₹', phone: '+91-294-2428419', isOpen: true, description: 'Rajasthani handicrafts', city: 'Udaipur', category: 'shopping', featured: true },
    
    { id: 'man1', name: 'Solang Valley', type: 'mountain', lat: 32.3191, lng: 77.1542, address: 'Solang', rating: 4.5, priceRange: '₹500', phone: '', isOpen: true, description: 'Adventure sports valley', city: 'Manali', category: 'attractions', featured: true },
    { id: 'man2', name: 'Rohtang Pass', type: 'mountain', lat: 32.3726, lng: 77.2493, address: 'Rohtang', rating: 4.6, priceRange: '₹50', phone: '', isOpen: true, description: 'High mountain pass with snow', city: 'Manali', category: 'attractions', featured: true },
    { id: 'man3', name: 'Hadimba Temple', type: 'temple', lat: 32.2396, lng: 77.1887, address: 'Dungri', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Ancient wooden temple in forest', city: 'Manali', category: 'attractions', featured: true },
    { id: 'man4', name: 'Vashisht Hot Springs', type: 'park', lat: 32.2500, lng: 77.1825, address: 'Vashisht', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'Natural hot water springs', city: 'Manali', category: 'attractions', featured: false },
    { id: 'man5', name: 'Old Manali', type: 'market', lat: 32.2528, lng: 77.1872, address: 'Old Manali', rating: 4.4, priceRange: '₹₹', phone: '', isOpen: true, description: 'Hippie cafes and shops', city: 'Manali', category: 'shopping', featured: true },
    { id: 'man6', name: 'Manu Temple', type: 'temple', lat: 32.2528, lng: 77.1872, address: 'Old Manali', rating: 4.2, priceRange: 'Free', phone: '', isOpen: true, description: 'Sage Manu temple', city: 'Manali', category: 'attractions', featured: false },
    { id: 'man7', name: 'Mall Road Manali', type: 'market', lat: 32.2396, lng: 77.1887, address: 'Mall Road', rating: 4.3, priceRange: '₹₹₹', phone: '', isOpen: true, description: 'Main shopping street', city: 'Manali', category: 'shopping', featured: false },
    { id: 'man8', name: 'Jogini Waterfall', type: 'mountain', lat: 32.2578, lng: 77.1933, address: 'Vashisht', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'Scenic hiking trail waterfall', city: 'Manali', category: 'attractions', featured: false },
    { id: 'man9', name: 'The Himalayan', type: 'luxury-hotel', lat: 32.2396, lng: 77.1887, address: 'Hadimba Road', rating: 4.5, priceRange: '₹10,000+', phone: '+91-1902-253300', isOpen: true, description: 'Luxury mountain resort', city: 'Manali', category: 'hotels', featured: true },
    { id: 'man10', name: 'Casa Bella Vista', type: 'cafe', lat: 32.2528, lng: 77.1872, address: 'Old Manali', rating: 4.5, priceRange: '₹₹', phone: '', isOpen: true, description: 'Italian cafe with valley view', city: 'Manali', category: 'food', featured: true },
    { id: 'man11', name: 'Atal Tunnel', type: 'mountain', lat: 32.3773, lng: 77.1449, address: 'South Portal', rating: 4.6, priceRange: 'Free', phone: '', isOpen: true, description: 'Worlds longest highway tunnel', city: 'Manali', category: 'attractions', featured: true },
    { id: 'man12', name: 'Great Himalayan National Park', type: 'park', lat: 31.6943, lng: 77.3767, address: 'Kullu', rating: 4.5, priceRange: '₹400', phone: '', isOpen: true, description: 'UNESCO World Heritage park', city: 'Manali', category: 'attractions', featured: false },
    { id: 'man13', name: 'Tibetan Monastery', type: 'temple', lat: 32.2396, lng: 77.1887, address: 'Manali Bazaar', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'Peaceful Buddhist monastery', city: 'Manali', category: 'attractions', featured: false },
    { id: 'man14', name: 'Nehru Kund', type: 'park', lat: 32.2700, lng: 77.1600, address: 'Manali-Keylong Highway', rating: 4.1, priceRange: 'Free', phone: '', isOpen: true, description: 'Natural spring', city: 'Manali', category: 'attractions', featured: false },
    { id: 'man15', name: 'Cafe 1947', type: 'cafe', lat: 32.2528, lng: 77.1872, address: 'Old Manali', rating: 4.4, priceRange: '₹₹', phone: '', isOpen: true, description: 'Riverside cafe', city: 'Manali', category: 'food', featured: false },
    // More MANALI - Hotels, Food, Shopping
    { id: 'man16', name: 'Manu Allaya Resort', type: 'resort', lat: 32.2396, lng: 77.1887, address: 'Log Huts Area', rating: 4.5, priceRange: '₹12,000+', phone: '+91-1902-252252', isOpen: true, description: 'Luxury spa resort', city: 'Manali', category: 'hotels', featured: true },
    { id: 'man17', name: 'Span Resort', type: 'resort', lat: 32.2396, lng: 77.1887, address: 'Left Bank, Manali', rating: 4.4, priceRange: '₹8,000+', phone: '+91-1902-250041', isOpen: true, description: 'Riverside resort', city: 'Manali', category: 'hotels', featured: false },
    { id: 'man18', name: 'Johnson\'s Cafe', type: 'cafe', lat: 32.2528, lng: 77.1872, address: 'Circuit House Road', rating: 4.5, priceRange: '₹₹', phone: '+91-1902-252352', isOpen: true, description: 'Famous trout and live music', city: 'Manali', category: 'food', featured: true },
    { id: 'man19', name: 'Drifters\' Inn & Cafe', type: 'cafe', lat: 32.2528, lng: 77.1872, address: 'Old Manali', rating: 4.4, priceRange: '₹₹', phone: '', isOpen: true, description: 'Backpacker favorite', city: 'Manali', category: 'food', featured: false },
    { id: 'man20', name: 'The Lazy Dog', type: 'cafe', lat: 32.2528, lng: 77.1872, address: 'Old Manali', rating: 4.5, priceRange: '₹₹₹', phone: '+91-1902-251201', isOpen: true, description: 'River view lounge', city: 'Manali', category: 'food', featured: true },
    { id: 'man21', name: 'Tibetan Market', type: 'market', lat: 32.2396, lng: 77.1887, address: 'Mall Road', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Woolen clothes and handicrafts', city: 'Manali', category: 'shopping', featured: true },
    { id: 'man22', name: 'Manali Market', type: 'market', lat: 32.2396, lng: 77.1887, address: 'Mall Road', rating: 4.1, priceRange: '₹₹', phone: '', isOpen: true, description: 'Local shopping street', city: 'Manali', category: 'shopping', featured: false },
    { id: 'man23', name: 'Himachal Emporium', type: 'boutique', lat: 32.2396, lng: 77.1887, address: 'The Mall', rating: 4.2, priceRange: '₹₹₹', phone: '', isOpen: true, description: 'Himachali shawls and handicrafts', city: 'Manali', category: 'shopping', featured: false },
    { id: 'man24', name: 'Renaissance Manali', type: 'fine-dining', lat: 32.2396, lng: 77.1887, address: 'Aleo', rating: 4.4, priceRange: '₹₹₹₹', phone: '+91-1902-251200', isOpen: true, description: 'Fine dining with mountain views', city: 'Manali', category: 'food', featured: false },
    { id: 'man25', name: 'Chopsticks', type: 'street-food', lat: 32.2396, lng: 77.1887, address: 'The Mall', rating: 4.3, priceRange: '₹₹', phone: '+91-1902-252618', isOpen: true, description: 'Tibetan and Chinese food', city: 'Manali', category: 'food', featured: false },
    
    { id: 'r1', name: 'Laxman Jhula', type: 'monument', lat: 30.1165, lng: 78.3198, address: 'Tapovan', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Iconic suspension bridge', city: 'Rishikesh', category: 'attractions', featured: true },
    { id: 'r2', name: 'Ram Jhula', type: 'monument', lat: 30.1026, lng: 78.3004, address: 'Swargashram', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Sacred bridge over Ganga', city: 'Rishikesh', category: 'attractions', featured: true },
    { id: 'r3', name: 'Beatles Ashram', type: 'temple', lat: 30.1219, lng: 78.3053, address: 'Swargashram', rating: 4.5, priceRange: '₹150', phone: '', isOpen: true, description: 'Where Beatles learned meditation', city: 'Rishikesh', category: 'attractions', featured: true },
    { id: 'r4', name: 'Triveni Ghat', type: 'temple', lat: 30.0993, lng: 78.2945, address: 'Triveni Road', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'Evening aarti on Ganga', city: 'Rishikesh', category: 'attractions', featured: true },
    { id: 'r5', name: 'Neer Garh Waterfall', type: 'mountain', lat: 30.0750, lng: 78.3250, address: 'Neelkanth Road', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'Hidden jungle waterfall', city: 'Rishikesh', category: 'attractions', featured: false },
    { id: 'r6', name: 'Parmarth Niketan', type: 'temple', lat: 30.1165, lng: 78.3198, address: 'Swargashram', rating: 4.6, priceRange: 'Free', phone: '+91-135-2440077', isOpen: true, description: 'Largest ashram in Rishikesh', city: 'Rishikesh', category: 'attractions', featured: true },
    { id: 'r7', name: 'River Rafting', type: 'park', lat: 30.0869, lng: 78.2676, address: 'Marine Drive', rating: 4.7, priceRange: '₹1,500', phone: '', isOpen: true, description: 'White water rafting adventure', city: 'Rishikesh', category: 'attractions', featured: true },
    { id: 'r8', name: 'Cafe de Goa', type: 'cafe', lat: 30.1165, lng: 78.3198, address: 'Tapovan', rating: 4.4, priceRange: '₹₹', phone: '', isOpen: true, description: 'Riverside Israeli cafe', city: 'Rishikesh', category: 'food', featured: true },
    { id: 'r9', name: 'Ananda in the Himalayas', type: 'resort', lat: 30.1428, lng: 78.2983, address: 'Narendra Nagar', rating: 4.8, priceRange: '₹35,000+', phone: '+91-1378-227500', isOpen: true, description: 'Luxury wellness retreat', city: 'Rishikesh', category: 'hotels', featured: true },
    { id: 'r10', name: 'Neelkanth Mahadev Temple', type: 'temple', lat: 30.1697, lng: 78.3908, address: 'Pauri', rating: 4.5, priceRange: 'Free', phone: '', isOpen: true, description: 'Ancient Shiva temple in mountains', city: 'Rishikesh', category: 'attractions', featured: false },
    { id: 'r11', name: 'Shivpuri', type: 'park', lat: 30.1525, lng: 78.3658, address: 'Shivpuri', rating: 4.4, priceRange: '₹2,000', phone: '', isOpen: true, description: 'Camping and rafting hub', city: 'Rishikesh', category: 'attractions', featured: false },
    { id: 'r12', name: 'Chotiwala Restaurant', type: 'street-food', lat: 30.1165, lng: 78.3198, address: 'Swargashram', rating: 4.2, priceRange: '₹₹', phone: '+91-135-2430071', isOpen: true, description: 'Famous vegetarian thali', city: 'Rishikesh', category: 'food', featured: true },
    { id: 'r13', name: 'Kunjapuri Temple', type: 'temple', lat: 30.1975, lng: 78.4200, address: 'Kunjapuri', rating: 4.4, priceRange: 'Free', phone: '', isOpen: true, description: 'Sunrise hilltop temple', city: 'Rishikesh', category: 'attractions', featured: false },
    { id: 'r14', name: 'Yoga Niketan', type: 'temple', lat: 30.1165, lng: 78.3198, address: 'Muni Ki Reti', rating: 4.3, priceRange: 'Free', phone: '', isOpen: true, description: 'Traditional yoga ashram', city: 'Rishikesh', category: 'attractions', featured: false },
    { id: 'r15', name: 'Little Buddha Cafe', type: 'cafe', lat: 30.1165, lng: 78.3198, address: 'Tapovan', rating: 4.5, priceRange: '₹₹', phone: '', isOpen: true, description: 'Rooftop river view cafe', city: 'Rishikesh', category: 'food', featured: false },
    // More RISHIKESH - Hotels, Food, Shopping
    { id: 'rsh16', name: 'Aloha on the Ganges', type: 'resort', lat: 30.0869, lng: 78.2676, address: 'Badrinath Road', rating: 4.6, priceRange: '₹12,000+', phone: '+91-135-2440641', isOpen: true, description: 'Luxury riverside resort', city: 'Rishikesh', category: 'hotels', featured: true },
    { id: 'rsh17', name: 'Atali Ganga', type: 'resort', lat: 30.1525, lng: 78.3658, address: 'Shivpuri', rating: 4.7, priceRange: '₹15,000+', phone: '+91-135-2440641', isOpen: true, description: 'Adventure luxury camp', city: 'Rishikesh', category: 'hotels', featured: true },
    { id: 'rsh18', name: 'Divine Resort', type: 'resort', lat: 30.1165, lng: 78.3198, address: 'Tapovan', rating: 4.4, priceRange: '₹6,000+', phone: '+91-135-2433001', isOpen: true, description: 'Ganga-side budget resort', city: 'Rishikesh', category: 'hotels', featured: false },
    { id: 'rsh19', name: 'Ganga Beach Restaurant', type: 'fine-dining', lat: 30.1165, lng: 78.3198, address: 'Laxman Jhula', rating: 4.5, priceRange: '₹₹₹', phone: '+91-135-2431242', isOpen: true, description: 'Organic riverside dining', city: 'Rishikesh', category: 'food', featured: true },
    { id: 'rsh20', name: 'The Sitting Elephant', type: 'cafe', lat: 30.1165, lng: 78.3198, address: 'Laxman Jhula', rating: 4.5, priceRange: '₹₹', phone: '', isOpen: true, description: 'Rooftop garden cafe', city: 'Rishikesh', category: 'food', featured: true },
    { id: 'rsh21', name: 'Ramana\'s Garden Cafe', type: 'cafe', lat: 30.1165, lng: 78.3198, address: 'Laxman Jhula', rating: 4.4, priceRange: '₹₹', phone: '+91-135-2433190', isOpen: true, description: 'Organic cafe and bakery', city: 'Rishikesh', category: 'food', featured: false },
    { id: 'rsh22', name: 'Madras Cafe', type: 'street-food', lat: 30.1165, lng: 78.3198, address: 'Ram Jhula', rating: 4.4, priceRange: '₹', phone: '', isOpen: true, description: 'South Indian vegetarian', city: 'Rishikesh', category: 'food', featured: false },
    { id: 'rsh23', name: 'Laxman Jhula Market', type: 'market', lat: 30.1165, lng: 78.3198, address: 'Tapovan', rating: 4.1, priceRange: '₹₹', phone: '', isOpen: true, description: 'Spiritual books and yoga wear', city: 'Rishikesh', category: 'shopping', featured: true },
    { id: 'rsh24', name: 'Ram Jhula Market', type: 'market', lat: 30.1026, lng: 78.3004, address: 'Swargashram', rating: 4.0, priceRange: '₹₹', phone: '', isOpen: true, description: 'Ayurvedic products and handicrafts', city: 'Rishikesh', category: 'shopping', featured: false },
    { id: 'rsh25', name: 'Yoga Niketan Ashram Shop', type: 'boutique', lat: 30.1165, lng: 78.3198, address: 'Muni Ki Reti', rating: 4.2, priceRange: '₹₹', phone: '', isOpen: true, description: 'Yoga mats and spiritual items', city: 'Rishikesh', category: 'shopping', featured: false },
  ];

  const getLocationDetails = (type: LocationType) => {
    const details: Record<LocationType, { emoji: string; color: string; label: string }> = {
      'luxury-hotel': { emoji: '🏨', color: '#8B5CF6', label: 'Luxury Hotel' },
      'budget-hotel': { emoji: '🏨', color: '#6366F1', label: 'Budget Hotel' },
      'resort': { emoji: '🏖️', color: '#EC4899', label: 'Resort' },
      'fine-dining': { emoji: '🍽️', color: '#F59E0B', label: 'Fine Dining' },
      'street-food': { emoji: '🍜', color: '#FBBF24', label: 'Street Food' },
      'cafe': { emoji: '☕', color: '#A78BFA', label: 'Cafe' },
      'bar': { emoji: '🍹', color: '#F472B6', label: 'Bar' },
      'fort': { emoji: '🏰', color: '#DC2626', label: 'Fort' },
      'palace': { emoji: '👑', color: '#F59E0B', label: 'Palace' },
      'temple': { emoji: '🛕', color: '#FF6B6B', label: 'Temple' },
      'mosque': { emoji: '🕌', color: '#4ECDC4', label: 'Mosque' },
      'church': { emoji: '⛪', color: '#95E1D3', label: 'Church' },
      'museum': { emoji: '🏛️', color: '#9B59B6', label: 'Museum' },
      'park': { emoji: '🌳', color: '#10B981', label: 'Park' },
      'beach': { emoji: '🏖️', color: '#3B82F6', label: 'Beach' },
      'mountain': { emoji: '⛰️', color: '#78909C', label: 'Mountain' },
      'monument': { emoji: '🗿', color: '#EF4444', label: 'Monument' },
      'mall': { emoji: '🛍️', color: '#A855F7', label: 'Mall' },
      'market': { emoji: '🏪', color: '#F97316', label: 'Market' },
      'boutique': { emoji: '👗', color: '#EC4899', label: 'Boutique' },
    };
    return details[type] || { emoji: '📍', color: '#6B7280', label: 'Location' };
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
    const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
      Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  };

  const getCompassDirection = (bearing: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  };

  const calculateTravelTime = (distance: number) => {
    const walkingSpeed = 5;
    const drivingSpeed = 40;
    const transitSpeed = 25;
    
    return {
      walking: `${Math.round((distance / walkingSpeed) * 60)} min`,
      driving: `${Math.round((distance / drivingSpeed) * 60)} min`,
      transit: `${Math.round((distance / transitSpeed) * 60)} min`,
    };
  };

  const filteredLocations = locations
    .filter(loc => loc.city === selectedCity)
    .filter(loc => selectedCategory === 'all' || loc.category === selectedCategory)
    .filter(loc => searchQuery === '' || 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map(loc => {
      if (userLocation) {
        const distance = calculateDistance(userLocation.lat, userLocation.lng, loc.lat, loc.lng);
        const bearing = calculateBearing(userLocation.lat, userLocation.lng, loc.lat, loc.lng);
        const travelTime = calculateTravelTime(distance);
        return { ...loc, distance, bearing, travelTime };
      }
      return loc;
    });

  useEffect(() => {
    // Initialize Leaflet map
    if (!mapContainerRef.current || leafletMapRef.current) return;

    // Initialize map centered on selected city
    const city = cities.find(c => c.name === selectedCity);
    if (!city) return;

    const map = L.map(mapContainerRef.current, {
      center: [city.lat, city.lng],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    leafletMapRef.current = map;

    // Initialize markers after a short delay to ensure map is ready
    setTimeout(() => {
      updateMarkers();
    }, 100);

    // Cleanup
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Update map view when city changes
    if (leafletMapRef.current) {
      const city = cities.find(c => c.name === selectedCity);
      if (city) {
        leafletMapRef.current.setView([city.lat, city.lng], 12);
      }
      updateMarkers();
    }
  }, [selectedCity, selectedCategory, searchQuery]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          toast.success('📍 Location detected!');
        },
        () => {
          toast.error('Unable to get your location');
        }
      );
    }
  };

  const updateMarkers = () => {
    if (!leafletMapRef.current) return;

    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    } else {
      markersLayerRef.current = L.layerGroup().addTo(leafletMapRef.current);
    }

    filteredLocations.forEach(location => {
      const details = getLocationDetails(location.type);
      
      // 🎯 MATHEMATICALLY PERFECT PIN - BOTTOM TIP = EXACT GPS LOCATION!
      const markerIcon = L.divIcon({
        className: 'custom-pin-marker',
        html: `
          <svg width="40" height="60" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
            ${showLabels ? `<text x="20" y="-5" text-anchor="middle" fill="${details.color}" font-size="11" font-weight="bold" stroke="white" stroke-width="3" paint-order="stroke">${location.name}</text>` : ''}
            <defs>
              <filter id="shadow-${location.id}">
                <feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.5"/>
              </filter>
            </defs>
            <g filter="url(#shadow-${location.id})">
              <!-- PERFECT TEARDROP: Circle at top + Sharp point EXACTLY at (20,60)! -->
              <path d="M 20,60 L 12,35 C 8,28 6,24 6,18 C 6,10 12,4 20,4 C 28,4 34,10 34,18 C 34,24 32,28 28,35 L 20,60 Z" 
                    fill="${details.color}" 
                    stroke="white" 
                    stroke-width="3"
                    stroke-linejoin="round"/>
              <!-- Inner glow -->
              <circle cx="20" cy="18" r="8" fill="white" fill-opacity="0.3"/>
              <!-- Emoji -->
              <text x="20" y="23" text-anchor="middle" font-size="16">${details.emoji}</text>
              <!-- Star badge -->
              ${location.featured ? `
                <circle cx="32" cy="8" r="6" fill="#FFD700" stroke="white" stroke-width="2"/>
                <text x="32" y="12" text-anchor="middle" font-size="9">⭐</text>
              ` : ''}
            </g>
          </svg>
        `,
        iconSize: [40, 60],
        iconAnchor: [20, 60],  // 🎯 X=20 (center), Y=60 (EXACT BOTTOM POINT!)
        popupAnchor: [0, -60],
      });

      const marker = L.marker([location.lat, location.lng], { icon: markerIcon })
        .addTo(markersLayerRef.current)
        .on('click', () => {
          setSelectedLocation(location);
          leafletMapRef.current.setView([location.lat, location.lng], 15);
        });

      marker.bindPopup(`
        <div style="text-align: center; min-width: 200px; padding: 10px;">
          <div style="font-size: 32px; margin-bottom: 8px;">${details.emoji}</div>
          <strong style="font-size: 16px; color: #1F2937;">${location.name}</strong><br>
          <span style="color: #6B7280; font-size: 12px;">${details.label}</span><br>
          <div style="margin-top: 10px; padding-top: 8px; border-top: 2px solid #E5E7EB;">
            <span style="color: #F59E0B; font-weight: bold;">⭐ ${location.rating}</span>
            <span style="margin: 0 8px; color: #D1D5DB;">•</span>
            <span style="color: #10B981; font-weight: bold;">${location.priceRange}</span>
          </div>
          ${location.distance ? `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
              <span style="color: #3B82F6; font-weight: bold;">📍 ${location.distance.toFixed(1)} km</span>
              <span style="margin: 0 6px; color: #D1D5DB;">•</span>
              <span style="color: #8B5CF6; font-weight: bold;">🧭 ${getCompassDirection(location.bearing || 0)}</span>
            </div>
          ` : ''}
          ${location.featured ? '<div style="margin-top: 8px; background: linear-gradient(135deg, #FEF3C7, #FDE68A); padding: 5px 8px; border-radius: 6px; font-size: 11px; color: #92400E; font-weight: 600;">⭐ Featured</div>' : ''}
        </div>
      `);
    });

    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="user-marker">
            <div class="user-pulse"></div>
            <div class="user-dot"></div>
            <div class="user-label">YOU</div>
          </div>
        `,
        iconSize: [60, 60],
        iconAnchor: [30, 30],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(markersLayerRef.current)
        .bindPopup('<strong style="font-size: 16px;">📍 Your Location</strong>');
    }

    drawRouteLine();
  };

  const drawRouteLine = () => {
    if (!leafletMapRef.current || !userLocation || !selectedLocation) return;

    if (routeLineRef.current) {
      leafletMapRef.current.removeLayer(routeLineRef.current);
    }

    const routeLine = L.polyline(
      [[userLocation.lat, userLocation.lng], [selectedLocation.lat, selectedLocation.lng]],
      {
        color: '#4285F4',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
      }
    ).addTo(leafletMapRef.current);

    const bounds = L.latLngBounds([
      [userLocation.lat, userLocation.lng],
      [selectedLocation.lat, selectedLocation.lng]
    ]);
    leafletMapRef.current.fitBounds(bounds, { padding: [50, 50] });

    routeLineRef.current = routeLine;

    if (selectedLocation.distance && selectedLocation.bearing !== undefined) {
      toast.success(
        `🧭 ${selectedLocation.distance.toFixed(1)} km ${getCompassDirection(selectedLocation.bearing)} • ${selectedLocation.travelTime?.driving || 'N/A'}`,
        { duration: 5000 }
      );
    }
  };

  useEffect(() => {
    if (leafletMapRef.current) {
      updateMarkers();
    }
  }, [userLocation, selectedLocation, filteredLocations, showLabels]);

  const handleShare = (location: Location) => {
    if (navigator.share) {
      navigator.share({
        title: location.name,
        text: `Check out ${location.name} in ${location.city}!`,
        url: `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`,
      });
    } else {
      navigator.clipboard.writeText(`${location.name}: https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`);
      toast.success('📋 Link copied to clipboard!');
    }
  };

  const categories = [
    { id: 'all', name: 'All', icon: Map, count: filteredLocations.length },
    { id: 'hotels', name: 'Hotels', icon: Hotel, count: locations.filter(l => l.category === 'hotels' && l.city === selectedCity).length },
    { id: 'food', name: 'Food', icon: Utensils, count: locations.filter(l => l.category === 'food' && l.city === selectedCity).length },
    { id: 'attractions', name: 'Attractions', icon: Camera, count: locations.filter(l => l.category === 'attractions' && l.city === selectedCity).length },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, count: locations.filter(l => l.category === 'shopping' && l.city === selectedCity).length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Leaflet CSS */}
      <style>{`
        .leaflet-pane,
        .leaflet-tile,
        .leaflet-marker-icon,
        .leaflet-marker-shadow,
        .leaflet-tile-container,
        .leaflet-pane > svg,
        .leaflet-pane > canvas,
        .leaflet-zoom-box,
        .leaflet-image-layer,
        .leaflet-layer {
          position: absolute;
          left: 0;
          top: 0;
        }
        .leaflet-container {
          overflow: hidden;
        }
        .leaflet-tile,
        .leaflet-marker-icon,
        .leaflet-marker-shadow {
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
          -webkit-user-drag: none;
        }
        .leaflet-tile::selection {
          background: transparent;
        }
        .leaflet-safari .leaflet-tile {
          image-rendering: -webkit-optimize-contrast;
        }
        .leaflet-safari .leaflet-tile-container {
          width: 1600px;
          height: 1600px;
          -webkit-transform-origin: 0 0;
        }
        .leaflet-marker-icon,
        .leaflet-marker-shadow {
          display: block;
        }
        .leaflet-container .leaflet-overlay-pane svg {
          max-width: none !important;
          max-height: none !important;
        }
        .leaflet-container .leaflet-marker-pane img,
        .leaflet-container .leaflet-shadow-pane img,
        .leaflet-container .leaflet-tile-pane img,
        .leaflet-container img.leaflet-image-layer,
        .leaflet-container .leaflet-tile {
          max-width: none !important;
          max-height: none !important;
          width: auto;
          padding: 0;
        }
        .leaflet-container img.leaflet-tile {
          mix-blend-mode: plus-lighter;
        }
        .leaflet-container.leaflet-touch-zoom {
          -ms-touch-action: pan-x pan-y;
          touch-action: pan-x pan-y;
        }
        .leaflet-container.leaflet-touch-drag {
          -ms-touch-action: pinch-zoom;
          touch-action: none;
          touch-action: pinch-zoom;
        }
        .leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {
          -ms-touch-action: none;
          touch-action: none;
        }
        .leaflet-container {
          -webkit-tap-highlight-color: transparent;
        }
        .leaflet-container a {
          -webkit-tap-highlight-color: rgba(51, 181, 229, 0.4);
        }
        .leaflet-tile {
          filter: inherit;
          visibility: hidden;
        }
        .leaflet-tile-loaded {
          visibility: inherit;
        }
        .leaflet-zoom-box {
          width: 0;
          height: 0;
          box-sizing: border-box;
          z-index: 800;
        }
        .leaflet-overlay-pane svg {
          -moz-user-select: none;
        }
        .leaflet-pane { z-index: 400; }
        .leaflet-tile-pane { z-index: 200; }
        .leaflet-overlay-pane { z-index: 400; }
        .leaflet-shadow-pane { z-index: 500; }
        .leaflet-marker-pane { z-index: 600; }
        .leaflet-tooltip-pane { z-index: 650; }
        .leaflet-popup-pane { z-index: 700; }
        .leaflet-map-pane canvas { z-index: 100; }
        .leaflet-map-pane svg { z-index: 200; }
        .leaflet-vml-shape {
          width: 1px;
          height: 1px;
        }
        .lvml {
          behavior: url(#default#VML);
          display: inline-block;
          position: absolute;
        }
        .leaflet-control {
          position: relative;
          z-index: 800;
          pointer-events: visiblePainted;
          pointer-events: auto;
        }
        .leaflet-top,
        .leaflet-bottom {
          position: absolute;
          z-index: 1000;
          pointer-events: none;
        }
        .leaflet-top {
          top: 0;
        }
        .leaflet-right {
          right: 0;
        }
        .leaflet-bottom {
          bottom: 0;
        }
        .leaflet-left {
          left: 0;
        }
        .leaflet-control {
          float: left;
          clear: both;
        }
        .leaflet-right .leaflet-control {
          float: right;
        }
        .leaflet-top .leaflet-control {
          margin-top: 10px;
        }
        .leaflet-bottom .leaflet-control {
          margin-bottom: 10px;
        }
        .leaflet-left .leaflet-control {
          margin-left: 10px;
        }
        .leaflet-right .leaflet-control {
          margin-right: 10px;
        }
      `}</style>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Map className="w-7 h-7" />
                  Interactive Maps
                </h1>
                <p className="text-blue-100 text-sm">Explore 300+ famous places across 11 cities</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  showLabels
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Layers className="w-4 h-4 inline mr-2" />
                {showLabels ? 'Labels ON' : 'Labels OFF'}
              </button>
              <button
                onClick={getUserLocation}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all"
              >
                <Locate className="w-4 h-4 inline mr-2" />
                My Location
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for places, attractions, hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-white/30 bg-white/95 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Cities */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Cities ({cities.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
                {cities.map(city => (
                  <button
                    key={city.name}
                    onClick={() => setSelectedCity(city.name)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      selectedCity === city.name
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{city.emoji}</span>
                    {city.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-600" />
                🔥 Categories & Filters
              </h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <cat.icon className="w-4 h-4" />
                      {cat.name}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      selectedCategory === cat.id 
                        ? 'bg-white/30' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-5 text-white">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                📊 Live Statistics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Places:</span>
                  <span className="font-bold text-lg">{filteredLocations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Featured:</span>
                  <span className="font-bold text-lg">{filteredLocations.filter(l => l.featured).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cities:</span>
                  <span className="font-bold text-lg">{cities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current City:</span>
                  <span className="font-bold text-yellow-300">{selectedCity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Filter:</span>
                  <span className="font-bold text-green-300 capitalize">{selectedCategory}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map + Details */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: '600px' }}>
              <div
                ref={mapContainerRef}
                style={{ height: '100%', width: '100%' }}
              />
            </div>

            {/* Selected Location Details */}
            {selectedLocation && (
              <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{getLocationDetails(selectedLocation.type).emoji}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedLocation.name}</h2>
                      <p className="text-gray-600 mb-2">{selectedLocation.address}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                          {getLocationDetails(selectedLocation.type).label}
                        </span>
                        {selectedLocation.featured && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-gray-700 mb-6">{selectedLocation.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl">
                    <div className="text-yellow-600 mb-1">
                      <Star className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{selectedLocation.rating}</div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                    <div className="text-green-600 mb-1">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">{selectedLocation.priceRange}</div>
                    <div className="text-xs text-gray-600">Price Range</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
                    <div className="text-blue-600 mb-1">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">{selectedLocation.isOpen ? 'Open' : 'Closed'}</div>
                    <div className="text-xs text-gray-600">Status</div>
                  </div>
                  {selectedLocation.distance && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                      <div className="text-purple-600 mb-1">
                        <Navigation className="w-5 h-5" />
                      </div>
                      <div className="text-lg font-bold text-gray-900">{selectedLocation.distance.toFixed(1)} km</div>
                      <div className="text-xs text-gray-600">{getCompassDirection(selectedLocation.bearing || 0)}</div>
                    </div>
                  )}
                </div>

                {selectedLocation.travelTime && (
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-blue-50 p-3 rounded-xl text-center">
                      <Footprints className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="font-bold text-gray-900 text-sm">{selectedLocation.travelTime.walking}</div>
                      <div className="text-xs text-gray-600">Walking</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-xl text-center">
                      <Car className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <div className="font-bold text-gray-900 text-sm">{selectedLocation.travelTime.driving}</div>
                      <div className="text-xs text-gray-600">Driving</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-xl text-center">
                      <Bus className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <div className="font-bold text-gray-900 text-sm">{selectedLocation.travelTime.transit}</div>
                      <div className="text-xs text-gray-600">Transit</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      window.location.href = `tel:${selectedLocation.phone}`;
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3.5 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                  <button
                    onClick={() => handleShare(selectedLocation)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3.5 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedLocation.lat},${selectedLocation.lng}`, '_blank')}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-3.5 rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open</span>
                  </button>
                </div>
              </div>
            )}

            {/* Places List - Shows Filtered Results */}
            <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-6 h-6 text-purple-600" />
                  {selectedCategory === 'all' ? 'All Places' : `${categories.find(c => c.id === selectedCategory)?.name}`} in {selectedCity}
                </h3>
                <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold">
                  {filteredLocations.length} Places
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredLocations.map(loc => {
                  const details = getLocationDetails(loc.type);
                  return (
                    <div
                      key={loc.id}
                      onClick={() => {
                        setSelectedLocation(loc);
                        if (leafletMapRef.current) {
                          leafletMapRef.current.setView([loc.lat, loc.lng], 15);
                        }
                      }}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        selectedLocation?.id === loc.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl transform scale-105'
                          : 'bg-gray-50 hover:bg-gray-100 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{details.emoji}</div>
                        <div className="flex-1">
                          <h4 className={`font-bold mb-1 ${selectedLocation?.id === loc.id ? 'text-white' : 'text-gray-900'}`}>
                            {loc.name}
                          </h4>
                          <p className={`text-sm mb-2 ${selectedLocation?.id === loc.id ? 'text-white/90' : 'text-gray-600'}`}>
                            {loc.address}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              selectedLocation?.id === loc.id
                                ? 'bg-white/30 text-white'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {details.label}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${
                              selectedLocation?.id === loc.id
                                ? 'bg-white/30 text-white'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              <Star className="w-3 h-3" />
                              {loc.rating}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              selectedLocation?.id === loc.id
                                ? 'bg-white/30 text-white'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {loc.priceRange}
                            </span>
                            {loc.featured && (
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                selectedLocation?.id === loc.id
                                  ? 'bg-yellow-400 text-yellow-900'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {filteredLocations.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No places found</h3>
                  <p className="text-gray-600">Try selecting a different category or city</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .leaflet-container { height: 100%; width: 100%; z-index: 1; }
        
        .custom-pin-marker { background: transparent !important; border: none !important; }
        
        .user-location-marker { background: transparent !important; border: none !important; }
        
        .user-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        
        .user-pulse {
          position: absolute;
          width: 50px;
          height: 50px;
          border: 4px solid #4285F4;
          border-radius: 50%;
          animation: pulse-animation 2s infinite;
          top: 5px;
        }
        
        @keyframes pulse-animation {
          0% { opacity: 1; transform: scale(0.5); }
          100% { opacity: 0; transform: scale(1.5); }
        }
        
        .user-dot {
          width: 20px;
          height: 20px;
          background: #4285F4;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(66, 133, 244, 0.6);
          position: relative;
          z-index: 10;
        }
        
        .user-label {
          background: white;
          color: #4285F4;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 800;
          margin-top: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          border: 2px solid #4285F4;
        }
      `}</style>
    </div>
  );
}

export default WorldClassGoogleMaps;