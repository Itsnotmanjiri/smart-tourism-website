import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, MapPin, Wifi, Car, Coffee, Dumbbell, Wind, X, ChevronDown } from 'lucide-react';
import { allHotels, searchHotels, Hotel } from '../data/hotelsDatabase';

interface AdvancedHotelSearchProps {
  destination: string;
  onHotelSelect: (hotelId: string) => void;
}

export function AdvancedHotelSearch({ destination, onHotelSelect }: AdvancedHotelSearchProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 20000,
    starRating: 0,
    propertyType: '',
    amenities: [] as string[],
    sortBy: 'popularity' as 'price-low' | 'price-high' | 'rating' | 'popularity'
  });

  useEffect(() => {
    applyFilters();
  }, [destination, filters]);

  const applyFilters = () => {
    const results = searchHotels({
      destination,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      starRating: filters.starRating,
      propertyType: filters.propertyType || undefined,
      amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
      sortBy: filters.sortBy
    });
    
    // Apply text search
    if (searchQuery) {
      const filtered = results.filter(h => 
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.propertyType.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setHotels(filtered);
    } else {
      setHotels(results);
    }
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

  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 20000,
      starRating: 0,
      propertyType: '',
      amenities: [],
      sortBy: 'popularity'
    });
    setSearchQuery('');
  };

  const amenityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Parking': Car,
    'Restaurant': Coffee,
    'Gym': Dumbbell,
    'AC': Wind
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hotels by name or type..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 text-lg"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-4 bg-blue-900 text-white rounded-xl hover:bg-blue-950 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden md:inline">Filters</span>
            {(filters.amenities.length > 0 || filters.starRating > 0 || filters.propertyType) && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {filters.amenities.length + (filters.starRating > 0 ? 1 : 0) + (filters.propertyType ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-semibold text-blue-900">{hotels.length}</span> hotels found in {destination}
          </p>
          
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-900"
          >
            <option value="popularity">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl text-gray-900">Advanced Filters</h3>
            <button
              onClick={resetFilters}
              className="text-blue-900 hover:text-blue-950 text-sm font-medium"
            >
              Reset All
            </button>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-gray-900 block mb-3">Price Range per Night</label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="500"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="px-3 py-2 bg-gray-100 rounded-lg">₹{filters.minPrice}</span>
                <span className="text-gray-600">to</span>
                <span className="px-3 py-2 bg-gray-100 rounded-lg">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="text-gray-900 block mb-3">Minimum Star Rating</label>
            <div className="flex gap-2">
              {[0, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setFilters({ ...filters, starRating: rating === filters.starRating ? 0 : rating })}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    filters.starRating === rating
                      ? 'border-blue-900 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {rating === 0 ? 'Any' : (
                    <div className="flex items-center justify-center gap-1">
                      <span>{rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="text-gray-900 block mb-3">Property Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Hotel', 'Resort', 'Homestay', 'Hostel', 'Villa', 'Apartment'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilters({ 
                    ...filters, 
                    propertyType: filters.propertyType === type ? '' : type 
                  })}
                  className={`py-3 rounded-xl border-2 transition-all ${
                    filters.propertyType === type
                      ? 'border-blue-900 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-gray-900 block mb-3">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking', 'AC', 'Room Service', 'Laundry', 'Pet Friendly', 'Garden'].map(amenity => {
                const Icon = amenityIcons[amenity];
                return (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                      filters.amenities.includes(amenity)
                        ? 'border-blue-900 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span className="text-sm">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Hotels Grid */}
      {hotels.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No hotels found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
          <button
            onClick={resetFilters}
            className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-950 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map(hotel => (
            <div
              key={hotel.id}
              onClick={() => onHotelSelect(hotel.id)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
            >
              {/* Hotel Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.images[0]}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {hotel.rating}
                </div>
                <div className="absolute top-3 right-3 bg-blue-900 text-white px-3 py-1 rounded-full text-sm">
                  {hotel.starRating} Star
                </div>
              </div>

              {/* Hotel Info */}
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="text-lg text-gray-900 group-hover:text-blue-900 transition-colors">
                    {hotel.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {hotel.propertyType} • {hotel.destination}
                  </p>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {hotel.amenities.slice(0, 4).map(amenity => {
                    const Icon = amenityIcons[amenity];
                    return (
                      <div key={amenity} className="px-2 py-1 bg-gray-100 rounded text-xs flex items-center gap-1">
                        {Icon && <Icon className="w-3 h-3" />}
                        {amenity}
                      </div>
                    );
                  })}
                  {hotel.amenities.length > 4 && (
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs">
                      +{hotel.amenities.length - 4} more
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-end justify-between pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600">{hotel.reviewCount} reviews</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-blue-900">₹{hotel.basePrice.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-600">per night</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {hotels.length > 12 && (
        <div className="text-center">
          <button className="px-8 py-4 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors">
            Load More Hotels
          </button>
        </div>
      )}
    </div>
  );
}
