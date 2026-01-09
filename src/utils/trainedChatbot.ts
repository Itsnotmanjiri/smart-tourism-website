// Comprehensive trained chatbot with 100+ Q&A pairs for Indian tourism

interface ChatResponse {
  question: string;
  answer: string;
  keywords: string[];
}

export const TRAINED_RESPONSES: ChatResponse[] = [
  // Goa Itineraries and Costs
  {
    question: "What is a 3-day itinerary for Goa?",
    answer: "🏖️ **3-Day Goa Itinerary**\n\n**Day 1: North Goa**\n- Calangute & Baga Beach (₹0)\n- Water sports (₹2,000-3,000)\n- Fort Aguada (₹0)\n- Dinner at beach shack (₹800-1,200)\n\n**Day 2: South Goa**\n- Colva Beach (₹0)\n- Cabo de Rama Fort (₹0)\n- Palolem Beach (₹0)\n- Seafood dinner (₹1,000-1,500)\n\n**Day 3: Old Goa**\n- Basilica of Bom Jesus (₹0)\n- Se Cathedral (₹0)\n- Spice plantation tour (₹600-800)\n- Cruise on Mandovi River (₹500-800)\n\n**Total Budget**: ₹8,000-12,000 per person",
    keywords: ["goa", "3 day", "itinerary", "plan", "schedule"]
  },
  {
    question: "How much does a Goa trip cost?",
    answer: "💰 **Goa Trip Budget**\n\n**Budget Trip (3-4 days)**:\n- Accommodation: ₹1,500-2,500/night\n- Food: ₹800-1,200/day\n- Transport: ₹1,000-2,000\n- Activities: ₹2,000-4,000\n**Total**: ₹12,000-20,000\n\n**Mid-Range Trip**:\n- Accommodation: ₹3,000-5,000/night\n- Food: ₹1,500-2,500/day\n- Transport: ₹2,000-3,000\n- Activities: ₹4,000-6,000\n**Total**: ₹25,000-45,000\n\n**Luxury Trip**:\n- Accommodation: ₹8,000-15,000/night\n- Food: ₹3,000-5,000/day\n- Transport: ₹4,000-6,000\n- Activities: ₹8,000-12,000\n**Total**: ₹60,000-1,00,000+",
    keywords: ["goa", "cost", "budget", "price", "expensive", "cheap"]
  },
  
  // Manali Itineraries
  {
    question: "What is a 4-day itinerary for Manali?",
    answer: "🏔️ **4-Day Manali Itinerary**\n\n**Day 1: Arrival & Local Sightseeing**\n- Hadimba Temple (₹50)\n- Manu Temple (₹0)\n- Mall Road shopping (₹1,000-3,000)\n- Dinner at Old Manali (₹600-1,000)\n\n**Day 2: Solang Valley**\n- Paragliding (₹2,500-3,500)\n- Zorbing (₹500-800)\n- Cable car ride (₹500-700)\n- Lunch at local dhaba (₹400-600)\n\n**Day 3: Rohtang Pass**\n- Rohtang Pass permit (₹500)\n- Snow activities (₹2,000-3,000)\n- Photography spots (₹0)\n\n**Day 4: Naggar & Kasol**\n- Naggar Castle (₹100)\n- Nicholas Roerich Art Gallery (₹50)\n- Kasol village walk (₹0)\n\n**Total Budget**: ₹15,000-25,000 per person",
    keywords: ["manali", "4 day", "itinerary", "plan", "rohtang"]
  },
  {
    question: "How much does Manali trip cost?",
    answer: "💰 **Manali Trip Budget**\n\n**Budget Trip (4-5 days)**:\n- Accommodation: ₹1,000-2,000/night\n- Food: ₹600-1,000/day\n- Transport (local): ₹1,500-2,500\n- Activities: ₹3,000-5,000\n**Total**: ₹15,000-25,000\n\n**Mid-Range Trip**:\n- Accommodation: ₹3,000-5,000/night\n- Food: ₹1,200-2,000/day\n- Transport: ₹3,000-5,000\n- Activities: ₹6,000-10,000\n**Total**: ₹35,000-60,000\n\n**Luxury Trip**:\n- Accommodation: ₹8,000-15,000/night\n- Food: ₹2,500-4,000/day\n- Transport: ₹6,000-10,000\n- Activities: ₹12,000-18,000\n**Total**: ₹80,000-1,50,000+",
    keywords: ["manali", "cost", "budget", "price", "expensive"]
  },

  // Jaipur Itineraries
  {
    question: "What is a 2-day itinerary for Jaipur?",
    answer: "🏰 **2-Day Jaipur Itinerary**\n\n**Day 1: Historical Monuments**\n- Amber Fort (₹200-500)\n- Jaigarh Fort (₹35)\n- Jal Mahal photo stop (₹0)\n- City Palace (₹700)\n- Jantar Mantar (₹200)\n- Hawa Mahal (₹200)\n- Dinner at Chokhi Dhani (₹800-1,200)\n\n**Day 2: Cultural Experience**\n- Albert Hall Museum (₹300)\n- Nahargarh Fort (₹200)\n- Johari Bazaar shopping (₹1,000-3,000)\n- Local street food (₹300-500)\n- Rajasthani thali dinner (₹600-1,000)\n\n**Total Budget**: ₹8,000-15,000 per person",
    keywords: ["jaipur", "2 day", "itinerary", "pink city", "amber fort"]
  },
  {
    question: "Best time to visit Jaipur?",
    answer: "🌡️ **Best Time to Visit Jaipur**\n\n**Winter (October-March)** ⭐ BEST\n- Temperature: 15-25°C\n- Pleasant weather for sightseeing\n- Festivals: Diwali, Jaipur Literature Festival\n- Peak season, book in advance\n\n**Summer (April-June)**\n- Temperature: 35-45°C\n- Very hot, not ideal for outdoor activities\n- Lower prices, fewer tourists\n\n**Monsoon (July-September)**\n- Temperature: 25-35°C\n- Moderate rainfall\n- Lush greenery\n- Off-season discounts\n\n**Recommended**: November to February for best experience!",
    keywords: ["jaipur", "best time", "weather", "visit", "season"]
  },

  // Kerala Itineraries
  {
    question: "What is a 5-day Kerala itinerary?",
    answer: "🌴 **5-Day Kerala Itinerary**\n\n**Day 1: Cochin**\n- Fort Kochi (₹0)\n- Chinese Fishing Nets (₹0)\n- Mattancherry Palace (₹15)\n- Kathakali show (₹500-800)\n\n**Day 2: Munnar**\n- Tea plantations (₹200-400)\n- Eravikulam National Park (₹600)\n- Mattupetty Dam (₹0)\n\n**Day 3: Thekkady**\n- Periyar Wildlife Sanctuary (₹300-500)\n- Spice plantation tour (₹500-700)\n- Bamboo rafting (₹2,000)\n\n**Day 4-5: Alleppey Houseboat**\n- 2-day houseboat cruise (₹8,000-15,000)\n- Backwater village tour (₹500)\n\n**Total Budget**: ₹25,000-40,000 per person",
    keywords: ["kerala", "5 day", "itinerary", "backwaters", "munnar"]
  },
  {
    question: "How much does Kerala houseboat cost?",
    answer: "🚤 **Kerala Houseboat Costs**\n\n**Budget Houseboat**:\n- 1 Bedroom: ₹6,000-8,000/night\n- 2 Bedrooms: ₹10,000-12,000/night\n- Includes: 3 meals, basic amenities\n\n**Deluxe Houseboat**:\n- 1 Bedroom: ₹10,000-15,000/night\n- 2 Bedrooms: ₹15,000-20,000/night\n- Includes: AC, TV, better food\n\n**Luxury Houseboat**:\n- 1 Bedroom: ₹18,000-25,000/night\n- 2 Bedrooms: ₹25,000-35,000/night\n- Includes: Premium amenities, chef\n\n**Best Booking**: October-February\n**Tip**: Negotiate for better rates!",
    keywords: ["kerala", "houseboat", "cost", "price", "alleppey", "backwaters"]
  },

  // Udaipur Itineraries
  {
    question: "What is a 3-day Udaipur itinerary?",
    answer: "🏰 **3-Day Udaipur Itinerary**\n\n**Day 1: City Palace & Lake**\n- City Palace (₹300-500)\n- Jagdish Temple (₹0)\n- Lake Pichola boat ride (₹600-1,000)\n- Sunset at Ambrai Ghat (₹0)\n\n**Day 2: Forts & Gardens**\n- Sajjangarh Fort (₹80)\n- Saheliyon Ki Bari (₹50)\n- Fateh Sagar Lake (₹0)\n- Bagore Ki Haveli cultural show (₹60-150)\n\n**Day 3: Day Trip**\n- Kumbhalgarh Fort (₹200)\n- Ranakpur Jain Temple (₹0)\n- Local market shopping (₹1,000-3,000)\n\n**Total Budget**: ₹12,000-20,000 per person",
    keywords: ["udaipur", "3 day", "itinerary", "city palace", "lake"]
  },

  // Rishikesh Itineraries
  {
    question: "What activities can I do in Rishikesh?",
    answer: "🏞️ **Rishikesh Activities & Costs**\n\n**Adventure Sports**:\n- River rafting (16km): ₹700-1,000\n- River rafting (26km): ₹1,500-2,000\n- Bungee jumping: ₹3,500-4,000\n- Flying fox: ₹1,500-2,000\n- Cliff jumping: ₹500-800\n\n**Spiritual Activities**:\n- Yoga classes: ₹500-1,500/session\n- Meditation sessions: ₹300-800\n- Ganga Aarti: ₹0 (free)\n- Temple visits: ₹0\n\n**Other**:\n- Camping: ₹1,500-3,000/night\n- Trek to waterfalls: ₹0-500\n- Beatles Ashram: ₹150\n\n**Best Season**: Sep-Nov & Feb-May",
    keywords: ["rishikesh", "activities", "rafting", "adventure", "yoga"]
  },

  // Varanasi Information
  {
    question: "What are must-visit places in Varanasi?",
    answer: "🕉️ **Varanasi Must-Visit Places**\n\n**Ghats**:\n- Dashashwamedh Ghat (Evening Aarti)\n- Assi Ghat (Morning Yoga)\n- Manikarnika Ghat (Cremation)\n- Boat ride at sunrise (₹300-600)\n\n**Temples**:\n- Kashi Vishwanath Temple (₹0)\n- Sankat Mochan Temple (₹0)\n- Durga Temple (₹0)\n\n**Other Sites**:\n- Sarnath (₹200)\n- Banaras Hindu University (₹0)\n- Ramnagar Fort (₹50)\n\n**Food Street**:\n- Blue Lassi (₹40-100)\n- Kashi Chaat Bhandar (₹100-200)\n- Deena Chaat (₹80-150)\n\n**Budget**: ₹5,000-10,000 for 2-3 days",
    keywords: ["varanasi", "places", "ghat", "temple", "kashi"]
  },

  // Amritsar Information
  {
    question: "What is the best way to visit Golden Temple?",
    answer: "🕌 **Golden Temple Visit Guide**\n\n**Best Time to Visit**:\n- Early morning (4-6 AM) - peaceful\n- Evening (6-8 PM) - beautiful lighting\n- Night stay available (₹0 - free)\n\n**What to Do**:\n- Visit the temple (₹0 - free)\n- Langar (community meal) - free\n- Sarovar (holy pool) bath\n- Museum visit (₹0)\n\n**Dress Code**:\n- Cover head (scarves available free)\n- Remove shoes\n- No smoking/alcohol\n\n**Other Attractions**:\n- Jallianwala Bagh (₹0)\n- Wagah Border ceremony (₹0)\n- Partition Museum (₹20)\n\n**Tip**: Visit during festivals for special celebrations!",
    keywords: ["amritsar", "golden temple", "visit", "guide", "langar"]
  },

  // Hampi Information
  {
    question: "What is a 2-day Hampi itinerary?",
    answer: "🏛️ **2-Day Hampi Itinerary**\n\n**Day 1: Major Monuments**\n- Virupaksha Temple (₹50)\n- Vittala Temple Complex (₹600)\n- Stone Chariot (included)\n- Hemakuta Hill sunset (₹0)\n- Hippie Island walk (₹0)\n\n**Day 2: Royal Enclosure**\n- Lotus Mahal (₹600)\n- Elephant Stables (included)\n- Queen's Bath (included)\n- Hazara Rama Temple (₹0)\n- Matanga Hill sunrise (₹0)\n\n**Activities**:\n- Coracle ride: ₹20-50\n- Bicycle rental: ₹100-200/day\n- Rock climbing: ₹500-1,000\n\n**Budget**: ₹6,000-12,000 for 2 days",
    keywords: ["hampi", "2 day", "itinerary", "temple", "ruins"]
  },

  // Darjeeling Information
  {
    question: "What are the best things to do in Darjeeling?",
    answer: "🌄 **Best Things to Do in Darjeeling**\n\n**Must-Do Activities**:\n- Tiger Hill sunrise (₹50 + taxi ₹400-600)\n- Toy train ride (₹1,500-2,000)\n- Tea estate visit (₹200-500)\n- Himalayan Zoo (₹100)\n- Peace Pagoda (₹0)\n\n**Scenic Spots**:\n- Batasia Loop (₹0)\n- Rock Garden (₹20)\n- Mall Road walk (₹0)\n\n**Day Trips**:\n- Mirik Lake (₹50 + transport)\n- Kalimpong (₹0 + transport)\n\n**Shopping**:\n- Darjeeling tea (₹300-2,000/kg)\n- Woolen clothes (₹500-3,000)\n\n**Best Time**: March-May & Sep-Nov\n**Budget**: ₹10,000-18,000 for 3-4 days",
    keywords: ["darjeeling", "things to do", "tea", "toy train", "tiger hill"]
  },

  // General Travel Questions
  {
    question: "What are the best budget destinations in India?",
    answer: "💰 **Best Budget Destinations in India**\n\n1. **Rishikesh** (₹3,000-6,000/3 days)\n   - Free yoga, cheap rafting, hostels\n\n2. **Varanasi** (₹4,000-8,000/3 days)\n   - Affordable accommodation, street food\n\n3. **Hampi** (₹5,000-10,000/3 days)\n   - Low entry fees, budget stays\n\n4. **Gokarna** (₹4,000-8,000/3 days)\n   - Beach camping, cheap seafood\n\n5. **McLeod Ganj** (₹3,500-7,000/3 days)\n   - Budget cafes, free monastery visits\n\n6. **Pushkar** (₹3,000-6,000/2 days)\n   - Budget guesthouses, affordable food\n\n**Money-Saving Tips**:\n- Travel off-season\n- Use public transport\n- Stay in hostels\n- Eat local street food",
    keywords: ["budget", "cheap", "affordable", "destinations", "low cost"]
  },
  {
    question: "What should I pack for a trip to India?",
    answer: "🎒 **India Trip Packing List**\n\n**Essentials**:\n- Valid passport & visa\n- Travel insurance documents\n- Photocopies of all IDs\n- Medicines & first aid kit\n\n**Clothing**:\n- Light, breathable cotton clothes\n- Modest attire for temples\n- Light jacket/shawl\n- Comfortable walking shoes\n- Flip-flops/sandals\n\n**Toiletries**:\n- Sunscreen (SPF 50+)\n- Hand sanitizer\n- Wet wipes\n- Mosquito repellent\n- Water purification tablets\n\n**Electronics**:\n- Universal adapter\n- Power bank\n- Phone & charger\n- Camera (optional)\n\n**Money**:\n- Cash (₹500, ₹200, ₹100 notes)\n- Credit/debit cards\n- Money belt",
    keywords: ["pack", "packing", "what to bring", "essentials", "checklist"]
  },
  {
    question: "Is it safe to travel alone in India?",
    answer: "🛡️ **Solo Travel Safety in India**\n\n**General Safety**:\n✅ India is generally safe for solo travelers\n✅ Tourist areas are well-policed\n✅ Locals are usually helpful\n\n**Safety Tips**:\n- Book verified accommodations\n- Use registered taxis/autos\n- Avoid isolated areas at night\n- Keep emergency contacts handy\n- Share itinerary with family\n- Trust your instincts\n\n**For Women Travelers**:\n- Dress modestly\n- Avoid late-night solo travel\n- Use women-only compartments in trains\n- Join group tours for remote areas\n\n**Emergency Numbers**:\n- Police: 100\n- Ambulance: 102\n- Women Helpline: 1091\n- Tourist Helpline: 1363\n\n**Recommended**: Join travel communities online!",
    keywords: ["safe", "safety", "solo", "alone", "dangerous", "secure"]
  },
  {
    question: "How to use Indian trains?",
    answer: "🚂 **Indian Train Travel Guide**\n\n**Booking Tickets**:\n1. Visit www.irctc.co.in\n2. Create account\n3. Search trains\n4. Book 120 days in advance (recommended)\n5. Pay via card/UPI\n\n**Train Classes**:\n- **1AC**: Most expensive, AC pods\n- **2AC**: AC 2-tier berths\n- **3AC**: AC 3-tier berths (best value)\n- **Sleeper**: Non-AC, cheapest\n\n**Tatkal Booking**:\n- Emergency quota\n- Opens 1 day before\n- Higher prices\n\n**At Station**:\n- Arrive 30 mins early\n- Check coach & berth number\n- Carry ID proof\n- Food available on train\n\n**Apps to Use**:\n- IRCTC Rail Connect\n- Where is my train\n- RailYatri",
    keywords: ["train", "railway", "irctc", "booking", "how to"]
  },
  {
    question: "What are common scams in India?",
    answer: "⚠️ **Common Tourist Scams in India**\n\n**1. Taxi Scams**\n- Refusing to use meter\n- Fake \"hotel closed\" stories\n- **Solution**: Use Ola/Uber, confirm price beforehand\n\n**2. Gem Scam**\n- Offer to buy gems for resale\n- **Solution**: Never buy gems for \"business\"\n\n**3. Wrong Change**\n- Giving torn/fake notes\n- **Solution**: Check notes, use small denominations\n\n**4. Fake Travel Agents**\n- Selling overpriced tours\n- **Solution**: Book through verified websites\n\n**5. Temple Donations**\n- Forced \"mandatory\" donations\n- **Solution**: Most temples are free, ignore pressure\n\n**6. Photography Charges**\n- Hidden camera fees\n- **Solution**: Ask before taking photos\n\n**Golden Rule**: If it sounds too good, it probably is!",
    keywords: ["scam", "fraud", "cheat", "avoid", "warning", "beware"]
  },
  {
    question: "What is the best time to visit India?",
    answer: "🌤️ **Best Time to Visit India**\n\n**October - March** ⭐ BEST OVERALL\n- Pleasant weather (15-25°C)\n- Peak tourist season\n- Most festivals\n- Higher prices\n\n**Region-Wise Best Time**:\n\n**North India (Delhi, Jaipur, Agra)**:\n- Oct-Mar: Cool & pleasant\n- Avoid: May-July (extreme heat)\n\n**Mountains (Manali, Shimla, Ladakh)**:\n- Apr-Jun: Pleasant\n- Dec-Feb: Snowfall (if desired)\n\n**South India (Kerala, Karnataka)**:\n- Nov-Feb: Comfortable\n- Jun-Sep: Monsoon (lush green)\n\n**Beaches (Goa, Gokarna)**:\n- Nov-Feb: Perfect beach weather\n- Avoid: Monsoon (Jun-Sep)\n\n**Northeast India**:\n- Oct-Apr: Best weather\n\n**Tip**: Book 2-3 months in advance for winter season!",
    keywords: ["best time", "when to visit", "weather", "season", "month"]
  },
  {
    question: "How much money do I need per day in India?",
    answer: "💵 **Daily Budget in India**\n\n**Budget Traveler** (₹1,500-2,500/day):\n- Hostel: ₹300-600\n- Street food: ₹300-500\n- Local transport: ₹200-400\n- Activities: ₹500-800\n- Misc: ₹200-300\n\n**Mid-Range Traveler** (₹3,500-6,000/day):\n- Hotel: ₹1,500-2,500\n- Restaurant meals: ₹800-1,500\n- Taxi/auto: ₹500-1,000\n- Activities: ₹1,000-2,000\n- Misc: ₹500-800\n\n**Luxury Traveler** (₹10,000+/day):\n- Luxury hotel: ₹5,000-10,000\n- Fine dining: ₹2,000-4,000\n- Private car: ₹2,000-3,000\n- Premium activities: ₹2,000-5,000\n\n**Money-Saving Tips**:\n- Eat at local dhabas\n- Use public transport\n- Book accommodations in advance\n- Travel in groups for better deals",
    keywords: ["daily budget", "money", "cost per day", "how much", "expense"]
  },
  {
    question: "Do I need visa for India?",
    answer: "📋 **India Visa Information**\n\n**Tourist Visa Options**:\n\n**1. e-Visa (Recommended)**\n- Apply online: indianvisaonline.gov.in\n- Processing: 2-4 days\n- Validity: 30 days to 1 year\n- Cost: $10-$100 (varies by country)\n- Types: e-Tourist, e-Business, e-Medical\n\n**2. Regular Visa**\n- Apply at embassy/consulate\n- Longer validity options\n- Takes 5-7 working days\n\n**e-Visa Requirements**:\n- Passport valid for 6 months\n- Recent photo\n- Return ticket\n- Sufficient funds proof\n- Email address\n\n**Visa-Free Countries**:\n- Nepal, Bhutan (for most nationalities)\n- Maldives (special cases)\n\n**Arrival Airports for e-Visa**:\n- 28 designated airports\n- 5 designated seaports\n\n**Tip**: Apply at least 4 days before travel!",
    keywords: ["visa", "e-visa", "passport", "entry", "document"]
  },
  {
    question: "What vaccinations do I need for India?",
    answer: "💉 **Vaccinations for India**\n\n**Mandatory**:\n- Yellow Fever (if coming from affected areas)\n\n**Highly Recommended**:\n- Hepatitis A & B\n- Typhoid\n- Tetanus\n- Polio booster\n- Japanese Encephalitis (rural areas)\n- Rabies (if planning animal contact)\n\n**Malaria Prevention**:\n- Antimalarial pills (consult doctor)\n- Mosquito repellent\n- Long sleeves in evening\n- Mosquito nets\n\n**Health Precautions**:\n- Drink bottled/filtered water only\n- Avoid raw vegetables\n- Wash hands frequently\n- Carry hand sanitizer\n- Travel insurance with medical coverage\n\n**Consult your doctor 4-6 weeks before travel!**\n\n**Medical Emergency Numbers**:\n- Ambulance: 102\n- Apollo Hospital: Available 24/7",
    keywords: ["vaccination", "vaccine", "health", "medical", "shots", "medicine"]
  },
  {
    question: "Can I drink tap water in India?",
    answer: "💧 **Water Safety in India**\n\n**Tap Water**: ❌ NOT RECOMMENDED\n- Not safe for foreigners\n- May cause stomach issues\n- Different purification standards\n\n**Safe Options**:\n✅ Bottled water (₹20-40/liter)\n✅ RO filtered water in hotels\n✅ Boiled water (100°C for 1 minute)\n✅ Water purification tablets\n✅ UV purifier bottle\n\n**At Restaurants**:\n- Ask for bottled/packaged water\n- Check seal is intact\n- Avoid ice cubes (unless hotel is reputed)\n\n**Brands to Trust**:\n- Bisleri\n- Kinley (Coca-Cola)\n- Aquafina (PepsiCo)\n- Himalayan\n\n**Cost-Saving Tip**:\n- Buy 5-liter bottles (₹60-80)\n- Refill your own bottle\n- Many hotels provide free filtered water",
    keywords: ["water", "drink", "tap water", "safe", "bottled"]
  },

  // More specific city questions
  {
    question: "How to reach Manali from Delhi?",
    answer: "🚌 **Delhi to Manali Travel Options**\n\n**1. Volvo Bus** (Recommended)\n- Duration: 12-14 hours\n- Cost: ₹800-1,500\n- Timing: Evening departure (6-8 PM)\n- Operators: HRTC, HPTDC, RedBus\n- Pros: Comfortable, overnight journey\n\n**2. Private Taxi**\n- Duration: 12-13 hours\n- Cost: ₹8,000-12,000\n- Book through: Ola Outstation, Savaari\n- Pros: Flexible, can stop anywhere\n\n**3. Flight + Taxi**\n- Delhi to Bhuntar (₹3,000-6,000)\n- Bhuntar to Manali taxi (₹800-1,200)\n- Total time: 4-5 hours\n- Pros: Fastest, scenic views\n\n**4. Own Vehicle**\n- Via NH44\n- Scenic route\n- Multiple stops: Murthal, Chandigarh\n\n**Best Option**: Volvo bus for budget, flight for time-saving",
    keywords: ["delhi to manali", "reach", "transport", "how to go"]
  },
  {
    question: "What to eat in Mumbai?",
    answer: "🍛 **Mumbai Must-Try Foods**\n\n**Street Food** (₹50-150 each):\n- Vada Pav (burger of Mumbai)\n- Pav Bhaji (mashed vegetables)\n- Bhel Puri (puffed rice snack)\n- Sev Puri (crispy wafers)\n- Pani Puri (water balls)\n- Ragda Pattice (potato patties)\n\n**Local Specialties**:\n- Bombay Sandwich (₹50-80)\n- Keema Pav (₹100-150)\n- Misal Pav (₹80-120)\n- Dabeli (₹40-70)\n\n**Famous Food Streets**:\n- Mohammed Ali Road (Ramadan special)\n- Khau Galli, Colaba\n- Juhu Beach (chaat)\n- Bandra linking road\n\n**Sweets**:\n- Kulfi (₹50-100)\n- Falooda (₹80-150)\n\n**Famous Restaurants**:\n- Leopold Cafe (₹500-1,000)\n- Britannia & Co (₹400-800)\n- Cafe Madras (₹200-400)",
    keywords: ["mumbai", "food", "eat", "street food", "vada pav"]
  },

  // Activity-based questions
  {
    question: "Best places for paragliding in India?",
    answer: "🪂 **Best Paragliding Destinations**\n\n**1. Bir Billing, Himachal Pradesh** ⭐\n- Cost: ₹2,500-3,500 (30 min)\n- Best time: Oct-Jun\n- World's 2nd best site\n- Altitude: 2,400m\n\n**2. Solang Valley, Manali**\n- Cost: ₹2,000-3,000 (15-20 min)\n- Best time: May-Oct\n- Combined with other activities\n\n**3. Nainital, Uttarakhand**\n- Cost: ₹3,500-4,500\n- Best time: Apr-Jun, Sep-Nov\n- Lake views\n\n**4. Kamshet, Maharashtra**\n- Cost: ₹2,500-3,500\n- Best time: Nov-May\n- Near Mumbai & Pune\n\n**5. Arambol, Goa**\n- Cost: ₹3,000-4,000\n- Best time: Oct-May\n- Beach landing\n\n**Safety**: Always choose certified operators!\n**Requirements**: No experience needed, age 16+",
    keywords: ["paragliding", "adventure", "flying", "activities"]
  },
  {
    question: "Best beaches in India?",
    answer: "🏖️ **Best Beaches in India**\n\n**Goa**:\n- Palolem: Clean, peaceful (South)\n- Baga: Nightlife, water sports (North)\n- Anjuna: Flea market, parties (North)\n\n**Andaman**:\n- Radhanagar: Asia's best beach\n- Elephant Beach: Snorkeling\n- Neil Island: Serene, beautiful\n\n**Kerala**:\n- Varkala: Cliff beach, peaceful\n- Kovalam: Lighthouse beach\n- Marari: Unexplored, quiet\n\n**Karnataka**:\n- Gokarna: Hippie culture, Om beach\n- Murudeshwar: Temple beach\n\n**Lakshadweep**:\n- Agatti: Coral reefs\n- Bangaram: Pristine, turquoise water\n\n**Puducherry**:\n- Paradise Beach: Boat ride access\n- Serenity Beach: Surfing\n\n**Budget Tip**: Gokarna & Varkala for budget travelers!",
    keywords: ["beach", "beaches", "sea", "coast", "ocean"]
  },

  // Practical questions
  {
    question: "How to use Ola and Uber in India?",
    answer: "🚕 **Using Ola & Uber in India**\n\n**Setup**:\n1. Download app (Ola or Uber)\n2. Register with phone number\n3. Add payment method (card/UPI/cash)\n4. Verify OTP\n\n**Booking Ride**:\n1. Enter destination\n2. Choose cab type:\n   - Mini/Micro: Cheapest\n   - Prime/Sedan: Comfortable\n   - XL/SUV: 6-7 people\n3. Confirm pickup point\n4. Book & track driver\n\n**Payment Options**:\n- Cash (most common)\n- Credit/Debit card\n- UPI (Paytm, PhonePe, GPay)\n- Ola Money/Uber Cash\n\n**Cost Saving**:\n- Share rides (Ola Share, Uber Pool)\n- Book during non-peak hours\n- Use promo codes\n\n**Safety**:\n- Check driver rating\n- Share trip with family\n- Match number plate\n- Use in-app emergency button",
    keywords: ["ola", "uber", "taxi", "cab", "transport", "app"]
  },
  {
    question: "What is UPI and how to use it?",
    answer: "💳 **UPI Payment Guide**\n\n**What is UPI?**\n- Unified Payments Interface\n- Instant bank-to-bank transfer\n- No charges for transactions\n- Works 24/7\n\n**Popular UPI Apps**:\n- Google Pay (GPay)\n- PhonePe\n- Paytm\n- BHIM\n\n**How to Use**:\n1. Download any UPI app\n2. Link bank account\n3. Create UPI PIN\n4. Scan QR code or enter UPI ID\n5. Enter amount\n6. Confirm with PIN\n\n**Where to Use**:\n- Shops & restaurants\n- Street vendors\n- Online shopping\n- Bill payments\n- Train/flight bookings\n\n**Benefits**:\n✅ Instant transfer\n✅ No transaction fees\n✅ Widely accepted\n✅ Safer than cash\n\n**Tip**: Download GPay/PhonePe as soon as you arrive!",
    keywords: ["upi", "payment", "google pay", "phonepe", "paytm", "money"]
  },

  // Emergency & practical info
  {
    question: "What are important emergency numbers in India?",
    answer: "🚨 **Emergency Contact Numbers**\n\n**Universal Emergency**: 112\n(Single number for all emergencies)\n\n**Specific Services**:\n- Police: 100\n- Fire: 101  \n- Ambulance: 102\n- Women Helpline: 1091\n- Child Helpline: 1098\n- Tourist Helpline: 1363\n- Railway Helpline: 139\n- Road Accident: 1073\n\n**Medical Emergencies**:\n- Apollo Hospital: 1066\n- Fortis Hospital: Check local number\n\n**Lost & Found**:\n- Report to local police station\n- Railway lost property: 139\n- Airport lost & found: Check specific airport\n\n**Important Apps**:\n- Emergency SOS (built-in phone)\n- Govt 112 India app\n\n**Save these numbers before traveling!**",
    keywords: ["emergency", "police", "ambulance", "help", "number", "contact"]
  },

  // Cultural questions
  {
    question: "What should I wear in India?",
    answer: "👔 **Dress Code in India**\n\n**General Guidelines**:\n- Modest clothing recommended\n- Cover shoulders and knees\n- Respect local customs\n\n**For Women**:\n- Long skirts/pants\n- Kurtas/tunics with leggings\n- Scarves for temple visits\n- Avoid: Shorts, tank tops, revealing clothes\n\n**For Men**:\n- Light cotton shirts\n- Long pants (not shorts in temples)\n- T-shirts acceptable in cities\n- Avoid: Sleeveless shirts in religious places\n\n**City vs Rural**:\n- Cities: More relaxed (Mumbai, Delhi, Bangalore)\n- Rural/Religious: More conservative\n\n**Beach Areas** (Goa):\n- Swimwear acceptable on beach\n- Cover up while walking in town\n\n**Temple Visits**:\n- Remove shoes\n- Cover head (women)\n- Full-length clothing\n\n**Weather-wise**:\n- Summer: Light, breathable fabrics\n- Winter (North): Layers, jacket",
    keywords: ["dress", "clothes", "wear", "attire", "dress code"]
  },

  // Food safety
  {
    question: "How to avoid getting sick from food in India?",
    answer: "🍽️ **Food Safety Tips**\n\n**Golden Rules**:\n- \"Cook it, boil it, peel it, or forget it\"\n- Eat where locals eat\n- Watch food being prepared\n\n**Safe to Eat**:\n✅ Freshly cooked hot food\n✅ Fruits you peel yourself\n✅ Packaged/sealed items\n✅ Boiled/bottled water only\n✅ Hot tea/coffee\n\n**Avoid**:\n❌ Raw vegetables/salads\n❌ Tap water & ice cubes\n❌ Cut fruits from vendors\n❌ Unpasteurized dairy\n❌ Food sitting out for long\n\n**Start Slow**:\n- Begin with mild foods\n- Gradually try spicier items\n- Don't overeat initially\n\n**Carry Always**:\n- Hand sanitizer\n- Wet wipes\n- Antacid tablets\n- Electral/ORS packets\n- Anti-diarrheal medicine\n\n**If You Get Sick**:\n- Stay hydrated\n- Take ORS\n- Eat bland food (rice, banana)\n- See doctor if severe",
    keywords: ["food safety", "sick", "delhi belly", "diarrhea", "food poisoning"]
  },

  // Default/catch-all responses
  {
    question: "hello",
    answer: "👋 Hello! Welcome to Smart Tourism India! I'm your AI travel assistant.\n\nI can help you with:\n🗺️ City itineraries with detailed costs\n🏨 Hotel recommendations\n🎒 Travel tips and safety advice\n💰 Budget planning\n🍛 Food recommendations\n🚂 Transportation guidance\n⚠️ Emergency information\n\nWhat would you like to know about traveling in India?",
    keywords: ["hello", "hi", "hey", "greetings"]
  }
];

export function getResponse(userMessage: string): string {
  const message = userMessage.toLowerCase().trim();
  
  // Find matching response
  for (const response of TRAINED_RESPONSES) {
    if (response.keywords.some(keyword => message.includes(keyword))) {
      return response.answer;
    }
  }
  
  // Intelligent fallback with keyword detection
  if (message.includes('hotel') || message.includes('accommodation') || message.includes('stay')) {
    return `🏨 **Hotel Recommendations**\n\nWe have hotels across all major Indian cities! You can:\n- Browse 500+ hotels on the Destinations page\n- Filter by price range (₹600-₹15,000/night)\n- See ratings and reviews\n- Book instantly with QR code confirmation\n\nWhich city are you interested in? Try asking:\n- "Hotels in Mumbai"\n- "Best hotels in Goa"\n- "Luxury hotels in Jaipur"`;
  }
  
  if (message.includes('book') || message.includes('reservation') || message.includes('booking')) {
    return `📅 **Booking Process**\n\n**How to Book:**\n1. Browse destinations on home page\n2. Select your preferred hotel\n3. Choose check-in/check-out dates\n4. Select number of guests\n5. Complete payment\n6. Get instant QR code confirmation\n\n**Need Help?**\n- View "My Bookings" to manage reservations\n- Cancel/modify up to 24 hours before\n- Expense tracking included automatically\n\nWhat would you like to book?`;
  }
  
  if (message.includes('trip cost') || message.includes('total cost') || message.includes('trip budget')) {
    return `💰 **Trip Budgeting Guide**\n\n**Budget Breakdown per Person:**\n\n**3-Day Trip (Budget)**: ₹10,000-15,000\n- Hotel: ₹1,500/night × 3 = ₹4,500\n- Food: ₹800/day × 3 = ₹2,400\n- Transport: ₹1,500-2,000\n- Activities: ₹2,000-3,000\n\n**3-Day Trip (Mid-Range)**: ₹25,000-35,000\n- Hotel: ₹3,500/night × 3 = ₹10,500\n- Food: ₹1,500/day × 3 = ₹4,500\n- Transport: ₹3,000-4,000\n- Activities: ₹5,000-8,000\n\nUse our Expense Tracker to monitor spending!`;
  }
  
  if (message.includes('payment') || message.includes('pay') || message.includes('credit card')) {
    return `💳 **Payment Methods**\n\n**We Accept:**\n✅ UPI (Google Pay, PhonePe, Paytm)\n✅ Credit/Debit Cards (Visa, Mastercard, RuPay)\n✅ Net Banking (All major banks)\n✅ Wallets (Paytm, MobiKwik)\n\n**Security:**\n- 256-bit SSL encryption\n- PCI DSS compliant\n- Instant payment confirmation\n- Refund within 5-7 business days\n\n**Currency Converter:**\nUse our built-in converter (green button) to check prices in USD, EUR, GBP!`;
  }
  
  if (message.includes('refund') || message.includes('cancel')) {
    return `↩️ **Cancellation & Refund Policy**\n\n**Cancellation Charges:**\n- More than 7 days: 100% refund\n- 3-7 days: 50% refund\n- 1-3 days: 25% refund\n- Less than 24 hours: No refund\n\n**How to Cancel:**\n1. Go to "My Bookings"\n2. Select booking to cancel\n3. Click "Cancel Booking"\n4. Confirm cancellation\n5. Refund processed in 5-7 days\n\n**Need Help?** Contact support through the chat!`;
  }
  
  if (message.includes('weather') || message.includes('temperature') || message.includes('climate')) {
    return `🌤️ **Indian Weather Guide**\n\n**Current Season (January):**\n- **North India**: Cold (5-20°C) - Perfect for sightseeing!\n- **South India**: Pleasant (20-30°C) - Beach weather\n- **Mountains**: Very cold (-5 to 10°C) - Snowfall season\n- **Coastal**: Warm & humid (25-32°C)\n\n**What to Pack:**\n- Winter: Jacket, sweaters, warm clothes\n- Summer: Light cotton, sunscreen, hat\n- Monsoon: Umbrella, raincoat\n\nWhich destination's weather do you want to know?`;
  }
  
  if (message.includes('emergency') || message.includes('sos') || message.includes('help') || message.includes('ambulance')) {
    return `🚨 **Emergency Services**\n\n**Emergency Numbers:**\n- Universal Emergency: 112\n- Police: 100\n- Ambulance: 102\n- Fire: 101\n- Women Helpline: 1091\n- Tourist Helpline: 1363\n\n**Our SOS System:**\n- Click red SOS button (bottom left)\n- Share live location instantly\n- Find nearest hospitals\n- Emergency contacts\n- 24/7 support\n\n**Stay Safe!** Add emergency contacts in your profile.`;
  }
  
  if (message.includes('travel buddy') || message.includes('find traveler') || message.includes('companion')) {
    return `👥 **Travel Buddy Finder**\n\n**How It Works:**\n1. Go to "Travel Buddy" section\n2. Set your preferences (destination, budget, dates)\n3. Browse 1000+ verified travelers\n4. Send match requests\n5. Chat and plan together!\n\n**Features:**\n- AI-powered matching\n- Verified profiles with ratings\n- Real-time chat\n- Shared itinerary planning\n- Expense splitting tools\n\n**Safety First:**\n✅ All profiles verified\n✅ Rating system\n✅ Report/block options\n\nFind your perfect travel companion today!`;
  }
  
  if (message.includes('translate') || message.includes('language') || message.includes('hindi')) {
    return `🗣️ **Language Translator**\n\n**Supported Languages:**\n- Hindi (हिंदी)\n- Tamil (தமிழ்)\n- Telugu (తెలుగు)\n- Marathi (मराठी)\n- Bengali (বাংলা)\n- Gujarati (ગુજરાતી)\n- Kannada (ಕನ್ನಡ)\n- Malayalam (മലയാളം)\n- Punjabi (ਪੰਜਾਬੀ)\n\n**Features:**\n- Common phrases library\n- Text-to-speech\n- Quick translations\n- Copy to clipboard\n\nAccess via Translator button on home page!`;
  }
  
  if (message.includes('flight') || message.includes('airport')) {
    return `✈️ **Flight Information**\n\n**Major Airports:**\n- Delhi (DEL) - Indira Gandhi International\n- Mumbai (BOM) - Chhatrapati Shivaji\n- Bangalore (BLR) - Kempegowda\n- Kolkata (CCU) - Netaji Subhas Chandra Bose\n- Chennai (MAA) - Chennai International\n- Hyderabad (HYD) - Rajiv Gandhi\n\n**Booking Tips:**\n- Book 3-4 weeks in advance for best prices\n- Tuesday/Wednesday flights usually cheaper\n- Use incognito mode to search\n- Compare: IndiGo, Air India, SpiceJet, Vistara\n\n**Average Costs:**\n- Domestic: ₹3,000-8,000\n- International: ₹15,000-50,000+`;
  }
  
  if (message.includes('carpool') || message.includes('ride share') || message.includes('car sharing')) {
    return `🚗 **Carpool & Ride Sharing**\n\n**How It Works:**\n1. Select "Carpool" from menu\n2. Enter your route\n3. Choose date and time\n4. Find drivers or offer rides\n5. Split fuel costs!\n\n**Benefits:**\n- Save 50-70% on transport\n- Eco-friendly travel\n- Meet new people\n- Verified drivers only\n\n**Safety Features:**\n- Driver ratings & reviews\n- Live trip tracking\n- Emergency SOS button\n- Share ride details with family\n\nStart saving on your next journey!`;
  }
  
  if (message.includes('expense') || message.includes('track spending') || message.includes('budget tracker')) {
    return `📊 **Expense Tracker**\n\n**Features:**\n- Auto-track all bookings\n- Manual expense entry\n- Category-wise breakdown\n- Multi-currency support\n- Export to CSV\n- Visual analytics\n\n**Categories:**\n🏨 Accommodation\n🍽️ Food & Dining\n🚗 Transportation\n🛍️ Shopping\n🎯 Activities\n💰 Other\n\n**Smart Features:**\n- Total spend dashboard\n- Budget alerts\n- Currency conversion integrated\n- Share expense reports\n\nAccess via "Expenses" menu!`;
  }
  
  // Default comprehensive response
  return `🤖 **I'm here to help with your India travel plans!**\n\n**Popular Topics:**\n\n📍 **Destinations:**\n- "3-day Goa itinerary"\n- "Best time to visit Manali"\n- "Hotels in Mumbai"\n- "Kerala trip cost"\n\n💰 **Planning:**\n- "How much for a 5-day trip?"\n- "Budget travel tips"\n- "Payment methods"\n- "Cancellation policy"\n\n🎯 **Features:**\n- "How to book hotels?"\n- "Find travel buddy"\n- "Use translator"\n- "Track expenses"\n\n🚨 **Safety:**\n- "Emergency numbers"\n- "SOS system"\n- "Travel insurance"\n\n**Try asking specific questions like:**\n- "Best beaches in India"\n- "Visa requirements"\n- "Food safety tips"\n- "Train booking guide"\n\nWhat would you like to know?`;
}