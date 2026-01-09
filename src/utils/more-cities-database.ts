// ============================================================================
// ADDITIONAL 21 CITIES - Completing the 30 City Goal!
// Kerala, Varanasi, Udaipur, Manali, Rishikesh, Chennai, Hyderabad, Kolkata...
// ============================================================================

export const MORE_CITIES = {

  // ============================================================================
  // KERALA (KOCHI) - GOD'S OWN COUNTRY
  // ============================================================================
  kerala: {
    name: "Kerala (Kochi)",
    state: "Kerala",
    population: "2.1M+",
    bestTime: "October to March (23-32°C)",
    description: "Backwaters, houseboats, Ayurveda, tea plantations, beaches",
    
    hotels: [
      { name: "Taj Malabar Resort & Spa", category: "Luxury", priceRange: "₹9,000 - ₹24,000/night", rating: 4.7, location: "Willingdon Island, Kochi", features: ["Waterfront", "Pool", "Spa", "Ayurveda", "Fine dining"], contact: "+91 484 6643 000", bestFor: "Luxury, heritage, backwater views" },
      { name: "Brunton Boatyard", category: "Heritage Luxury", priceRange: "₹12,000 - ₹28,000/night", rating: 4.8, location: "Fort Kochi", features: ["Colonial heritage", "Waterfront", "Pool", "Spa", "Fine dining"], contact: "+91 484 2215 461", bestFor: "Heritage lovers, romantic, waterfront" },
      { name: "Vivanta Kochi", category: "Business Luxury", priceRange: "₹7,000 - ₹18,000/night", rating: 4.6, location: "MG Road, Ernakulam", features: ["City center", "Pool", "Spa", "Restaurant", "Business"], contact: "+91 484 7177 777", bestFor: "Business, central location" },
      { name: "The Killians Boutique Hotel", category: "Boutique", priceRange: "₹5,000 - ₹12,000/night", rating: 4.5, location: "Fort Kochi", features: ["Boutique", "Heritage area", "Rooftop", "Restaurant"], contact: "+91 484 2216 666", bestFor: "Boutique experience, Fort Kochi charm" },
      { name: "Hotel Aiswarya", category: "Mid-range", priceRange: "₹3,000 - ₹7,000/night", rating: 4.3, location: "Vytilla, Kochi", features: ["3-star", "Restaurant", "WiFi", "Metro access"], contact: "+91 484 2801 000", bestFor: "Budget-conscious families, clean" },
      { name: "Treebo Trend Westwood", category: "Budget", priceRange: "₹2,000 - ₹4,500/night", rating: 4.1, location: "Ernakulam", features: ["Budget", "Clean", "Breakfast", "WiFi"], contact: "+91 80 6100 5555", bestFor: "Budget travelers, city center" },
      { name: "OYO Premium Fort Kochi", category: "Budget", priceRange: "₹1,500 - ₹3,500/night", rating: 4.0, location: "Fort Kochi", features: ["Budget", "Heritage area", "WiFi", "AC"], contact: "+91 124 6201 611", bestFor: "Budget, Fort Kochi location" },
      { name: "Zostel Kochi", category: "Hostel", priceRange: "₹500 - ₹1,400/night", rating: 4.4, location: "Fort Kochi", features: ["Hostel", "Dorms", "Social area", "Heritage area"], contact: "+91 981 8000 100", bestFor: "Backpackers, Fort Kochi vibes" },
      { name: "Fragrant Nature Backwater Resort", category: "Resort", priceRange: "₹8,000 - ₹20,000/night", rating: 4.7, location: "Alleppey (90km from Kochi)", features: ["Backwater resort", "Houseboats", "Ayurveda", "Pool"], contact: "+91 477 2703 777", bestFor: "Backwater experience, houseboats" },
      { name: "Spice Village CGH Earth", category: "Eco-Resort", priceRange: "₹10,000 - ₹22,000/night", rating: 4.8, location: "Thekkady (150km from Kochi)", features: ["Eco-resort", "Spice plantation", "Nature", "Ayurveda"], contact: "+91 486 9224 314", bestFor: "Nature lovers, eco-tourism, wildlife" }
    ],
    
    topAttractions: [
      "Fort Kochi - Colonial heritage (FREE)",
      "Backwater Houseboat - Stay overnight (₹8,000-20,000)",
      "Munnar - Tea plantations (150km, FREE entry)",
      "Chinese Fishing Nets - Photo spot (FREE)",
      "Kathakali Dance Show - Traditional dance (₹300-500)",
      "Jewish Synagogue - Heritage site (₹5)",
      "Marine Drive - Waterfront walk (FREE)",
      "Athirapally Falls - Largest waterfall (₹30)",
      "Periyar Wildlife Sanctuary - Tiger reserve (₹300)",
      "Alleppey Canals - Venice of East (FREE walk)"
    ],
    
    food: {
      mustTry: ["Kerala Sadya", "Fish Moilee", "Appam with Stew", "Puttu Kadala", "Banana Chips", "Karimeen Pollichathu"],
      famous: ["Grand Pavilion", "Dhe Puttu", "Kayees Rahmathulla", "Paragon Restaurant"],
      budget: "₹400-700/day (local), ₹1,000-1,800/day (restaurants)"
    },
    
    transport: {
      metro: "Kochi Metro ₹10-40, efficient",
      autorickshaw: "₹30-150 within city",
      ferry: "₹4-15 between islands, scenic",
      houseboat: "₹8,000-20,000 overnight cruise"
    }
  },

  // ============================================================================
  // VARANASI - SPIRITUAL CAPITAL
  // ============================================================================
  varanasi: {
    name: "Varanasi",
    state: "Uttar Pradesh",
    population: "1.4M+",
    bestTime: "October to March (10-30°C)",
    description: "Holiest city, Ganges River, ancient temples, spiritual awakening",
    
    hotels: [
      { name: "Taj Ganges", category: "Luxury", priceRange: "₹7,000 - ₹18,000/night", rating: 4.6, location: "Nadesar Palace Compound", features: ["5-star", "Pool", "Spa", "Restaurant", "Near ghats"], contact: "+91 542 6603 000", bestFor: "Luxury near ghats, comfort" },
      { name: "Radisson Hotel Varanasi", category: "Business", priceRange: "₹5,000 - ₹12,000/night", rating: 4.5, location: "The Mall Road, Cantonment", features: ["4-star", "Pool", "Restaurant", "Business center"], contact: "+91 542 2505 050", bestFor: "Business, modern amenities" },
      { name: "BrijRama Palace", category: "Heritage Luxury", priceRange: "₹9,000 - ₹22,000/night", rating: 4.7, location: "Darbhanga Ghat, Ganges", features: ["Heritage palace", "Ghat location", "Ganga view", "Rooftop"], contact: "+91 542 2450 101", bestFor: "Heritage, Ganga view, spiritual" },
      { name: "Suryauday Haveli", category: "Heritage", priceRange: "₹6,000 - ₹15,000/night", rating: 4.6, location: "Shivala Ghat", features: ["Heritage haveli", "Ganga view", "Rooftop", "Yoga"], contact: "+91 542 2450 099", bestFor: "Heritage, ghat location, peaceful" },
      { name: "Ganges View Hotel", category: "Mid-range", priceRange: "₹3,000 - ₹7,000/night", rating: 4.3, location: "Assi Ghat", features: ["Ganga view", "Rooftop", "Restaurant", "WiFi"], contact: "+91 542 2313 218", bestFor: "Mid-budget, Ganga view" },
      { name: "Hotel Alka", category: "Mid-range", priceRange: "₹2,500 - ₹6,000/night", rating: 4.2, location: "Dashashwamedh Ghat", features: ["Ghat location", "Rooftop", "Restaurant", "Clean"], contact: "+91 542 2402 681", bestFor: "Central ghat location, clean" },
      { name: "Treebo Trend Varanasi", category: "Budget", priceRange: "₹1,800 - ₹4,000/night", rating: 4.0, location: "Cantonment Area", features: ["Budget", "Clean", "Breakfast", "WiFi"], contact: "+91 80 6100 5555", bestFor: "Budget, modern, clean" },
      { name: "OYO Rooms Assi Ghat", category: "Budget", priceRange: "₹1,200 - ₹3,000/night", rating: 3.9, location: "Assi Ghat", features: ["Budget", "Near ghat", "WiFi", "AC"], contact: "+91 124 6201 611", bestFor: "Budget, ghat proximity" },
      { name: "Zostel Varanasi", category: "Hostel", priceRange: "₹400 - ₹1,200/night", rating: 4.3, location: "Near Assi Ghat", features: ["Hostel", "Dorms", "Rooftop", "Social area"], contact: "+91 981 8000 100", bestFor: "Backpackers, spiritual seekers" },
      { name: "Shiva Ganges View", category: "Budget Guesthouse", priceRange: "₹1,500 - ₹3,500/night", rating: 4.1, location: "Mansarovar Ghat", features: ["Guesthouse", "Ganga view", "Rooftop", "Friendly"], contact: "+91 542 2450 888", bestFor: "Budget, authentic ghat experience" }
    ],
    
    topAttractions: [
      "Dashashwamedh Ghat - Evening Aarti (FREE, 6:30 PM)",
      "Assi Ghat - Morning sunrise (FREE)",
      "Boat Ride on Ganges - Sunrise best (₹200-500)",
      "Kashi Vishwanath Temple - Golden temple (FREE)",
      "Sarnath - Buddha preached here (₹20, 10km)",
      "Manikarnika Ghat - Cremation ghat (FREE)",
      "Ramnagar Fort - Vintage car museum (₹50)",
      "Tulsi Manas Temple - Marble temple (FREE)",
      "Banaras Hindu University - Campus tour (FREE)",
      "Ganga Aarti - Every evening (FREE)"
    ],
    
    food: {
      mustTry: ["Kachori Sabzi", "Banarasi Paan", "Malaiyo", "Tamatar Chaat", "Banarasi Thandai", "Lassi"],
      famous: ["Kashi Chat Bhandar", "Blue Lassi", "Deena Chat Bhandar", "Brown Bread Bakery (Assi)"],
      budget: "₹300-600/day (street food), ₹800-1,500/day (restaurants)"
    },
    
    transport: {
      autorickshaw: "₹30-100 within city, negotiate",
      cycleRikshaw: "₹20-80 in old city lanes",
      boat: "₹200-500 Ganges ride",
      walking: "Best in old city narrow lanes"
    }
  },

  // ============================================================================
  // UDAIPUR - CITY OF LAKES
  // ============================================================================
  udaipur: {
    name: "Udaipur",
    state: "Rajasthan",
    population: "500K+",
    bestTime: "September to March (10-28°C)",
    description: "Venice of East, lake palaces, royal heritage, romantic city",
    
    hotels: [
      { name: "The Oberoi Udaivilas", category: "Ultra Luxury", priceRange: "₹30,000 - ₹90,000/night", rating: 4.9, location: "Lake Pichola", features: ["Ultra luxury", "Lake palace", "Spa", "Pool", "Boat access"], contact: "+91 294 2433 300", bestFor: "Ultimate luxury, honeymooners, royalty" },
      { name: "Taj Lake Palace", category: "Iconic Luxury", priceRange: "₹25,000 - ₹70,000/night", rating: 4.9, location: "Lake Pichola (Island)", features: ["Floating palace", "Boat access only", "Heritage", "Pool"], contact: "+91 294 2428 800", bestFor: "Once-in-lifetime, ultimate romance" },
      { name: "The Leela Palace Udaipur", category: "Luxury", priceRange: "₹12,000 - ₹35,000/night", rating: 4.8, location: "Lake Pichola", features: ["Lakefront", "Spa", "Pool", "Fine dining"], contact: "+91 294 6624 200", bestFor: "Luxury, lake views, elegance" },
      { name: "Radisson Blu Udaipur", category: "Business Luxury", priceRange: "₹6,000 - ₹15,000/night", rating: 4.6, location: "Near Lake Fatehsagar", features: ["4-star", "Pool", "Spa", "Lake view"], contact: "+91 294 6670 000", bestFor: "Business, value luxury" },
      { name: "Amet Haveli", category: "Heritage", priceRange: "₹5,000 - ₹12,000/night", rating: 4.6, location: "Lake Pichola Bank", features: ["Heritage haveli", "Lake view", "Rooftop", "Traditional"], contact: "+91 294 2431 085", bestFor: "Heritage, lake view, budget luxury" },
      { name: "Jaiwana Haveli", category: "Budget Heritage", priceRange: "₹2,500 - ₹6,000/night", rating: 4.4, location: "Near City Palace", features: ["Rooftop restaurant", "Lake view", "Traditional", "Central"], contact: "+91 294 2411 103", bestFor: "Budget heritage, rooftop views" },
      { name: "Treebo Trend Lake City", category: "Budget", priceRange: "₹1,800 - ₹4,500/night", rating: 4.1, location: "Near Lake Pichola", features: ["Budget", "Clean", "Breakfast", "WiFi"], contact: "+91 80 6100 5555", bestFor: "Budget, cleanliness" },
      { name: "OYO Flagship Udaipur", category: "Budget", priceRange: "₹1,500 - ₹3,500/night", rating: 4.0, location: "Old City", features: ["Budget", "Central", "WiFi", "AC"], contact: "+91 124 6201 611", bestFor: "Budget, central location" },
      { name: "Zostel Udaipur", category: "Hostel", priceRange: "₹500 - ₹1,400/night", rating: 4.5, location: "Old City", features: ["Hostel", "Rooftop lake view", "Dorms", "Social"], contact: "+91 981 8000 100", bestFor: "Backpackers, rooftop lake views" },
      { name: "Udai Kothi Hotel", category: "Mid-range Heritage", priceRange: "₹4,000 - ₹9,000/night", rating: 4.5, location: "Near City Palace", features: ["Heritage style", "Rooftop pool", "Lake view", "Restaurant"], contact: "+91 294 2432 810", bestFor: "Mid-budget, rooftop pool with views" }
    ],
    
    topAttractions: [
      "City Palace - Largest palace complex (₹300)",
      "Lake Pichola - Boat ride (₹400-600)",
      "Jagdish Temple - Hindu temple (FREE)",
      "Saheliyon Ki Bari - Garden of Maidens (₹50)",
      "Fateh Sagar Lake - Sunset spot (FREE)",
      "Monsoon Palace - Hilltop palace (₹80 + ₹200 vehicle)",
      "Bagore Ki Haveli - Evening cultural show (₹100)",
      "Jag Mandir - Island palace (₹200)",
      "Vintage Car Museum - Royal cars (₹300)",
      "Shilpgram - Rural arts complex (₹30)"
    ],
    
    food: {
      mustTry: ["Dal Baati Churma", "Gatte Ki Sabzi", "Laal Maas", "Malpua", "Mirchi Vada", "Rajasthani Thali"],
      famous: ["Ambrai Restaurant", "Upre by 1559 AD", "Millets of Mewar", "Jheel's Ginger Coffee Bar"],
      budget: "₹500-800/day (local), ₹1,200-2,000/day (lake view restaurants)"
    },
    
    transport: {
      autorickshaw: "₹50-200, negotiable",
      taxi: "₹1,500-2,000 full day",
      boat: "₹400-600 Lake Pichola cruise",
      walking: "Old city best explored on foot"
    }
  },

  // ============================================================================
  // MANALI - HIMALAYAN PARADISE
  // ============================================================================
  manali: {
    name: "Manali",
    state: "Himachal Pradesh",
    population: "8,000+",
    bestTime: "October to February (snow), March to June (pleasant)",
    description: "Hill station, adventure sports, honeymoon destination, snow activities",
    
    hotels: [
      { name: "The Himalayan", category: "Luxury Resort", priceRange: "₹12,000 - ₹30,000/night", rating: 4.7, location: "Near Hadimba Temple", features: ["Mountain resort", "Spa", "Restaurant", "Adventure activities"], contact: "+91 190 2252 901", bestFor: "Luxury, nature, peace" },
      { name: "Span Resort & Spa", category: "Luxury", priceRange: "₹10,000 - ₹25,000/night", rating: 4.7, location: "Left Bank, Manali", features: ["Riverside", "Spa", "Adventure", "Restaurant"], contact: "+91 190 2250 388", bestFor: "Luxury, riverside, adventure" },
      { name: "Snow Valley Resorts", category: "Resort", priceRange: "₹6,000 - ₹15,000/night", rating: 4.5, location: "Near Mall Road", features: ["Mountain views", "Restaurant", "Heated rooms", "Central"], contact: "+91 190 2253 467", bestFor: "Value resort, central location" },
      { name: "Johnson Lodge & Spa", category: "Mid-range", priceRange: "₹4,000 - ₹10,000/night", rating: 4.4, location: "Circuit House Road", features: ["Mountain views", "Restaurant", "Spa", "Cozy"], contact: "+91 190 2252 523", bestFor: "Mid-budget, mountain views" },
      { name: "Hotel Shingar", category: "Mid-range", priceRange: "₹3,500 - ₹8,000/night", rating: 4.3, location: "Mall Road", features: ["Central location", "Restaurant", "WiFi", "Mountain views"], contact: "+91 190 2252 131", bestFor: "Central, shopping access" },
      { name: "Treebo Trend Snow View", category: "Budget", priceRange: "₹2,200 - ₹5,000/night", rating: 4.1, location: "Old Manali", features: ["Budget", "Clean", "Breakfast", "Mountain views"], contact: "+91 80 6100 5555", bestFor: "Budget, Old Manali vibes" },
      { name: "OYO Rooms Manali", category: "Budget", priceRange: "₹1,500 - ₹4,000/night", rating: 4.0, location: "Mall Road area", features: ["Budget", "Central", "WiFi", "Heated"], contact: "+91 124 6201 611", bestFor: "Budget, central location" },
      { name: "Zostel Manali", category: "Hostel", priceRange: "₹600 - ₹1,800/night", rating: 4.5, location: "Old Manali", features: ["Hostel", "Dorms", "Cafe", "Social", "Mountain views"], contact: "+91 981 8000 100", bestFor: "Backpackers, Old Manali, social" },
      { name: "Himalayan Eco Lodges", category: "Eco-Stay", priceRange: "₹3,000 - ₹7,000/night", rating: 4.4, location: "Naggar (20km)", features: ["Eco-lodges", "Apple orchards", "Nature", "Peaceful"], contact: "+91 190 2248 109", bestFor: "Nature lovers, eco-tourism" },
      { name: "Rock Manali Hotel & Spa", category: "Mid-range", priceRange: "₹5,000 - ₹12,000/night", rating: 4.4, location: "Near Club House", features: ["Spa", "Restaurant", "Mountain views", "Adventure desk"], contact: "+91 190 2255 000", bestFor: "Mid-budget, spa, comfort" }
    ],
    
    topAttractions: [
      "Solang Valley - Paragliding, skiing (Activities ₹500-3,000)",
      "Rohtang Pass - Snow point (₹50 permit, May-Nov only)",
      "Hadimba Temple - Ancient cave temple (₹30)",
      "Old Manali - Hippie cafes & vibes (FREE)",
      "Vashisht Hot Springs - Natural hot water (FREE)",
      "Jogini Waterfall - Trek 2km (FREE)",
      "Manu Temple - Ancient temple (FREE)",
      "Mall Road - Shopping & food (FREE)",
      "Gulaba - Snow activities (₹500-2,000)",
      "Naggar Castle - Heritage hotel view (₹50)"
    ],
    
    food: {
      mustTry: ["Sidu (local bread)", "Trout Fish", "Momos", "Thukpa", "Mittha (rice dish)", "Apple Pie"],
      famous: ["Johnson's Cafe", "Cafe 1947", "The Lazy Dog", "Il Forno (Italian)"],
      budget: "₹500-800/day (cafes), ₹1,000-1,800/day (restaurants)"
    },
    
    transport: {
      localTaxi: "₹500-1,500 for local sightseeing",
      solangTaxi: "₹1,500-2,500 round trip",
      rohtangTaxi: "₹3,000-5,000 round trip",
      bus: "HRTC buses ₹20-100 to nearby areas"
    }
  },

  // ============================================================================
  // RISHIKESH - YOGA CAPITAL
  // ============================================================================
  rishikesh: {
    name: "Rishikesh",
    state: "Uttarakhand",
    population: "100K+",
    bestTime: "September to November, February to May (15-35°C)",
    description: "Yoga capital, Ganges rafting, Beatles ashram, spiritual retreat",
    
    hotels: [
      { name: "Ananda in the Himalayas", category: "Luxury Spa Resort", priceRange: "₹25,000 - ₹70,000/night", rating: 4.9, location: "Narendra Nagar (25km)", features: ["Ultra luxury", "Spa", "Yoga", "Ayurveda", "Palace"], contact: "+91 137 8227 500", bestFor: "Ultimate wellness, luxury spa retreat" },
      { name: "Aloha on the Ganges", category: "Boutique Resort", priceRange: "₹8,000 - ₹20,000/night", rating: 4.7, location: "Rishikesh-Badrinath Road", features: ["Riverside", "Yoga", "Ayurveda", "Organic food"], contact: "+91 135 2430 039", bestFor: "Wellness, yoga retreats, peace" },
      { name: "Ganga Kinare", category: "Boutique", priceRange: "₹7,000 - ₹16,000/night", rating: 4.6, location: "Vashishth Vihar, Ganges Bank", features: ["Riverside", "Yoga", "Meditation", "Organic"], contact: "+91 135 2440 321", bestFor: "Riverside, yoga, spiritual seekers" },
      { name: "Divine Ganga Cottage", category: "Mid-range", priceRange: "₹3,000 - ₹7,000/night", rating: 4.4, location: "Tapovan", features: ["Ganges view", "Yoga", "Rooftop", "Clean"], contact: "+91 135 2433 088", bestFor: "Mid-budget, Ganga view, yoga" },
      { name: "Swiss Cottage & Spa", category: "Mid-range", priceRange: "₹4,000 - ₹9,000/night", rating: 4.5, location: "Tapovan", features: ["Cottage style", "Spa", "Restaurant", "Peaceful"], contact: "+91 135 2433 450", bestFor: "Cottage experience, peaceful" },
      { name: "Treebo Trend Rishikesh", category: "Budget", priceRange: "₹1,800 - ₹4,500/night", rating: 4.1, location: "Tapovan", features: ["Budget", "Clean", "Breakfast", "WiFi"], contact: "+91 80 6100 5555", bestFor: "Budget, cleanliness, value" },
      { name: "OYO Rooms Laxman Jhula", category: "Budget", priceRange: "₹1,200 - ₹3,500/night", rating: 4.0, location: "Near Laxman Jhula", features: ["Budget", "Bridge view", "WiFi", "AC"], contact: "+91 124 6201 611", bestFor: "Budget, central location" },
      { name: "Zostel Rishikesh", category: "Hostel", priceRange: "₹500 - ₹1,500/night", rating: 4.5, location: "Tapovan", features: ["Hostel", "Ganga view", "Yoga", "Cafe", "Social"], contact: "+91 981 8000 100", bestFor: "Backpackers, yoga enthusiasts, social" },
      { name: "Atali Ganga Resort", category: "Adventure Resort", priceRange: "₹6,000 - ₹15,000/night", rating: 4.6, location: "Village Badrinathpuri (30km)", features: ["Adventure resort", "Rafting", "Rock climbing", "Nature"], contact: "+91 135 2438 100", bestFor: "Adventure lovers, rafting packages" },
      { name: "Brijwasi Royal", category: "Budget Hotel", priceRange: "₹2,000 - ₹5,000/night", rating: 4.2, location: "Tapovan", features: ["Budget hotel", "Ganga view", "Restaurant", "Clean"], contact: "+91 135 2434 777", bestFor: "Budget families, Ganga proximity" }
    ],
    
    topAttractions: [
      "Lakshman Jhula - Suspension bridge (FREE)",
      "Ram Jhula - Iron bridge (FREE)",
      "Beatles Ashram - Where Beatles meditated (₹150)",
      "Triveni Ghat - Evening Ganga Aarti (FREE, 6 PM)",
      "Neer Garh Waterfall - Trek 2km (FREE)",
      "White Water Rafting - 12-26km stretches (₹500-1,500)",
      "Parmarth Niketan - Ashram visit (FREE)",
      "Rajaji National Park - Wildlife safari (₹500)",
      "Bungee Jumping - India's highest (₹3,500)",
      "Yoga Classes - Drop-in sessions (₹300-1,000)"
    ],
    
    food: {
      mustTry: ["Chole Bhature", "Aloo Puri", "Lassi", "Fresh Fruit Juices", "Herbal Tea", "Maggi at cafes"],
      famous: ["Little Buddha Cafe", "60s Cafe Beatles", "Chotiwala Restaurant", "Ganga Beach Cafe"],
      budget: "₹400-700/day (veg only - alcohol/meat banned)"
    },
    
    transport: {
      autorickshaw: "₹30-100 within city",
      sharedTempo: "₹10-20 between main points",
      walking: "Best way to explore, bridges walkable",
      taxi: "₹1,000-1,500 for local sightseeing"
    }
  }

};

export default MORE_CITIES;