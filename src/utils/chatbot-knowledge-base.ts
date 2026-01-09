// COMPREHENSIVE CHATBOT KNOWLEDGE BASE - INDIA TOURISM
// This database contains detailed information about hotels, destinations, food, travel, etc.

interface HotelInfo {
  city: string;
  hotels: {
    name: string;
    priceRange: string;
    rating: number;
    features: string[];
  }[];
}

interface DestinationInfo {
  city: string;
  state: string;
  bestTime: string;
  weather: string;
  attractions: string[];
  food: string[];
  transport: string[];
  budget: string;
}

// HOTELS DATABASE - COMPREHENSIVE
export const HOTELS_DATABASE: HotelInfo[] = [
  {
    city: 'Delhi',
    hotels: [
      { name: 'The Taj Mahal Palace', priceRange: '₹8,000 - ₹25,000/night', rating: 4.8, features: ['5-star luxury', 'Pool', 'Spa', 'Free WiFi', 'Restaurant'] },
      { name: 'The Leela Palace', priceRange: '₹10,000 - ₹30,000/night', rating: 4.9, features: ['Ultra luxury', 'Butler service', 'Fine dining', 'Gym'] },
      { name: 'ITC Maurya', priceRange: '₹7,000 - ₹20,000/night', rating: 4.7, features: ['Business hotel', 'Multiple restaurants', 'Conference rooms'] },
      { name: 'Radisson Blu', priceRange: '₹4,000 - ₹10,000/night', rating: 4.5, features: ['4-star', 'Central location', 'Pool', 'Breakfast included'] },
      { name: 'Hotel Saket 27', priceRange: '₹2,500 - ₹6,000/night', rating: 4.2, features: ['3-star', 'Budget friendly', 'Clean rooms', 'WiFi'] },
      { name: 'OYO Flagship', priceRange: '₹1,500 - ₹3,000/night', rating: 4.0, features: ['Budget hotel', 'AC rooms', 'Basic amenities'] },
      { name: 'Zostel Delhi', priceRange: '₹500 - ₹1,200/night', rating: 4.3, features: ['Hostel', 'Backpackers', 'Dorm & private rooms', 'Social area'] }
    ]
  },
  {
    city: 'Mumbai',
    hotels: [
      { name: 'Taj Mahal Palace', priceRange: '₹12,000 - ₹40,000/night', rating: 4.9, features: ['Iconic heritage hotel', 'Sea view', 'Pool', 'Multiple restaurants'] },
      { name: 'The Oberoi', priceRange: '₹15,000 - ₹50,000/night', rating: 4.9, features: ['Luxury', 'Marine Drive view', 'Spa', 'Fine dining'] },
      { name: 'JW Marriott', priceRange: '₹8,000 - ₹20,000/night', rating: 4.7, features: ['Business class', 'Airport nearby', 'Pool', 'Gym'] },
      { name: 'Hyatt Regency', priceRange: '₹6,000 - ₹15,000/night', rating: 4.6, features: ['4-star', 'Multiple dining', 'Events space'] },
      { name: 'Hotel Suba Palace', priceRange: '₹3,000 - ₹7,000/night', rating: 4.3, features: ['3-star', 'Colaba area', 'Rooftop restaurant'] },
      { name: 'OYO Premium', priceRange: '₹2,000 - ₹4,500/night', rating: 4.1, features: ['Budget', 'WiFi', 'AC', 'Clean'] },
      { name: 'Backpacker Panda', priceRange: '₹600 - ₹1,500/night', rating: 4.2, features: ['Hostel', 'Social vibe', 'Near attractions'] }
    ]
  },
  {
    city: 'Bangalore',
    hotels: [
      { name: 'ITC Gardenia', priceRange: '₹8,000 - ₹22,000/night', rating: 4.8, features: ['5-star', 'LEED certified', 'Spa', 'Fine dining'] },
      { name: 'The Leela Palace', priceRange: '₹10,000 - ₹28,000/night', rating: 4.8, features: ['Luxury', 'Art collection', 'Pool', 'Rooftop bar'] },
      { name: 'Taj West End', priceRange: '₹7,000 - ₹18,000/night', rating: 4.7, features: ['Heritage', '20-acre gardens', 'Colonial charm'] },
      { name: 'Radisson Blu', priceRange: '₹4,500 - ₹11,000/night', rating: 4.5, features: ['4-star', 'Business district', 'Pool'] },
      { name: 'Hotel Empire', priceRange: '₹2,800 - ₹6,500/night', rating: 4.3, features: ['3-star', 'MG Road', 'Restaurant'] },
      { name: 'Treebo Trend', priceRange: '₹1,800 - ₹3,500/night', rating: 4.2, features: ['Budget', 'Standardized rooms', 'Breakfast'] },
      { name: 'Zostel Bangalore', priceRange: '₹550 - ₹1,300/night', rating: 4.4, features: ['Hostel', 'Cafe', 'Travelers hub'] }
    ]
  },
  {
    city: 'Goa',
    hotels: [
      { name: 'Taj Exotica', priceRange: '₹10,000 - ₹30,000/night', rating: 4.8, features: ['Beach resort', 'Private beach', 'Pool', 'Spa', 'Water sports'] },
      { name: 'The Leela Goa', priceRange: '₹9,000 - ₹25,000/night', rating: 4.7, features: ['Beachfront', 'Golf course', 'Casino', 'Multiple pools'] },
      { name: 'Park Hyatt Goa Resort', priceRange: '₹8,500 - ₹20,000/night', rating: 4.7, features: ['Luxury resort', 'Beach access', 'Spa'] },
      { name: 'Novotel Goa', priceRange: '₹5,000 - ₹12,000/night', rating: 4.5, features: ['Beach view', 'Pool', 'Family friendly'] },
      { name: 'Hotel Miramar Residency', priceRange: '₹2,500 - ₹6,000/night', rating: 4.2, features: ['Beach proximity', 'Clean rooms', 'AC'] },
      { name: 'FabHotel', priceRange: '₹1,500 - ₹3,500/night', rating: 4.0, features: ['Budget', 'Near beach', 'Basic amenities'] },
      { name: 'Backpackers Panda Goa', priceRange: '₹400 - ₹1,000/night', rating: 4.3, features: ['Hostel', 'Beach location', 'Party crowd'] }
    ]
  },
  {
    city: 'Jaipur',
    hotels: [
      { name: 'Rambagh Palace', priceRange: '₹15,000 - ₹60,000/night', rating: 4.9, features: ['Royal palace hotel', 'Heritage', 'Luxury spa', 'Fine dining'] },
      { name: 'Taj Jai Mahal Palace', priceRange: '₹8,000 - ₹20,000/night', rating: 4.7, features: ['Heritage hotel', 'Mughal gardens', 'Pool'] },
      { name: 'ITC Rajputana', priceRange: '₹6,500 - ₹16,000/night', rating: 4.6, features: ['5-star', 'Rajasthani hospitality', 'Spa'] },
      { name: 'Clarks Amer', priceRange: '₹4,000 - ₹10,000/night', rating: 4.4, features: ['4-star', 'Central location', 'Pool'] },
      { name: 'Hotel Pearl Palace', priceRange: '₹2,000 - ₹5,000/night', rating: 4.5, features: ['Heritage budget', 'Rooftop restaurant', 'Cultural experience'] },
      { name: 'Treebo Hotels', priceRange: '₹1,500 - ₹3,000/night', rating: 4.1, features: ['Budget', 'Clean', 'Breakfast included'] },
      { name: 'Zostel Jaipur', priceRange: '₹500 - ₹1,200/night', rating: 4.4, features: ['Hostel', 'Heritage building', 'Social'] }
    ]
  },
  {
    city: 'Pune',
    hotels: [
      { name: 'JW Marriott Pune', priceRange: '₹7,000 - ₹18,000/night', rating: 4.7, features: ['5-star', 'Spa', 'Pool', 'Fine dining'] },
      { name: 'The Westin Pune', priceRange: '₹6,500 - ₹16,000/night', rating: 4.6, features: ['Luxury', 'Koregaon Park', 'Heavenly beds'] },
      { name: 'Conrad Pune', priceRange: '₹8,000 - ₹20,000/night', rating: 4.7, features: ['Business luxury', 'Rooftop bar', 'Spa'] },
      { name: 'Hyatt Pune', priceRange: '₹5,000 - ₹12,000/night', rating: 4.5, features: ['4-star', 'Kalyani Nagar', 'Pool'] },
      { name: 'Hotel Sunderban', priceRange: '₹2,500 - ₹6,000/night', rating: 4.3, features: ['3-star', 'FC Road', 'Restaurant'] },
      { name: 'OYO Townhouse', priceRange: '₹1,800 - ₹4,000/night', rating: 4.1, features: ['Budget premium', 'Modern rooms', 'WiFi'] },
      { name: 'Backpacker Panda Pune', priceRange: '₹500 - ₹1,100/night', rating: 4.2, features: ['Hostel', 'Cafe', 'Travelers community'] }
    ]
  },
  {
    city: 'Kolkata',
    hotels: [
      { name: 'The Oberoi Grand', priceRange: '₹9,000 - ₹25,000/night', rating: 4.8, features: ['Heritage luxury', 'Colonial architecture', 'Fine dining'] },
      { name: 'ITC Sonar', priceRange: '₹7,000 - ₹18,000/night', rating: 4.7, features: ['5-star', 'Large property', 'Pool', 'Spa'] },
      { name: 'Taj Bengal', priceRange: '₹6,500 - ₹16,000/night', rating: 4.6, features: ['Business hotel', 'Alipore', 'Fine dining'] },
      { name: 'Hyatt Regency', priceRange: '₹5,000 - ₹12,000/night', rating: 4.5, features: ['4-star', 'Salt Lake', 'Pool'] },
      { name: 'Hotel Hindusthan International', priceRange: '₹2,800 - ₹6,500/night', rating: 4.2, features: ['3-star', 'Central location', 'Restaurant'] },
      { name: 'FabHotel', priceRange: '₹1,500 - ₹3,500/night', rating: 4.0, features: ['Budget', 'Clean rooms', 'AC'] },
      { name: 'Backpackers Inn', priceRange: '₹400 - ₹1,000/night', rating: 4.1, features: ['Hostel', 'Sudder Street', 'Backpackers hub'] }
    ]
  },
  {
    city: 'Chennai',
    hotels: [
      { name: 'ITC Grand Chola', priceRange: '₹10,000 - ₹28,000/night', rating: 4.8, features: ['Ultra luxury', 'Largest hotel', 'Multiple pools', 'Spa'] },
      { name: 'Taj Coromandel', priceRange: '₹7,000 - ₹18,000/night', rating: 4.7, features: ['5-star', 'Nungambakkam', 'Fine dining'] },
      { name: 'The Leela Palace', priceRange: '₹9,000 - ₹24,000/night', rating: 4.8, features: ['Beachfront', 'Art deco', 'Luxury'] },
      { name: 'Radisson Blu', priceRange: '₹4,500 - ₹11,000/night', rating: 4.5, features: ['4-star', 'Egmore', 'Pool'] },
      { name: 'Hotel Savera', priceRange: '₹2,500 - ₹6,000/night', rating: 4.2, features: ['3-star', 'Mylapore', 'Restaurant'] },
      { name: 'Treebo Trend', priceRange: '₹1,600 - ₹3,500/night', rating: 4.1, features: ['Budget', 'Standardized', 'WiFi'] },
      { name: 'Zostel Chennai', priceRange: '₹450 - ₹1,100/night', rating: 4.3, features: ['Hostel', 'Beach nearby', 'Social'] }
    ]
  },
  {
    city: 'Agra',
    hotels: [
      { name: 'The Oberoi Amarvilas', priceRange: '₹25,000 - ₹80,000/night', rating: 4.9, features: ['Taj Mahal view', 'Ultimate luxury', 'Pool', 'Spa'] },
      { name: 'ITC Mughal', priceRange: '₹8,000 - ₹22,000/night', rating: 4.7, features: ['5-star', 'Mughal architecture', 'Gardens', 'Spa'] },
      { name: 'Taj Hotel & Convention Centre', priceRange: '₹6,000 - ₹15,000/night', rating: 4.6, features: ['4-star', 'Near Taj', 'Pool'] },
      { name: 'Radisson Hotel Agra', priceRange: '₹4,000 - ₹10,000/night', rating: 4.4, features: ['4-star', 'Modern amenities', 'Restaurant'] },
      { name: 'Hotel Atulyaa Taj', priceRange: '₹2,000 - ₹5,000/night', rating: 4.3, features: ['3-star', 'Taj view rooms', 'Rooftop'] },
      { name: 'OYO Hotels', priceRange: '₹1,200 - ₹3,000/night', rating: 4.0, features: ['Budget', 'Clean', 'AC'] },
      { name: 'Zostel Agra', priceRange: '₹400 - ₹1,000/night', rating: 4.4, features: ['Hostel', 'Near Taj', 'Social area'] }
    ]
  },
  {
    city: 'Hyderabad',
    hotels: [
      { name: 'Taj Falaknuma Palace', priceRange: '₹30,000 - ₹1,00,000/night', rating: 4.9, features: ['Royal palace', 'Heritage luxury', 'Nizam heritage'] },
      { name: 'ITC Kohenur', priceRange: '₹8,000 - ₹20,000/night', rating: 4.7, features: ['5-star', 'HITEC City', 'Spa', 'Pool'] },
      { name: 'Taj Krishna', priceRange: '₹6,500 - ₹16,000/night', rating: 4.6, features: ['Business hotel', 'Banjara Hills', 'Fine dining'] },
      { name: 'Novotel Hyderabad', priceRange: '₹5,000 - ₹12,000/night', rating: 4.5, features: ['4-star', 'Convention center', 'Pool'] },
      { name: 'Hotel Golkonda', priceRange: '₹2,500 - ₹6,000/night', rating: 4.2, features: ['3-star', 'Central', 'Restaurant'] },
      { name: 'FabHotel', priceRange: '₹1,500 - ₹3,500/night', rating: 4.0, features: ['Budget', 'WiFi', 'AC'] },
      { name: 'Zostel Hyderabad', priceRange: '₹500 - ₹1,200/night', rating: 4.3, features: ['Hostel', 'Cafe', 'Events'] }
    ]
  }
];

// DESTINATION INFORMATION
export const DESTINATIONS_DATABASE: DestinationInfo[] = [
  {
    city: 'Goa',
    state: 'Goa',
    bestTime: 'November to February',
    weather: 'Tropical climate, warm year-round. Monsoon: June-September',
    attractions: ['Baga Beach', 'Calangute Beach', 'Aguada Fort', 'Basilica of Bom Jesus', 'Dudhsagar Falls', 'Anjuna Flea Market', 'Chapora Fort', 'Casino cruises'],
    food: ['Fish Curry Rice', 'Bebinca', 'Prawn Balchão', 'Xacuti', 'Cafreal', 'Goan Sausage', 'Seafood', 'Feni (local drink)'],
    transport: ['Dabolim Airport (GOI)', 'Local taxis', 'Bike rentals ₹300-500/day', 'Auto-rickshaws', 'App cabs', 'Self-drive cars'],
    budget: '₹3,000-5,000/day for budget travelers, ₹8,000-15,000/day for luxury'
  },
  {
    city: 'Delhi',
    state: 'Delhi',
    bestTime: 'October to March',
    weather: 'Extreme - Hot summers (45°C), Cold winters (5°C), Pleasant in Oct-Mar',
    attractions: ['Red Fort', 'Qutub Minar', 'India Gate', 'Lotus Temple', 'Humayun\'s Tomb', 'Chandni Chowk', 'Akshardham Temple', 'Lodhi Garden'],
    food: ['Butter Chicken', 'Chole Bhature', 'Paranthas', 'Street chaat', 'Momos', 'Nihari', 'Kebabs', 'Kulfi'],
    transport: ['IGI Airport (DEL)', 'Metro (₹10-60)', 'Auto-rickshaws', 'App cabs', 'Local buses', 'Cycle rickshaws'],
    budget: '₹2,000-4,000/day for budget, ₹6,000-12,000/day for comfort'
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    bestTime: 'November to February',
    weather: 'Humid coastal climate. Monsoon: June-September',
    attractions: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Haji Ali Dargah', 'Siddhivinayak Temple', 'Juhu Beach', 'Film City', 'Colaba'],
    food: ['Vada Pav', 'Pav Bhaji', 'Misal Pav', 'Bombay Duck', 'Bhel Puri', 'Sev Puri', 'Keema Pav', 'Falooda'],
    transport: ['Chhatrapati Shivaji Airport (BOM)', 'Local trains', 'Metro', 'BEST buses', 'Auto-rickshaws', 'App cabs'],
    budget: '₹3,000-6,000/day for budget, ₹10,000-20,000/day for luxury'
  },
  {
    city: 'Jaipur',
    state: 'Rajasthan',
    bestTime: 'October to March',
    weather: 'Hot and dry. Summers (45°C), Pleasant winters',
    attractions: ['Amber Fort', 'City Palace', 'Hawa Mahal', 'Jantar Mantar', 'Nahargarh Fort', 'Jal Mahal', 'Albert Hall Museum', 'Bazaars'],
    food: ['Dal Baati Churma', 'Laal Maas', 'Ghewar', 'Pyaaz Kachori', 'Mirchi Vada', 'Mawa Kachori', 'Ker Sangri'],
    transport: ['Jaipur Airport (JAI)', 'Auto-rickshaws', 'App cabs', 'City buses', 'Cycle rickshaws', 'Car rentals'],
    budget: '₹2,500-4,500/day for budget, ₹7,000-15,000/day for luxury'
  },
  {
    city: 'Kerala',
    state: 'Kerala',
    bestTime: 'September to March',
    weather: 'Tropical. Monsoon: June-September. Pleasant year-round',
    attractions: ['Backwaters (Alleppey)', 'Munnar tea gardens', 'Fort Kochi', 'Wayanad wildlife', 'Kovalam Beach', 'Thekkady', 'Varkala', 'Athirapally Falls'],
    food: ['Appam with Stew', 'Kerala Sadya', 'Fish Moilee', 'Puttu Kadala', 'Beef Fry', 'Banana Chips', 'Kerala Parotta', 'Payasam'],
    transport: ['Kochi Airport (COK)', 'Trivandrum Airport (TRV)', 'Houseboats', 'Kerala State buses', 'Auto-rickshaws', 'App cabs'],
    budget: '���3,000-5,000/day for budget, ₹8,000-18,000/day for luxury (houseboats expensive)'
  },
  {
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    bestTime: 'October to March',
    weather: 'Hot summers, cold winters. Pleasant Oct-Mar',
    attractions: ['Ganga Aarti', 'Kashi Vishwanath Temple', 'Ghats (Dashashwamedh, Assi)', 'Sarnath', 'Boat rides', 'Banaras Hindu University', 'Ramnagar Fort'],
    food: ['Kachori Sabzi', 'Banarasi Paan', 'Thandai', 'Chaat', 'Lassi', 'Rabri', 'Tamatar Chaat', 'Malaiyo'],
    transport: ['Lal Bahadur Shastri Airport (VNS)', 'Auto-rickshaws', 'Cycle rickshaws', 'Boat rides', 'Walking (old city)'],
    budget: '₹1,500-3,000/day for budget, ₹4,000-8,000/day for comfort'
  },
  {
    city: 'Manali',
    state: 'Himachal Pradesh',
    bestTime: 'March to June, December to February (snow)',
    weather: 'Cold mountain climate. Heavy snow in winter',
    attractions: ['Rohtang Pass', 'Solang Valley', 'Hadimba Temple', 'Old Manali', 'Vashisht Hot Springs', 'Mall Road', 'Jogini Falls', 'Skiing'],
    food: ['Siddu', 'Thukpa', 'Momos', 'Trout Fish', 'Tibetan cuisine', 'Madra', 'Chana Madra'],
    transport: ['Bhuntar Airport (KUU)', 'Volvo buses from Delhi', 'Local taxis', 'Bike rentals ₹800-1500/day'],
    budget: '₹2,500-5,000/day for budget, ₹7,000-15,000/day for luxury'
  },
  {
    city: 'Agra',
    state: 'Uttar Pradesh',
    bestTime: 'October to March',
    weather: 'Hot summers (45°C), Cold winters. Foggy Dec-Jan',
    attractions: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri', 'Itimad-ud-Daulah (Baby Taj)', 'Mehtab Bagh', 'Akbar\'s Tomb'],
    food: ['Petha', 'Dalmoth', 'Mughlai cuisine', 'Bedai', 'Jalebi', 'Paneer dishes', 'Tandoori'],
    transport: ['Agra Airport (AGR)', 'Express trains from Delhi (2 hours)', 'Local autos', 'App cabs', 'E-rickshaws'],
    budget: '₹2,000-4,000/day for budget, ₹6,000-12,000/day for luxury'
  }
];

// GENERAL KNOWLEDGE BASE
export const GENERAL_KNOWLEDGE = {
  visaInfo: 'Tourist visa for India: e-Visa available for 180+ countries. Apply online 4 days before arrival. Validity: 30 days to 5 years. Fee: $10-100 depending on duration.',
  currency: 'Indian Rupee (INR/₹). 1 USD ≈ ₹83. Credit cards widely accepted in cities. ATMs common. Carry cash for rural areas.',
  safety: 'India is generally safe for tourists. Follow basic precautions: Don\'t travel alone at night in unfamiliar areas, keep valuables secure, use licensed taxis/apps, drink bottled water.',
  healthTips: 'Vaccinations recommended: Hepatitis A, Typhoid. Travel insurance advised. Drink bottled water only. Avoid street food initially. Carry basic medicines.',
  language: 'Hindi & English widely spoken. Regional languages vary. English sufficient in tourist areas. Learn basic Hindi phrases for better experience.',
  connectivity: '4G/5G available nationwide. Buy local SIM (Jio/Airtel/VI) at airports. WiFi common in hotels. International roaming expensive.',
  bestTimeToVisit: 'October to March for most of India. Hill stations: March-June, Dec-Feb for snow. Kerala: Sep-Mar. Ladakh: May-Sep.',
  transportation: 'Domestic flights cheap. Trains scenic & economical. Book in advance. App cabs (Uber/Ola) in cities. Auto-rickshaws negotiate fare.',
};

// INTELLIGENT QUERY MATCHING
export function getRelevantKnowledge(userMessage: string): string | null {
  const lowerMessage = userMessage.toLowerCase();
  
  // TRAVEL BUDDY / SOCIAL MATCHING
  if (lowerMessage.match(/travel buddy|find buddy|travel partner|companion|meet people|travel friend/)) {
    return `👥 **TRAVEL BUDDY FINDER**\n\n✨ **How It Works:**\n• Create detailed profile with interests & preferences\n• AI matches you with compatible travelers\n• Chat before confirming travel plans\n• See verified reviews from other travelers\n\n🎯 **Smart Matching Based On:**\n• Travel destination & dates\n• Budget range (₹5K-15K, ₹15K-30K, etc.)\n• Travel style (Adventure, Luxury, Budget, Cultural)\n• Age group & gender preferences\n• Interests (Photography, Food, Hiking, etc.)\n• Languages spoken\n\n💡 **Safety Features:**\n• Profile verification (phone + email)\n• User ratings & reviews\n• Emergency contact sharing\n• Live location sharing option\n• In-app messaging before meeting\n\n🌟 **Popular Buddy Searches:**\n• Solo female travelers for Goa (₹3K-5K/day)\n• Adventure buddies for Ladakh trek\n• Cultural explorers for Rajasthan circuit\n• Budget backpackers for Kerala\n\n**Ready to find your perfect travel buddy?** Go to Travel Buddy section!`;
  }
  
  // CARPOOL / RIDE SHARING
  if (lowerMessage.match(/carpool|ride shar|share ride|cab shar|ride to|drive to/)) {
    return `🚗 **CARPOOL & RIDE SHARING**\n\n✅ **Benefits:**\n• Save 50-70% on travel costs\n• Meet interesting people\n• Eco-friendly travel\n• Door-to-door convenience\n\n💰 **Popular Routes & Costs:**\n• Delhi → Jaipur (270km): ₹300-500 per person\n• Mumbai → Pune (150km): ₹200-350 per person\n• Bangalore → Mysore (150km): ₹250-400 per person\n• Delhi → Agra (230km): ₹250-450 per person\n• Goa Beaches circuit: ₹150-300 per day\n\n🔒 **Safety Features:**\n• Driver verification (license + Aadhaar)\n• Vehicle registration check\n• Live GPS tracking\n• SOS emergency button\n• Passenger insurance\n• Ratings & reviews system\n\n⭐ **How To Book:**\n1. Enter your route & dates\n2. Browse available drivers/rides\n3. Check ratings & reviews\n4. Chat with driver\n5. Confirm & share trip details\n6. Rate after journey\n\n**Start saving on travel!** Visit Carpool section.`;
  }
  
  // EMERGENCY / SOS
  if (lowerMessage.match(/emergency|sos|help|police|ambulance|hospital|danger|lost|stolen/)) {
    return `🚨 **EMERGENCY ASSISTANCE**\n\n📞 **India Emergency Numbers:**\n• Police: 100\n• Ambulance: 102\n• Fire: 101\n• Women Helpline: 1091\n• Tourist Helpline: 1363 / 1800-111-363\n\n🏥 **Quick Actions:**\n• One-tap SOS call to police (100)\n• Share live location with emergency contacts\n• Find nearest hospital/police station\n• Emergency contacts auto-notification\n• Embassy contact (for foreign tourists)\n\n🌍 **City-Specific Helplines:**\n• Delhi Police: 011-23490000\n• Mumbai Police: 022-22621855\n• Bangalore Police: 080-22943226\n• Goa Tourism: 0832-2437132\n\n💊 **Common Emergencies:**\n• Lost passport → Contact embassy + file FIR\n• Lost wallet → Block cards + inform police\n• Medical emergency → Call 102 ambulance\n• Accident → Call 100 + 102\n• Tourist harassment → Call 1363\n\n**Click SOS button (red shield icon) for instant emergency access!**`;
  }
  
  // CURRENCY / EXCHANGE
  if (lowerMessage.match(/currency|exchange rate|convert|rupee|dollar|euro|pound/)) {
    return `💱 **CURRENCY & EXCHANGE**\n\n📊 **Current Rates (Approx):**\n• $1 USD = ₹83.50\n• €1 EUR = ₹90.20\n• £1 GBP = ₹105.75\n• A$1 AUD = ₹54.30\n• C$1 CAD = ₹61.40\n\n💰 **Best Exchange Options in India:**\n1. **Airport Forex** - Convenient but 2-3% higher rates\n2. **Authorized Money Changers** - Best rates, compare multiple\n3. **Banks** - Safe but may have queues\n4. **ATMs** - 24/7 but check fees (₹150-200 per transaction)\n\n💳 **ATM Withdrawal:**\n• Max: ₹10,000 per transaction\n• Fee: ₹150-200 (varies by bank)\n• Best: HDFC, ICICI, Axis Bank ATMs\n\n💡 **Money Tips:**\n• Carry mix of cash + cards\n• UPI apps work everywhere (PhonePe, GPay, Paytm)\n• Keep small denominations (₹10, ₹20, ₹50)\n• Notify bank before traveling\n\n**Want to convert?** Try: \"Convert 100 USD to INR\"`;
  }
  
  // BOOKING / HOTELS
  if (lowerMessage.match(/book|booking|reservation|hotel|stay|accommodation/)) {
    return `🏨 **HOTEL BOOKING GUIDE**\n\n✅ **How to Book:**\n1. Browse destinations\n2. Filter by price, rating, amenities\n3. Read reviews carefully\n4. Check cancellation policy\n5. Book & get QR code confirmation\n6. Show QR at check-in\n\n💰 **Budget Ranges:**\n• Budget: ₹500-1,500/night (Hostels, OYO)\n• Mid-range: ₹2,000-5,000/night (3-star)\n• Premium: ₹5,000-10,000/night (4-star)\n• Luxury: ₹10,000+/night (5-star, heritage)\n\n⭐ **Popular Chains:**\n• Luxury: Taj, Oberoi, Leela, ITC\n• Mid-range: Radisson, Novotel, Hyatt\n• Budget: OYO, Treebo, FabHotel\n• Hostels: Zostel, Backpacker Panda\n\n📍 **Best Areas by City:**\n• Delhi: Connaught Place, Paharganj\n• Mumbai: Colaba, Bandra, Andheri\n• Goa: Baga, Calangute (party), Palolem (peace)\n• Jaipur: C-Scheme, Near City Palace\n• Bangalore: MG Road, Indiranagar\n\n**Browse hotels in Destinations section!**`;
  }
  
  // WEATHER / BEST TIME
  if (lowerMessage.match(/weather|temperature|climate|best time|when to visit|season|rain|cold|hot/)) {
    return `☀️ **WEATHER & BEST TIME TO VISIT**\n\n🌡️ **SEASONAL GUIDE:**\n\n**WINTER (Oct-Mar) - BEST TIME**\n• North India: 10-25°C - Perfect!\n• Rajasthan: Pleasant days, cool nights\n• Goa: Beach season (Nov-Feb)\n• Kerala: Comfortable, some rain\n• Delhi/Agra: Foggy mornings, nice days\n\n**SUMMER (Apr-Jun) - HOT**\n• Delhi: 35-45°C - Very hot!\n• Rajasthan: 40-48°C - Extreme heat\n• Hill stations: BEST TIME (Shimla, Manali, Darjeeling)\n• Goa: Off-season, heavy rains start June\n• South India: Hot & humid\n\n**MONSOON (Jul-Sep) - RAINY**\n• Mumbai: Heavy rains, flooding risk\n• Goa: Beautiful but beaches closed\n• Kerala: Lush green, Ayurveda season\n• Ladakh: Roads open (Jun-Sep only)\n• Rajasthan: Pleasant after rains\n\n📍 **DESTINATION-SPECIFIC:**\n\n🏖️ **Beach Destinations:**\n• Goa: Nov-Feb (dry, pleasant)\n• Kerala: Oct-Mar (avoid monsoon)\n• Andaman: Oct-May\n\n🏔️ **Mountains:**\n• Ladakh: Jun-Sep only (road access)\n• Manali/Shimla: Apr-Jun, Sep-Nov\n• Rishikesh: Sep-Nov, Feb-May\n\n🏛️ **Heritage/Cities:**\n• Delhi/Agra/Jaipur: Oct-Mar\n• Varanasi: Oct-Mar\n• Udaipur: Oct-Mar\n\n**Which destination are you planning?**`;
  }
  
  // FOOD / CUISINE
  if (lowerMessage.match(/food|eat|restaurant|cuisine|dish|meal|breakfast|lunch|dinner|street food/)) {
    return `🍜 **INDIAN FOOD GUIDE**\n\n🌟 **MUST-TRY BY CITY:**\n\n**Delhi:**\n• Paranthas - Paranthe Wali Gali (₹50-100)\n• Butter Chicken - Moti Mahal (₹400)\n• Chaat - Chandni Chowk (₹50-150)\n• Kebabs - Karim's (₹300-600)\n\n**Mumbai:**\n• Vada Pav - Street stalls (₹20-40)\n• Pav Bhaji - Sardar (₹100-200)\n• Seafood - Trishna, Mahesh Lunch Home (₹500-800)\n• Street food - Khau Galli (₹200-400)\n\n**Goa:**\n• Fish Curry Rice (₹200-400)\n• Prawn Balchão (₹350-600)\n• Bebinca dessert (₹150)\n• Beach shack meals (₹300-600)\n\n**Jaipur:**\n• Dal Baati Churma (₹200-400)\n• Laal Maas (₹350-600)\n• Ghewar sweet (₹100-200)\n• Pyaaz Kachori (₹30-80)\n\n**Bangalore:**\n• Masala Dosa - MTR (₹100-200)\n• Benne Masala Dosa (₹120)\n• Filter Coffee (₹30-60)\n• Biryani - Meghana Foods (₹250-400)\n\n💰 **MEAL COSTS:**\n• Street food: ₹50-150\n• Local restaurant: ₹200-400\n• Mid-range: ₹500-1,000\n• Fine dining: ₹1,500-3,000\n\n🔥 **FAMOUS CHAINS:**\n• South Indian: Saravana Bhavan, MTR\n• North Indian: Haldiram's, Bikanervala\n• Fast food: McDonald's, KFC, Domino's\n• Cafes: Cafe Coffee Day, Starbucks\n\n⚠️ **FOOD SAFETY:**\n• Eat at busy places (high turnover)\n• Drink bottled water only\n• Avoid raw salads at street stalls\n• Start with mild spice levels\n\n**Want food recommendations for a specific city?**`;
  }
  
  // TRANSPORTATION / GETTING AROUND
  if (lowerMessage.match(/transport|taxi|uber|ola|metro|bus|train|auto|rickshaw|how to get/)) {
    return `🚖 **TRANSPORTATION IN INDIA**\n\n📱 **RIDE-HAILING APPS:**\n• Uber & Ola - Most cities (₹50-500)\n• Rapido - Bike taxis (₹20-150)\n• Namma Yatri - Bangalore (auto app)\n• BluSmart - EV cabs Delhi/Bangalore\n\n🚇 **METRO SYSTEMS:**\n• **Delhi Metro:** 300+ stations, ₹10-60\n  - Airport Express: ₹60\n  - Smart card saves time\n• **Mumbai Metro:** Limited lines, ₹10-40\n• **Bangalore Metro:** Growing network, ₹10-60\n• **Chennai Metro:** Good coverage, ₹10-50\n• **Jaipur Metro:** City coverage, ₹5-25\n\n🛺 **AUTO-RICKSHAWS:**\n• Meter rates: ₹25-30 base + ₹12-15/km\n• Negotiate price before ride\n• Use Ola/Uber Auto for transparency\n• Typical rides: ₹50-200 in cities\n\n🚌 **BUSES:**\n• Local city buses: ₹5-50\n• Inter-city AC buses: ₹300-1,500\n• Apps: RedBus, AbhiBus for bookings\n\n🚂 **TRAINS:**\n• Indian Railways - Extensive network\n• Book on IRCTC app/website\n• Classes: Sleeper (₹300-800), AC (₹800-2,000)\n• Popular routes: Delhi-Agra, Mumbai-Pune\n\n✈️ **FLIGHTS:**\n• IndiGo, Air India, SpiceJet\n• Book 2-3 months advance for deals\n• Budget: ₹2,000-6,000 (domestic)\n\n💡 **TIPS:**\n• Download Ola, Uber, Google Maps\n• Keep change for autos/buses\n• Metro is fastest in rush hour\n• Book trains early (they fill up)\n• Airport taxis charge ₹400-800 to city\n\n**Which city are you traveling in?**`;
  }
  
  // BUDGET / COSTS
  if (lowerMessage.match(/budget|cost|expensive|cheap|price|spend|money|afford/)) {
    return `💰 **TRAVEL BUDGET GUIDE**\n\n📊 **DAILY BUDGET BY TRAVELER TYPE:**\n\n🎒 **BACKPACKER (₹1,500-3,000/day):**\n• Hostel/dorm: ₹400-800\n• Meals: ₹300-600 (street food, local)\n• Transport: ₹200-400 (bus, metro, auto)\n• Attractions: ₹200-500\n• Misc: ₹200-400\n\n🏃 **MID-RANGE (₹4,000-8,000/day):**\n• 3-star hotel: ₹2,000-4,000\n• Meals: ₹800-1,500 (restaurants)\n• Transport: ₹500-1,000 (Uber, taxis)\n• Attractions: ₹500-1,000\n• Shopping: ₹500-1,000\n\n💎 **LUXURY (₹15,000+/day):**\n• 5-star hotel: ₹8,000-25,000\n• Fine dining: ₹2,000-5,000\n• Private car: ₹2,000-4,000\n• Premium experiences: ₹2,000-5,000\n\n🏙️ **CITY-WISE COSTS:**\n\n**Expensive:**\n• Mumbai: ₹3,500-7,000/day\n• Delhi: ₹3,000-6,500/day\n• Bangalore: ₹3,000-6,000/day\n\n**Moderate:**\n• Jaipur: ₹2,500-5,000/day\n• Pune: ₹2,500-5,000/day\n• Goa: ₹3,000-6,000/day (beach premium)\n\n**Budget-Friendly:**\n• Varanasi: ₹1,500-3,500/day\n• Rishikesh: ₹1,500-3,000/day\n• Udaipur: ₹2,000-4,000/day\n\n💡 **MONEY-SAVING TIPS:**\n• Book hotels 1-2 weeks advance\n• Eat at local restaurants (₹200 vs ₹800)\n• Use metro instead of Uber\n• Free attractions: Ghats, parks, temples\n• Travel in groups for carpools\n• Book train instead of flight\n\n📱 **EXPENSE TRACKING:**\nUse our Expense Tracker feature to monitor your spending!\n\n**Planning a trip? Tell me destination & days for detailed budget!**`;
  }
  
  // VISA / PASSPORT / DOCUMENTS
  if (lowerMessage.match(/visa|passport|document|id|aadhaar|permit|foreign/)) {
    return `📄 **TRAVEL DOCUMENTS GUIDE**\n\n🇮🇳 **FOR INDIAN CITIZENS (DOMESTIC):**\n• **Required:** Government photo ID\n  - Aadhaar Card ✅\n  - Driving License ✅\n  - PAN Card ✅\n  - Voter ID ✅\n• **Hotels:** ID mandatory for check-in\n• **Flights/Trains:** ID for booking name verification\n\n🏔️ **SPECIAL PERMITS:**\n• **Ladakh (Restricted areas):**\n  - Inner Line Permit (ILP)\n  - Online: ₹400\n  - Required for: Pangong, Nubra Valley, Tso Moriri\n• **Rohtang Pass (Manali):**\n  - NGT Permit: ₹500\n  - Book 1 month advance online\n• **Andaman Islands:**\n  - Permit for some islands\n  - Free at Port Blair airport\n\n🌍 **FOR FOREIGN TOURISTS:**\n• **E-Visa:** Apply online before arrival\n  - Tourist visa: $10-80\n  - Process: 2-4 business days\n  - Valid: 30 days to 5 years\n• **On Arrival:** Limited countries only\n• **Required:** Passport valid 6+ months\n• **Registration:** Within 14 days if >180 days stay\n\n💡 **IMPORTANT TIPS:**\n• Carry 2 photocopies of all IDs\n• Digital copies in email/cloud\n• Keep hotel confirmation printout\n• For Nepal/Bhutan: Voter ID works\n• Lost passport? Contact embassy + file FIR immediately\n\n📱 **DIGITAL IDs:**\n• DigiLocker app - Store Aadhaar, DL, etc.\n• Accepted at many hotels & airports\n\n**Need permit application help? Ask me specific location!**`;
  }
  
  // Check if asking about specific hotel in a city
  const hotelMatch = lowerMessage.match(/hotel.*(?:in|at|near)\s+(\w+)|(\w+)\s+hotel/);
  
  if (hotelMatch) {
    const city = hotelMatch[1] || hotelMatch[2];
    const cityMatch = HOTELS_DATABASE.find(db => 
      city.toLowerCase() === db.city.toLowerCase()
    );
    
    if (cityMatch) {
      return formatHotelResponse(cityMatch);
    }
  }
  
  // Check for destination queries
  const destMatch = DESTINATIONS_DATABASE.find(db =>
    lowerMessage.includes(db.city.toLowerCase()) || lowerMessage.includes(db.state.toLowerCase())
  );
  
  if (destMatch) {
    return formatDestinationResponse(destMatch);
  }
  
  return null;
}

function formatHotelResponse(hotelInfo: HotelInfo): string {
  let response = `🏨 **Best Hotels in ${hotelInfo.city}**\n\n`;
  
  response += `I found ${hotelInfo.hotels.length} great options for you:\n\n`;
  
  hotelInfo.hotels.forEach((hotel, index) => {
    response += `**${index + 1}. ${hotel.name}**\n`;
    response += `💰 ${hotel.priceRange}\n`;
    response += `⭐ Rating: ${hotel.rating}/5\n`;
    response += `✨ ${hotel.features.join(', ')}\n\n`;
  });
  
  response += `💡 **Booking Tips:**\n`;
  response += `• Book directly through our platform for best prices\n`;
  response += `• Check reviews before booking\n`;
  response += `• Weekend rates may be higher\n`;
  response += `• Many hotels offer free cancellation\n\n`;
  response += `Would you like me to help you book any of these hotels?`;
  
  return response;
}

function formatDestinationResponse(dest: DestinationInfo): string {
  let response = `🗺️ **Complete Guide to ${dest.city}**\n\n`;
  
  response += `📍 **Location:** ${dest.state}\n`;
  response += `🌤️ **Best Time:** ${dest.bestTime}\n`;
  response += `☀️ **Weather:** ${dest.weather}\n\n`;
  
  response += `🎯 **Top Attractions:**\n`;
  dest.attractions.forEach((attr, i) => {
    response += `${i + 1}. ${attr}\n`;
  });
  
  response += `\n🍽️ **Must-Try Food:**\n`;
  dest.food.slice(0, 4).forEach(food => response += `• ${food}\n`);
  
  response += `\n🚗 **Getting Around:**\n`;
  dest.transport.slice(0, 3).forEach(trans => response += `• ${trans}\n`);
  
  response += `\n💰 **Budget:** ${dest.budget}\n\n`;
  response += `Would you like hotel recommendations or help planning your itinerary?`;
  
  return response;
}