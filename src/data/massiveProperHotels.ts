// MASSIVE HOTELS DATABASE - 100 HOTELS (10 PER CITY ACROSS 10 CITIES)
// Production-ready, realistic data

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  area: string;
  propertyType: 'Hotel' | 'Resort' | 'Homestay' | 'Hostel' | 'Villa';
  starRating: number;
  basePrice: number;
  discountedPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  address: string;
  description: string;
  rooms: {
    type: string;
    price: number;
    available: number;
  }[];
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  verified: boolean;
  available: boolean;
  // UI display properties
  tags: string[];
  isDeal: boolean;
  isNew: boolean;
  isPopular: boolean;
  bookingsToday: number;
}

// 10 INDIAN CITIES WITH 10 HOTELS EACH
const cities = ['Goa', 'Manali', 'Jaipur', 'Kerala', 'Udaipur', 'Rishikesh', 'Varanasi', 'Amritsar', 'Hampi', 'Darjeeling'];

const hotelNamePrefixes = ['The Royal', 'Grand', 'Taj', 'Heritage', 'Paradise', 'Golden', 'Blue', 'Ocean', 'Mountain', 'Palace'];
const hotelNameSuffixes = ['Palace', 'Resort', 'Inn', 'Retreat', 'Lodge', 'Villa', 'Havens', 'Suites', 'Regency', 'Grand'];

const areas: { [key: string]: string[] } = {
  'Goa': ['Calangute', 'Baga', 'Anjuna', 'Palolem', 'Candolim', 'Vagator', 'Morjim', 'Arambol', 'Colva', 'Benaulim'],
  'Manali': ['Old Manali', 'Mall Road', 'Vashisht', 'Solang Valley', 'Naggar', 'Kullu', 'Kasol', 'Manikaran', 'Rohtang', 'Gulaba'],
  'Jaipur': ['Pink City', 'Bani Park', 'C-Scheme', 'MI Road', 'Vaishali Nagar', 'Malviya Nagar', 'Mansarovar', 'Jagatpura', 'Tonk Road', 'Ajmer Road'],
  'Kerala': ['Munnar', 'Alleppey', 'Kovalam', 'Varkala', 'Wayanad', 'Kumarakom', 'Thekkady', 'Fort Kochi', 'Vagamon', 'Ponmudi'],
  'Udaipur': ['Lake Pichola', 'Fateh Sagar', 'City Palace Area', 'Ambrai Ghat', 'Sajjangarh', 'Hathi Pol', 'Gulab Bagh', 'Sukhadia Circle', 'Shilpgram', 'Ahar'],
  'Rishikesh': ['Laxman Jhula', 'Ram Jhula', 'Tapovan', 'Neelkanth', 'Shivpuri', 'Badrinath Road', 'Swarg Ashram', 'Muni Ki Reti', 'Geeta Bhawan', 'Triveni Ghat'],
  'Varanasi': ['Assi Ghat', 'Dashashwamedh Ghat', 'Godowlia', 'Lanka', 'Bhelupur', 'Sigra', 'Cantonment', 'Nadesar', 'Ramnagar', 'Sarnath'],
  'Amritsar': ['Golden Temple Area', 'Hall Bazaar', 'Lawrence Road', 'Ranjit Avenue', 'Mall Road', 'GT Road', 'Model Town', 'Chheharta', 'Majitha Road', 'Batala Road'],
  'Hampi': ['Hampi Bazaar', 'Virupapura Gaddi', 'Kamalapura', 'Anegundi', 'Sanapur', 'Tungabhadra', 'Hippie Island', 'Matanga Hill', 'Hemakuta Hill', 'Vittala Temple Area'],
  'Darjeeling': ['Mall Road', 'Chowrasta', 'Happy Valley', 'Ghoom', 'Lebong', 'Jalapahar', 'Observatory Hill', 'Tiger Hill', 'Batasia Loop', 'St. Paul\'s School']
};

const amenitiesList = [
  ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Room Service', 'Parking', 'AC'],
  ['Free WiFi', 'Rooftop Restaurant', 'Bar', 'Laundry', 'Airport Shuttle', 'Concierge', 'AC', 'TV'],
  ['Free WiFi', 'Mountain View', 'Bonfire', 'Garden', 'BBQ', 'Trekking', 'Parking', 'Hot Water'],
  ['Free WiFi', 'Beach Access', 'Water Sports', 'Yoga', 'Ayurveda', 'Restaurant', 'Pool', 'AC'],
  ['Free WiFi', 'Lake View', 'Boat Rides', 'Cultural Shows', 'Library', 'Terrace', 'Parking', 'AC'],
  ['Free WiFi', 'River View', 'Meditation', 'Yoga Classes', 'Organic Food', 'Library', 'Garden', 'Hot Water'],
  ['Free WiFi', 'Ghat View', 'Temple Nearby', 'Cultural Tours', 'Vegetarian Food', 'Terrace', 'Laundry', 'AC'],
  ['Free WiFi', 'Temple View', 'Punjabi Cuisine', 'Cultural Shows', 'Shopping Assistance', 'Parking', 'AC', 'TV'],
  ['Free WiFi', 'Ruins View', 'Bicycle Rental', 'Guided Tours', 'Rooftop Dining', 'Hammocks', 'Garden', 'Hot Water'],
  ['Free WiFi', 'Mountain View', 'Tea Estate Tours', 'Toy Train Booking', 'Bonfire', 'Library', 'Parking', 'Hot Water']
];

const propertyTypes: Array<'Hotel' | 'Resort' | 'Homestay' | 'Hostel' | 'Villa'> = ['Hotel', 'Resort', 'Homestay', 'Hostel', 'Villa'];

const ownerNames = [
  'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Singh', 'Vikram Mehta',
  'Neha Gupta', 'Arjun Reddy', 'Kavita Verma', 'Ravi Nair', 'Anjali Desai',
  'Sanjay Joshi', 'Pooja Iyer', 'Karan Malhotra', 'Deepika Rao', 'Rohit Chopra',
  'Meera Saxena', 'Aditya Khanna', 'Simran Bhatia', 'Varun Sethi', 'Ishita Agarwal'
];

// Generate 100 hotels (10 per city)
export const allHotels: Hotel[] = [];

const tagOptions = [
  ['Luxury', 'Comfortable', 'Spacious'],
  ['Budget Friendly', 'Clean', 'Cozy'],
  ['Family Friendly', 'Kids Welcome', 'Safe'],
  ['Romantic', 'Couple Friendly', 'Honeymoon Special'],
  ['Business', 'WiFi', 'Conference Room'],
  ['Adventure', 'Outdoor Activities', 'Trekking'],
  ['Beach View', 'Ocean Front', 'Sunset View'],
  ['Mountain View', 'Valley View', 'Nature'],
  ['Historic', 'Heritage', 'Cultural'],
  ['Modern', 'Contemporary', 'Trendy']
];

cities.forEach((city, cityIndex) => {
  for (let i = 0; i < 10; i++) {
    const hotelId = `hotel-${cityIndex * 10 + i + 1}`;
    const propertyType = propertyTypes[i % 5];
    const starRating = Math.floor(Math.random() * 3) + 3; // 3-5 stars
    const basePrice = propertyType === 'Hostel' ? 800 + (i * 100) : 
                      propertyType === 'Homestay' ? 1500 + (i * 200) :
                      propertyType === 'Hotel' ? 2500 + (i * 300) :
                      propertyType === 'Resort' ? 4000 + (i * 500) :
                      3000 + (i * 400);
    const rating = 3.5 + (Math.random() * 1.5);
    const reviewCount = 50 + Math.floor(Math.random() * 450);
    const isDeal = Math.random() > 0.6;
    const isNew = i < 2; // First 2 hotels in each city are new
    const isPopular = i < 3 || rating > 4.5; // First 3 or high-rated are popular

    allHotels.push({
      id: hotelId,
      name: `${hotelNamePrefixes[i]} ${city} ${hotelNameSuffixes[i]}`,
      destination: city,
      area: areas[city][i],
      propertyType,
      starRating,
      basePrice,
      discountedPrice: isDeal ? Math.floor(basePrice * 0.85) : undefined,
      rating: parseFloat(rating.toFixed(1)),
      reviewCount,
      images: [
        `https://images.unsplash.com/photo-${1566073771259 + cityIndex * 1000 + i}?w=800`,
        `https://images.unsplash.com/photo-${1571896349842 + cityIndex * 1000 + i}?w=800`,
        `https://images.unsplash.com/photo-${1582719508461 + cityIndex * 1000 + i}?w=800`
      ],
      amenities: amenitiesList[cityIndex],
      address: `${areas[city][i]}, ${city}, India`,
      description: `Experience luxury and comfort at ${hotelNamePrefixes[i]} ${city} ${hotelNameSuffixes[i]}. Located in the heart of ${areas[city][i]}, we offer world-class amenities and exceptional service.`,
      rooms: [
        { type: 'Deluxe Room', price: basePrice, available: 5 },
        { type: 'Suite', price: Math.floor(basePrice * 1.5), available: 3 },
        { type: 'Family Room', price: Math.floor(basePrice * 1.3), available: 4 }
      ],
      checkInTime: '2:00 PM',
      checkOutTime: '11:00 AM',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      ownerId: `owner-${cityIndex * 10 + i + 1}`,
      ownerName: ownerNames[(cityIndex * 10 + i) % 20],
      ownerPhone: `+91 ${90000 + (cityIndex * 10 + i + 1)}00000`,
      verified: Math.random() > 0.2,
      available: true,
      // UI display properties
      tags: tagOptions[i % tagOptions.length],
      isDeal,
      isNew,
      isPopular,
      bookingsToday: isPopular ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 10)
    });
  }
});

// Search function
export function searchHotels(params: {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  minRating?: number;
  amenities?: string[];
  page?: number;
  limit?: number;
}) {
  // Load provider-created hotels from localStorage
  const touristHotels = JSON.parse(localStorage.getItem('touristHotels') || '[]');
  
  // Combine static hotels with provider-created hotels
  let filtered = [...allHotels, ...touristHotels];

  if (params.destination) {
    filtered = filtered.filter(h => h.destination === params.destination);
  }

  if (params.minPrice !== undefined) {
    filtered = filtered.filter(h => (h.discountedPrice || h.basePrice) >= params.minPrice);
  }

  if (params.maxPrice !== undefined) {
    filtered = filtered.filter(h => (h.discountedPrice || h.basePrice) <= params.maxPrice);
  }

  if (params.propertyType) {
    filtered = filtered.filter(h => h.propertyType === params.propertyType);
  }

  if (params.minRating) {
    filtered = filtered.filter(h => h.rating >= params.minRating);
  }

  if (params.amenities && params.amenities.length > 0) {
    filtered = filtered.filter(h =>
      params.amenities!.some(amenity => h.amenities.includes(amenity))
    );
  }

  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    hotels: filtered.slice(startIndex, endIndex),
    total: filtered.length,
    hasMore: endIndex < filtered.length
  };
}

// Get hotel by ID
export function getHotelById(id: string): Hotel | undefined {
  // Check provider-created hotels first
  const touristHotels = JSON.parse(localStorage.getItem('touristHotels') || '[]');
  const providerHotel = touristHotels.find((h: Hotel) => h.id === id);
  if (providerHotel) return providerHotel;
  
  // Fall back to static hotels
  return allHotels.find(h => h.id === id);
}

// Get hotels by destination
export function getHotelsByDestination(destination: string): Hotel[] {
  // Load provider-created hotels from localStorage
  const touristHotels = JSON.parse(localStorage.getItem('touristHotels') || '[]');
  
  // Combine and filter
  return [...allHotels, ...touristHotels].filter(h => h.destination === destination);
}

export { cities as availableCities };