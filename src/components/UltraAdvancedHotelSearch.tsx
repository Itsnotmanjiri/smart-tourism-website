import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, MapPin, TrendingUp, Zap, Award, Heart, X, ChevronDown, Filter } from 'lucide-react';
import { searchHotels, Hotel, getHotelById } from '../data/massiveProperHotels';
import { ProperHotelBooking } from './ProperHotelBooking';
import { getHotelAverageRatings } from '../utils/reviewsData';

interface Props {
  destination: string;
  onHotelSelect: (hotelId: string) => void;
}

export function UltraAdvancedHotelSearch({ destination, onHotelSelect }: Props) {
  const [searchResults, setSearchResults] = useState<{ hotels: Hotel[]; total: number; hasMore: boolean }>({
    hotels: [],
    total: 0,
    hasMore: false
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState<Hotel | null>(null);
  
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 50000,
    starRating: 0,
    propertyType: '',
    amenities: [] as string[],
    sortBy: 'popular' as 'price-low' | 'price-high' | 'rating' | 'popular'
  });

  useEffect(() => {
    performSearch(1);
  }, [destination, filters, searchQuery]);

  const performSearch = (page: number) => {
    setLoading(true);
    
    // Simulate slight delay for realism
    setTimeout(() => {
      const results = searchHotels({
        destination,
        minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
        maxPrice: filters.maxPrice < 50000 ? filters.maxPrice : undefined,
        minRating: filters.starRating > 0 ? filters.starRating : undefined,
        propertyType: filters.propertyType || undefined,
        amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
        page: 1,
        limit: 100
      });
      
      // Apply client-side sorting
      let sortedHotels = results.hotels;
      if (filters.sortBy === 'price-low') {
        sortedHotels = [...sortedHotels].sort((a, b) => (a.discountedPrice || a.basePrice) - (b.discountedPrice || b.basePrice));
      } else if (filters.sortBy === 'price-high') {
        sortedHotels = [...sortedHotels].sort((a, b) => (b.discountedPrice || b.basePrice) - (a.discountedPrice || a.basePrice));
      } else if (filters.sortBy === 'rating') {
        sortedHotels = [...sortedHotels].sort((a, b) => b.rating - a.rating);
      }
      
      setSearchResults({
        hotels: sortedHotels,
        total: sortedHotels.length,
        hasMore: false
      });
      
      setCurrentPage(page);
      setLoading(false);
    }, 200);
  };

  const loadMore = () => {
    performSearch(currentPage + 1);
  };

  const toggleAmenity = (amenity: string) => {
    if (filters.amenities.includes(amenity)) {
      setFilters({
        ...filters,
        amenities: filters.amenities.filter(a => a !== amenity)
      });
    } else {
      setFilters({
        ...filters,
        amenities: [...filters.amenities, amenity]
      });
    }
  };

  const activeFiltersCount = 
    (filters.starRating > 0 ? 1 : 0) +
    (filters.propertyType ? 1 : 0) +
    filters.amenities.length +
    (filters.maxPrice < 50000 ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 sticky top-20 z-30">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-blue-900" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hotels, areas, or attractions..."
              className="w-full pl-14 pr-6 py-4 border-3 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-900 text-lg transition-all"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-8 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl hover:shadow-xl transition-all flex items-center gap-3 whitespace-nowrap relative"
          >
            <SlidersHorizontal className="w-6 h-6" />
            <span className="hidden md:inline text-lg">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-sm">
              <span className="text-3xl font-bold text-blue-900">{searchResults.total.toLocaleString('en-IN')}</span>
              <span className="text-gray-600 ml-2">hotels available</span>
            </div>
            
            {searchResults.hotels.filter(h => h.isDeal).length > 0 && (
              <div className="px-4 py-2 bg-orange-100 text-orange-900 rounded-full text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {searchResults.hotels.filter(h => h.isDeal).length} Great Deals
              </div>
            )}
            
            {searchResults.hotels.filter(h => h.isNew).length > 0 && (
              <div className="px-4 py-2 bg-green-100 text-green-900 rounded-full text-sm font-medium flex items-center gap-2">
                <Award className="w-4 h-4" />
                {searchResults.hotels.filter(h => h.isNew).length} New Properties
              </div>
            )}
          </div>
          
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
            className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white text-base"
          >
            <option value="popular">Most Popular</option>
            <option value="deals">Best Deals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl text-gray-900 font-semibold">Refine Your Search</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <label className="text-lg text-gray-900 font-medium block">Price per Night</label>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div className="flex items-center justify-between">
                <span className="px-6 py-3 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl text-lg font-medium">
                  ₹{filters.minPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-gray-500">to</span>
                <span className="px-6 py-3 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl text-lg font-medium">
                  ₹{filters.maxPrice.toLocaleString('en-IN')}
                  {filters.maxPrice >= 50000 && '+'}
                </span>
              </div>
            </div>
          </div>

          {/* Star Rating */}
          <div className="space-y-4">
            <label className="text-lg text-gray-900 font-medium block">Star Rating</label>
            <div className="grid grid-cols-6 gap-3">
              {[0, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setFilters({ ...filters, starRating: rating === filters.starRating ? 0 : rating })}
                  className={`py-4 rounded-2xl border-3 transition-all ${
                    filters.starRating === rating
                      ? 'border-blue-900 bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-xl scale-105'
                      : 'border-gray-200 hover:border-blue-300 hover:scale-105'
                  }`}
                >
                  {rating === 0 ? (
                    <span className="font-medium">Any</span>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-lg font-bold">{rating}</span>
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-4">
            <label className="text-lg text-gray-900 font-medium block">Property Type</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {['Hotel', 'Resort', 'Homestay', 'Hostel', 'Villa', 'Apartment', 'Boutique', 'Heritage', 'Beach Resort', 'Mountain Lodge'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilters({ 
                    ...filters, 
                    propertyType: filters.propertyType === type ? '' : type 
                  })}
                  className={`py-4 px-4 rounded-2xl border-3 transition-all ${
                    filters.propertyType === type
                      ? 'border-blue-900 bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-xl'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-sm font-medium">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <label className="text-lg text-gray-900 font-medium block">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking', 'AC', 'Room Service', 'Breakfast Included', 'Pet Friendly', 'Garden', 'Beach Access', 'Mountain View'].map(amenity => (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`py-3 px-4 rounded-xl border-2 transition-all text-sm ${
                    filters.amenities.includes(amenity)
                      ? 'border-blue-900 bg-blue-50 text-blue-900 font-semibold'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && currentPage === 1 && (
        <div className="text-center py-20">
          <div className="inline-block w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Finding the best hotels for you...</p>
        </div>
      )}

      {/* Hotels Grid */}
      {!loading || currentPage > 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {searchResults.hotels.map(hotel => {
            const finalPrice = hotel.discountedPrice || hotel.basePrice;
            const discount = hotel.discountedPrice 
              ? Math.round((1 - hotel.discountedPrice / hotel.basePrice) * 100)
              : 0;

            return (
              <div
                key={hotel.id}
                onClick={() => onHotelSelect(hotel.id)}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer group transform hover:-translate-y-2 duration-300"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {hotel.isPopular && (
                      <div className="px-3 py-1.5 bg-red-600 text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <TrendingUp className="w-3 h-3" />
                        Popular
                      </div>
                    )}
                    {hotel.isDeal && (
                      <div className="px-3 py-1.5 bg-orange-600 text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Zap className="w-3 h-3" />
                        Deal
                      </div>
                    )}
                    {hotel.isNew && (
                      <div className="px-3 py-1.5 bg-green-600 text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Award className="w-3 h-3" />
                        New
                      </div>
                    )}
                  </div>

                  <div className="absolute top-4 right-4">
                    <button className="p-2.5 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors">
                      <Heart className="w-5 h-5 text-gray-600 hover:text-red-600" />
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">{hotel.rating}</span>
                    <span className="text-sm text-gray-600">({hotel.reviewCount})</span>
                  </div>

                  {/* Discount */}
                  {discount > 0 && (
                    <div className="absolute bottom-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-lg">
                      {discount}% OFF
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors mb-1 line-clamp-1">
                      {hotel.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {hotel.area}, {hotel.destination}
                    </p>
                  </div>

                  {/* Property Type & Stars */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-lg text-xs font-medium">
                      {hotel.propertyType}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: hotel.starRating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  {hotel.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {hotel.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bookings Today */}
                  {hotel.bookingsToday > 10 && (
                    <p className="text-xs text-red-600 font-medium mb-3">
                      🔥 {hotel.bookingsToday} people booked today
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-end justify-between pt-3 border-t-2 border-gray-100">
                    <div>
                      {hotel.discountedPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          ₹{hotel.basePrice.toLocaleString('en-IN')}
                        </p>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-blue-900">
                          ₹{finalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm text-gray-600">/night</span>
                      </div>
                    </div>
                    <button className="px-5 py-2.5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Load More */}
      {searchResults.hasMore && !loading && (
        <div className="text-center pt-8">
          <button
            onClick={loadMore}
            className="px-12 py-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl hover:shadow-2xl transition-all text-lg font-medium"
          >
            Load More Hotels ({searchResults.total - searchResults.hotels.length} remaining)
          </button>
        </div>
      )}

      {/* Loading More */}
      {loading && currentPage > 1 && (
        <div className="text-center py-8">
          <div className="inline-block w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}