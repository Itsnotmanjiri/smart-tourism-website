import { useState } from 'react';
import { ArrowLeft, Utensils, MapPin, Building2, Star, Wifi, Coffee, Users } from 'lucide-react';
import { BookingModal } from './BookingModal';

interface FamousFood {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
}

interface Spot {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
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
}

const destinationData: Record<string, {
  foods: FamousFood[];
  spots: Spot[];
  hostels: Hostel[];
}> = {
  paris: {
    foods: [
      {
        id: 'croissant',
        name: 'Classic Croissant',
        description: 'Buttery, flaky French pastry perfect for breakfast',
        image: 'https://images.unsplash.com/photo-1498099916438-d96f52d0c7ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGZvb2QlMjBjcm9pc3NhbnR8ZW58MXx8fHwxNzY1NDI0NDkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
        price: '€2-4'
      },
      {
        id: 'escargot',
        name: 'Escargots',
        description: 'French delicacy of cooked snails in garlic butter',
        image: 'https://images.unsplash.com/photo-1715634091290-c2f51c0bcb3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGNhZmUlMjByZXN0YXVyYW50fGVufDF8fHx8MTc2NTQ2MzIzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
        price: '€12-18'
      }
    ],
    spots: [
      {
        id: 'eiffel',
        name: 'Eiffel Tower',
        description: 'Iconic iron lattice tower and symbol of France',
        image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc2NTQyMjE0MHww&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Landmark'
      },
      {
        id: 'louvre',
        name: 'Louvre Museum',
        description: "World's largest art museum with Mona Lisa",
        image: 'https://images.unsplash.com/photo-1635666626028-5e319a2592b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3V2cmUlMjBtdXNldW0lMjBwYXJpc3xlbnwxfHx8fDE3NjU0MTczNjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Museum'
      }
    ],
    hostels: [
      {
        id: 'generator',
        name: 'Generator Paris',
        image: 'https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBiZWRyb29tfGVufDF8fHx8MTc2NTQ2MzIzMXww&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.5,
        price: 35,
        amenities: ['Free WiFi', 'Breakfast', 'Bar'],
        description: 'Modern hostel near Gare du Nord with vibrant atmosphere',
        available: true
      },
      {
        id: 'lescottes',
        name: 'Les Piaules',
        image: 'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzY1NDMyMzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.7,
        price: 42,
        amenities: ['Free WiFi', 'Rooftop', 'Coworking'],
        description: 'Stylish hostel with rooftop terrace in trendy area',
        available: true
      },
      {
        id: 'stjchristophers',
        name: 'St Christophers Inn',
        image: 'https://images.unsplash.com/photo-1565629196891-2ddb37c9e9fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwaG9zdGVsJTIwbG91bmdlfGVufDF8fHx8MTc2NTQ2MzIzMnww&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.3,
        price: 28,
        amenities: ['Free WiFi', 'Bar', 'Common Room'],
        description: 'Budget-friendly hostel near Canal Saint-Martin',
        available: true
      }
    ]
  },
  // Add similar data for other destinations
  tokyo: {
    foods: [
      { id: 'ramen', name: 'Tonkotsu Ramen', description: 'Rich pork bone broth noodle soup', image: 'https://images.unsplash.com/photo-1565629196891-2ddb37c9e9fc?w=400', price: '¥900-1500' },
      { id: 'sushi', name: 'Fresh Sushi', description: 'Traditional Japanese delicacy', image: 'https://images.unsplash.com/photo-1565629196891-2ddb37c9e9fc?w=400', price: '¥2000-5000' }
    ],
    spots: [
      { id: 'sensoji', name: 'Senso-ji Temple', description: 'Ancient Buddhist temple in Asakusa', image: 'https://images.unsplash.com/photo-1640871426525-a19540c45a39?w=600', category: 'Temple' },
      { id: 'shibuya', name: 'Shibuya Crossing', description: 'Busiest pedestrian crossing in the world', image: 'https://images.unsplash.com/photo-1640871426525-a19540c45a39?w=600', category: 'Landmark' }
    ],
    hostels: [
      { id: 'tokyohostel1', name: 'Khaosan Tokyo', image: 'https://images.unsplash.com/photo-1709805619372-40de3f158e83?w=600', rating: 4.6, price: 3200, amenities: ['Free WiFi', 'Lounge', 'Kitchen'], description: 'Central location near Asakusa', available: true },
      { id: 'tokyohostel2', name: 'Nui. Hostel', image: 'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?w=600', rating: 4.8, price: 3800, amenities: ['Free WiFi', 'Bar', 'Cafe'], description: 'Trendy hostel with cafe and bar', available: true }
    ]
  },
  bali: {
    foods: [
      { id: 'nasigoreng', name: 'Nasi Goreng', description: 'Indonesian fried rice with spices', image: 'https://images.unsplash.com/photo-1565629196891-2ddb37c9e9fc?w=400', price: 'Rp 25,000-50,000' },
      { id: 'satay', name: 'Satay', description: 'Grilled meat skewers with peanut sauce', image: 'https://images.unsplash.com/photo-1565629196891-2ddb37c9e9fc?w=400', price: 'Rp 30,000-60,000' }
    ],
    spots: [
      { id: 'uluwatu', name: 'Uluwatu Temple', description: 'Clifftop temple with ocean views', image: 'https://images.unsplash.com/photo-1698466632744-f79b37b88ffd?w=600', category: 'Temple' },
      { id: 'tegallalang', name: 'Tegallalang Rice Terraces', description: 'Stunning rice field landscapes', image: 'https://images.unsplash.com/photo-1698466632744-f79b37b88ffd?w=600', category: 'Nature' }
    ],
    hostels: [
      { id: 'balihostel1', name: 'Poshtel Bali', image: 'https://images.unsplash.com/photo-1709805619372-40de3f158e83?w=600', rating: 4.7, price: 150000, amenities: ['Pool', 'Free WiFi', 'Breakfast'], description: 'Beachside hostel in Canggu', available: true },
      { id: 'balihostel2', name: 'The Farm Hostel', image: 'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?w=600', rating: 4.9, price: 180000, amenities: ['Pool', 'Free WiFi', 'Restaurant'], description: 'Eco-friendly hostel in Ubud', available: true }
    ]
  },
  newyork: {
    foods: [
      { id: 'pizza', name: 'New York Pizza', description: 'Classic thin-crust pizza slice', image: 'https://images.unsplash.com/photo-1565629196891-2ddb37c9e9fc?w=400', price: '$3-6' },
      { id: 'bagel', name: 'NY Bagel', description: 'Fresh bagel with cream cheese and lox', image: 'https://images.unsplash.com/photo-1565629196891-2ddb37c9e9fc?w=400', price: '$5-10' }
    ],
    spots: [
      { id: 'centralpark', name: 'Central Park', description: 'Iconic urban park in Manhattan', image: 'https://images.unsplash.com/photo-1570304816841-906a17d7b067?w=600', category: 'Park' },
      { id: 'timessquare', name: 'Times Square', description: 'Bright lights and Broadway shows', image: 'https://images.unsplash.com/photo-1570304816841-906a17d7b067?w=600', category: 'Landmark' }
    ],
    hostels: [
      { id: 'nyhostel1', name: 'HI NYC Hostel', image: 'https://images.unsplash.com/photo-1709805619372-40de3f158e83?w=600', rating: 4.4, price: 55, amenities: ['Free WiFi', 'Kitchen', 'Lounge'], description: 'Upper West Side location near Central Park', available: true },
      { id: 'nyhostel2', name: 'Jazz on the Park', image: 'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?w=600', rating: 4.3, price: 48, amenities: ['Free WiFi', 'Bar', 'Events'], description: 'Social hostel with live music', available: true }
    ]
  },
  dubai: {
    foods: [
      { id: 'shawarma', name: 'Shawarma', description: 'Middle Eastern wrap with meat and veggies', image: 'https://images.unsplash.com/photo-1565629196891-2ddb37c9e9fc?w=400', price: 'AED 15-30' },
      { id: 'hummus', name: 'Hummus Platter', description: 'Creamy chickpea dip with pita bread', image: 'https://images.unsplash.com/photo-1565629196891-2ddb37c9e9fc?w=400', price: 'AED 20-40' }
    ],
    spots: [
      { id: 'burjkhalifa', name: 'Burj Khalifa', description: "World's tallest building", image: 'https://images.unsplash.com/photo-1706798636444-d4eb076fb63c?w=600', category: 'Landmark' },
      { id: 'dubaimall', name: 'Dubai Mall', description: 'Massive shopping and entertainment complex', image: 'https://images.unsplash.com/photo-1706798636444-d4eb076fb63c?w=600', category: 'Shopping' }
    ],
    hostels: [
      { id: 'dubaihostel1', name: 'Bedspace Dubai', image: 'https://images.unsplash.com/photo-1709805619372-40de3f158e83?w=600', rating: 4.2, price: 80, amenities: ['Free WiFi', 'Kitchen', 'AC'], description: 'Budget accommodation in Deira', available: true },
      { id: 'dubaihostel2', name: 'Dubai Youth Hostel', image: 'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?w=600', rating: 4.0, price: 70, amenities: ['Free WiFi', 'Pool', 'Breakfast'], description: 'Affordable stay near metro', available: true }
    ]
  },
  london: {
    foods: [
      { id: 'fishandchips', name: 'Fish & Chips', description: 'Classic British fried fish with chips', image: 'https://images.unsplash.com/photo-1565629196891-2ddb37c9e9fc?w=400', price: '£8-15' },
      { id: 'sundayroast', name: 'Sunday Roast', description: 'Traditional roast dinner with Yorkshire pudding', image: 'https://images.unsplash.com/photo-1565629196891-2ddb37c9e9fc?w=400', price: '£12-20' }
    ],
    spots: [
      { id: 'bigben', name: 'Big Ben', description: 'Iconic clock tower at Westminster', image: 'https://images.unsplash.com/photo-1745016176874-cd3ed3f5bfc6?w=600', category: 'Landmark' },
      { id: 'britishmuseum', name: 'British Museum', description: 'World-famous museum with vast collections', image: 'https://images.unsplash.com/photo-1745016176874-cd3ed3f5bfc6?w=600', category: 'Museum' }
    ],
    hostels: [
      { id: 'londonhostel1', name: 'Wombats London', image: 'https://images.unsplash.com/photo-1709805619372-40de3f158e83?w=600', rating: 4.5, price: 30, amenities: ['Free WiFi', 'Bar', 'Lounge'], description: 'Central location near Tower Bridge', available: true },
      { id: 'londonhostel2', name: 'Generator London', image: 'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?w=600', rating: 4.6, price: 35, amenities: ['Free WiFi', 'Bar', 'Cinema'], description: 'Trendy hostel in Kings Cross', available: true }
    ]
  }
};

interface DestinationDetailProps {
  destinationId: string;
  onBack: () => void;
}

export function DestinationDetail({ destinationId, onBack }: DestinationDetailProps) {
  const [activeTab, setActiveTab] = useState<'foods' | 'spots' | 'hostels'>('foods');
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  
  const data = destinationData[destinationId] || destinationData.paris;

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 text-blue-900 hover:text-blue-950"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Destinations
      </button>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-blue-900 mb-4 capitalize">{destinationId}</h2>
        
        <div className="flex gap-4 border-b mb-6">
          <button
            onClick={() => setActiveTab('foods')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'foods'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-gray-600 hover:text-blue-900'
            }`}
          >
            <Utensils className="w-5 h-5" />
            Famous Foods
          </button>
          <button
            onClick={() => setActiveTab('spots')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'spots'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-gray-600 hover:text-blue-900'
            }`}
          >
            <MapPin className="w-5 h-5" />
            Spots to Explore
          </button>
          <button
            onClick={() => setActiveTab('hostels')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'hostels'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-gray-600 hover:text-blue-900'
            }`}
          >
            <Building2 className="w-5 h-5" />
            Hostels
          </button>
        </div>

        {/* Famous Foods */}
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
                  <h3 className="mb-2">{food.name}</h3>
                  <p className="text-gray-600 mb-3">{food.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-900">{food.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Spots to Explore */}
        {activeTab === 'spots' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.spots.map((spot) => (
              <div key={spot.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={spot.image}
                  alt={spot.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3>{spot.name}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full">
                      {spot.category}
                    </span>
                  </div>
                  <p className="text-gray-600">{spot.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hostels */}
        {activeTab === 'hostels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.hostels.map((hostel) => (
              <div key={hostel.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={hostel.image}
                  alt={hostel.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3>{hostel.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{hostel.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{hostel.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {hostel.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded text-gray-600"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-blue-900">${hostel.price}</span>
                      <span className="text-gray-600">/night</span>
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
      </div>

      {selectedHostel && (
        <BookingModal
          hostel={selectedHostel}
          onClose={() => setSelectedHostel(null)}
        />
      )}
    </div>
  );
}