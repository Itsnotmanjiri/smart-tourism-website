import { useState } from 'react';
import { Search, MapPin, Calendar, Users, Heart, MessageCircle } from 'lucide-react';

interface TravelBuddy {
  id: string;
  name: string;
  age: number;
  from: string;
  destination: string;
  travelDates: string;
  interests: string[];
  avatar: string;
  bio: string;
}

const mockBuddies: TravelBuddy[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    age: 28,
    from: 'San Francisco, USA',
    destination: 'Paris',
    travelDates: 'Jan 15-22, 2025',
    interests: ['Photography', 'Museums', 'Food'],
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Love exploring new cultures and trying local cuisine!'
  },
  {
    id: '2',
    name: 'Marco Silva',
    age: 32,
    from: 'Lisbon, Portugal',
    destination: 'Tokyo',
    travelDates: 'Feb 5-15, 2025',
    interests: ['Hiking', 'Photography', 'Culture'],
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Adventure seeker looking for hiking partners'
  },
  {
    id: '3',
    name: 'Emma Johnson',
    age: 25,
    from: 'London, UK',
    destination: 'Bali',
    travelDates: 'Jan 20-30, 2025',
    interests: ['Yoga', 'Beaches', 'Wellness'],
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Yoga enthusiast seeking peaceful travel companions'
  },
  {
    id: '4',
    name: 'Alex Kumar',
    age: 29,
    from: 'Mumbai, India',
    destination: 'New York',
    travelDates: 'Mar 1-10, 2025',
    interests: ['Music', 'Food', 'Nightlife'],
    avatar: 'https://i.pravatar.cc/150?img=13',
    bio: 'Music lover exploring the NYC scene'
  },
  {
    id: '5',
    name: 'Sofia Martinez',
    age: 26,
    from: 'Barcelona, Spain',
    destination: 'Dubai',
    travelDates: 'Feb 12-20, 2025',
    interests: ['Shopping', 'Luxury', 'Architecture'],
    avatar: 'https://i.pravatar.cc/150?img=9',
    bio: 'Architecture enthusiast exploring modern design'
  },
  {
    id: '6',
    name: 'James Wilson',
    age: 31,
    from: 'Sydney, Australia',
    destination: 'London',
    travelDates: 'Jan 25-Feb 5, 2025',
    interests: ['History', 'Pubs', 'Football'],
    avatar: 'https://i.pravatar.cc/150?img=14',
    bio: 'History buff and football fan visiting London'
  }
];

export function TravelBuddyFinder() {
  const [searchDestination, setSearchDestination] = useState('');
  const [filteredBuddies, setFilteredBuddies] = useState(mockBuddies);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  const allInterests = Array.from(
    new Set(mockBuddies.flatMap((buddy) => buddy.interests))
  );

  const handleSearch = () => {
    let results = mockBuddies;

    if (searchDestination) {
      results = results.filter((buddy) =>
        buddy.destination.toLowerCase().includes(searchDestination.toLowerCase())
      );
    }

    if (selectedInterest) {
      results = results.filter((buddy) =>
        buddy.interests.includes(selectedInterest)
      );
    }

    setFilteredBuddies(results);
  };

  const handleInterestFilter = (interest: string) => {
    if (selectedInterest === interest) {
      setSelectedInterest(null);
      setFilteredBuddies(mockBuddies);
    } else {
      setSelectedInterest(interest);
      const results = mockBuddies.filter((buddy) =>
        buddy.interests.includes(interest)
      );
      setFilteredBuddies(results);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-blue-900 mb-2">Find Your Travel Buddy</h2>
        <p className="text-gray-600">Connect with travelers heading to the same destination</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by destination..."
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>

        {/* Interest Filters */}
        <div>
          <p className="text-gray-700 mb-3">Filter by Interests:</p>
          <div className="flex flex-wrap gap-2">
            {allInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestFilter(interest)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedInterest === interest
                    ? 'bg-blue-900 text-white'
                    : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuddies.map((buddy) => (
          <div
            key={buddy.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={buddy.avatar}
                  alt={buddy.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="mb-1">{buddy.name}, {buddy.age}</h3>
                  <p className="text-gray-600">{buddy.from}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4 italic">"{buddy.bio}"</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-900" />
                  <span>Traveling to: {buddy.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-blue-900" />
                  <span>{buddy.travelDates}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-2">Interests:</p>
                <div className="flex flex-wrap gap-2">
                  {buddy.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Connect
                </button>
                <button className="p-2 border border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBuddies.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="mb-2">No Travel Buddies Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}