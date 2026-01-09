import { useState } from 'react';
import { MapPin, Star, Search, SlidersHorizontal, X } from 'lucide-react';
import { FilterSummaryBar, ActiveFilter } from './ux/FilterSummaryBar';
import { EmptyState } from './ux/EmptyState';
import { IntentBanner, UserIntent } from './ux/IntentBanner';

interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  description: string;
  popularSeason: string;
  avgPrice: number;
  category: 'cultural' | 'beach' | 'urban' | 'adventure' | 'spiritual';
}

// Indian destinations with proper categorization
const indianDestinations: Destination[] = [
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'Rajasthan, India',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600',
    rating: 4.7,
    description: 'The Pink City with magnificent palaces and vibrant bazaars',
    popularSeason: 'October - March',
    avgPrice: 1500,
    category: 'cultural'
  },
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600',
    rating: 4.8,
    description: 'Beaches, nightlife, and Portuguese heritage on the western coast',
    popularSeason: 'November - February',
    avgPrice: 2000,
    category: 'beach'
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    country: 'Uttar Pradesh, India',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600',
    rating: 4.6,
    description: 'Ancient spiritual city on the banks of the sacred Ganges',
    popularSeason: 'October - March',
    avgPrice: 1000,
    category: 'spiritual'
  },
  {
    id: 'manali',
    name: 'Manali',
    country: 'Himachal Pradesh, India',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    rating: 4.7,
    description: 'Himalayan hill station with snow-capped peaks and adventure sports',
    popularSeason: 'May - June, December - February',
    avgPrice: 1800,
    category: 'adventure'
  },
  {
    id: 'kerala',
    name: 'Kerala',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600',
    rating: 4.9,
    description: "God's Own Country with backwaters, beaches, and lush greenery",
    popularSeason: 'September - March',
    avgPrice: 1800,
    category: 'beach'
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    country: 'Rajasthan, India',
    image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=600',
    rating: 4.7,
    description: 'The City of Lakes with romantic palaces and heritage architecture',
    popularSeason: 'October - March',
    avgPrice: 1600,
    category: 'cultural'
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    country: 'Uttarakhand, India',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600',
    rating: 4.6,
    description: 'Yoga capital of the world nestled in the Himalayan foothills',
    popularSeason: 'September - November, March - May',
    avgPrice: 1200,
    category: 'spiritual'
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    country: 'Punjab, India',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=600',
    rating: 4.7,
    description: 'Home to the Golden Temple and rich Sikh heritage',
    popularSeason: 'October - March',
    avgPrice: 1300,
    category: 'spiritual'
  },
  {
    id: 'hampi',
    name: 'Hampi',
    country: 'Karnataka, India',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600',
    rating: 4.8,
    description: 'Ancient ruins and boulder-strewn landscapes of Vijayanagara Empire',
    popularSeason: 'October - February',
    avgPrice: 1100,
    category: 'cultural'
  },
  {
    id: 'darjeeling',
    name: 'Darjeeling',
    country: 'West Bengal, India',
    image: 'https://images.unsplash.com/photo-1586894579535-2c0433a7da4c?w=600',
    rating: 4.6,
    description: 'Tea capital with stunning views of Kanchenjunga and toy train rides',
    popularSeason: 'March - May, September - November',
    avgPrice: 1400,
    category: 'adventure'
  },
  {
    id: 'delhi',
    name: 'Delhi',
    country: 'National Capital Territory, India',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600',
    rating: 4.5,
    description: 'Historic capital with Mughal monuments, street food, and vibrant markets',
    popularSeason: 'October - March',
    avgPrice: 1700,
    category: 'cultural'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'Maharashtra, India',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600',
    rating: 4.6,
    description: 'The City of Dreams - Bollywood, Gateway of India, and coastal charm',
    popularSeason: 'November - February',
    avgPrice: 2200,
    category: 'urban'
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    country: 'Karnataka, India',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600',
    rating: 4.5,
    description: 'Garden City and IT hub with pleasant climate and vibrant nightlife',
    popularSeason: 'October - February',
    avgPrice: 1900,
    category: 'urban'
  }
];

interface EnhancedDestinationsListProps {
  onDestinationSelect: (destinationId: string) => void;
}

export function EnhancedDestinationsList({ onDestinationSelect }: EnhancedDestinationsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<'budget' | 'mid' | 'luxury' | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price'>('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [userIntent, setUserIntent] = useState<UserIntent>(null);

  // Get filtered and sorted destinations
  const getFilteredDestinations = () => {
    let filtered = [...indianDestinations];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
             d.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(d => d.category === selectedCategory);
    }

    // Price range filter
    if (priceRange) {
      filtered = filtered.filter(d => {
        if (priceRange === 'budget') return d.avgPrice <= 1500;
        if (priceRange === 'mid') return d.avgPrice > 1500 && d.avgPrice <= 2000;
        if (priceRange === 'luxury') return d.avgPrice > 2000;
        return true;
      });
    }

    // Rating filter
    if (minRating) {
      filtered = filtered.filter(d => d.rating >= minRating);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.avgPrice - b.avgPrice;
      // Recommended: weighted score
      const scoreA = a.rating * 0.6 + (5 - a.avgPrice / 1000) * 0.4;
      const scoreB = b.rating * 0.6 + (5 - b.avgPrice / 1000) * 0.4;
      return scoreB - scoreA;
    });

    return filtered;
  };

  const filteredDestinations = getFilteredDestinations();

  // Get active filters for summary bar
  const getActiveFilters = (): ActiveFilter[] => {
    const filters: ActiveFilter[] = [];
    
    if (searchQuery) {
      filters.push({
        id: 'search',
        label: 'Search',
        value: searchQuery
      });
    }
    
    if (selectedCategory) {
      filters.push({
        id: 'category',
        label: 'Category',
        value: selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
      });
    }
    
    if (priceRange) {
      const priceLabels = {
        budget: 'Budget (≤₹1,500)',
        mid: 'Mid-range (₹1,500-₹2,000)',
        luxury: 'Luxury (>₹2,000)'
      };
      filters.push({
        id: 'price',
        label: 'Price',
        value: priceLabels[priceRange]
      });
    }
    
    if (minRating) {
      filters.push({
        id: 'rating',
        label: 'Min Rating',
        value: `${minRating}+ stars`
      });
    }
    
    return filters;
  };

  const removeFilter = (filterId: string) => {
    if (filterId === 'search') setSearchQuery('');
    if (filterId === 'category') setSelectedCategory(null);
    if (filterId === 'price') setPriceRange(null);
    if (filterId === 'rating') setMinRating(null);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setPriceRange(null);
    setMinRating(null);
  };

  const getSortLabel = () => {
    const labels = {
      recommended: 'Best matches',
      rating: 'Highest rated',
      price: 'Lowest price'
    };
    return labels[sortBy];
  };

  const categories = [
    { value: 'cultural', label: 'Cultural', icon: '🏛️' },
    { value: 'beach', label: 'Beach', icon: '🏖️' },
    { value: 'urban', label: 'Urban', icon: '🏙️' },
    { value: 'adventure', label: 'Adventure', icon: '⛰️' },
    { value: 'spiritual', label: 'Spiritual', icon: '🕉️' }
  ];

  return (
    <div>
      {/* Intent Banner */}
      {userIntent && (
        <IntentBanner
          detectedIntent={userIntent}
          onIntentChange={setUserIntent}
          onDismiss={() => setUserIntent(null)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-blue-900 mb-2">Explore India</h2>
        <p className="text-gray-600">Discover incredible destinations across the country</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="recommended">Recommended</option>
            <option value="rating">Top Rated</option>
            <option value="price">Budget Friendly</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters ? 'bg-blue-900 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-gray-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(selectedCategory === cat.value ? null : cat.value)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      selectedCategory === cat.value
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-white border-gray-300 hover:border-blue-900'
                    }`}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-gray-700 mb-2">Price Range (per night)</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'budget', label: 'Budget (≤₹1,500)' },
                  { value: 'mid', label: 'Mid-range (₹1,500-₹2,000)' },
                  { value: 'luxury', label: 'Luxury (>₹2,000)' }
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setPriceRange(priceRange === range.value ? null : range.value as any)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      priceRange === range.value
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-white border-gray-300 hover:border-blue-900'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-gray-700 mb-2">Minimum Rating</label>
              <div className="flex gap-2">
                {[4.5, 4.0, 3.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(minRating === rating ? null : rating)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      minRating === rating
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-white border-gray-300 hover:border-blue-900'
                    }`}
                  >
                    {rating}+ ⭐
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Summary */}
      <FilterSummaryBar
        sortBy={getSortLabel()}
        activeFilters={getActiveFilters()}
        onRemoveFilter={removeFilter}
        onClearAll={clearAllFilters}
        resultsCount={filteredDestinations.length}
      />

      {/* Results */}
      {filteredDestinations.length === 0 ? (
        <EmptyState
          type="no-results"
          recommendations={{
            title: 'Try these alternatives:',
            items: [
              'Clear some filters to see more results',
              'Try a different search term',
              'Explore all categories',
              'Browse destinations in nearby states'
            ]
          }}
          actionLabel="Clear all filters"
          onAction={clearAllFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <div
              key={destination.id}
              onClick={() => onDestinationSelect(destination.id)}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="relative h-48">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{destination.rating}</span>
                </div>
                <div className="absolute top-4 left-4 bg-blue-900 text-white px-3 py-1 rounded-full">
                  {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-900" />
                  <span className="text-gray-600">{destination.country}</span>
                </div>
                <h3 className="mb-2">{destination.name}</h3>
                <p className="text-gray-600 mb-3">{destination.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600">Avg. ₹{destination.avgPrice}/night</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-900">Best: {destination.popularSeason}</span>
                  <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors">
                    Explore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Intent Detection Suggestion */}
      {!userIntent && filteredDestinations.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900 mb-2">Get personalized recommendations</p>
          <p className="text-blue-800 mb-3">
            Tell us your travel style to see destinations that match your preferences
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setUserIntent('budget')}
              className="px-4 py-2 bg-white border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Budget Traveler
            </button>
            <button
              onClick={() => setUserIntent('luxury')}
              className="px-4 py-2 bg-white border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Luxury Seeker
            </button>
            <button
              onClick={() => setUserIntent('explorer')}
              className="px-4 py-2 bg-white border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Explorer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}