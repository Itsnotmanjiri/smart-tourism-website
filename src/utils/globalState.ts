// GLOBAL STATE MANAGEMENT - Proper data persistence
// Handles: User Authentication, Bookings, Expenses, Matches, Chat History, Carpool Bookings

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'traveler' | 'provider';
  avatar?: string;
  ownedHotels?: string[]; // Hotel IDs owned by this user
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  hotelName: string;
  destination: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
}

export interface CarpoolBooking {
  id: string;
  userId: string;
  driverId: string;
  driverName: string;
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  seatsBooked: number;
  pricePerSeat: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
}

export interface Expense {
  id: string;
  userId: string;
  category: 'accommodation' | 'transport' | 'food' | 'activities' | 'shopping' | 'other';
  description: string;
  amount: number;
  currency: string;
  date: string;
  destination?: string;
  bookingId?: string; // Link to booking if applicable
  paymentMethod?: string;
}

export interface Match {
  id: string;
  userId: string;
  buddyId: string;
  destination: string;
  matchedAt: string;
  status: 'active' | 'inactive';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

class GlobalState {
  private currentUser: User | null = null;
  private bookings: Booking[] = [];
  private carpoolBookings: CarpoolBooking[] = [];
  private expenses: Expense[] = [];
  private matches: Match[] = [];
  private chatHistory: ChatMessage[] = [];

  constructor() {
    this.loadFromStorage();
  }

  // Load data from localStorage
  private loadFromStorage() {
    try {
      const userData = localStorage.getItem('currentUser');
      if (userData) this.currentUser = JSON.parse(userData);

      const bookingsData = localStorage.getItem('bookings');
      if (bookingsData) this.bookings = JSON.parse(bookingsData);

      const carpoolBookingsData = localStorage.getItem('carpoolBookings');
      if (carpoolBookingsData) this.carpoolBookings = JSON.parse(carpoolBookingsData);

      const expensesData = localStorage.getItem('expenses');
      if (expensesData) this.expenses = JSON.parse(expensesData);

      const matchesData = localStorage.getItem('matches');
      if (matchesData) this.matches = JSON.parse(matchesData);

      const chatData = localStorage.getItem('chatHistory');
      if (chatData) this.chatHistory = JSON.parse(chatData);
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  // Save to localStorage
  private saveToStorage() {
    try {
      if (this.currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }
      localStorage.setItem('bookings', JSON.stringify(this.bookings));
      localStorage.setItem('carpoolBookings', JSON.stringify(this.carpoolBookings));
      localStorage.setItem('expenses', JSON.stringify(this.expenses));
      localStorage.setItem('matches', JSON.stringify(this.matches));
      localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  // USER MANAGEMENT
  login(user: User) {
    this.currentUser = user;
    this.saveToStorage();
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isProvider(): boolean {
    return this.currentUser?.role === 'provider';
  }

  // BOOKING MANAGEMENT
  addBooking(booking: Omit<Booking, 'id' | 'userId' | 'bookingDate' | 'status'>): string {
    if (!this.currentUser) throw new Error('User not logged in');

    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`,
      userId: this.currentUser.id,
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };

    this.bookings.push(newBooking);
    
    // Save to allBookings for provider/driver dashboard access
    const allBookings = JSON.parse(localStorage.getItem('allBookings') || '[]');
    allBookings.push({
      type: 'hotel',
      id: newBooking.id,
      bookingId: newBooking.id,
      userId: this.currentUser.id,
      guestName: this.currentUser.name,
      guestEmail: this.currentUser.email,
      hotelId: booking.hotelId,
      hotelName: booking.hotelName,
      destination: booking.destination,
      roomType: booking.roomType,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      rooms: booking.guests, // guests = rooms
      guests: booking.guests,
      totalAmount: booking.totalPrice,
      amount: booking.totalPrice,
      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,
      bookingDate: newBooking.bookingDate,
      status: 'confirmed'
    });
    localStorage.setItem('allBookings', JSON.stringify(allBookings));
    
    // Auto-add to expenses
    this.addExpense({
      category: 'accommodation',
      description: `${booking.hotelName} - ${booking.roomType}`,
      amount: booking.totalPrice,
      currency: '₹',
      date: new Date().toISOString(),
      destination: booking.destination,
      bookingId: newBooking.id,
      paymentMethod: booking.paymentMethod
    });

    this.saveToStorage();
    return newBooking.id;
  }

  getBookings(userId?: string): Booking[] {
    const targetUserId = userId || this.currentUser?.id;
    if (!targetUserId) return [];
    return this.bookings.filter(b => b.userId === targetUserId);
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.find(b => b.id === id);
  }

  cancelBooking(id: string) {
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = 'cancelled';
      this.saveToStorage();
    }
  }

  // CARPOOL BOOKING MANAGEMENT
  addCarpoolBooking(carpoolBooking: Omit<CarpoolBooking, 'id' | 'userId' | 'bookingDate' | 'status'>): string {
    if (!this.currentUser) throw new Error('User not logged in');

    const newCarpoolBooking: CarpoolBooking = {
      ...carpoolBooking,
      id: `carpool-booking-${Date.now()}`,
      userId: this.currentUser.id,
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };

    this.carpoolBookings.push(newCarpoolBooking);
    
    // Save to allBookings for provider/driver dashboard access
    const allBookings = JSON.parse(localStorage.getItem('allBookings') || '[]');
    allBookings.push({
      type: 'carpool',
      id: newCarpoolBooking.id,
      bookingId: newCarpoolBooking.id,
      userId: this.currentUser.id,
      guestName: this.currentUser.name,
      guestEmail: this.currentUser.email,
      driverId: carpoolBooking.driverId,
      driverName: carpoolBooking.driverName,
      from: carpoolBooking.from,
      to: carpoolBooking.to,
      departureDate: carpoolBooking.departureDate,
      departureTime: carpoolBooking.departureTime,
      seatsBooked: carpoolBooking.seatsBooked,
      pricePerSeat: carpoolBooking.pricePerSeat,
      totalAmount: carpoolBooking.totalPrice,
      amount: carpoolBooking.totalPrice,
      paymentMethod: carpoolBooking.paymentMethod,
      paymentStatus: carpoolBooking.paymentStatus,
      bookingDate: newCarpoolBooking.bookingDate,
      status: 'confirmed'
    });
    localStorage.setItem('allBookings', JSON.stringify(allBookings));
    
    // Auto-add to expenses
    this.addExpense({
      category: 'transport',
      description: `Carpool with ${carpoolBooking.driverName} from ${carpoolBooking.from} to ${carpoolBooking.to}`,
      amount: carpoolBooking.totalPrice,
      currency: '₹',
      date: new Date().toISOString(),
      destination: carpoolBooking.to,
      bookingId: newCarpoolBooking.id,
      paymentMethod: carpoolBooking.paymentMethod
    });

    this.saveToStorage();
    return newCarpoolBooking.id;
  }

  getCarpoolBookings(userId?: string): CarpoolBooking[] {
    const targetUserId = userId || this.currentUser?.id;
    if (!targetUserId) return [];
    return this.carpoolBookings.filter(b => b.userId === targetUserId);
  }

  getCarpoolBookingById(id: string): CarpoolBooking | undefined {
    return this.carpoolBookings.find(b => b.id === id);
  }

  cancelCarpoolBooking(id: string) {
    const carpoolBooking = this.carpoolBookings.find(b => b.id === id);
    if (carpoolBooking) {
      carpoolBooking.status = 'cancelled';
      this.saveToStorage();
    }
  }

  // EXPENSE MANAGEMENT
  addExpense(expense: Omit<Expense, 'id' | 'userId'>): string {
    if (!this.currentUser) throw new Error('User not logged in');

    const newExpense: Expense = {
      ...expense,
      id: `expense-${Date.now()}-${Math.random()}`,
      userId: this.currentUser.id
    };

    this.expenses.push(newExpense);
    this.saveToStorage();
    return newExpense.id;
  }

  getExpenses(userId?: string): Expense[] {
    const targetUserId = userId || this.currentUser?.id;
    if (!targetUserId) return [];
    return this.expenses.filter(e => e.userId === targetUserId);
  }

  deleteExpense(id: string) {
    this.expenses = this.expenses.filter(e => e.id !== id);
    this.saveToStorage();
  }

  getTotalExpenses(currency: string = '₹'): number {
    const userExpenses = this.getExpenses();
    return userExpenses
      .filter(e => e.currency === currency)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  // MATCH MANAGEMENT
  addMatch(buddyId: string, destination: string): string {
    if (!this.currentUser) throw new Error('User not logged in');

    const newMatch: Match = {
      id: `match-${Date.now()}`,
      userId: this.currentUser.id,
      buddyId,
      destination,
      matchedAt: new Date().toISOString(),
      status: 'active'
    };

    this.matches.push(newMatch);
    this.saveToStorage();
    return newMatch.id;
  }

  getMatches(): Match[] {
    if (!this.currentUser) return [];
    return this.matches.filter(m => m.userId === this.currentUser!.id && m.status === 'active');
  }

  isMatched(buddyId: string): boolean {
    return this.getMatches().some(m => m.buddyId === buddyId);
  }

  // CHAT MANAGEMENT
  addMessage(receiverId: string, message: string): string {
    if (!this.currentUser) throw new Error('User not logged in');

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: this.currentUser.id,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.chatHistory.push(newMessage);
    this.saveToStorage();
    return newMessage.id;
  }

  getChatMessages(otherUserId: string): ChatMessage[] {
    if (!this.currentUser) return [];
    
    return this.chatHistory.filter(m => 
      (m.senderId === this.currentUser!.id && m.receiverId === otherUserId) ||
      (m.senderId === otherUserId && m.receiverId === this.currentUser!.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  markMessagesAsRead(otherUserId: string) {
    if (!this.currentUser) return;
    
    this.chatHistory.forEach(m => {
      if (m.senderId === otherUserId && m.receiverId === this.currentUser!.id) {
        m.read = true;
      }
    });
    this.saveToStorage();
  }

  getUnreadCount(otherUserId: string): number {
    if (!this.currentUser) return 0;
    
    return this.chatHistory.filter(m => 
      m.senderId === otherUserId && 
      m.receiverId === this.currentUser!.id && 
      !m.read
    ).length;
  }
}

// Singleton instance
export const globalState = new GlobalState();

// Helper function to auto-login demo users
export function initializeDemoUsers() {
  const currentUser = globalState.getCurrentUser();
  
  if (!currentUser) {
    // Auto-login as traveler
    globalState.login({
      id: 'user-traveler-1',
      name: 'Manjiri',
      email: 'manjiri@example.com',
      phone: '+91-9876543201',
      role: 'traveler',
      avatar: 'https://randomuser.me/api/portraits/women/30.jpg'
    });
  }
}

// Demo provider user
export const demoProvider: User = {
  id: 'user-provider-1',
  name: 'Rajesh Sharma',
  email: 'rajesh@hotels.com',
  phone: '+91-9876543210',
  role: 'provider',
  ownedHotels: ['goa-1', 'manali-1']
};

console.log('✅ Global State Management Initialized');