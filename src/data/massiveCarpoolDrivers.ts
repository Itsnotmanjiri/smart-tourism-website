// MASSIVE CARPOOL/RIDESHARE DATABASE - 100 DRIVERS (10 PER CITY)
// Production-ready realistic driver profiles

export interface CarpoolDriver {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  avatar: string;
  rating: number;
  totalTrips: number;
  verified: boolean;
  carModel: string;
  carNumber: string;
  carColor: string;
  carYear: number;
  seatsAvailable: number;
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  pricePerSeat: number;
  route: string[];
  amenities: string[];
  rules: string[];
  bio: string;
  languages: string[];
  musicPreference: string;
  smokingAllowed: boolean;
  petsAllowed: boolean;
  responseRate: number;
  phoneNumber: string;
  isOnline: boolean;
  lastActive: string;
  totalDistance: string;
  estimatedDuration: string;
  flexibleTiming: boolean;
  instantBooking: boolean;
}

const cities = ['Goa', 'Manali', 'Jaipur', 'Kerala', 'Udaipur', 'Rishikesh', 'Varanasi', 'Amritsar', 'Hampi', 'Darjeeling'];

const maleNames = [
  'Rahul Sharma', 'Amit Patel', 'Vikram Singh', 'Arjun Mehta', 'Karan Verma',
  'Rohit Kumar', 'Aditya Reddy', 'Sanjay Gupta', 'Varun Malhotra', 'Ravi Nair',
  'Ajay Joshi', 'Nikhil Desai', 'Pranav Saxena', 'Harish Rao', 'Suresh Iyer'
];

const femaleNames = [
  'Priya Sharma', 'Neha Patel', 'Anjali Singh', 'Kavita Mehta', 'Simran Verma',
  'Pooja Kumar', 'Deepika Reddy', 'Meera Gupta', 'Ishita Malhotra', 'Sunita Nair',
  'Divya Joshi', 'Ritu Desai', 'Aarti Saxena', 'Swati Rao', 'Nisha Iyer'
];

const carModels = [
  'Maruti Swift', 'Hyundai i20', 'Honda City', 'Toyota Innova', 'Mahindra XUV500',
  'Maruti Dzire', 'Hyundai Creta', 'Tata Nexon', 'Kia Seltos', 'Honda Amaze',
  'Maruti Baleno', 'Volkswagen Polo', 'Ford EcoSport', 'Renault Duster', 'Nissan Magnite'
];

const carColors = ['White', 'Silver', 'Black', 'Red', 'Blue', 'Grey', 'Brown', 'Maroon'];

const musicPreferences = ['Bollywood', 'English Pop', 'Classical', 'Rock', 'No Music', 'Any'];

const amenitiesOptions = [
  ['AC', 'Music System', 'Phone Charger', 'Water Bottles'],
  ['AC', 'Music System', 'WiFi Hotspot', 'Snacks'],
  ['AC', 'Premium Sound', 'Phone Charger', 'Newspaper'],
  ['AC', 'Music System', 'First Aid Kit', 'Water Bottles'],
  ['AC', 'GPS', 'Phone Charger', 'Cushions']
];

const rulesOptions = [
  ['No Smoking', 'No Food', 'Be Punctual', 'Respect Privacy'],
  ['No Smoking', 'Light Snacks OK', 'Be On Time', 'Share Fuel Cost'],
  ['No Smoking', 'No Pets', 'Punctuality Required', 'Minimal Luggage'],
  ['Smoking Allowed', 'Food Allowed', 'Flexible Timing', 'Any Luggage'],
  ['No Smoking', 'Music Allowed', 'On Time', 'Share Toll Cost']
];

// City pairs for routes
const cityRoutes: { [key: string]: { to: string; distance: string; duration: string; route: string[] }[] } = {
  'Goa': [
    { to: 'Mumbai', distance: '450 km', duration: '8 hrs', route: ['Goa', 'Ratnagiri', 'Chiplun', 'Panvel', 'Mumbai'] },
    { to: 'Bangalore', distance: '560 km', duration: '10 hrs', route: ['Goa', 'Karwar', 'Hubli', 'Tumkur', 'Bangalore'] },
    { to: 'Pune', distance: '450 km', duration: '8 hrs', route: ['Goa', 'Kolhapur', 'Satara', 'Pune'] }
  ],
  'Manali': [
    { to: 'Delhi', distance: '570 km', duration: '12 hrs', route: ['Manali', 'Kullu', 'Mandi', 'Chandigarh', 'Delhi'] },
    { to: 'Shimla', distance: '250 km', duration: '7 hrs', route: ['Manali', 'Kullu', 'Mandi', 'Shimla'] },
    { to: 'Amritsar', distance: '380 km', duration: '9 hrs', route: ['Manali', 'Mandi', 'Pathankot', 'Amritsar'] }
  ],
  'Jaipur': [
    { to: 'Delhi', distance: '280 km', duration: '5 hrs', route: ['Jaipur', 'Shahpura', 'Gurugram', 'Delhi'] },
    { to: 'Agra', distance: '240 km', duration: '4 hrs', route: ['Jaipur', 'Dausa', 'Bharatpur', 'Agra'] },
    { to: 'Udaipur', distance: '390 km', duration: '7 hrs', route: ['Jaipur', 'Ajmer', 'Chittorgarh', 'Udaipur'] }
  ],
  'Kerala': [
    { to: 'Bangalore', distance: '350 km', duration: '7 hrs', route: ['Kochi', 'Thrissur', 'Palakkad', 'Salem', 'Bangalore'] },
    { to: 'Chennai', distance: '680 km', duration: '11 hrs', route: ['Kochi', 'Coimbatore', 'Salem', 'Vellore', 'Chennai'] },
    { to: 'Goa', distance: '620 km', duration: '11 hrs', route: ['Kochi', 'Mangalore', 'Karwar', 'Goa'] }
  ],
  'Udaipur': [
    { to: 'Jaipur', distance: '390 km', duration: '7 hrs', route: ['Udaipur', 'Chittorgarh', 'Ajmer', 'Jaipur'] },
    { to: 'Ahmedabad', distance: '260 km', duration: '5 hrs', route: ['Udaipur', 'Dungarpur', 'Ahmedabad'] },
    { to: 'Mumbai', distance: '730 km', duration: '12 hrs', route: ['Udaipur', 'Ahmedabad', 'Surat', 'Mumbai'] }
  ],
  'Rishikesh': [
    { to: 'Delhi', distance: '240 km', duration: '6 hrs', route: ['Rishikesh', 'Haridwar', 'Roorkee', 'Meerut', 'Delhi'] },
    { to: 'Dehradun', distance: '45 km', duration: '1.5 hrs', route: ['Rishikesh', 'Dehradun'] },
    { to: 'Chandigarh', distance: '210 km', duration: '5 hrs', route: ['Rishikesh', 'Haridwar', 'Yamunanagar', 'Chandigarh'] }
  ],
  'Varanasi': [
    { to: 'Delhi', distance: '820 km', duration: '14 hrs', route: ['Varanasi', 'Allahabad', 'Kanpur', 'Agra', 'Delhi'] },
    { to: 'Lucknow', distance: '320 km', duration: '6 hrs', route: ['Varanasi', 'Allahabad', 'Lucknow'] },
    { to: 'Patna', distance: '250 km', duration: '5 hrs', route: ['Varanasi', 'Ghazipur', 'Buxar', 'Patna'] }
  ],
  'Amritsar': [
    { to: 'Delhi', distance: '450 km', duration: '8 hrs', route: ['Amritsar', 'Jalandhar', 'Ludhiana', 'Chandigarh', 'Delhi'] },
    { to: 'Manali', distance: '380 km', duration: '9 hrs', route: ['Amritsar', 'Pathankot', 'Mandi', 'Manali'] },
    { to: 'Shimla', distance: '350 km', duration: '8 hrs', route: ['Amritsar', 'Ludhiana', 'Chandigarh', 'Shimla'] }
  ],
  'Hampi': [
    { to: 'Bangalore', distance: '340 km', duration: '7 hrs', route: ['Hampi', 'Hospet', 'Chitradurga', 'Tumkur', 'Bangalore'] },
    { to: 'Goa', distance: '310 km', duration: '6 hrs', route: ['Hampi', 'Hospet', 'Hubli', 'Goa'] },
    { to: 'Hyderabad', distance: '350 km', duration: '7 hrs', route: ['Hampi', 'Raichur', 'Kurnool', 'Hyderabad'] }
  ],
  'Darjeeling': [
    { to: 'Kolkata', distance: '640 km', duration: '12 hrs', route: ['Darjeeling', 'Siliguri', 'Malda', 'Kolkata'] },
    { to: 'Gangtok', distance: '100 km', duration: '4 hrs', route: ['Darjeeling', 'Siliguri', 'Gangtok'] },
    { to: 'Patna', distance: '560 km', duration: '11 hrs', route: ['Darjeeling', 'Siliguri', 'Purnia', 'Patna'] }
  ]
};

// Generate 100 drivers (10 per city)
export const allDrivers: CarpoolDriver[] = [];

cities.forEach((city, cityIndex) => {
  const routes = cityRoutes[city];
  
  for (let i = 0; i < 10; i++) {
    const isMale = Math.random() > 0.3;
    const name = isMale ? maleNames[Math.floor(Math.random() * maleNames.length)] : femaleNames[Math.floor(Math.random() * femaleNames.length)];
    const age = 25 + Math.floor(Math.random() * 20);
    const rating = 3.5 + (Math.random() * 1.5);
    const totalTrips = 10 + Math.floor(Math.random() * 190);
    const routeIndex = i % routes.length;
    const selectedRoute = routes[routeIndex];
    
    // Generate departure date (next 7 days)
    const today = new Date();
    const departureDate = new Date(today);
    departureDate.setDate(today.getDate() + (i % 7));
    
    const driverId = `driver-${cityIndex * 10 + i + 1}`;
    
    // Calculate realistic price per seat (₹5-8 per km)
    const distanceInKm = parseInt(selectedRoute.distance);
    const baseRatePerKm = 5 + (Math.random() * 3); // Random between ₹5-8 per km
    const calculatedPrice = Math.round(distanceInKm * baseRatePerKm);
    // Round to nearest 50 for cleaner pricing
    const pricePerSeat = Math.round(calculatedPrice / 50) * 50;
    
    allDrivers.push({
      id: driverId,
      name,
      age,
      gender: isMale ? 'Male' : 'Female',
      avatar: isMale 
        ? `https://randomuser.me/api/portraits/men/${(cityIndex * 10 + i) % 70}.jpg`
        : `https://randomuser.me/api/portraits/women/${(cityIndex * 10 + i) % 70}.jpg`,
      rating: parseFloat(rating.toFixed(1)),
      totalTrips,
      verified: Math.random() > 0.2,
      carModel: carModels[i % carModels.length],
      carNumber: `${['GJ', 'HP', 'RJ', 'KL', 'RJ', 'UK', 'UP', 'PB', 'KA', 'WB'][cityIndex]} ${10 + i} ${String.fromCharCode(65 + i)} ${1000 + (cityIndex * 10 + i)}`,
      carColor: carColors[i % carColors.length],
      carYear: 2018 + (i % 5),
      seatsAvailable: (i % 3) + 2, // 2-4 seats
      from: city,
      to: selectedRoute.to,
      departureDate: departureDate.toISOString().split('T')[0],
      departureTime: `${6 + (i % 12)}:00 ${(6 + (i % 12)) < 12 ? 'AM' : 'PM'}`,
      pricePerSeat: pricePerSeat,
      route: selectedRoute.route,
      amenities: amenitiesOptions[i % amenitiesOptions.length],
      rules: rulesOptions[i % rulesOptions.length],
      bio: `Experienced driver with ${totalTrips}+ trips. Love to travel and meet new people. Safe and comfortable rides guaranteed!`,
      languages: i % 3 === 0 ? ['Hindi', 'English'] : i % 3 === 1 ? ['Hindi', 'English', 'Punjabi'] : ['Hindi', 'English', 'Tamil'],
      musicPreference: musicPreferences[i % musicPreferences.length],
      smokingAllowed: i % 4 === 0,
      petsAllowed: i % 5 === 0,
      responseRate: 80 + Math.floor(Math.random() * 20),
      phoneNumber: `+91 ${90000 + (cityIndex * 10 + i + 1)}00000`,
      isOnline: Math.random() > 0.3,
      lastActive: i % 3 === 0 ? 'Online now' : i % 3 === 1 ? '2 hours ago' : 'Yesterday',
      totalDistance: selectedRoute.distance,
      estimatedDuration: selectedRoute.duration,
      flexibleTiming: i % 3 === 0,
      instantBooking: i % 2 === 0
    });
  }
});

// Search function
export function searchDrivers(params: {
  from?: string;
  to?: string;
  departureDate?: string;
  minSeats?: number;
  maxPrice?: number;
  verified?: boolean;
  instantBooking?: boolean;
  page?: number;
  limit?: number;
}) {
  let filtered = [...allDrivers];

  if (params.from) {
    filtered = filtered.filter(d => d.from.toLowerCase().includes(params.from!.toLowerCase()));
  }

  if (params.to) {
    filtered = filtered.filter(d => d.to.toLowerCase().includes(params.to!.toLowerCase()));
  }

  if (params.departureDate) {
    filtered = filtered.filter(d => d.departureDate === params.departureDate);
  }

  if (params.minSeats) {
    filtered = filtered.filter(d => d.seatsAvailable >= params.minSeats);
  }

  if (params.maxPrice) {
    filtered = filtered.filter(d => d.pricePerSeat <= params.maxPrice);
  }

  if (params.verified) {
    filtered = filtered.filter(d => d.verified);
  }

  if (params.instantBooking) {
    filtered = filtered.filter(d => d.instantBooking);
  }

  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    drivers: filtered.slice(startIndex, endIndex),
    total: filtered.length,
    hasMore: endIndex < filtered.length
  };
}

// Get driver by ID
export function getDriverById(id: string): CarpoolDriver | undefined {
  return allDrivers.find(d => d.id === id);
}

// Get drivers by city
export function getDriversByCity(city: string): CarpoolDriver[] {
  return allDrivers.filter(d => d.from === city);
}

export { cities as availableCities };