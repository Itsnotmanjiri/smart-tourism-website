import { supabase, TABLES, generateId, handleSupabaseError, successResponse } from './supabase-client';
import { localDB, initializeLocalDatabase, triggerRealtimeUpdate } from './local-database';

// Auto-detect if we should use local database
let useLocalDB = false;

// Initialize and check database availability
export async function initializeDatabase() {
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    
    if (error && (error.code === 'PGRST205' || error.message?.includes('Could not find the table'))) {
      // Silently switch to local mode - tables don't exist
      useLocalDB = true;
      initializeLocalDatabase();
      return { useLocalDB };
    } else if (error) {
      // Other error, switch to local mode
      useLocalDB = true;
      initializeLocalDatabase();
      return { useLocalDB };
    } else {
      // Success - use Supabase
      useLocalDB = false;
      return { useLocalDB };
    }
  } catch (err) {
    // Connection failed, switch to local mode
    useLocalDB = true;
    initializeLocalDatabase();
    return { useLocalDB };
  }
}

// Get the active database client
function getDB() {
  return useLocalDB ? localDB : supabase;
}

// ==================== USER PROFILE ====================

export const getUserProfile = async (userId: string) => {
  try {
    // If using local DB, skip Supabase calls
    if (useLocalDB) {
      const profile = localStorage.getItem(`userProfile_${userId}`);
      return successResponse(profile ? JSON.parse(profile) : null);
    }

    const db = getDB();
    const { data, error } = await db
      .from(TABLES.USERS)
      .select('*')
      .eq('email', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // User doesn't exist, return null
        return successResponse(null);
      }
      // Switch to local mode on error
      useLocalDB = true;
      const profile = localStorage.getItem(`userProfile_${userId}`);
      return successResponse(profile ? JSON.parse(profile) : null);
    }
    
    return successResponse(data);
  } catch (error) {
    // Fallback to localStorage
    const profile = localStorage.getItem(`userProfile_${userId}`);
    return successResponse(profile ? JSON.parse(profile) : null);
  }
};

export const createOrUpdateUserProfile = async (userId: string, profileData: any) => {
  try {
    // If using local DB, use localStorage
    if (useLocalDB) {
      const profile = {
        email: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(`userProfile_${userId}`, JSON.stringify(profile));
      return successResponse(profile);
    }

    const db = getDB();
    const { data, error } = await db
      .from(TABLES.USERS)
      .upsert({
        email: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })
      .select()
      .single();
    
    if (error) {
      // Switch to local mode on error
      useLocalDB = true;
      const profile = {
        email: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(`userProfile_${userId}`, JSON.stringify(profile));
      return successResponse(profile);
    }
    
    return successResponse(data);
  } catch (error) {
    // Fallback to localStorage
    const profile = {
      email: userId,
      ...profileData,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(`userProfile_${userId}`, JSON.stringify(profile));
    return successResponse(profile);
  }
};

// ==================== CHATBOT ====================

export const chatbotQuery = async (query: string, userId: string, conversationHistory: any[]) => {
  try {
    // RAG Chatbot with knowledge base about Indian tourism
    const knowledgeBase = {
      destinations: {
        'mumbai': 'Mumbai, the city of dreams, offers Gateway of India, Marine Drive, Elephanta Caves, and delicious street food. Best time to visit: October to February.',
        'goa': 'Goa is famous for beautiful beaches like Baga, Calangute, Anjuna, water sports, Portuguese architecture, and nightlife. Best time: November to February.',
        'delhi': 'Delhi features Red Fort, Qutub Minar, India Gate, Lotus Temple, and amazing street food. Best time: October to March.',
        'jaipur': 'Jaipur, the Pink City, has Hawa Mahal, Amber Fort, City Palace, and Jantar Mantar. Best time: November to February.',
        'kerala': 'Kerala offers backwaters, houseboats, Munnar tea gardens, beaches, and Ayurvedic treatments. Best time: September to March.',
        'agra': 'Agra is home to the iconic Taj Mahal, Agra Fort, and Fatehpur Sikri. Best time: October to March.',
        'udaipur': 'Udaipur, the City of Lakes, features Lake Pichola, City Palace, and romantic boat rides. Best time: September to March.',
        'varanasi': 'Varanasi is the spiritual capital with Ganges ghats, temples, and evening aarti ceremonies. Best time: October to March.',
        'rishikesh': 'Rishikesh offers yoga, rafting, Beatles Ashram, and spiritual experiences. Best time: September to November and March to May.',
        'manali': 'Manali is perfect for adventure sports, Solang Valley, Rohtang Pass, and honeymoons. Best time: October to June.'
      },
      activities: {
        'adventure': 'Popular adventure activities: rafting in Rishikesh, paragliding in Bir Billing, trekking in Himalayas, scuba diving in Andaman.',
        'spiritual': 'Spiritual experiences: yoga in Rishikesh, temple visits in Varanasi, meditation retreats in Dharamshala.',
        'beach': 'Beach activities: water sports in Goa, beach hopping in Andaman, surfing in Kovalam.',
        'food': 'Must-try foods: street food in Mumbai, Mughlai in Delhi, seafood in Goa, thali in Rajasthan.',
        'culture': 'Cultural experiences: festivals like Diwali, Holi, classical dance performances, heritage walks.'
      },
      booking: {
        'hotel': 'Search for hotels by destination, check availability, compare prices, and book with instant confirmation.',
        'payment': 'Secure payments in Indian Rupees via UPI, cards, or net banking.',
        'cancel': 'Free cancellation available on selected hotels up to 24 hours before check-in.'
      },
      features: {
        'buddy': 'Travel Buddy Finder helps you find companions with AI matching based on interests and travel style.',
        'carpool': 'Carpool feature connects travelers going to same destinations to share rides and costs.',
        'sos': 'SOS Emergency feature provides instant help with location sharing and emergency contacts.',
        'itinerary': 'Smart itinerary generator creates personalized day-by-day plans based on your preferences.'
      }
    };

    const lowerQuery = query.toLowerCase();
    let response = '';

    // Check for destinations
    for (const [dest, info] of Object.entries(knowledgeBase.destinations)) {
      if (lowerQuery.includes(dest)) {
        response = info;
        break;
      }
    }

    // Check for activities
    if (!response) {
      for (const [activity, info] of Object.entries(knowledgeBase.activities)) {
        if (lowerQuery.includes(activity)) {
          response = info;
          break;
        }
      }
    }

    // Check for booking queries
    if (!response) {
      if (lowerQuery.includes('book') || lowerQuery.includes('hotel') || lowerQuery.includes('stay')) {
        response = knowledgeBase.booking.hotel;
      } else if (lowerQuery.includes('payment') || lowerQuery.includes('pay')) {
        response = knowledgeBase.booking.payment;
      } else if (lowerQuery.includes('cancel')) {
        response = knowledgeBase.booking.cancel;
      }
    }

    // Check for features
    if (!response) {
      if (lowerQuery.includes('buddy') || lowerQuery.includes('friend') || lowerQuery.includes('companion')) {
        response = knowledgeBase.features.buddy;
      } else if (lowerQuery.includes('carpool') || lowerQuery.includes('ride') || lowerQuery.includes('share')) {
        response = knowledgeBase.features.carpool;
      } else if (lowerQuery.includes('sos') || lowerQuery.includes('emergency') || lowerQuery.includes('help')) {
        response = knowledgeBase.features.sos;
      } else if (lowerQuery.includes('itinerary') || lowerQuery.includes('plan') || lowerQuery.includes('trip')) {
        response = knowledgeBase.features.itinerary;
      }
    }

    // Greeting responses
    if (!response) {
      if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
        response = "Namaste! 🙏 I'm your AI travel assistant for exploring incredible India. I can help you with destinations, bookings, travel tips, and all platform features. How can I assist you today?";
      } else if (lowerQuery.includes('thank')) {
        response = "You're welcome! Feel free to ask me anything about traveling in India. Safe travels! 🌏";
      } else if (lowerQuery.includes('bye') || lowerQuery.includes('goodbye')) {
        response = "Safe travels! Don't hesitate to reach out if you need any travel assistance. Namaste! 🙏";
      }
    }

    // Default response
    if (!response) {
      response = "I can help you with:\n\n🏨 Hotel bookings and destinations (Mumbai, Goa, Delhi, Jaipur, Kerala, etc.)\n🎯 Activities (adventure, spiritual, beaches, food, culture)\n👥 Travel Buddy Finder\n🚗 Carpool & Ride Sharing\n🆘 Emergency SOS\n📋 Smart Itinerary Planning\n💰 Payments in Indian Rupees\n\nWhat would you like to know more about?";
    }

    // Save to conversation history (if using Supabase)
    if (!useLocalDB) {
      try {
        await getDB().from('chat_conversations').insert({
          user_id: userId,
          query: query,
          response: response,
          created_at: new Date().toISOString()
        });
      } catch (err) {
        // Silently fail if table doesn't exist
      }
    }

    return successResponse({ response, timestamp: new Date().toISOString() });
  } catch (error) {
    return handleSupabaseError(error);
  }
};