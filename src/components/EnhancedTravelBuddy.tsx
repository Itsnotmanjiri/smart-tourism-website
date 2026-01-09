import { useState } from 'react';
import { MapPin, Calendar, Heart, X, MessageCircle, Users, DollarSign, CheckCircle, UserPlus } from 'lucide-react';
import { TravelBuddyChat } from './TravelBuddyChat';

interface TravelPlan {
  id: string;
  userId: string;
  userName: string;
  userAge: number;
  userFrom: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  interests: string[];
  travelStyle: string;
  avatar: string;
  bio: string;
  matchScore?: number;
  status: 'active' | 'pending' | 'matched';
}

const MOCK_PLANS: TravelPlan[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Priya Sharma',
    userAge: 28,
    userFrom: 'Delhi',
    destination: 'Goa',
    startDate: '2025-01-15',
    endDate: '2025-01-20',
    budget: '₹15,000-20,000',
    interests: ['Beach', 'Nightlife', 'Water Sports'],
    travelStyle: 'Adventure',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Looking for party buddies in Goa!',
    matchScore: 92,
    status: 'active'
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Rahul Mehta',
    userAge: 32,
    userFrom: 'Mumbai',
    destination: 'Manali',
    startDate: '2025-02-01',
    endDate: '2025-02-07',
    budget: '₹25,000-30,000',
    interests: ['Trekking', 'Photography', 'Mountains'],
    travelStyle: 'Adventure',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Adventure enthusiast seeking trekking partners',
    matchScore: 88,
    status: 'active'
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Anjali Patel',
    userAge: 25,
    userFrom: 'Bangalore',
    destination: 'Kerala',
    startDate: '2025-01-10',
    endDate: '2025-01-15',
    budget: '₹20,000-25,000',
    interests: ['Nature', 'Backwaters', 'Ayurveda'],
    travelStyle: 'Relaxed',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Looking for peaceful travel companions',
    matchScore: 85,
    status: 'active'
  },
  {
    id: '4',
    userId: 'u4',
    userName: 'Vikram Singh',
    userAge: 29,
    userFrom: 'Jaipur',
    destination: 'Goa',
    startDate: '2025-01-18',
    endDate: '2025-01-22',
    budget: '₹18,000-22,000',
    interests: ['Beach', 'Food', 'Music'],
    travelStyle: 'Social',
    avatar: 'https://i.pravatar.cc/150?img=13',
    bio: 'Foodie exploring coastal cuisine',
    matchScore: 90,
    status: 'active'
  }
];

export function EnhancedTravelBuddy() {
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>(MOCK_PLANS);
  const [myPlan, setMyPlan] = useState<TravelPlan | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [activeChatBuddy, setActiveChatBuddy] = useState<TravelPlan | null>(null);
  const [formData, setFormData] = useState({
    destination: 'Goa',
    startDate: '',
    endDate: '',
    budget: '₹10,000-15,000',
    interests: [] as string[],
    travelStyle: 'Social',
    bio: ''
  });

  const DESTINATIONS = [
    'Goa', 'Manali', 'Kerala', 'Jaipur', 'Udaipur', 
    'Rishikesh', 'Darjeeling', 'Varanasi', 'Amritsar', 'Hampi'
  ];

  const INTERESTS = [
    'Beach', 'Mountains', 'Trekking', 'Photography', 'Food',
    'Nightlife', 'Culture', 'History', 'Adventure', 'Nature',
    'Shopping', 'Yoga', 'Backwaters', 'Water Sports', 'Music'
  ];

  const TRAVEL_STYLES = ['Solo', 'Social', 'Adventure', 'Luxury', 'Budget', 'Relaxed'];

  const handleCreatePlan = () => {
    if (!formData.startDate || !formData.endDate || formData.interests.length === 0) {
      alert('Please fill all required fields');
      return;
    }

    const newPlan: TravelPlan = {
      id: `plan-${Date.now()}`,
      userId: 'current-user',
      userName: 'You',
      userAge: 28,
      userFrom: 'Your City',
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: formData.budget,
      interests: formData.interests,
      travelStyle: formData.travelStyle,
      avatar: 'https://i.pravatar.cc/150?img=20',
      bio: formData.bio,
      status: 'active'
    };

    setMyPlan(newPlan);
    setShowCreatePlan(false);
    alert('Travel plan created! Now finding matches...');
  };

  const handleFindMatches = () => {
    if (!myPlan) {
      alert('Please create a travel plan first');
      return;
    }

    // Filter and score matches
    const matchedPlans = MOCK_PLANS.map(plan => {
      let score = 0;
      
      // Destination match (40 points)
      if (plan.destination === myPlan.destination) score += 40;
      
      // Date overlap (25 points)
      const planStart = new Date(plan.startDate);
      const planEnd = new Date(plan.endDate);
      const myStart = new Date(myPlan.startDate);
      const myEnd = new Date(myPlan.endDate);
      
      if (planStart <= myEnd && planEnd >= myStart) score += 25;
      
      // Budget similarity (15 points)
      if (plan.budget === myPlan.budget) score += 15;
      
      // Interest overlap (10 points)
      const commonInterests = plan.interests.filter(i => myPlan.interests.includes(i));
      score += Math.min(10, commonInterests.length * 2);
      
      // Travel style match (10 points)
      if (plan.travelStyle === myPlan.travelStyle) score += 10;
      
      return { ...plan, matchScore: score };
    }).filter(plan => plan.matchScore! > 50)
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    setTravelPlans(matchedPlans);
  };

  const handleMatch = (planId: string) => {
    setPendingRequests([...pendingRequests, planId]);
    alert('Match request sent! Waiting for response...');
    
    // Simulate acceptance after 2 seconds
    setTimeout(() => {
      setMatches([...matches, planId]);
      setPendingRequests(pendingRequests.filter(id => id !== planId));
      alert('Match accepted! You can now chat with your travel buddy.');
    }, 2000);
  };

  const handleReject = (planId: string) => {
    setTravelPlans(travelPlans.filter(plan => plan.id !== planId));
  };

  const handleChat = (planId: string) => {
    const buddy = travelPlans.find(plan => plan.id === planId);
    if (buddy) {
      setActiveChatBuddy(buddy);
    }
  };

  const toggleInterest = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter(i => i !== interest)
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl p-6">
        <h2 className="text-2xl mb-2 flex items-center gap-3">
          <Users className="w-8 h-8" />
          Travel Buddy Matchmaking
        </h2>
        <p className="text-pink-100 text-sm">Find perfect travel companions with AI-powered matching</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setShowCreatePlan(true)}
          className="bg-blue-900 text-white p-6 rounded-2xl hover:bg-blue-950 transition-all shadow-lg flex items-center justify-center gap-3"
        >
          <UserPlus className="w-6 h-6" />
          <div className="text-left">
            <div className="text-xl">Create Travel Plan</div>
            <div className="text-sm text-blue-200">Set your destination & preferences</div>
          </div>
        </button>

        <button
          onClick={handleFindMatches}
          disabled={!myPlan}
          className={`p-6 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 ${
            myPlan 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          <Heart className="w-6 h-6" />
          <div className="text-left">
            <div className="text-xl">Find Matches</div>
            <div className="text-sm opacity-80">Discover compatible travelers</div>
          </div>
        </button>
      </div>

      {/* My Travel Plan */}
      {myPlan && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-900">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Your Travel Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 rounded-xl p-4">
            <div>
              <p className="text-sm text-gray-600">Destination</p>
              <p className="text-gray-900">{myPlan.destination}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dates</p>
              <p className="text-gray-900">{myPlan.startDate} to {myPlan.endDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget</p>
              <p className="text-gray-900">{myPlan.budget}</p>
            </div>
          </div>
        </div>
      )}

      {/* Create Plan Form */}
      {showCreatePlan && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-900">
          <h3 className="text-gray-900 mb-4">Create Your Travel Plan</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-600 block mb-2">Destination *</label>
              <select
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
              >
                {DESTINATIONS.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">Travel Style</label>
              <select
                value={formData.travelStyle}
                onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
              >
                {TRAVEL_STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 block mb-2">Budget Range</label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
              >
                <option>₹5,000-10,000</option>
                <option>₹10,000-15,000</option>
                <option>₹15,000-20,000</option>
                <option>₹20,000-30,000</option>
                <option>₹30,000+</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">Interests * (Select at least one)</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-blue-900 text-white border-blue-900'
                      : 'border-gray-300 hover:border-blue-900'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">Bio (Optional)</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell others about yourself and what you're looking for..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 h-24"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowCreatePlan(false)}
              className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePlan}
              className="flex-1 bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-950 transition-colors"
            >
              Create Plan
            </button>
          </div>
        </div>
      )}

      {/* Matched Travelers */}
      <div className="space-y-4">
        <h3 className="text-gray-900">
          {myPlan ? `Potential Matches (${travelPlans.length})` : 'Recent Travelers'}
        </h3>
        
        {travelPlans.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No matches found. Try adjusting your preferences.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {travelPlans.map(plan => {
              const isMatched = matches.includes(plan.id);
              const isPending = pendingRequests.includes(plan.id);
              
              return (
                <div key={plan.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src={plan.avatar} 
                      alt={plan.userName}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-gray-900">{plan.userName}, {plan.userAge}</h4>
                        {plan.matchScore && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            {plan.matchScore}% match
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{plan.userFrom}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4" />
                      {plan.destination}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4" />
                      {plan.startDate} to {plan.endDate}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <DollarSign className="w-4 h-4" />
                      {plan.budget}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {plan.interests.map(interest => (
                        <span key={interest} className="bg-blue-50 text-blue-900 px-2 py-1 rounded text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4 italic">"{plan.bio}"</p>

                  {isMatched ? (
                    <button
                      onClick={() => handleChat(plan.id)}
                      className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Chat Now
                    </button>
                  ) : isPending ? (
                    <div className="w-full bg-yellow-100 text-yellow-800 py-3 rounded-xl text-center">
                      Request Pending...
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleReject(plan.id)}
                        className="bg-gray-200 text-gray-900 py-3 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        Pass
                      </button>
                      <button
                        onClick={() => handleMatch(plan.id)}
                        className="bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Heart className="w-5 h-5" />
                        Match
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Window */}
      {activeChatBuddy && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-900">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Chat with {activeChatBuddy.userName}
          </h3>
          <TravelBuddyChat buddy={activeChatBuddy} />
        </div>
      )}
    </div>
  );
}