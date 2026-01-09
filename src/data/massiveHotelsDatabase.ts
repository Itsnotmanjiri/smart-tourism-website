// MASSIVE HOTEL DATABASE - 100,000+ HOTELS
// Industry-scale database with intelligent generation

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  area: string;
  propertyType: 'Hotel' | 'Resort' | 'Homestay' | 'Hostel' | 'Villa' | 'Apartment' | 'Boutique' | 'Heritage' | 'Beach Resort' | 'Mountain Lodge';
  starRating: number;
  basePrice: number;
  discountedPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  address: string;
  description: string;
  roomTypes: {
    type: string;
    price: number;
    occupancy: number;
    available: number;
    amenities: string[];
  }[];
  latitude: number;
  longitude: number;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  isPopular: boolean;
  isDeal: boolean;
  isNew: boolean;
  bookingsToday: number;
  views: number;
  nearbyAttractions: string[];
  hotelChain?: string;
  tags: string[];
}

// Massive arrays for realistic combinations
const hotelPrefixes = [
  'Taj', 'Oberoi', 'Leela', 'Royal', 'Grand', 'Imperial', 'Palace', 'Heritage', 'Luxury', 'Premium',
  'Elite', 'Crown', 'Majestic', 'Paradise', 'Golden', 'Silver', 'Pearl', 'Diamond', 'Emerald', 'Sapphire',
  'Radisson', 'Hyatt', 'Hilton', 'Marriott', 'ITC', 'The', 'Le', 'La', 'Vista', 'Azure',
  'Sunset', 'Sunrise', 'Ocean', 'Mountain', 'Valley', 'River', 'Lake', 'Forest', 'Garden', 'Palm',
  'Blue', 'White', 'Green', 'Red', 'Yellow', 'Orange', 'Purple', 'Pink', 'Platinum', 'Ruby',
  'Topaz', 'Amber', 'Jade', 'Opal', 'Crystal', 'Jewel', 'Treasure', 'Fortune', 'Harmony', 'Serenity',
  'Tranquil', 'Peaceful', 'Blissful', 'Delightful', 'Wonderful', 'Magnificent', 'Splendid', 'Glorious', 'Divine', 'Sacred',
  'Regal', 'Noble', 'Sovereign', 'Monarch', 'Emperor', 'King', 'Queen', 'Prince', 'Princess', 'Duke',
  'Boutique', 'Classic', 'Modern', 'Contemporary', 'Traditional', 'Vintage', 'Antique', 'Historic', 'Colonial', 'Victorian',
  'Art', 'Zen', 'Lotus', 'Orchid', 'Lily', 'Rose', 'Jasmine', 'Tulip', 'Magnolia', 'Dahlia'
];

const hotelSuffixes = [
  'Hotel', 'Resort', 'Palace', 'Retreat', 'Suites', 'Inn', 'Lodge', 'Villa', 'Residency', 'Manor',
  'Estate', 'Haven', 'Sanctuary', 'Oasis', 'Garden', 'View', 'Heights', 'Towers', 'Plaza', 'Grand',
  'Regency', 'Continental', 'International', 'Paradise', 'Bay', 'Beach', 'Coast', 'Shore', 'Lagoon', 'Island',
  'Park', 'Grove', 'Woods', 'Forest', 'Hills', 'Valley', 'Mountain', 'Peak', 'Summit', 'Ridge',
  'House', 'Home', 'Stay', 'Rest', 'Comfort', 'Luxury', 'Premium', 'Elite', 'Royal', 'Imperial',
  'Palace', 'Castle', 'Fort', 'Haveli', 'Mahal', 'Kothi', 'Bungalow', 'Cottage', 'Farmhouse', 'Retreat',
  'Spa', 'Wellness', 'Club', 'Court', 'Square', 'Circle', 'Avenue', 'Boulevard', 'Lane', 'Street',
  'Gateway', 'Landmark', 'Icon', 'Legend', 'Heritage', 'Legacy', 'Tradition', 'Culture', 'Spirit', 'Soul',
  'Dream', 'Fantasy', 'Magic', 'Wonder', 'Marvel', 'Miracle', 'Bliss', 'Joy', 'Delight', 'Pleasure',
  'Experience', 'Escape', 'Adventure', 'Journey', 'Discovery', 'Exploration', 'Destination', 'Paradise', 'Utopia', 'Nirvana'
];

const hotelAreas = [
  'City Center', 'Beach Road', 'Mall Road', 'MG Road', 'Airport Road', 'Railway Station Area',
  'Old Town', 'New Town', 'Commercial District', 'Business District', 'Tourist Area', 'Heritage Zone',
  'Beach Front', 'Lakeside', 'Riverside', 'Mountain View', 'Valley View', 'Garden Area',
  'Shopping District', 'Entertainment Zone', 'Cultural Quarter', 'Historic Center', 'Modern Quarter',
  'Near Market', 'Near Temple', 'Near Beach', 'Near Airport', 'Near Station', 'Downtown'
];

const amenitiesList = [
  'WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking', 'AC', 'Room Service', 'Laundry',
  'Conference Room', 'Airport Shuttle', 'Pet Friendly', 'Garden', 'Terrace', 'Business Center',
  'Breakfast Included', '24/7 Front Desk', 'Elevator', 'Wheelchair Accessible', 'Kid Friendly',
  'Swimming Pool', 'Rooftop', 'Balcony', 'Sea View', 'Mountain View', 'City View', 'River View',
  'Jacuzzi', 'Sauna', 'Steam Room', 'Yoga Center', 'Library', 'Game Room', 'Play Area',
  'BBQ Area', 'Picnic Area', 'Cycling', 'Trekking', 'Water Sports', 'Adventure Activities',
  'Doctor on Call', 'Pharmacy', 'ATM', 'Currency Exchange', 'Travel Desk', 'Car Rental',
  'Valet Parking', 'Concierge', 'Housekeeping', 'Security 24/7', 'CCTV', 'Locker',
  'Mini Bar', 'Tea/Coffee Maker', 'Hair Dryer', 'Iron', 'Safe', 'Bathtub', 'Shower'
];

const hotelChains = [
  'Taj Hotels', 'Oberoi Hotels', 'ITC Hotels', 'The Leela', 'Hyatt', 'Marriott', 'Hilton',
  'Radisson', 'Novotel', 'Accor', 'Lemon Tree', 'Ginger', 'FabHotels', 'OYO', 'Treebo',
  null, null, null, null, null // Many independent hotels
];

const attractions = [
  'Beach', 'Temple', 'Fort', 'Palace', 'Museum', 'Park', 'Market', 'Mall', 'Restaurant District',
  'Night Market', 'Waterfall', 'Lake', 'River', 'Mountain', 'Valley', 'Garden', 'Zoo', 'Aquarium',
  'Theme Park', 'Adventure Park', 'Water Park', 'Historical Monument', 'Cultural Center', 'Art Gallery'
];

const destinationData: Record<string, { lat: number; lng: number; basePrice: number; areas: number }> = {
  'Goa': { lat: 15.2993, lng: 74.1240, basePrice: 3000, areas: 30 },
  'Manali': { lat: 32.2396, lng: 77.1887, basePrice: 2500, areas: 25 },
  'Jaipur': { lat: 26.9124, lng: 75.7873, basePrice: 2200, areas: 28 },
  'Kerala': { lat: 10.8505, lng: 76.2711, basePrice: 2800, areas: 35 },
  'Udaipur': { lat: 24.5854, lng: 73.7125, basePrice: 3500, areas: 22 },
  'Rishikesh': { lat: 30.0869, lng: 78.2676, basePrice: 1800, areas: 20 },
  'Varanasi': { lat: 25.3176, lng: 82.9739, basePrice: 1500, areas: 26 },
  'Amritsar': { lat: 31.6340, lng: 74.8723, basePrice: 2000, areas: 24 },
  'Hampi': { lat: 15.3350, lng: 76.4600, basePrice: 1600, areas: 18 },
  'Darjeeling': { lat: 27.0410, lng: 88.2663, basePrice: 2400, areas: 20 }
};

const roomTypeTemplates = [
  { type: 'Standard Room', multiplier: 1, occupancy: 2, amenities: ['AC', 'TV', 'WiFi'] },
  { type: 'Deluxe Room', multiplier: 1.3, occupancy: 2, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar'] },
  { type: 'Premium Room', multiplier: 1.6, occupancy: 3, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Balcony'] },
  { type: 'Executive Suite', multiplier: 2, occupancy: 3, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Balcony', 'Living Room'] },
  { type: 'Family Suite', multiplier: 2.2, occupancy: 4, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Kitchenette', '2 Bedrooms'] },
  { type: 'Presidential Suite', multiplier: 3.5, occupancy: 6, amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Butler Service'] }
];

function generateHotelName(seed: number): string {
  const prefix = hotelPrefixes[seed % hotelPrefixes.length];
  const suffix = hotelSuffixes[Math.floor(seed / hotelPrefixes.length) % hotelSuffixes.length];
  return `${prefix} ${suffix}`;
}

function selectRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

function generateHotelsForDestination(destination: string, count: number): Hotel[] {
  const hotels: Hotel[] = [];
  const destData = destinationData[destination];
  
  for (let i = 0; i < count; i++) {
    const seed = i + destination.charCodeAt(0) * 10000;
    const starRating = Math.random() < 0.05 ? 5 : Math.random() < 0.15 ? 4 : Math.random() < 0.4 ? 3 : 2;
    
    const propertyTypes: Hotel['propertyType'][] = [
      'Hotel', 'Resort', 'Homestay', 'Hostel', 'Villa', 'Apartment',
      'Boutique', 'Heritage', 'Beach Resort', 'Mountain Lodge'
    ];
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    
    // Dynamic pricing with variation
    const priceVariation = (Math.random() * 0.6 + 0.7); // 70% to 130%
    const starMultiplier = starRating / 3;
    const areaMultiplier = Math.random() < 0.3 ? 1.5 : 1; // Prime locations cost more
    const basePrice = Math.round(destData.basePrice * priceVariation * starMultiplier * areaMultiplier / 100) * 100;
    
    // Discount system
    const hasDiscount = Math.random() < 0.25; // 25% hotels have discounts
    const discountedPrice = hasDiscount ? Math.round(basePrice * (Math.random() * 0.3 + 0.6)) : undefined;
    
    const rating = parseFloat((3.5 + Math.random() * 1.5).toFixed(1));
    const reviewCount = Math.floor(Math.random() * 5000) + 10;
    
    const amenitiesCount = starRating * 3 + Math.floor(Math.random() * 8);
    const amenities = selectRandomItems(amenitiesList, amenitiesCount);
    
    const roomTypes = roomTypeTemplates.map(template => ({
      type: template.type,
      price: Math.round(basePrice * template.multiplier),
      occupancy: template.occupancy,
      available: Math.floor(Math.random() * 15) + 1,
      amenities: template.amenities
    }));

    const imageVariety = Math.floor(Math.random() * 20);
    const images = [
      `https://images.unsplash.com/photo-15660${73271 + imageVariety}259?w=800&q=80`,
      `https://images.unsplash.com/photo-15421${41918 + imageVariety}882?w=800&q=80`,
      `https://images.unsplash.com/photo-15618${24204 + imageVariety}774?w=800&q=80`,
      `https://images.unsplash.com/photo-15626${30089 + imageVariety}945?w=800&q=80`
    ];

    const area = hotelAreas[Math.floor(Math.random() * hotelAreas.length)];
    const nearbyAttractions = selectRandomItems(attractions, 3 + Math.floor(Math.random() * 3));
    const hotelChain = hotelChains[Math.floor(Math.random() * hotelChains.length)];
    
    const isPopular = reviewCount > 3000 && rating > 4.2;
    const isDeal = hasDiscount && Math.random() < 0.5;
    const isNew = Math.random() < 0.08; // 8% new properties
    
    const bookingsToday = Math.floor(Math.random() * 50) + (isPopular ? 20 : 0);
    const views = reviewCount * (Math.floor(Math.random() * 5) + 2);
    
    const tags: string[] = [];
    if (isPopular) tags.push('Popular');
    if (isDeal) tags.push('Great Deal');
    if (isNew) tags.push('Newly Opened');
    if (rating >= 4.5) tags.push('Highly Rated');
    if (bookingsToday > 30) tags.push('Trending');
    if (amenities.includes('Breakfast Included')) tags.push('Free Breakfast');
    if (cancellationPolicy.includes('Free')) tags.push('Free Cancellation');

    hotels.push({
      id: `${destination.toLowerCase()}-${i + 1}`,
      name: generateHotelName(seed),
      destination,
      area,
      propertyType,
      starRating,
      basePrice,
      discountedPrice,
      rating,
      reviewCount,
      images,
      amenities,
      address: `${area}, ${destination}, India - ${400000 + Math.floor(Math.random() * 99999)}`,
      description: `Experience ${hotelChain ? 'the renowned hospitality of ' + hotelChain + ' at' : 'luxury at'} ${generateHotelName(seed)}. Located in ${area}, ${destination}, offering ${propertyType.toLowerCase()} accommodation with ${amenities.length} amenities including ${amenities.slice(0, 3).join(', ')}. ${nearbyAttractions.length > 0 ? `Near ${nearbyAttractions[0]} and other attractions.` : ''}`,
      roomTypes,
      latitude: destData.lat + (Math.random() * 0.2 - 0.1),
      longitude: destData.lng + (Math.random() * 0.2 - 0.1),
      checkInTime: Math.random() < 0.7 ? '2:00 PM' : '12:00 PM',
      checkOutTime: Math.random() < 0.8 ? '11:00 AM' : '12:00 PM',
      cancellationPolicy: Math.random() < 0.6 ? 'Free cancellation up to 24 hours before check-in' : 'Non-refundable',
      isPopular,
      isDeal,
      isNew,
      bookingsToday,
      views,
      nearbyAttractions,
      hotelChain: hotelChain || undefined,
      tags
    });
  }
  
  return hotels;
}

// Generate 10,000 hotels per destination = 100,000 total hotels
export const allHotels: Hotel[] = [
  ...generateHotelsForDestination('Goa', 10000),
  ...generateHotelsForDestination('Manali', 10000),
  ...generateHotelsForDestination('Jaipur', 10000),
  ...generateHotelsForDestination('Kerala', 10000),
  ...generateHotelsForDestination('Udaipur', 10000),
  ...generateHotelsForDestination('Rishikesh', 10000),
  ...generateHotelsForDestination('Varanasi', 10000),
  ...generateHotelsForDestination('Amritsar', 10000),
  ...generateHotelsForDestination('Hampi', 10000),
  ...generateHotelsForDestination('Darjeeling', 10000)
];

// Intelligent search that ALWAYS returns results
export function intelligentHotelSearch(filters: {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  starRating?: number;
  propertyType?: string;
  amenities?: string[];
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'popularity' | 'deals';
  searchQuery?: string;
  page?: number;
  limit?: number;
}): { hotels: Hotel[]; total: number; hasMore: boolean } {
  let results = [...allHotels];
  let relaxedFilters = false;
  
  // Apply filters
  if (filters.destination) {
    results = results.filter(h => h.destination === filters.destination);
  }
  
  if (filters.minPrice !== undefined) {
    results = results.filter(h => (h.discountedPrice || h.basePrice) >= filters.minPrice);
  }
  
  if (filters.maxPrice !== undefined) {
    results = results.filter(h => (h.discountedPrice || h.basePrice) <= filters.maxPrice);
  }
  
  if (filters.starRating) {
    results = results.filter(h => h.starRating >= filters.starRating);
  }
  
  if (filters.propertyType) {
    results = results.filter(h => h.propertyType === filters.propertyType);
  }
  
  if (filters.amenities && filters.amenities.length > 0) {
    results = results.filter(h => 
      filters.amenities!.every(amenity => h.amenities.includes(amenity))
    );
  }
  
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    results = results.filter(h => 
      h.name.toLowerCase().includes(query) ||
      h.propertyType.toLowerCase().includes(query) ||
      h.area.toLowerCase().includes(query) ||
      h.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // INTELLIGENT FALLBACK - If no results, relax filters
  if (results.length === 0 && filters.amenities && filters.amenities.length > 0) {
    // Remove amenity filters
    results = intelligentHotelSearch({ ...filters, amenities: [] }).hotels;
    relaxedFilters = true;
  }
  
  if (results.length === 0 && filters.propertyType) {
    // Remove property type filter
    results = intelligentHotelSearch({ ...filters, propertyType: undefined }).hotels;
    relaxedFilters = true;
  }
  
  if (results.length === 0 && filters.starRating) {
    // Reduce star rating
    results = intelligentHotelSearch({ ...filters, starRating: Math.max(2, filters.starRating - 1) }).hotels;
    relaxedFilters = true;
  }
  
  // Sorting
  switch (filters.sortBy) {
    case 'price-low':
      results.sort((a, b) => (a.discountedPrice || a.basePrice) - (b.discountedPrice || b.basePrice));
      break;
    case 'price-high':
      results.sort((a, b) => (b.discountedPrice || b.basePrice) - (a.discountedPrice || a.basePrice));
      break;
    case 'rating':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'deals':
      results.sort((a, b) => {
        if (a.isDeal && !b.isDeal) return -1;
        if (!a.isDeal && b.isDeal) return 1;
        return b.rating - a.rating;
      });
      break;
    case 'popularity':
    default:
      results.sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return b.bookingsToday - a.bookingsToday;
      });
  }
  
  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 50;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    hotels: results.slice(startIndex, endIndex),
    total: results.length,
    hasMore: endIndex < results.length
  };
}

export function getHotelById(id: string): Hotel | undefined {
  return allHotels.find(h => h.id === id);
}

console.log(`✅ Massive Hotel Database Loaded: ${allHotels.length.toLocaleString()} hotels`);
