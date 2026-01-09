import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qiyickzezgoksgampvae.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeWlja3plemdva3NnYW1wdmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjcxMDQsImV4cCI6MjA4MzAwMzEwNH0.U3JyRb7yrUkOn07MJQHR15mvbdU6FQX4RCiYjh2CQnY';

// Global singleton pattern to ensure only one instance across entire app
// Store instance on window to prevent multiple instances even across HMR
declare global {
  interface Window {
    __supabaseClient?: ReturnType<typeof createClient>;
    __supabaseClientInitialized?: boolean;
  }
}

// Single initialization block - runs once per page load
let clientInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  // Browser environment - use window singleton
  if (typeof window !== 'undefined') {
    if (!window.__supabaseClient) {
      console.log('🔧 Initializing Supabase client (singleton)');
      window.__supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'sb-traveltourism-auth-token'
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
      window.__supabaseClientInitialized = true;
    }
    return window.__supabaseClient;
  }
  
  // SSR fallback - also use singleton pattern
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storageKey: 'sb-traveltourism-auth-token'
      }
    });
  }
  return clientInstance;
}

// Export the singleton instance
export const supabase = getSupabaseClient();

// Table names constant
export const TABLES = {
  USERS: 'users',
  BOOKINGS: 'bookings',
  HOTELS: 'hotels',
  DESTINATIONS: 'destinations',
  TRAVEL_BUDDIES: 'travel_buddies',
  BUDDY_REQUESTS: 'buddy_requests',
  CARPOOLS: 'carpools',
  CARPOOL_BOOKINGS: 'carpool_bookings',
  CHAT_MESSAGES: 'chat_messages',
  ITINERARIES: 'itineraries',
  EXPENSES: 'expenses',
  PAYMENTS: 'payments',
  SOS_ALERTS: 'sos_alerts',
  REVIEWS: 'reviews',
  WISHLIST: 'wishlist',
  DRIVERS: 'drivers',
  DRIVER_TRIPS: 'driver_trips',
  PROVIDERS: 'providers',
  CHATBOT_LOGS: 'chatbot_logs'
};

// Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Standardized error handler
export const handleSupabaseError = (error: any) => {
  console.error('Supabase Error:', error);
  return {
    success: false,
    error: error.message || 'An error occurred',
    data: null
  };
};

// Standardized success response
export const successResponse = (data: any) => {
  return {
    success: true,
    data,
    error: null
  };
};