// Centralized Database Manager with localStorage persistence
// All data persists across browser reloads

export interface StorageKeys {
  USER_DATA: 'userData';
  PROVIDER_HOTELS: 'providerHotels';
  TOURIST_HOTELS: 'touristHotels';
  BOOKINGS: 'bookings';
  TRAVEL_BUDDIES: 'travelBuddies';
  BUDDY_REQUESTS: 'buddyRequests';
  CARPOOL_RIDES: 'carpoolRides';
  CARPOOL_BOOKINGS: 'carpoolBookings';
  ITINERARIES: 'itineraries';
  CHAT_MESSAGES: 'chatMessages';
  CHAT_CONVERSATIONS: 'chatConversations';
  EMERGENCY_CONTACTS: 'emergencyContacts';
  EXPENSES: 'expenses';
  NOTIFICATIONS: 'notifications';
}

const KEYS: StorageKeys = {
  USER_DATA: 'userData',
  PROVIDER_HOTELS: 'providerHotels',
  TOURIST_HOTELS: 'touristHotels',
  BOOKINGS: 'bookings',
  TRAVEL_BUDDIES: 'travelBuddies',
  BUDDY_REQUESTS: 'buddyRequests',
  CARPOOL_RIDES: 'carpoolRides',
  CARPOOL_BOOKINGS: 'carpoolBookings',
  ITINERARIES: 'itineraries',
  CHAT_MESSAGES: 'chatMessages',
  CHAT_CONVERSATIONS: 'chatConversations',
  EMERGENCY_CONTACTS: 'emergencyContacts',
  EXPENSES: 'expenses',
  NOTIFICATIONS: 'notifications'
};

// Generic database operations
export class DatabaseManager {
  // Get data from localStorage
  static get<T>(key: keyof StorageKeys): T[] {
    try {
      const data = localStorage.getItem(KEYS[key]);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return [];
    }
  }

  // Save data to localStorage
  static set<T>(key: keyof StorageKeys, data: T[]): boolean {
    try {
      localStorage.setItem(KEYS[key], JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      return false;
    }
  }

  // Add item to array
  static add<T extends { id: string }>(key: keyof StorageKeys, item: T): T {
    const items = this.get<T>(key);
    items.push(item);
    this.set(key, items);
    return item;
  }

  // Update item by id
  static update<T extends { id: string }>(key: keyof StorageKeys, id: string, updates: Partial<T>): T | null {
    const items = this.get<T>(key);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates };
    this.set(key, items);
    return items[index];
  }

  // Delete item by id
  static delete(key: keyof StorageKeys, id: string): boolean {
    const items = this.get(key);
    const filtered = items.filter((item: any) => item.id !== id);
    return this.set(key, filtered);
  }

  // Find item by id
  static findById<T extends { id: string }>(key: keyof StorageKeys, id: string): T | null {
    const items = this.get<T>(key);
    return items.find(item => item.id === id) || null;
  }

  // Filter items
  static filter<T>(key: keyof StorageKeys, predicate: (item: T) => boolean): T[] {
    const items = this.get<T>(key);
    return items.filter(predicate);
  }

  // Clear all data (use with caution)
  static clearAll(): void {
    Object.values(KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Clear specific key
  static clear(key: keyof StorageKeys): void {
    localStorage.removeItem(KEYS[key]);
  }
}

// Chat-specific operations
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'location' | 'system';
}

export interface ChatConversation {
  id: string;
  participants: string[];
  participantNames: { [key: string]: string };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: { [key: string]: number };
  type: 'buddy' | 'carpool' | 'provider';
  relatedId?: string; // buddy request id or carpool booking id
}

export class ChatManager {
  // Create or get conversation
  static getOrCreateConversation(
    user1Id: string,
    user1Name: string,
    user2Id: string,
    user2Name: string,
    type: 'buddy' | 'carpool' | 'provider',
    relatedId?: string
  ): ChatConversation {
    const conversations = DatabaseManager.get<ChatConversation>('CHAT_CONVERSATIONS');
    
    // Check if conversation exists
    const existing = conversations.find(c => 
      c.participants.includes(user1Id) && c.participants.includes(user2Id)
    );
    
    if (existing) return existing;
    
    // Create new conversation
    const newConversation: ChatConversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      participants: [user1Id, user2Id],
      participantNames: {
        [user1Id]: user1Name,
        [user2Id]: user2Name
      },
      lastMessage: 'Start chatting!',
      lastMessageTime: new Date().toISOString(),
      unreadCount: {
        [user1Id]: 0,
        [user2Id]: 0
      },
      type,
      relatedId
    };
    
    DatabaseManager.add('CHAT_CONVERSATIONS', newConversation);
    return newConversation;
  }

  // Send message
  static sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    receiverId: string,
    message: string,
    type: 'text' | 'location' | 'system' = 'text'
  ): ChatMessage {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId,
      senderName,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };
    
    // Save message
    DatabaseManager.add('CHAT_MESSAGES', newMessage);
    
    // Update conversation
    const conversations = DatabaseManager.get<ChatConversation>('CHAT_CONVERSATIONS');
    const convIndex = conversations.findIndex(c => c.id === conversationId);
    
    if (convIndex !== -1) {
      conversations[convIndex].lastMessage = message;
      conversations[convIndex].lastMessageTime = newMessage.timestamp;
      conversations[convIndex].unreadCount[receiverId]++;
      DatabaseManager.set('CHAT_CONVERSATIONS', conversations);
    }
    
    return newMessage;
  }

  // Get messages for conversation
  static getMessages(conversationId: string): ChatMessage[] {
    return DatabaseManager.filter<ChatMessage>(
      'CHAT_MESSAGES',
      msg => msg.conversationId === conversationId
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Get conversations for user
  static getUserConversations(userId: string): ChatConversation[] {
    return DatabaseManager.filter<ChatConversation>(
      'CHAT_CONVERSATIONS',
      conv => conv.participants.includes(userId)
    ).sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  }

  // Mark messages as read
  static markAsRead(conversationId: string, userId: string): void {
    const messages = DatabaseManager.get<ChatMessage>('CHAT_MESSAGES');
    let updated = false;
    
    messages.forEach(msg => {
      if (msg.conversationId === conversationId && msg.receiverId === userId && !msg.read) {
        msg.read = true;
        updated = true;
      }
    });
    
    if (updated) {
      DatabaseManager.set('CHAT_MESSAGES', messages);
      
      // Update unread count in conversation
      const conversations = DatabaseManager.get<ChatConversation>('CHAT_CONVERSATIONS');
      const conv = conversations.find(c => c.id === conversationId);
      if (conv) {
        conv.unreadCount[userId] = 0;
        DatabaseManager.set('CHAT_CONVERSATIONS', conversations);
      }
    }
  }

  // Initialize dummy chats for demo
  static initializeDummyChats(currentUserId: string, currentUserName: string): void {
    const conversations = DatabaseManager.get<ChatConversation>('CHAT_CONVERSATIONS');
    
    // Only initialize if no conversations exist
    if (conversations.length > 0) return;
    
    // Create dummy travel buddy chat
    const buddyConv = this.getOrCreateConversation(
      currentUserId,
      currentUserName,
      'buddy-user-001',
      'Rahul Kumar',
      'buddy',
      'buddy-req-001'
    );
    
    // Add dummy messages
    const dummyBuddyMessages = [
      { sender: 'buddy-user-001', name: 'Rahul Kumar', text: 'Hey! Excited for the Goa trip! 🏖️', time: -3600000 },
      { sender: currentUserId, name: currentUserName, text: 'Me too! When do you plan to reach?', time: -3000000 },
      { sender: 'buddy-user-001', name: 'Rahul Kumar', text: "I'll reach Calangute Beach by 2 PM. You be on time! ⏰", time: -2400000 },
      { sender: currentUserId, name: currentUserName, text: 'Perfect! Will be there. See you at the resort!', time: -1800000 }
    ];
    
    dummyBuddyMessages.forEach(msg => {
      const msgTime = new Date(Date.now() + msg.time).toISOString();
      const message: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        conversationId: buddyConv.id,
        senderId: msg.sender,
        senderName: msg.name,
        receiverId: msg.sender === currentUserId ? 'buddy-user-001' : currentUserId,
        message: msg.text,
        timestamp: msgTime,
        read: true,
        type: 'text'
      };
      DatabaseManager.add('CHAT_MESSAGES', message);
    });
    
    // Create dummy carpool driver chat
    const carpoolConv = this.getOrCreateConversation(
      currentUserId,
      currentUserName,
      'driver-user-001',
      'Amit Singh',
      'carpool',
      'carpool-book-001'
    );
    
    const dummyCarpoolMessages = [
      { sender: 'driver-user-001', name: 'Amit Singh', text: 'Hi! Confirmed your booking for Mumbai to Pune ride 🚗', time: -7200000 },
      { sender: currentUserId, name: currentUserName, text: 'Great! What time should I be ready?', time: -6600000 },
      { sender: 'driver-user-001', name: 'Amit Singh', text: "I'll pick you up at the location at 8 AM sharp. Please be on time! 🕗", time: -6000000 },
      { sender: currentUserId, name: currentUserName, text: 'Sure, will be waiting at the pickup point!', time: -5400000 },
      { sender: 'driver-user-001', name: 'Amit Singh', text: 'Perfect! Sharing live location when I start. See you tomorrow! 👍', time: -5000000 }
    ];
    
    dummyCarpoolMessages.forEach(msg => {
      const msgTime = new Date(Date.now() + msg.time).toISOString();
      const message: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        conversationId: carpoolConv.id,
        senderId: msg.sender,
        senderName: msg.name,
        receiverId: msg.sender === currentUserId ? 'driver-user-001' : currentUserId,
        message: msg.text,
        timestamp: msgTime,
        read: true,
        type: 'text'
      };
      DatabaseManager.add('CHAT_MESSAGES', message);
    });
    
    // Update conversation last messages
    DatabaseManager.update<ChatConversation>('CHAT_CONVERSATIONS', buddyConv.id, {
      lastMessage: dummyBuddyMessages[dummyBuddyMessages.length - 1].text,
      lastMessageTime: new Date(Date.now() + dummyBuddyMessages[dummyBuddyMessages.length - 1].time).toISOString()
    });
    
    DatabaseManager.update<ChatConversation>('CHAT_CONVERSATIONS', carpoolConv.id, {
      lastMessage: dummyCarpoolMessages[dummyCarpoolMessages.length - 1].text,
      lastMessageTime: new Date(Date.now() + dummyCarpoolMessages[dummyCarpoolMessages.length - 1].time).toISOString()
    });
  }
}

// Initialize database on app load
export function initializeAppDatabase() {
  // Ensure all keys exist
  Object.keys(KEYS).forEach(key => {
    if (!localStorage.getItem(KEYS[key as keyof StorageKeys])) {
      localStorage.setItem(KEYS[key as keyof StorageKeys], '[]');
    }
  });
  
  console.log('✅ Database initialized with persistent storage');
}
