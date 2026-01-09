// ============================================================================
// COMPREHENSIVE CITY & HOTEL DATABASE - 30+ CITIES WITH 10 HOTELS EACH
// 300+ Hotels Total!
// ============================================================================

import EXTENDED_CITIES from './extended-city-database';
import MORE_CITIES from './more-cities-database';

// Base cities (Delhi, Mumbai, Bangalore) + Extended cities (Goa, Jaipur, Agra) + More cities (Kerala, Varanasi, Udaipur, Manali, Rishikesh + 16 more)
export const COMPLETE_CITY_DATABASE = {
  
  // ============================================================================
  // DELHI - CAPITAL CITY
  // ============================================================================
  delhi: {
    name: "Delhi",
    state: "Delhi (NCT)",
    population: "20M+",
    bestTime: "October to March (15-25°C)",
    description: "Capital of India, UNESCO World Heritage Sites, Mughal & British architecture",
    
    hotels: [
      {
        name: "The Leela Palace New Delhi",
        category: "Luxury",
        priceRange: "₹12,000 - ₹35,000/night",
        rating: 4.9,
        location: "Diplomatic Enclave, Chanakyapuri",
        features: ["Ultra luxury", "Spa & wellness", "4 restaurants", "Butler service", "Pool", "Gym", "Business center"],
        contact: "+91 11 3933 1234",
        bestFor: "Business travelers, luxury seekers, special occasions"
      },
      {
        name: "The Taj Mahal Hotel New Delhi",
        category: "Luxury",
        priceRange: "₹10,000 - ₹30,000/night",
        rating: 4.8,
        location: "Mansingh Road, near India Gate",
        features: ["Heritage luxury", "Rooftop restaurant", "Spa", "Pool", "Fine dining", "24/7 room service"],
        contact: "+91 11 6656 6162",
        bestFor: "Luxury travelers, honeymooners, business"
      },
      {
        name: "ITC Maurya",
        category: "Luxury",
        priceRange: "₹8,000 - ₹22,000/night",
        rating: 4.7,
        location: "Sardar Patel Marg, Diplomatic Enclave",
        features: ["5-star", "Bukhara restaurant", "LEED certified", "Spa", "Multiple dining", "Conference rooms"],
        contact: "+91 11 2611 2233",
        bestFor: "Business meetings, fine dining, eco-conscious"
      },
      {
        name: "Radisson Blu Plaza Delhi Airport",
        category: "Business",
        priceRange: "₹5,000 - ₹12,000/night",
        rating: 4.6,
        location: "National Highway 8, Mahipalpur",
        features: ["Airport hotel", "Free shuttle", "Pool", "Gym", "Business lounge", "24/7 dining"],
        contact: "+91 11 2677 9191",
        bestFor: "Airport proximity, business travelers, transit"
      },
      {
        name: "Hotel Saket 27",
        category: "Mid-range",
        priceRange: "₹3,000 - ₹7,000/night",
        rating: 4.4,
        location: "Saket, South Delhi",
        features: ["3-star", "Metro access", "Restaurant", "WiFi", "Clean rooms", "Parking"],
        contact: "+91 11 4060 0000",
        bestFor: "Budget-conscious, families, metro access"
      },
      {
        name: "Treebo Trend O2 Residency",
        category: "Budget",
        priceRange: "₹2,000 - ₹4,500/night",
        rating: 4.2,
        location: "Karol Bagh",
        features: ["Budget hotel", "Breakfast included", "WiFi", "AC rooms", "Central location"],
        contact: "+91 80 6100 5555",
        bestFor: "Budget travelers, shopping area, central"
      },
      {
        name: "OYO Flagship Paharganj",
        category: "Budget",
        priceRange: "₹1,500 - ₹3,500/night",
        rating: 4.0,
        location: "Main Bazaar, Paharganj",
        features: ["Budget", "Near railway station", "WiFi", "AC", "Backpacker area"],
        contact: "+91 124 6201 611",
        bestFor: "Budget backpackers, railway access, shopping"
      },
      {
        name: "Zostel Delhi",
        category: "Hostel",
        priceRange: "₹500 - ₹1,500/night",
        rating: 4.4,
        location: "Mahipalpur (near airport) / Janakpuri",
        features: ["Hostel", "Dorm beds", "Private rooms", "Common area", "Cafe", "Social events"],
        contact: "+91 981 8000 100",
        bestFor: "Backpackers, solo travelers, social atmosphere"
      },
      {
        name: "The Imperial New Delhi",
        category: "Heritage Luxury",
        priceRange: "₹15,000 - ₹50,000/night",
        rating: 4.9,
        location: "Janpath, Connaught Place",
        features: ["Colonial heritage", "Art collection", "Spa", "Fine dining", "Pool", "Butler service"],
        contact: "+91 11 2334 1234",
        bestFor: "Heritage lovers, luxury, central location"
      },
      {
        name: "Bloom Hotel Hauz Khas",
        category: "Boutique",
        priceRange: "₹4,000 - ₹9,000/night",
        rating: 4.5,
        location: "Hauz Khas Village",
        features: ["Boutique hotel", "Rooftop cafe", "Near nightlife", "Modern design", "WiFi"],
        contact: "+91 11 4600 3456",
        bestFor: "Young travelers, nightlife, cafes, art galleries"
      }
    ],
    
    topAttractions: [
      "Red Fort - UNESCO site (₹35)",
      "Qutub Minar - 73m tower (₹30)",
      "India Gate - War memorial (FREE)",
      "Lotus Temple - Bahai House (FREE)",
      "Humayun's Tomb - Mughal architecture (₹35)",
      "Akshardham Temple - Modern marvel (FREE, shows ₹170)",
      "Chandni Chowk - Old Delhi market",
      "Jama Masjid - Largest mosque (FREE)",
      "Lodhi Garden - Morning walks (FREE)",
      "Hauz Khas Village - Nightlife & cafes"
    ],
    
    food: {
      mustTry: ["Butter Chicken", "Paranthas", "Chole Bhature", "Kebabs", "Street Chaat", "Momos"],
      famous: ["Karim's (Mughlai)", "Moti Mahal (Butter Chicken)", "Paranthe Wali Gali", "Chandni Chowk street food"],
      budget: "₹300-600/day (street food), ₹800-1,500/day (restaurants)"
    },
    
    transport: {
      metro: "₹10-60, 300+ stations, most efficient",
      uber: "₹50-500 depending on distance",
      auto: "₹25 base + ₹15/km",
      airport: "Metro ₹60 to New Delhi, Taxi ₹400-800"
    }
  },

  // ============================================================================
  // MUMBAI - FINANCIAL CAPITAL
  // ============================================================================
  mumbai: {
    name: "Mumbai",
    state: "Maharashtra",
    population: "22M+",
    bestTime: "November to February (20-30°C)",
    description: "Financial capital, Bollywood, colonial architecture, street food paradise",
    
    hotels: [
      {
        name: "Taj Mahal Palace Mumbai",
        category: "Iconic Luxury",
        priceRange: "₹15,000 - ₹60,000/night",
        rating: 4.9,
        location: "Apollo Bunder, Colaba",
        features: ["Iconic heritage", "Sea view", "Pool", "Multiple restaurants", "Spa", "Gateway of India view"],
        contact: "+91 22 6665 3366",
        bestFor: "Luxury, heritage, special occasions, sea view"
      },
      {
        name: "The Oberoi Mumbai",
        category: "Luxury",
        priceRange: "₹18,000 - ₹55,000/night",
        rating: 4.9,
        location: "Nariman Point, Marine Drive",
        features: ["Ultra luxury", "Ocean view", "Fine dining", "Spa", "Pool", "Butler service"],
        contact: "+91 22 6632 5757",
        bestFor: "Business elite, Marine Drive view, fine dining"
      },
      {
        name: "JW Marriott Mumbai Sahar",
        category: "Business Luxury",
        priceRange: "₹9,000 - ₹22,000/night",
        rating: 4.7,
        location: "Andheri East (near airport)",
        features: ["Airport hotel", "Pool", "Spa", "Business center", "Multiple dining", "Free shuttle"],
        contact: "+91 22 6882 8888",
        bestFor: "Business travelers, airport access, conferences"
      },
      {
        name: "Hyatt Regency Mumbai",
        category: "Business",
        priceRange: "₹7,000 - ₹18,000/night",
        rating: 4.6,
        location: "Sahar Airport Road",
        features: ["4-star", "Pool", "Gym", "Restaurant", "Business lounge", "Free airport shuttle"],
        contact: "+91 22 6696 1234",
        bestFor: "Business, airport proximity, meetings"
      },
      {
        name: "Hotel Suba Palace",
        category: "Mid-range",
        priceRange: "₹3,500 - ₹8,000/night",
        rating: 4.3,
        location: "Colaba, Apollo Bunder",
        features: ["3-star", "Rooftop restaurant", "Near Gateway", "WiFi", "Tourist area"],
        contact: "+91 22 6615 0808",
        bestFor: "Budget tourists, Colaba area, sightseeing"
      },
      {
        name: "The Gordon House Hotel",
        category: "Boutique",
        priceRange: "₹5,000 - ₹12,000/night",
        rating: 4.4,
        location: "Battery Street, Colaba",
        features: ["Boutique", "Themed rooms", "Restaurant", "Central location", "Unique design"],
        contact: "+91 22 2287 1122",
        bestFor: "Unique experience, central Colaba, style"
      },
      {
        name: "Treebo Trend Bawa International",
        category: "Budget",
        priceRange: "₹2,500 - ₹5,000/night",
        rating: 4.1,
        location: "Vile Parle East (near airport)",
        features: ["Budget", "Clean rooms", "WiFi", "Breakfast", "Airport access"],
        contact: "+91 80 6100 5555",
        bestFor: "Budget travelers, airport area, clean"
      },
      {
        name: "OYO Premium Andheri",
        category: "Budget",
        priceRange: "₹2,000 - ₹4,500/night",
        rating: 4.0,
        location: "Andheri West/East",
        features: ["Budget", "AC rooms", "WiFi", "Metro access", "Basic amenities"],
        contact: "+91 124 6201 611",
        bestFor: "Budget, airport area, metro access"
      },
      {
        name: "Backpacker Panda Colaba",
        category: "Hostel",
        priceRange: "₹600 - ₹1,800/night",
        rating: 4.2,
        location: "Near Colaba Causeway",
        features: ["Hostel", "Dorm & private", "Social area", "Cafe", "Near attractions"],
        contact: "+91 22 2202 0525",
        bestFor: "Backpackers, social, budget, central"
      },
      {
        name: "Residency Hotel Fort",
        category: "Heritage Budget",
        priceRange: "₹3,000 - ₹6,500/night",
        rating: 4.2,
        location: "Fort Area, South Mumbai",
        features: ["Heritage building", "Central location", "Restaurant", "Business district"],
        contact: "+91 22 6638 3939",
        bestFor: "Heritage, business district, budget luxury"
      }
    ],
    
    topAttractions: [
      "Gateway of India - Iconic monument (FREE)",
      "Marine Drive - Queen's Necklace (FREE)",
      "Elephanta Caves - UNESCO site (Ferry ₹200)",
      "Chhatrapati Shivaji Terminus - UNESCO railway",
      "Juhu Beach - Street food (FREE)",
      "Haji Ali Dargah - Mosque on sea (FREE)",
      "Bandra-Worli Sea Link - Engineering marvel",
      "Film City - Bollywood tours (₹2,500)",
      "Siddhivinayak Temple - Ganesh temple (FREE)",
      "Colaba Causeway - Shopping street"
    ],
    
    food: {
      mustTry: ["Vada Pav", "Pav Bhaji", "Bhel Puri", "Misal Pav", "Bombay Sandwich", "Seafood"],
      famous: ["Sardar Pav Bhaji", "Trishna (seafood)", "Leopold Cafe", "Bademiya (kebabs)"],
      budget: "₹400-700/day (street food), ₹1,000-2,000/day (restaurants)"
    },
    
    transport: {
      localTrain: "₹5-30, lifeline, AVOID rush hours (9-11am, 6-9pm)",
      metro: "₹10-40, limited lines",
      uber: "₹100-500",
      ferry: "To Elephanta ₹200 round trip"
    }
  },

  // ============================================================================
  // BANGALORE - IT CAPITAL
  // ============================================================================
  bangalore: {
    name: "Bangalore",
    state: "Karnataka",
    population: "12M+",
    bestTime: "October to February (15-28°C)",
    description: "Silicon Valley of India, Garden City, pleasant weather year-round",
    
    hotels: [
      {
        name: "The Leela Palace Bangalore",
        category: "Luxury",
        priceRange: "₹12,000 - ₹30,000/night",
        rating: 4.8,
        location: "HAL Airport Road",
        features: ["Ultra luxury", "Art collection", "Rooftop bar", "Pool", "Spa", "Fine dining"],
        contact: "+91 80 2521 1234",
        bestFor: "Luxury, art lovers, business elite"
      },
      {
        name: "ITC Gardenia",
        category: "Luxury",
        priceRange: "₹9,000 - ₹24,000/night",
        rating: 4.8,
        location: "Residency Road, Ashok Nagar",
        features: ["5-star", "LEED Platinum", "Spa", "Multiple restaurants", "Pool", "Eco-luxury"],
        contact: "+91 80 4949 4949",
        bestFor: "Eco-conscious luxury, business, wellness"
      },
      {
        name: "Taj West End",
        category: "Heritage Luxury",
        priceRange: "₹8,000 - ₹20,000/night",
        rating: 4.7,
        location: "Race Course Road",
        features: ["Heritage", "20-acre gardens", "Colonial charm", "Pool", "Spa"],
        contact: "+91 80 6660 5660",
        bestFor: "Heritage lovers, gardens, peaceful luxury"
      },
      {
        name: "The Ritz-Carlton Bangalore",
        category: "Luxury",
        priceRange: "₹14,000 - ₹35,000/night",
        rating: 4.8,
        location: "Residency Road",
        features: ["International luxury", "Rooftop bar", "Spa", "Pool", "Fine dining"],
        contact: "+91 80 4925 4925",
        bestFor: "International travelers, luxury, rooftop views"
      },
      {
        name: "Radisson Blu Atria",
        category: "Business",
        priceRange: "₹5,500 - ₹13,000/night",
        rating: 4.5,
        location: "Palace Road",
        features: ["4-star", "Business district", "Pool", "Gym", "Multiple dining"],
        contact: "+91 80 4949 4949",
        bestFor: "Business travelers, central location"
      },
      {
        name: "Hotel Empire",
        category: "Mid-range",
        priceRange: "₹3,000 - ₹7,000/night",
        rating: 4.3,
        location: "Church Street, MG Road",
        features: ["3-star", "Central MG Road", "Restaurant", "WiFi", "Shopping area"],
        contact: "+91 80 2558 5281",
        bestFor: "Shopping, central location, mid-budget"
      },
      {
        name: "Treebo Trend Bliss",
        category: "Budget",
        priceRange: "₹2,200 - ₹4,500/night",
        rating: 4.2,
        location: "Indiranagar",
        features: ["Budget", "Trendy area", "Breakfast", "WiFi", "Clean rooms"],
        contact: "+91 80 6100 5555",
        bestFor: "Budget, cafes, nightlife area"
      },
      {
        name: "FabHotel Prime Royale",
        category: "Budget",
        priceRange: "₹1,800 - ₹3,800/night",
        rating: 4.0,
        location: "Koramangala",
        features: ["Budget", "Startup hub area", "WiFi", "AC", "Clean"],
        contact: "+91 11 4156 7506",
        bestFor: "Budget, tech area, young crowd"
      },
      {
        name: "Zostel Bangalore",
        category: "Hostel",
        priceRange: "₹550 - ₹1,500/night",
        rating: 4.4,
        location: "Lavelle Road",
        features: ["Hostel", "Dorm beds", "Cafe", "Common area", "Social events"],
        contact: "+91 981 8000 100",
        bestFor: "Backpackers, social, travelers community"
      },
      {
        name: "Ginger Hotel Bangalore",
        category: "Economy",
        priceRange: "₹2,500 - ₹5,000/night",
        rating: 4.1,
        location: "Whitefield (IT hub)",
        features: ["Economy chain", "Clean", "Restaurant", "WiFi", "IT park access"],
        contact: "+91 80 3980 3333",
        bestFor: "Business budget, IT professionals, clean"
      }
    ],
    
    topAttractions: [
      "Lalbagh Botanical Garden - 240 acres (₹50)",
      "Bangalore Palace - Tudor architecture (₹230)",
      "Cubbon Park - Green lung (FREE)",
      "Nandi Hills - Sunrise point (₹50, 60km away)",
      "ISKCON Temple - Modern temple (FREE)",
      "Visvesvaraya Museum - Science museum (₹50)",
      "UB City - Luxury mall & dining",
      "Commercial Street - Shopping paradise",
      "Bannerghatta National Park - Zoo & safari (₹100)",
      "Cafe culture - Church Street, Koramangala"
    ],
    
    food: {
      mustTry: ["Masala Dosa", "Idli-Vada", "Filter Coffee", "Biryani", "Benne Dosa"],
      famous: ["MTR (since 1924)", "Vidyarthi Bhavan", "Meghana Foods", "Koshy's"],
      budget: "₹400-700/day (local), ₹1,000-2,000/day (cafes)"
    },
    
    transport: {
      metro: "₹10-60, Purple & Green lines",
      uber: "₹100-500",
      auto: "Namma Yatri app (transparent pricing)",
      bus: "BMTC ₹5-50"
    }
  },

  // Merge with extended cities (Goa, Jaipur, Agra + 24 more)
  ...EXTENDED_CITIES,

  // Merge with more cities (Kerala, Varanasi, Udaipur, Manali, Rishikesh + 16 more)
  ...MORE_CITIES

};

// Export city search function
export function getCityInfo(cityName: string): any {
  const normalizedCity = cityName.toLowerCase().trim();
  return COMPLETE_CITY_DATABASE[normalizedCity] || null;
}

// Export hotel search function
export function getHotelsByCity(cityName: string, budget?: string): string {
  const city = getCityInfo(cityName);
  
  if (!city) {
    return `Sorry, I don't have detailed information about ${cityName} yet. Try asking about: Delhi, Mumbai, Bangalore, Goa, Jaipur, Kerala, Udaipur, Agra, Varanasi, or Manali.`;
  }
  
  let response = `🏨 **HOTELS IN ${city.name.toUpperCase()}** (${city.state})\n\n`;
  response += `📍 **Best Time to Visit:** ${city.bestTime}\n\n`;
  
  // Filter by budget if specified
  let hotelsToShow = city.hotels;
  if (budget) {
    const budgetLower = budget.toLowerCase();
    if (budgetLower.includes('luxury') || budgetLower.includes('5 star')) {
      hotelsToShow = city.hotels.filter((h: any) => h.category.includes('Luxury'));
    } else if (budgetLower.includes('budget') || budgetLower.includes('cheap')) {
      hotelsToShow = city.hotels.filter((h: any) => 
        h.category.includes('Budget') || h.category.includes('Hostel') || h.category.includes('Economy')
      );
    } else if (budgetLower.includes('mid') || budgetLower.includes('3 star')) {
      hotelsToShow = city.hotels.filter((h: any) => h.category.includes('Mid-range'));
    }
  }
  
  // Add hotels
  hotelsToShow.forEach((hotel: any, index: number) => {
    response += `**${index + 1}. ${hotel.name}**\n`;
    response += `   💎 Category: ${hotel.category}\n`;
    response += `   💰 Price: ${hotel.priceRange}\n`;
    response += `   ⭐ Rating: ${hotel.rating}/5.0\n`;
    response += `   📍 Location: ${hotel.location}\n`;
    response += `   ✨ Features: ${hotel.features.slice(0, 4).join(', ')}\n`;
    response += `   🎯 Best For: ${hotel.bestFor}\n`;
    response += `   📞 Contact: ${hotel.contact}\n\n`;
  });
  
  // Add city highlights
  response += `\n🎯 **TOP ATTRACTIONS:**\n`;
  city.topAttractions.slice(0, 5).forEach((attr: string) => {
    response += `• ${attr}\n`;
  });
  
  response += `\n🍽️ **FOOD:**\n`;
  response += `Must Try: ${city.food.mustTry.join(', ')}\n`;
  response += `Budget: ${city.food.budget}\n\n`;
  
  response += `🚗 **TRANSPORT:**\n`;
  Object.entries(city.transport).forEach(([key, value]) => {
    response += `• ${key}: ${value}\n`;
  });
  
  response += `\n💡 **Need help booking?** I can provide more details about any hotel!`;
  
  return response;
}

export default COMPLETE_CITY_DATABASE;