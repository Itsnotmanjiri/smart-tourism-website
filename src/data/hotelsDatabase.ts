// MASSIVE HOTEL DATABASE - 100+ HOTELS PER CITY

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  propertyType: 'Hotel' | 'Resort' | 'Homestay' | 'Hostel' | 'Villa' | 'Apartment';
  starRating: number;
  basePrice: number;
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
  }[];
  latitude: number;
  longitude: number;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
}

const hotelPrefixes = ['Taj', 'Oberoi', 'Leela', 'Royal', 'Grand', 'Imperial', 'Palace', 'Heritage', 'Luxury', 'Premium', 'Elite', 'Crown', 'Majestic', 'Paradise', 'Golden', 'Silver', 'Pearl', 'Diamond', 'Emerald', 'Sapphire'];
const hotelSuffixes = ['Hotel', 'Resort', 'Palace', 'Retreat', 'Suites', 'Inn', 'Lodge', 'Villa', 'Residency', 'Manor', 'Estate', 'Haven', 'Sanctuary', 'Oasis', 'Garden', 'View', 'Heights', 'Towers', 'Plaza'];
const amenitiesList = ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking', 'AC', 'Room Service', 'Laundry', 'Conference Room', 'Airport Shuttle', 'Pet Friendly', 'Garden', 'Terrace', 'Business Center'];

const destinationData = {
  'Goa': { lat: 15.2993, lng: 74.1240, basePrice: 3000, imageIndex: 1 },
  'Manali': { lat: 32.2396, lng: 77.1887, basePrice: 2500, imageIndex: 2 },
  'Jaipur': { lat: 26.9124, lng: 75.7873, basePrice: 2200, imageIndex: 3 },
  'Kerala': { lat: 10.8505, lng: 76.2711, basePrice: 2800, imageIndex: 4 },
  'Udaipur': { lat: 24.5854, lng: 73.7125, basePrice: 3500, imageIndex: 5 },
  'Rishikesh': { lat: 30.0869, lng: 78.2676, basePrice: 1800, imageIndex: 6 },
  'Varanasi': { lat: 25.3176, lng: 82.9739, basePrice: 1500, imageIndex: 7 },
  'Amritsar': { lat: 31.6340, lng: 74.8723, basePrice: 2000, imageIndex: 8 },
  'Hampi': { lat: 15.3350, lng: 76.4600, basePrice: 1600, imageIndex: 9 },
  'Darjeeling': { lat: 27.0410, lng: 88.2663, basePrice: 2400, imageIndex: 10 }
};

const roomTypeTemplates = [
  { type: 'Standard Room', multiplier: 1, occupancy: 2 },
  { type: 'Deluxe Room', multiplier: 1.3, occupancy: 2 },
  { type: 'Premium Room', multiplier: 1.6, occupancy: 3 },
  { type: 'Suite', multiplier: 2, occupancy: 4 },
  { type: 'Presidential Suite', multiplier: 3.5, occupancy: 6 }
];

function generateHotelName(index: number): string {
  const prefix = hotelPrefixes[index % hotelPrefixes.length];
  const suffix = hotelSuffixes[Math.floor(index / hotelPrefixes.length) % hotelSuffixes.length];
  return `${prefix} ${suffix}`;
}

function selectRandomAmenities(count: number): string[] {
  const shuffled = [...amenitiesList].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateHotels(destination: string, count: number): Hotel[] {
  const hotels: Hotel[] = [];
  const destData = destinationData[destination as keyof typeof destinationData];
  
  for (let i = 0; i < count; i++) {
    const starRating = Math.floor(Math.random() * 4) + 2; // 2-5 stars
    const propertyTypes: Hotel['propertyType'][] = ['Hotel', 'Resort', 'Homestay', 'Hostel', 'Villa', 'Apartment'];
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    
    const basePriceVariation = destData.basePrice + (Math.random() * 2000 - 1000);
    const starMultiplier = starRating / 3;
    const basePrice = Math.round(basePriceVariation * starMultiplier);
    
    const rating = (3.5 + Math.random() * 1.5).toFixed(1);
    const reviewCount = Math.floor(Math.random() * 1000) + 50;
    
    const amenitiesCount = starRating + Math.floor(Math.random() * 5);
    const amenities = selectRandomAmenities(amenitiesCount);
    
    const roomTypes = roomTypeTemplates.map(template => ({
      type: template.type,
      price: Math.round(basePrice * template.multiplier),
      occupancy: template.occupancy,
      available: Math.floor(Math.random() * 10) + 1
    }));

    const images = [
      `https://images.unsplash.com/photo-156607${3271259 + destData.imageIndex}?w=800&q=80`,
      `https://images.unsplash.com/photo-156607${3271260 + destData.imageIndex}?w=800&q=80`,
      `https://images.unsplash.com/photo-156607${3271261 + destData.imageIndex}?w=800&q=80`
    ];

    hotels.push({
      id: `${destination.toLowerCase()}-${i + 1}`,
      name: generateHotelName(i),
      destination,
      propertyType,
      starRating,
      basePrice,
      rating: parseFloat(rating),
      reviewCount,
      images,
      amenities,
      address: `${i + 1}, Tourist Area, ${destination}, India`,
      description: `Experience luxury and comfort at ${generateHotelName(i)}. Located in the heart of ${destination}, offering world-class amenities and exceptional service.`,
      roomTypes,
      latitude: destData.lat + (Math.random() * 0.1 - 0.05),
      longitude: destData.lng + (Math.random() * 0.1 - 0.05),
      checkInTime: '2:00 PM',
      checkOutTime: '11:00 AM',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in'
    });
  }
  
  return hotels;
}

// Generate 120 hotels per destination
export const allHotels: Hotel[] = [
  ...generateHotels('Goa', 120),
  ...generateHotels('Manali', 120),
  ...generateHotels('Jaipur', 120),
  ...generateHotels('Kerala', 120),
  ...generateHotels('Udaipur', 120),
  ...generateHotels('Rishikesh', 120),
  ...generateHotels('Varanasi', 120),
  ...generateHotels('Amritsar', 120),
  ...generateHotels('Hampi', 120),
  ...generateHotels('Darjeeling', 120)
];

export function getHotelsByDestination(destination: string): Hotel[] {
  return allHotels.filter(h => h.destination === destination);
}

export function getHotelById(id: string): Hotel | undefined {
  return allHotels.find(h => h.id === id);
}

export function searchHotels(filters: {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  starRating?: number;
  propertyType?: string;
  amenities?: string[];
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'popularity';
}): Hotel[] {
  let results = [...allHotels];
  
  if (filters.destination) {
    results = results.filter(h => h.destination === filters.destination);
  }
  
  if (filters.minPrice !== undefined) {
    results = results.filter(h => h.basePrice >= filters.minPrice);
  }
  
  if (filters.maxPrice !== undefined) {
    results = results.filter(h => h.basePrice <= filters.maxPrice);
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
  
  // Sorting
  if (filters.sortBy === 'price-low') {
    results.sort((a, b) => a.basePrice - b.basePrice);
  } else if (filters.sortBy === 'price-high') {
    results.sort((a, b) => b.basePrice - a.basePrice);
  } else if (filters.sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (filters.sortBy === 'popularity') {
    results.sort((a, b) => b.reviewCount - a.reviewCount);
  }
  
  return results;
}

// Total: 1,200 hotels
console.log(`Total hotels in database: ${allHotels.length}`);
