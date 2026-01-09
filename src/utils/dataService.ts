// Comprehensive data persistence service
export const dataService = {
  // Save data to localStorage
  save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Save data (alias for save)
  saveData<T>(key: string, data: T): void {
    this.save(key, data);
  },

  // Load data from localStorage
  load<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  },

  // Get data (alias for load with null default)
  getData<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  },

  // Remove data from localStorage
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  // Clear all data
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Keys for different data types
export const STORAGE_KEYS = {
  HOTELS: 'smart_tourism_hotels',
  BOOKINGS: 'smart_tourism_bookings',
  EXPENSES: 'smart_tourism_expenses',
  TRAVEL_BUDDIES: 'smart_tourism_buddies',
  CARPOOL_DRIVERS: 'smart_tourism_drivers',
  ITINERARIES: 'smart_tourism_itineraries',
  CHAT_HISTORY: 'smart_tourism_chat_history',
  USER_PROFILE: 'smart_tourism_profile',
  FEEDBACK: 'smart_tourism_feedback',
  PHOTOS: 'smart_tourism_photos'
};