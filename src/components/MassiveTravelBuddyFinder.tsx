import { useState, useEffect } from 'react';
import { Users, MapPin, Calendar, DollarSign, Heart, X, MessageCircle, Check, Star, Shield, TrendingUp, Filter, Search, Plus, ArrowLeft, Sparkles } from 'lucide-react';
import { allTravelBuddies, searchTravelBuddies, TravelBuddy, availableCities } from '../data/massiveProperBuddies';
import { EnhancedTravelBuddyChat } from './EnhancedTravelBuddyChat';
import { CreateBuddyProfile } from './CreateBuddyProfile';
import { globalState } from '../utils/globalState';
import { NatureBackground, GlassCard, FloatingGradientCard, AnimatedButton } from './ui/GlassCard';

interface MassiveTravelBuddyFinderProps {
  onBack: () => void;
}

export function MassiveTravelBuddyFinder({ onBack }: MassiveTravelBuddyFinderProps) {
  const [searchResults, setSearchResults] = useState<{ buddies: TravelBuddy[]; total: number; hasMore: boolean }>({
    buddies: [],
    total: 0,
    hasMore: false
  });
  
  const [matches, setMatches] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeChatBuddy, setActiveChatBuddy] = useState<TravelBuddy | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  
  const [filters, setFilters] = useState({
    destination: 'Goa',
    budget: '',
    interests: [] as string[],
    travelStyle: '',
    gender: '',
    verified: false,
    minRating: 0
  });

  useEffect(() => {
    performSearch(1);
  }, [filters]);

  const performSearch = (page: number) => {
    setLoading(true);
    
    setTimeout(() => {
      const results = searchTravelBuddies({
        destination: filters.destination,
        budget: filters.budget || undefined,
        interests: filters.interests.length > 0 ? filters.interests : undefined,
        travelStyle: filters.travelStyle || undefined,
        gender: filters.gender || undefined,
        verified: filters.verified || undefined,
        minRating: filters.minRating || undefined,
        page,
        limit: 12
      });
      
      if (page === 1) {
        setSearchResults(results);
      } else {
        setSearchResults({
          buddies: [...searchResults.buddies, ...results.buddies],
          total: results.total,
          hasMore: results.hasMore
        });
      }
      
      setCurrentPage(page);
      setLoading(false);
    }, 150);
  };

  const loadMore = () => {
    performSearch(currentPage + 1);
  };

  const handleMatch = (buddyId: string) => {
    if (!matches.includes(buddyId)) {
      setMatches([...matches, buddyId]);
    }
  };

  const handleReject = (buddyId: string) => {
    if (!rejected.includes(buddyId)) {
      setRejected([...rejected, buddyId]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (filters.interests.includes(interest)) {
      setFilters({
        ...filters,
        interests: filters.interests.filter(i => i !== interest)
      });
    } else {
      setFilters({
        ...filters,
        interests: [...filters.interests, interest]
      });
    }
  };

  const activeFiltersCount =
    (filters.budget ? 1 : 0) +
    (filters.travelStyle ? 1 : 0) +
    (filters.gender ? 1 : 0) +
    (filters.verified ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    filters.interests.length;

  const destinations = availableCities;
  const budgets = ['₹5,000-10,000', '₹10,000-15,000', '₹15,000-20,000', '₹20,000-30,000', '₹30,000-50,000', '₹50,000+'];
  const travelStyles = ['Backpacker', 'Luxury', 'Adventure', 'Relaxed', 'Cultural', 'Party', 'Spiritual', 'Budget', 'Social', 'Solo'];
  const interests = ['Photography', 'Adventure', 'Food', 'Culture', 'History', 'Nature', 'Nightlife', 'Shopping', 'Yoga', 'Trekking', 'Beach', 'Mountains'];

  return (
    <NatureBackground 
      imageUrl="https://images.unsplash.com/photo-1635936612557-3491e1db5587?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjB0cmVlcyUyMG5hdHVyZXxlbnwxfHx8fDE3Njc0NTQ1Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080"
      overlay="light"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <AnimatedButton
          onClick={onBack}
          variant="secondary"
          icon={<ArrowLeft className="w-5 h-5" />}
          className="mb-6"
        >
          Back to Home
        </AnimatedButton>

        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-4xl font-bold mb-3">Find Your Perfect Travel Companion</h2>
            <p className="text-blue-200 text-lg">
              Connect with {searchResults.total.toLocaleString('en-IN')} travelers heading to {filters.destination}
            </p>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 sticky top-20 z-30">
            <div className="flex gap-4 mb-4">
              {/* Destination */}
              <select
                value={filters.destination}
                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                className="flex-1 px-6 py-4 border-3 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-900 text-lg font-medium bg-gradient-to-r from-purple-50 to-blue-50"
              >
                {destinations.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-8 py-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl hover:shadow-xl transition-all flex items-center gap-3 whitespace-nowrap relative"
              >
                <Filter className="w-6 h-6" />
                <span className="hidden md:inline text-lg">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-sm">
                <span className="text-3xl font-bold text-purple-900">{searchResults.total.toLocaleString('en-IN')}</span>
                <span className="text-gray-600 ml-2">travelers found</span>
              </div>
              
              {matches.length > 0 && (
                <div className="px-4 py-2 bg-green-100 text-green-900 rounded-full text-sm font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-current" />
                  {matches.length} Matches
                </div>
              )}
              
              <div className="px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                {searchResults.buddies.filter(b => b.isOnline).length} Online Now
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl text-gray-900 font-semibold">Refine Your Search</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Budget */}
              <div className="space-y-4">
                <label className="text-lg text-gray-900 font-medium block">Budget Range</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {budgets.map(budget => (
                    <button
                      key={budget}
                      onClick={() => setFilters({ ...filters, budget: filters.budget === budget ? '' : budget })}
                      className={`py-4 rounded-2xl border-3 transition-all ${
                        filters.budget === budget
                          ? 'border-purple-900 bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-xl'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Style */}
              <div className="space-y-4">
                <label className="text-lg text-gray-900 font-medium block">Travel Style</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {travelStyles.map(style => (
                    <button
                      key={style}
                      onClick={() => setFilters({ ...filters, travelStyle: filters.travelStyle === style ? '' : style })}
                      className={`py-4 rounded-2xl border-3 transition-all ${
                        filters.travelStyle === style
                          ? 'border-purple-900 bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-xl'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <label className="text-lg text-gray-900 font-medium block">Shared Interests</label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {interests.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`py-3 px-4 rounded-xl border-2 transition-all text-sm ${
                        filters.interests.includes(interest)
                          ? 'border-purple-900 bg-purple-50 text-purple-900 font-semibold'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-lg text-gray-900 font-medium block mb-3">Gender Preference</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['', 'Male', 'Female'].map(gender => (
                      <button
                        key={gender}
                        onClick={() => setFilters({ ...filters, gender })}
                        className={`py-3 rounded-xl border-2 transition-all ${
                          filters.gender === gender
                            ? 'border-purple-900 bg-purple-50 text-purple-900 font-semibold'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {gender || 'Any'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-lg text-gray-900 font-medium block mb-3">Minimum Rating</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 3, 3.5, 4, 4.5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setFilters({ ...filters, minRating: rating })}
                        className={`py-3 rounded-xl border-2 transition-all ${
                          filters.minRating === rating
                            ? 'border-purple-900 bg-purple-50 text-purple-900 font-semibold'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {rating || 'Any'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-lg text-gray-900 font-medium block mb-3">Verified Only</label>
                  <button
                    onClick={() => setFilters({ ...filters, verified: !filters.verified })}
                    className={`w-full py-4 rounded-xl border-2 transition-all ${
                      filters.verified
                        ? 'border-purple-900 bg-purple-50 text-purple-900 font-semibold'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {filters.verified ? '✓ Verified Only' : 'All Travelers'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && currentPage === 1 && (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-purple-900 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-lg">Finding perfect travel companions...</p>
            </div>
          )}

          {/* Travel Buddies Grid */}
          {!loading || currentPage > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.buddies
                .filter(buddy => !rejected.includes(buddy.id))
                .map(buddy => (
                <div
                  key={buddy.id}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300"
                >
                  {/* Header with Avatar */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={buddy.avatar}
                            alt={buddy.name}
                            className="w-20 h-20 rounded-full border-4 border-white shadow-xl object-cover"
                          />
                          {buddy.isOnline && (
                            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 border-3 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-white text-xl font-bold flex items-center gap-2">
                            {buddy.name}
                            {buddy.verified && (
                              <Shield className="w-5 h-5 text-blue-400 fill-current" />
                            )}
                          </h3>
                          <p className="text-blue-200 text-sm">{buddy.age} • {buddy.gender}</p>
                          <p className="text-blue-200 text-sm">{buddy.hometown}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-bold">{buddy.rating}</span>
                        <span className="text-blue-200 text-sm">({buddy.tripsCompleted} trips)</span>
                      </div>
                      <span className="text-blue-200 text-xs">{buddy.lastActive}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    {/* Travel Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-5 h-5 text-purple-900" />
                        <span className="font-medium">{buddy.destination}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5 text-purple-900" />
                        <span>{buddy.travelDates}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <DollarSign className="w-5 h-5 text-purple-900" />
                        <span>{buddy.budget}</span>
                      </div>
                    </div>

                    {/* Travel Style & Response Rate */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-900 rounded-lg text-sm font-medium">
                        {buddy.travelStyle}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-900 rounded-lg text-sm">
                        {buddy.responseRate}% response
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{buddy.bio}</p>

                    {/* Interests */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2">Interests:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {buddy.interests.slice(0, 4).map(interest => (
                          <span key={interest} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            {interest}
                          </span>
                        ))}
                        {buddy.interests.length > 4 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            +{buddy.interests.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-1">Languages: {buddy.languages.join(', ')}</p>
                    </div>

                    {/* Looking For */}
                    {buddy.lookingFor.length > 0 && (
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Looking for:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {buddy.lookingFor.map(item => (
                            <span key={item} className="px-2 py-0.5 bg-blue-50 text-blue-900 rounded text-xs">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {matches.includes(buddy.id) ? (
                      <div className="space-y-2">
                        <div className="px-4 py-3 bg-green-100 text-green-900 rounded-xl text-center font-medium flex items-center justify-center gap-2">
                          <Check className="w-5 h-5" />
                          Matched!
                        </div>
                        <button
                          onClick={() => setActiveChatBuddy(buddy)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Chat Now
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleReject(buddy.id)}
                          className="px-4 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-all font-medium flex items-center justify-center gap-2"
                        >
                          <X className="w-5 h-5" />
                          Pass
                        </button>
                        <button
                          onClick={() => handleMatch(buddy.id)}
                          className="px-4 py-3 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
                        >
                          <Heart className="w-5 h-5" />
                          Match
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* Load More */}
          {searchResults.hasMore && !loading && (
            <div className="text-center pt-8">
              <button
                onClick={loadMore}
                className="px-12 py-5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl hover:shadow-2xl transition-all text-lg font-medium"
              >
                Load More Travelers ({searchResults.total - searchResults.buddies.length} remaining)
              </button>
            </div>
          )}

          {/* Loading More */}
          {loading && currentPage > 1 && (
            <div className="text-center py-8">
              <div className="inline-block w-12 h-12 border-4 border-purple-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Chat Modal */}
          {activeChatBuddy && (
            <EnhancedTravelBuddyChat
              buddy={{
                id: activeChatBuddy.id,
                name: activeChatBuddy.name,
                avatar: activeChatBuddy.avatar,
                destination: activeChatBuddy.destination,
                travelDates: activeChatBuddy.travelDates,
                isOnline: activeChatBuddy.isOnline,
                lastSeen: new Date()
              }}
              onClose={() => setActiveChatBuddy(null)}
            />
          )}

          {/* Create Buddy Profile Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => setShowCreateProfile(true)}
              className="px-12 py-5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl hover:shadow-2xl transition-all text-lg font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your Profile
            </button>
          </div>

          {/* Create Buddy Profile Modal */}
          {showCreateProfile && (
            <CreateBuddyProfile
              onClose={() => setShowCreateProfile(false)}
            />
          )}
        </div>
      </div>
    </NatureBackground>
  );
}