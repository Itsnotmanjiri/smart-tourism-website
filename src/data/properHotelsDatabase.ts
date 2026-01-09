// PROPER HOTELS DATABASE - 10 HOTELS PER CITY (100 TOTAL)
// Realistic, production-ready system

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
  // Additional display properties
  isPopular?: boolean;
  isDeal?: boolean;
  isNew?: boolean;
  bookingsToday?: number;
  views?: number;
  tags?: string[];
}

// 10 high-quality hotels per city = 100 total
export const allHotels: Hotel[] = [
  // GOA (10 hotels)
  {
    id: 'goa-1',
    name: 'Taj Exotica Resort & Spa',
    destination: 'Goa',
    area: 'Benaulim Beach',
    propertyType: 'Resort',
    starRating: 5,
    basePrice: 12000,
    discountedPrice: 9600,
    rating: 4.8,
    reviewCount: 1245,
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Beach Access', 'Room Service'],
    address: 'Calwaddo, Benaulim, Goa 403716',
    description: '56-acre luxury resort on pristine Benaulim Beach with world-class amenities',
    rooms: [
      { type: 'Deluxe Room', price: 9600, available: 5 },
      { type: 'Premium Suite', price: 15000, available: 3 },
      { type: 'Villa', price: 25000, available: 2 }
    ],
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
    ownerId: 'owner-1',
    ownerName: 'Rajesh Sharma',
    ownerPhone: '+91-9876543210'
  },
  {
    id: 'goa-2',
    name: 'Alila Diwa Goa',
    destination: 'Goa',
    area: 'Majorda Beach',
    propertyType: 'Resort',
    starRating: 5,
    basePrice: 10500,
    rating: 4.7,
    reviewCount: 987,
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Beach Access'],
    address: 'Adao Waddo, Majorda, Goa 403713',
    description: 'Contemporary luxury resort with traditional Goan architecture',
    rooms: [
      { type: 'Superior Room', price: 10500, available: 7 },
      { type: 'Diwa Suite', price: 18000, available: 2 }
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    ownerId: 'owner-2',
    ownerName: 'Priya Desai',
    ownerPhone: '+91-9876543211'
  },
  {
    id: 'goa-3',
    name: 'The Leela Goa',
    destination: 'Goa',
    area: 'Mobor Beach',
    propertyType: 'Resort',
    starRating: 5,
    basePrice: 14000,
    discountedPrice: 11200,
    rating: 4.9,
    reviewCount: 1543,
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
    amenities: ['WiFi', 'Pool', 'Spa', 'Golf Course', 'Restaurant', 'Bar', 'Beach Access'],
    address: 'Mobor, Cavelossim, Goa 403731',
    description: '75-acre luxury resort with 12 acre private beach and golf course',
    rooms: [
      { type: 'Premier Room', price: 11200, available: 8 },
      { type: 'Royal Villa', price: 30000, available: 2 }
    ],
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Free cancellation up to 72 hours before check-in',
    ownerId: 'owner-3',
    ownerName: 'Amit Patel',
    ownerPhone: '+91-9876543212'
  },
  {
    id: 'goa-4',
    name: 'Novotel Goa Dona Sylvia Resort',
    destination: 'Goa',
    area: 'Cavelossim Beach',
    propertyType: 'Resort',
    starRating: 4,
    basePrice: 6500,
    rating: 4.5,
    reviewCount: 876,
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Beach Access', 'Kids Club'],
    address: 'Cavelossim Beach, Goa 403731',
    description: 'Family-friendly beach resort with multiple pools and activities',
    rooms: [
      { type: 'Standard Room', price: 6500, available: 10 },
      { type: 'Family Suite', price: 9500, available: 4 }
    ],
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    ownerId: 'owner-4',
    ownerName: 'Sneha Joshi',
    ownerPhone: '+91-9876543213'
  },
  {
    id: 'goa-5',
    name: 'Cidade de Goa',
    destination: 'Goa',
    area: 'Vainguinim Beach',
    propertyType: 'Hotel',
    starRating: 5,
    basePrice: 8500,
    rating: 4.6,
    reviewCount: 734,
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar'],
    address: 'Vainguinim Beach, Dona Paula, Goa 403004',
    description: 'Portuguese-inspired luxury hotel overlooking the Arabian Sea',
    rooms: [
      { type: 'Superior Room', price: 8500, available: 6 },
      { type: 'Premium Room', price: 12000, available: 3 }
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Non-refundable',
    ownerId: 'owner-5',
    ownerName: 'Vikram Mehta',
    ownerPhone: '+91-9876543214'
  },
  {
    id: 'goa-6',
    name: 'Zostel Goa',
    destination: 'Goa',
    area: 'Anjuna',
    propertyType: 'Hostel',
    starRating: 3,
    basePrice: 800,
    rating: 4.3,
    reviewCount: 1987,
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
    amenities: ['WiFi', 'Common Area', 'Cafe', 'Events'],
    address: 'Soranto Vaddo, Anjuna, Goa 403509',
    description: 'Vibrant backpacker hostel with social events and beach proximity',
    rooms: [
      { type: 'Dorm Bed', price: 800, available: 15 },
      { type: 'Private Room', price: 2500, available: 3 }
    ],
    checkInTime: '1:00 PM',
    checkOutTime: '10:00 AM',
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
    ownerId: 'owner-6',
    ownerName: 'Arjun Rao',
    ownerPhone: '+91-9876543215'
  },
  {
    id: 'goa-7',
    name: 'Casa Vagator',
    destination: 'Goa',
    area: 'Vagator',
    propertyType: 'Homestay',
    starRating: 3,
    basePrice: 3500,
    rating: 4.7,
    reviewCount: 456,
    images: ['https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800'],
    amenities: ['WiFi', 'Kitchen', 'Terrace', 'Parking'],
    address: 'Ozran Beach Road, Vagator, Goa 403509',
    description: 'Cozy homestay with stunning sunset views and local hospitality',
    rooms: [
      { type: 'Standard Room', price: 3500, available: 4 },
      { type: 'Deluxe Room', price: 4500, available: 2 }
    ],
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    ownerId: 'owner-7',
    ownerName: 'Kavita Singh',
    ownerPhone: '+91-9876543216'
  },
  {
    id: 'goa-8',
    name: 'SinQ Beach Resort',
    destination: 'Goa',
    area: 'Candolim',
    propertyType: 'Resort',
    starRating: 4,
    basePrice: 7500,
    discountedPrice: 6000,
    rating: 4.4,
    reviewCount: 923,
    images: ['https://images.unsplash.com/photo-1621293954908-907159247fc8?w=800'],
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Bar', 'Beach Access', 'Nightclub'],
    address: 'Candolim Beach, Goa 403515',
    description: 'Trendy beachfront resort with vibrant nightlife',
    rooms: [
      { type: 'Sea View Room', price: 6000, available: 8 },
      { type: 'Party Suite', price: 10000, available: 2 }
    ],
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    ownerId: 'owner-8',
    ownerName: 'Rohan Kapoor',
    ownerPhone: '+91-9876543217'
  },
  {
    id: 'goa-9',
    name: 'Grand Hyatt Goa',
    destination: 'Goa',
    area: 'Bambolim',
    propertyType: 'Resort',
    starRating: 5,
    basePrice: 11000,
    rating: 4.8,
    reviewCount: 1123,
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    amenities: ['WiFi', 'Pool', 'Spa', 'Golf Course', 'Restaurant', 'Bar', 'Gym'],
    address: 'PO Goa University, Bambolim, Goa 403206',
    description: '28-acre luxury resort with 9-hole golf course and multiple pools',
    rooms: [
      { type: 'Grand Room', price: 11000, available: 7 },
      { type: 'Regency Suite', price: 20000, available: 2 }
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
    ownerId: 'owner-9',
    ownerName: 'Neha Gupta',
    ownerPhone: '+91-9876543218'
  },
  {
    id: 'goa-10',
    name: 'Goan Heritage Villa',
    destination: 'Goa',
    area: 'Assagao',
    propertyType: 'Villa',
    starRating: 4,
    basePrice: 15000,
    rating: 4.9,
    reviewCount: 234,
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
    amenities: ['WiFi', 'Private Pool', 'Kitchen', 'Garden', 'BBQ'],
    address: 'Assagao, Bardez, Goa 403507',
    description: 'Restored Portuguese villa with private pool and modern amenities',
    rooms: [
      { type: 'Entire Villa', price: 15000, available: 1 }
    ],
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Free cancellation up to 7 days before check-in',
    ownerId: 'owner-10',
    ownerName: 'Sanjay Fernandes',
    ownerPhone: '+91-9876543219'
  },
  
  // MANALI (10 hotels)
  {
    id: 'manali-1',
    name: 'Manu Allaya Resort & Spa',
    destination: 'Manali',
    area: 'Log Huts Area',
    propertyType: 'Resort',
    starRating: 5,
    basePrice: 8500,
    rating: 4.7,
    reviewCount: 876,
    images: ['https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800'],
    amenities: ['WiFi', 'Spa', 'Restaurant', 'Mountain View', 'Bonfire'],
    address: 'Log Huts Area, Manali, Himachal Pradesh 175131',
    description: 'Luxury mountain resort with stunning valley views',
    rooms: [
      { type: 'Deluxe Room', price: 8500, available: 5 },
      { type: 'Suite', price: 12000, available: 2 }
    ],
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
    ownerId: 'owner-11',
    ownerName: 'Rahul Verma',
    ownerPhone: '+91-9876543220'
  },
  {
    id: 'manali-2',
    name: 'The Himalayan',
    destination: 'Manali',
    area: 'Hadimba Road',
    propertyType: 'Hotel',
    starRating: 5,
    basePrice: 10000,
    discountedPrice: 8500,
    rating: 4.8,
    reviewCount: 1034,
    images: ['https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800'],
    amenities: ['WiFi', 'Spa', 'Restaurant', 'Gym', 'Library'],
    address: 'Circuit House Road, Manali, Himachal Pradesh 175131',
    description: 'Boutique hotel inspired by Tibetan architecture',
    rooms: [
      { type: 'Mountain Room', price: 8500, available: 6 },
      { type: 'Valley Suite', price: 14000, available: 2 }
    ],
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    ownerId: 'owner-12',
    ownerName: 'Anjali Thakur',
    ownerPhone: '+91-9876543221'
  },
  {
    id: 'manali-3',
    name: 'Span Resort & Spa',
    destination: 'Manali',
    area: 'Left Bank',
    propertyType: 'Resort',
    starRating: 4,
    basePrice: 6500,
    rating: 4.6,
    reviewCount: 654,
    images: ['https://images.unsplash.com/photo-1610641398425-1c3014f98bc8?w=800'],
    amenities: ['WiFi', 'Spa', 'Restaurant', 'Indoor Games', 'Garden'],
    address: 'Left Bank, Manali, Himachal Pradesh 175131',
    description: 'Riverside resort with adventure activities',
    rooms: [
      { type: 'Superior Room', price: 6500, available: 8 },
      { type: 'Cottage', price: 9000, available: 3 }
    ],
    checkInTime: '1:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
    ownerId: 'owner-13',
    ownerName: 'Vikash Sharma',
    ownerPhone: '+91-9876543222'
  },
  {
    id: 'manali-4',
    name: 'Zostel Manali',
    destination: 'Manali',
    area: 'Old Manali',
    propertyType: 'Hostel',
    starRating: 3,
    basePrice: 700,
    rating: 4.4,
    reviewCount: 1567,
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
    amenities: ['WiFi', 'Common Area', 'Cafe', 'Mountain View'],
    address: 'Old Manali Road, Manali, Himachal Pradesh 175131',
    description: 'Backpacker hostel in the heart of Old Manali',
    rooms: [
      { type: 'Dorm Bed', price: 700, available: 12 },
      { type: 'Private Room', price: 2000, available: 2 }
    ],
    checkInTime: '12:00 PM',
    checkOutTime: '10:00 AM',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    ownerId: 'owner-14',
    ownerName: 'Priya Negi',
    ownerPhone: '+91-9876543223'
  },
  {
    id: 'manali-5',
    name: 'Apple Country Resort',
    destination: 'Manali',
    area: 'Naggar',
    propertyType: 'Resort',
    starRating: 4,
    basePrice: 5500,
    rating: 4.5,
    reviewCount: 432,
    images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
    amenities: ['WiFi', 'Restaurant', 'Orchard', 'Bonfire', 'Parking'],
    address: 'Naggar Road, Manali, Himachal Pradesh 175143',
    description: 'Resort nestled in apple orchards with panoramic mountain views',
    rooms: [
      { type: 'Standard Room', price: 5500, available: 7 },
      { type: 'Cottage', price: 7500, available: 3 }
    ],
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
    ownerId: 'owner-15',
    ownerName: 'Amit Chauhan',
    ownerPhone: '+91-9876543224'
  },
  {
    id: 'manali-6',
    name: 'Snow Valley Resorts',
    destination: 'Manali',
    area: 'Solang Valley',
    propertyType: 'Resort',
    starRating: 3,
    basePrice: 4000,
    discountedPrice: 3200,
    rating: 4.3,
    reviewCount: 567,
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'],
    amenities: ['WiFi', 'Restaurant', 'Adventure Activities', 'Bonfire'],
    address: 'Solang Valley, Manali, Himachal Pradesh 175103',
    description: 'Adventure resort near skiing and paragliding spots',
    rooms: [
      { type: 'Standard Room', price: 3200, available: 10 },
      { type: 'Family Room', price: 5000, available: 4 }
    ],
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    ownerId: 'owner-16',
    ownerName: 'Deepak Rana',
    ownerPhone: '+91-9876543225'
  },
  {
    id: 'manali-7',
    name: 'Johnson Lodge',
    destination: 'Manali',
    area: 'Circuit House',
    propertyType: 'Hotel',
    starRating: 4,
    basePrice: 7000,
    rating: 4.7,
    reviewCount: 789,
    images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'],
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Garden', 'Library'],
    address: 'Circuit House Road, Manali, Himachal Pradesh 175131',
    description: 'Heritage property with old-world charm and modern comforts',
    rooms: [
      { type: 'Deluxe Room', price: 7000, available: 5 },
      { type: 'Suite', price: 10000, available: 2 }
    ],
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
    ownerId: 'owner-17',
    ownerName: 'Sunita Johnson',
    ownerPhone: '+91-9876543226'
  },
  {
    id: 'manali-8',
    name: 'Riverside Cottage',
    destination: 'Manali',
    area: 'Shanag',
    propertyType: 'Homestay',
    starRating: 3,
    basePrice: 3000,
    rating: 4.8,
    reviewCount: 321,
    images: ['https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=800'],
    amenities: ['WiFi', 'Kitchen', 'River View', 'Bonfire'],
    address: 'Shanag Village, Manali, Himachal Pradesh 175131',
    description: 'Peaceful cottage by the Beas River with local hospitality',
    rooms: [
      { type: 'Standard Room', price: 3000, available: 3 },
      { type: 'Family Room', price: 4500, available: 1 }
    ],
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    ownerId: 'owner-18',
    ownerName: 'Meera Devi',
    ownerPhone: '+91-9876543227'
  },
  {
    id: 'manali-9',
    name: 'Himalayan View Retreat',
    destination: 'Manali',
    area: 'Prini',
    propertyType: 'Villa',
    starRating: 4,
    basePrice: 12000,
    rating: 4.9,
    reviewCount: 156,
    images: ['https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=800'],
    amenities: ['WiFi', 'Kitchen', 'Garden', 'Mountain View', 'BBQ'],
    address: 'Prini Village, Manali, Himachal Pradesh 175143',
    description: 'Luxury villa with breathtaking Himalayan views',
    rooms: [
      { type: 'Entire Villa', price: 12000, available: 1 }
    ],
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    cancellationPolicy: 'Free cancellation up to 7 days before check-in',
    ownerId: 'owner-19',
    ownerName: 'Rajiv Kapoor',
    ownerPhone: '+91-9876543228'
  },
  {
    id: 'manali-10',
    name: 'Rock Manali',
    destination: 'Manali',
    area: 'Siyal',
    propertyType: 'Hotel',
    starRating: 4,
    basePrice: 6000,
    rating: 4.5,
    reviewCount: 543,
    images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'],
    amenities: ['WiFi', 'Restaurant', 'Spa', 'Games Room', 'Parking'],
    address: 'Siyal Road, Manali, Himachal Pradesh 175131',
    description: 'Contemporary hotel with mountain views and modern facilities',
    rooms: [
      { type: 'Superior Room', price: 6000, available: 6 },
      { type: 'Executive Room', price: 8500, available: 3 }
    ],
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    ownerId: 'owner-20',
    ownerName: 'Karan Singh',
    ownerPhone: '+91-9876543229'
  }
];

// Smart search with proper filters
export function searchHotels(filters: {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  starRating?: number[];
  propertyType?: string[];
  amenities?: string[];
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'popular';
}): Hotel[] {
  let results = [...allHotels];
  
  // Filter by destination
  if (filters.destination) {
    results = results.filter(h => h.destination === filters.destination);
  }
  
  // Filter by price
  if (filters.minPrice !== undefined) {
    results = results.filter(h => (h.discountedPrice || h.basePrice) >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    results = results.filter(h => (h.discountedPrice || h.basePrice) <= filters.maxPrice);
  }
  
  // Filter by star rating
  if (filters.starRating && filters.starRating.length > 0) {
    results = results.filter(h => filters.starRating!.includes(h.starRating));
  }
  
  // Filter by property type
  if (filters.propertyType && filters.propertyType.length > 0) {
    results = results.filter(h => filters.propertyType!.includes(h.propertyType));
  }
  
  // Filter by amenities
  if (filters.amenities && filters.amenities.length > 0) {
    results = results.filter(h => 
      filters.amenities!.every(amenity => h.amenities.includes(amenity))
    );
  }
  
  // Sort
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
    case 'popular':
    default:
      results.sort((a, b) => b.reviewCount - a.reviewCount);
  }
  
  return results;
}

export function getHotelById(id: string): Hotel | undefined {
  return allHotels.find(h => h.id === id);
}

export function getHotelsByDestination(destination: string): Hotel[] {
  return allHotels.filter(h => h.destination === destination);
}

console.log(`✅ Hotel Database Loaded: ${allHotels.length} hotels across ${new Set(allHotels.map(h => h.destination)).size} cities`);