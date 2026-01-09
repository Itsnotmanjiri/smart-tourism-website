import { useState, useEffect } from 'react';
import { ArrowLeft, Utensils, MapPin, Building2, Star, Info } from 'lucide-react';
import { UltraAdvancedHotelSearch } from './UltraAdvancedHotelSearch';
import { ProperHotelBooking } from './ProperHotelBooking';
import { IntentBanner, UserIntent } from './ux/IntentBanner';
import { ExplainabilityPanel, ExplanationFactor } from './ux/ExplainabilityPanel';
import { TrustBadges, SentimentType } from './ux/TrustBadges';
import { TimeAndCrowdIndicators, CrowdLevel } from './ux/TimeAndCrowdIndicators';
import { FilterSummaryBar, ActiveFilter } from './ux/FilterSummaryBar';
import { EmptyState } from './ux/EmptyState';
import { PricingBreakdownModal } from './ux/PricingBreakdownModal';
import { WeatherWidget } from './WeatherWidget';
import { getHotelById, getHotelsByDestination } from '../data/massiveProperHotels';
import { Hotel } from '../data/massiveProperHotels';

interface FamousFood {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  rating?: number;
  sentiment?: SentimentType;
}

interface Spot {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  crowdLevel?: CrowdLevel;
  bestTimeToVisit?: string;
  distance?: string;
}

interface Hostel {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
  amenities: string[];
  description: string;
  available: boolean;
  distance?: string;
  sentiment?: SentimentType;
  sentimentScore?: number;
  isVerified?: boolean;
  reviewCount?: number;
}

// Enhanced mock data for Indian destinations
const indianDestinationData: Record<string, {
  foods: FamousFood[];
  spots: Spot[];
  hostels: Hostel[];
}> = {
  jaipur: {
    foods: [
      {
        id: 'dalbati',
        name: 'Dal Baati Churma',
        description: 'Traditional Rajasthani dish with lentils, baked wheat balls, and sweet crumble',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600',
        price: '₹250-400',
        rating: 4.7,
        sentiment: 'positive'
      },
      {
        id: 'ghewar',
        name: 'Ghewar',
        description: 'Disc-shaped sweet cake soaked in sugar syrup, a Rajasthani specialty',
        image: 'https://images.unsplash.com/photo-1606471191009-63d046f97f95?w=600',
        price: '₹150-300',
        rating: 4.5,
        sentiment: 'positive'
      }
    ],
    spots: [
      {
        id: 'hawamahal',
        name: 'Hawa Mahal',
        description: 'Iconic pink sandstone palace with intricate lattice windows',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600',
        category: 'Historical',
        crowdLevel: 'medium',
        bestTimeToVisit: 'Early morning (7-9 AM)',
        distance: '2.5 km from city center'
      },
      {
        id: 'amberfort',
        name: 'Amber Fort',
        description: 'Majestic hilltop fort with stunning architecture and elephant rides',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600',
        category: 'Fort',
        crowdLevel: 'high',
        bestTimeToVisit: 'Late afternoon (3-5 PM)',
        distance: '11 km from city center'
      }
    ],
    hostels: [
      {
        id: 'pinkpearl',
        name: 'Pink Pearl Heritage',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
        rating: 4.6,
        price: 1200,
        amenities: ['Free WiFi', 'Rooftop Restaurant', 'AC'],
        description: 'Heritage hotel in the heart of Pink City with traditional Rajasthani architecture',
        available: true,
        distance: '1.5 km from Hawa Mahal',
        sentiment: 'positive',
        sentimentScore: 0.85,
        isVerified: true,
        reviewCount: 342
      },
      {
        id: 'zosteljaipur',
        name: 'Zostel Jaipur',
        image: 'https://images.unsplash.com/photo-1631049307255-d3c7c90d0f31?w=600',
        rating: 4.4,
        price: 600,
        amenities: ['Free WiFi', 'Common Area', 'Cafe'],
        description: 'Budget-friendly hostel with vibrant backpacker community',
        available: true,
        distance: '3 km from city center',
        sentiment: 'positive',
        sentimentScore: 0.75,
        isVerified: true,
        reviewCount: 567
      },
      {
        id: 'maharaja',
        name: 'Maharaja Heritage',
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600',
        rating: 4.8,
        price: 2500,
        amenities: ['Pool', 'Free WiFi', 'Spa', 'Restaurant'],
        description: 'Luxury heritage property with royal hospitality',
        available: true,
        distance: '2 km from Amber Fort',
        sentiment: 'positive',
        sentimentScore: 0.92,
        isVerified: true,
        reviewCount: 189
      }
    ]
  },
  goa: {
    foods: [
      {
        id: 'fishcurry',
        name: 'Goan Fish Curry',
        description: 'Coconut-based spicy fish curry, a coastal delicacy',
        image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=600',
        price: '₹350-600',
        rating: 4.8,
        sentiment: 'positive'
      },
      {
        id: 'bebinca',
        name: 'Bebinca',
        description: 'Traditional Goan layered dessert made with coconut milk and eggs',
        image: 'https://images.unsplash.com/photo-1606471191009-63d046f97f95?w=600',
        price: '₹200-350',
        rating: 4.6,
        sentiment: 'positive'
      }
    ],
    spots: [
      {
        id: 'baga',
        name: 'Baga Beach',
        description: 'Popular beach with water sports and vibrant nightlife',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600',
        category: 'Beach',
        crowdLevel: 'high',
        bestTimeToVisit: 'Early morning or sunset',
        distance: '10 km from Panaji'
      },
      {
        id: 'oldgoa',
        name: 'Basilica of Bom Jesus',
        description: 'UNESCO World Heritage Site, historic church with Portuguese architecture',
        image: 'https://images.unsplash.com/photo-1580491934424-fb5cf383c53e?w=600',
        category: 'Religious',
        crowdLevel: 'low',
        bestTimeToVisit: 'Morning hours (9-11 AM)',
        distance: '9 km from Panaji'
      }
    ],
    hostels: [
      {
        id: 'beachshack',
        name: 'Seashell Beach Stay',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
        rating: 4.5,
        price: 1500,
        amenities: ['Beachfront', 'Free WiFi', 'Breakfast'],
        description: 'Cozy beach shack-style accommodation steps from the sea',
        available: true,
        distance: '50m from beach',
        sentiment: 'positive',
        sentimentScore: 0.80,
        isVerified: true,
        reviewCount: 423
      },
      {
        id: 'goahostel',
        name: 'Backpacker Panda Goa',
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600',
        rating: 4.3,
        price: 700,
        amenities: ['Pool', 'Free WiFi', 'Bar'],
        description: 'Social hostel with pool parties and beach proximity',
        available: true,
        distance: '500m from Baga Beach',
        sentiment: 'neutral',
        sentimentScore: 0.65,
        isVerified: true,
        reviewCount: 891
      }
    ]
  },
  varanasi: {
    foods: [
      {
        id: 'kachori',
        name: 'Kachori Sabzi',
        description: 'Deep-fried bread with spicy potato curry, a breakfast staple',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600',
        price: '₹80-150',
        rating: 4.7,
        sentiment: 'positive'
      },
      {
        id: 'malaiyo',
        name: 'Malaiyo',
        description: 'Seasonal winter dessert made with milk foam and saffron',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600',
        price: '₹100-200',
        rating: 4.9,
        sentiment: 'positive'
      }
    ],
    spots: [
      {
        id: 'dashashwamedh',
        name: 'Dashashwamedh Ghat',
        description: 'Main ghat on Ganges river, famous for evening Ganga Aarti ceremony',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600',
        category: 'Religious',
        crowdLevel: 'high',
        bestTimeToVisit: 'Evening Aarti (6-7 PM)',
        distance: 'Central Varanasi'
      },
      {
        id: 'sarnath',
        name: 'Sarnath',
        description: 'Buddhist pilgrimage site where Buddha gave his first sermon',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600',
        category: 'Historical',
        crowdLevel: 'medium',
        bestTimeToVisit: 'Morning (8-11 AM)',
        distance: '10 km from Varanasi'
      }
    ],
    hostels: [
      {
        id: 'gangesview',
        name: 'Ganges View Guesthouse',
        image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600',
        rating: 4.4,
        price: 800,
        amenities: ['River View', 'Free WiFi', 'Rooftop'],
        description: 'Traditional guesthouse overlooking the sacred Ganges',
        available: true,
        distance: '100m from Dashashwamedh Ghat',
        sentiment: 'positive',
        sentimentScore: 0.78,
        isVerified: true,
        reviewCount: 234
      },
      {
        id: 'hostellavie',
        name: 'Hostel Lavie',
        image: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=600',
        rating: 4.6,
        price: 500,
        amenities: ['Free WiFi', 'Common Kitchen', 'Library'],
        description: 'Peaceful hostel in Assi Ghat area with spiritual ambiance',
        available: true,
        distance: '5 km from main ghats',
        sentiment: 'positive',
        sentimentScore: 0.82,
        isVerified: true,
        reviewCount: 456
      }
    ]
  },
  delhi: {
    foods: [
      {
        id: 'chole',
        name: 'Chole Bhature',
        description: 'Spicy chickpea curry with deep-fried bread, Delhi\'s iconic breakfast',
        image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600',
        price: '₹120-250',
        rating: 4.8,
        sentiment: 'positive'
      },
      {
        id: 'parathas',
        name: 'Stuffed Parathas',
        description: 'Flatbread stuffed with various fillings from Paranthe Wali Gali',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600',
        price: '₹150-300',
        rating: 4.7,
        sentiment: 'positive'
      },
      {
        id: 'kebab',
        name: 'Tunday Kababi',
        description: 'Melt-in-mouth mutton kebabs from the famous Old Delhi joints',
        image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600',
        price: '₹300-500',
        rating: 4.9,
        sentiment: 'positive'
      }
    ],
    spots: [
      {
        id: 'redfort',
        name: 'Red Fort',
        description: 'Historic Mughal fortress and UNESCO World Heritage Site',
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600',
        category: 'Historical',
        crowdLevel: 'high',
        bestTimeToVisit: 'Early morning (9-11 AM)',
        distance: 'Old Delhi'
      },
      {
        id: 'indigate',
        name: 'India Gate',
        description: 'War memorial and iconic landmark in the heart of New Delhi',
        image: 'https://images.unsplash.com/photo-1569140394-c01db6bfef9e?w=600',
        category: 'Monument',
        crowdLevel: 'medium',
        bestTimeToVisit: 'Evening (5-7 PM)',
        distance: 'Central Delhi'
      },
      {
        id: 'lotus',
        name: 'Lotus Temple',
        description: 'Stunning flower-shaped Bahá\'í House of Worship',
        image: 'https://images.unsplash.com/photo-1605649186962-ba96fc00062e?w=600',
        category: 'Religious',
        crowdLevel: 'medium',
        bestTimeToVisit: 'Morning (9-12 AM)',
        distance: '15 km from city center'
      }
    ],
    hostels: [
      {
        id: 'delhihostel',
        name: 'Madpackers Delhi',
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600',
        rating: 4.5,
        price: 800,
        amenities: ['Free WiFi', 'Common Area', 'Cafe', 'AC'],
        description: 'Social hostel in Paharganj with rooftop hangout area',
        available: true,
        distance: '2 km from New Delhi Railway Station',
        sentiment: 'positive',
        sentimentScore: 0.80,
        isVerified: true,
        reviewCount: 678
      },
      {
        id: 'hosteldelhi',
        name: 'Zostel Delhi',
        image: 'https://images.unsplash.com/photo-1631049307255-d3c7c90d0f31?w=600',
        rating: 4.4,
        price: 700,
        amenities: ['Free WiFi', 'Cafe', 'Events'],
        description: 'Backpacker paradise near historical monuments',
        available: true,
        distance: '3 km from Red Fort',
        sentiment: 'positive',
        sentimentScore: 0.75,
        isVerified: true,
        reviewCount: 892
      }
    ]
  },
  mumbai: {
    foods: [
      {
        id: 'vadapav',
        name: 'Vada Pav',
        description: 'Mumbai\'s iconic street food - spicy potato fritter in a bun',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600',
        price: '₹20-50',
        rating: 4.9,
        sentiment: 'positive'
      },
      {
        id: 'pavbhaji',
        name: 'Pav Bhaji',
        description: 'Spicy mixed vegetable curry served with buttered bread',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600',
        price: '₹100-200',
        rating: 4.8,
        sentiment: 'positive'
      },
      {
        id: 'bhelpuri',
        name: 'Bhel Puri',
        description: 'Tangy puffed rice salad from Chowpatty Beach',
        image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600',
        price: '₹50-100',
        rating: 4.7,
        sentiment: 'positive'
      }
    ],
    spots: [
      {
        id: 'gateway',
        name: 'Gateway of India',
        description: 'Iconic Mumbai landmark overlooking the Arabian Sea',
        image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600',
        category: 'Monument',
        crowdLevel: 'high',
        bestTimeToVisit: 'Early morning or evening',
        distance: 'Colaba, South Mumbai'
      },
      {
        id: 'marinedrive',
        name: 'Marine Drive',
        description: 'Scenic promenade known as the Queen\'s Necklace',
        image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=600',
        category: 'Scenic',
        crowdLevel: 'medium',
        bestTimeToVisit: 'Sunset (6-8 PM)',
        distance: 'South Mumbai'
      }
    ],
    hostels: [
      {
        id: 'mumbaihostel',
        name: 'Backpacker Panda Mumbai',
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600',
        rating: 4.6,
        price: 1200,
        amenities: ['Free WiFi', 'Cafe', 'AC', 'Common Area'],
        description: 'Modern hostel in Andheri with easy airport access',
        available: true,
        distance: '5 km from Mumbai Airport',
        sentiment: 'positive',
        sentimentScore: 0.83,
        isVerified: true,
        reviewCount: 543
      },
      {
        id: 'zostelmumbai',
        name: 'Zostel Mumbai',
        image: 'https://images.unsplash.com/photo-1631049307255-d3c7c90d0f31?w=600',
        rating: 4.5,
        price: 1000,
        amenities: ['Free WiFi', 'Rooftop', 'Events'],
        description: 'Social hostel near Gateway of India',
        available: true,
        distance: '1 km from Gateway of India',
        sentiment: 'positive',
        sentimentScore: 0.79,
        isVerified: true,
        reviewCount: 721
      }
    ]
  },
  bangalore: {
    foods: [
      {
        id: 'masaladosa',
        name: 'Masala Dosa',
        description: 'Crispy rice crepe with spiced potato filling, a South Indian staple',
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600',
        price: '₹80-150',
        rating: 4.8,
        sentiment: 'positive'
      },
      {
        id: 'filtercoffee',
        name: 'Filter Coffee',
        description: 'Authentic South Indian filter coffee, Bangalore\'s signature beverage',
        image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600',
        price: '₹40-80',
        rating: 4.9,
        sentiment: 'positive'
      },
      {
        id: 'biryani',
        name: 'Meghana Biryani',
        description: 'Aromatic biryani from the famous Meghana Foods chain',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
        price: '₹250-400',
        rating: 4.7,
        sentiment: 'positive'
      }
    ],
    spots: [
      {
        id: 'lalbagh',
        name: 'Lalbagh Botanical Garden',
        description: 'Historic 240-acre botanical garden with diverse flora',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600',
        category: 'Garden',
        crowdLevel: 'low',
        bestTimeToVisit: 'Early morning (6-9 AM)',
        distance: 'South Bangalore'
      },
      {
        id: 'palace',
        name: 'Bangalore Palace',
        description: 'Tudor-style palace with beautiful gardens and architecture',
        image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600',
        category: 'Historical',
        crowdLevel: 'medium',
        bestTimeToVisit: 'Morning (10-12 AM)',
        distance: 'Central Bangalore'
      }
    ],
    hostels: [
      {
        id: 'blrhostel',
        name: 'Zostel Bangalore',
        image: 'https://images.unsplash.com/photo-1631049307255-d3c7c90d0f31?w=600',
        rating: 4.6,
        price: 900,
        amenities: ['Free WiFi', 'Cafe', 'Common Area', 'Events'],
        description: 'Vibrant hostel in Koramangala with tech-savvy crowd',
        available: true,
        distance: '8 km from city center',
        sentiment: 'positive',
        sentimentScore: 0.84,
        isVerified: true,
        reviewCount: 612
      },
      {
        id: 'woodstockblr',
        name: 'Woodstock Hostel',
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600',
        rating: 4.5,
        price: 800,
        amenities: ['Free WiFi', 'Garden', 'Music'],
        description: 'Cozy hostel with music lounge and garden area',
        available: true,
        distance: '6 km from MG Road',
        sentiment: 'positive',
        sentimentScore: 0.78,
        isVerified: true,
        reviewCount: 487
      }
    ]
  }
};

interface EnhancedDestinationDetailProps {
  destinationId: string;
  onBack: () => void;
}

export function EnhancedDestinationDetail({ destinationId, onBack }: EnhancedDestinationDetailProps) {
  const [activeTab, setActiveTab] = useState<'foods' | 'spots' | 'hostels' | 'hotels'>('hotels');
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [userIntent, setUserIntent] = useState<UserIntent>('explorer');
  const [showPricingBreakdown, setShowPricingBreakdown] = useState<Hostel | null>(null);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recommended' | 'price' | 'rating' | 'distance'>('recommended');
  
  const data = indianDestinationData[destinationId] || indianDestinationData.jaipur;

  // Detect user intent based on interactions
  useEffect(() => {
    const savedIntent = localStorage.getItem('userIntent') as UserIntent;
    if (savedIntent) {
      setUserIntent(savedIntent);
    }
  }, []);

  const handleIntentChange = (intent: UserIntent) => {
    setUserIntent(intent);
    if (intent) {
      localStorage.setItem('userIntent', intent);
    }
    
    // Auto-adjust filters based on intent
    if (intent === 'budget') {
      setSortBy('price');
    } else if (intent === 'luxury') {
      setMinRating(4.5);
    } else if (intent === 'planner') {
      setSortBy('rating');
    }
  };

  // Get active filters
  const getActiveFilters = (): ActiveFilter[] => {
    const filters: ActiveFilter[] = [];
    if (priceRange) {
      filters.push({
        id: 'price',
        label: 'Price',
        value: `₹${priceRange[0]} - ₹${priceRange[1]}`
      });
    }
    if (minRating) {
      filters.push({
        id: 'rating',
        label: 'Min Rating',
        value: `${minRating}+`
      });
    }
    return filters;
  };

  const removeFilter = (filterId: string) => {
    if (filterId === 'price') setPriceRange(null);
    if (filterId === 'rating') setMinRating(null);
  };

  const clearAllFilters = () => {
    setPriceRange(null);
    setMinRating(null);
  };

  // Sort hostels based on user intent and preferences
  const getSortedHostels = () => {
    let filtered = [...data.hostels];
    
    // Apply filters
    if (priceRange) {
      filtered = filtered.filter(h => h.price >= priceRange[0] && h.price <= priceRange[1]);
    }
    if (minRating) {
      filtered = filtered.filter(h => h.rating >= minRating);
    }

    // Sort based on criteria and intent
    filtered.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'distance') {
        const aNum = parseFloat(a.distance || '999');
        const bNum = parseFloat(b.distance || '999');
        return aNum - bNum;
      }
      
      // Recommended: weighted score
      const scoreA = a.rating * 0.4 + (a.sentimentScore || 0) * 0.3 + (5 - a.price / 1000) * 0.3;
      const scoreB = b.rating * 0.4 + (b.sentimentScore || 0) * 0.3 + (5 - b.price / 1000) * 0.3;
      return scoreB - scoreA;
    });

    return filtered;
  };

  const sortedHostels = getSortedHostels();

  // Generate explanation factors for a hostel
  const getExplanationFactors = (hostel: Hostel): ExplanationFactor[] => {
    const factors: ExplanationFactor[] = [];
    
    if (hostel.distance) {
      factors.push({
        type: 'distance',
        label: 'Location',
        value: hostel.distance,
        impact: 'high'
      });
    }
    
    if (hostel.rating >= 4.5) {
      factors.push({
        type: 'rating',
        label: 'High Rating',
        value: `${hostel.rating}/5 from ${hostel.reviewCount} verified reviews`,
        impact: 'high'
      });
    }
    
    if (userIntent === 'budget' && hostel.price <= 800) {
      factors.push({
        type: 'price',
        label: 'Budget Friendly',
        value: `₹${hostel.price}/night fits your budget preference`,
        impact: 'high'
      });
    }
    
    if (userIntent === 'luxury' && hostel.price >= 2000) {
      factors.push({
        type: 'price',
        label: 'Premium Experience',
        value: 'Luxury amenities and high-end service',
        impact: 'high'
      });
    }
    
    if (hostel.sentiment === 'positive' && (hostel.sentimentScore || 0) > 0.8) {
      factors.push({
        type: 'trending',
        label: 'Highly Recommended',
        value: `${Math.round((hostel.sentimentScore || 0) * 100)}% positive guest sentiment`,
        impact: 'medium'
      });
    }

    return factors;
  };

  const getSortLabel = () => {
    const labels = {
      recommended: 'Best match for you',
      price: 'Lowest price first',
      rating: 'Highest rated first',
      distance: 'Nearest first'
    };
    return labels[sortBy];
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 text-blue-900 hover:text-blue-950"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Destinations
      </button>

      {/* Intent Banner */}
      <IntentBanner
        detectedIntent={userIntent}
        onIntentChange={handleIntentChange}
      />

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-blue-900 mb-4 capitalize">{destinationId}</h2>
        
        <div className="flex gap-4 border-b mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('hotels')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'hotels'
                ? 'border-blue-900 text-blue-900 font-bold'
                : 'border-transparent text-gray-600 hover:text-blue-900'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span>All Hotels</span>
            <span className="px-2 py-0.5 bg-blue-900 text-white rounded-full text-xs">10</span>
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'foods'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-gray-600 hover:text-blue-900'
            }`}
          >
            <Utensils className="w-5 h-5" />
            Local Cuisine
          </button>
          <button
            onClick={() => setActiveTab('spots')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'spots'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-gray-600 hover:text-blue-900'
            }`}
          >
            <MapPin className="w-5 h-5" />
            Places to Visit
          </button>
          <button
            onClick={() => setActiveTab('hostels')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'hostels'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-gray-600 hover:text-blue-900'
            }`}
          >
            <Building2 className="w-5 h-5" />
            Quick Stays
          </button>
        </div>

        {/* Weather Widget - Added as dedicated section */}
        <div className="mb-6">
          <WeatherWidget city={destinationId.charAt(0).toUpperCase() + destinationId.slice(1)} />
        </div>

        {/* MASSIVE HOTELS DATABASE */}
        {activeTab === 'hotels' && (
          <UltraAdvancedHotelSearch
            destination={destinationId.charAt(0).toUpperCase() + destinationId.slice(1)}
            onHotelSelect={(hotelId) => setSelectedHotelId(hotelId)}
          />
        )}

        {/* Foods */}
        {activeTab === 'foods' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.foods.map((food) => (
              <div key={food.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3>{food.name}</h3>
                    {food.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{food.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{food.description}</p>
                  
                  {food.sentiment && (
                    <div className="mb-3">
                      <TrustBadges sentiment={food.sentiment} />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-blue-900">{food.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Spots */}
        {activeTab === 'spots' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.spots.map((spot) => (
              <div key={spot.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={spot.image}
                  alt={spot.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3>{spot.name}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full">
                      {spot.category}
                    </span>
                  </div>
                  <p className="text-gray-600">{spot.description}</p>
                  
                  {spot.distance && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{spot.distance}</span>
                    </div>
                  )}
                  
                  <TimeAndCrowdIndicators
                    bestTimeToVisit={spot.bestTimeToVisit}
                    crowdLevel={spot.crowdLevel}
                    compact
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hostels */}
        {activeTab === 'hostels' && (
          <>
            {/* Filter and Sort Controls */}
            <div className="mb-6 flex flex-wrap gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="recommended">Recommended</option>
                <option value="price">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
                <option value="distance">Nearest First</option>
              </select>

              <select
                value={minRating || ''}
                onChange={(e) => setMinRating(e.target.value ? parseFloat(e.target.value) : null)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>

            {/* Filter Summary */}
            <FilterSummaryBar
              sortBy={getSortLabel()}
              activeFilters={getActiveFilters()}
              onRemoveFilter={removeFilter}
              onClearAll={clearAllFilters}
              resultsCount={sortedHostels.length}
            />

            {/* Results */}
            {sortedHostels.length === 0 ? (
              <EmptyState
                type="no-results"
                recommendations={{
                  title: 'Try these alternatives:',
                  items: [
                    'Expand your budget range',
                    'Lower the minimum rating requirement',
                    'Browse other destinations nearby'
                  ]
                }}
                actionLabel="Clear all filters"
                onAction={clearAllFilters}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedHostels.map((hostel) => (
                  <div key={hostel.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                    <img
                      src={hostel.image}
                      alt={hostel.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <h3>{hostel.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{hostel.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{hostel.description}</p>
                      
                      {hostel.distance && (
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span>{hostel.distance}</span>
                        </div>
                      )}
                      
                      <div className="mb-3">
                        <TrustBadges
                          sentiment={hostel.sentiment}
                          sentimentScore={hostel.sentimentScore}
                          isVerified={hostel.isVerified}
                          showSentimentBar
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hostel.amenities.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 rounded text-gray-600"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                      
                      {/* Explainability Panel */}
                      <div className="mb-4">
                        <ExplainabilityPanel
                          factors={getExplanationFactors(hostel)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <div>
                            <span className="text-blue-900">₹{hostel.price}</span>
                            <span className="text-gray-600">/night</span>
                          </div>
                          <button
                            onClick={() => setShowPricingBreakdown(hostel)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => setSelectedHostel(hostel)}
                          disabled={!hostel.available}
                          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          {hostel.available ? 'Book Now' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selectedHostel && (
        <BookingModal
          hostel={selectedHostel}
          onClose={() => setSelectedHostel(null)}
        />
      )}

      {showPricingBreakdown && (
        <PricingBreakdownModal
          breakdown={{
            basePrice: showPricingBreakdown.price,
            demandSurge: Math.round(showPricingBreakdown.price * 0.15),
            seasonalFactor: Math.round(showPricingBreakdown.price * 0.05),
            total: showPricingBreakdown.price,
            currency: '₹',
            surgeCapped: true
          }}
          itemName={showPricingBreakdown.name}
          onClose={() => setShowPricingBreakdown(null)}
        />
      )}

      {/* Proper Hotel Booking Modal */}
      {selectedHotelId && (() => {
        const hotel = getHotelById(selectedHotelId);
        return hotel ? (
          <ProperHotelBooking
            hotel={hotel}
            onClose={() => setSelectedHotelId(null)}
            onSuccess={() => {
              setSelectedHotelId(null);
              alert('Booking successful! Check "My Bookings" and "Expense Tracker"');
            }}
          />
        ) : null;
      })()}
    </div>
  );
}