import { useState, useEffect } from 'react';
import { Car, MapPin, Calendar, Users, DollarSign, Shield, Star, Clock, Navigation, Phone, MessageCircle, Check, X, Filter, Search, ArrowLeft, Send } from 'lucide-react';
import { searchDrivers, CarpoolDriver, availableCities } from '../data/massiveCarpoolDrivers';
import { UniversalPaymentGateway } from './UniversalPaymentGateway';
import { addNotification } from './InAppNotifications';
import { globalState } from '../utils/globalState';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { CarpoolDriverChat } from './CarpoolDriverChat';
import { NatureBackground, GlassCard, FloatingGradientCard, AnimatedButton } from './ui/GlassCard';

interface BackendDriver {
  id: string;
  name: string;
  email: string;
  phone: string;
  carModel: string;
  carNumber: string;
  totalSeats: number;
  seatsAvailable: number;
  seatsBooked: number;
  rating: number;
  totalTrips: number;
  verified: boolean;
  instantBooking: boolean;
}

interface Props {
  onBack?: () => void;
}

export function MassiveCarpoolFinder({ onBack }: Props) {
  const [searchResults, setSearchResults] = useState<{ drivers: CarpoolDriver[]; total: number; hasMore: boolean }>({
    drivers: [],
    total: 0,
    hasMore: false
  });
  
  const [bookings, setBookings] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<CarpoolDriver | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDriver, setPaymentDriver] = useState<CarpoolDriver | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatDriver, setChatDriver] = useState<{ id: string; name: string } | null>(null);
  const [backendDrivers, setBackendDrivers] = useState<BackendDriver[]>([]);
  
  const [filters, setFilters] = useState({
    from: 'Delhi',
    to: '',
    departureDate: '',
    minSeats: 1,
    maxPrice: 10000,
    verified: false,
    instantBooking: false,
    // NEW ADVANCED FILTERS
    gender: 'any' as 'any' | 'male' | 'female' | 'mixed',
    ageGroup: 'any' as 'any' | '18-25' | '26-35' | '36-50' | '50+',
    smoking: 'any' as 'any' | 'smoking' | 'non-smoking',
    pets: 'any' as 'any' | 'allowed' | 'not-allowed',
    music: 'any' as 'any' | 'yes' | 'no',
    luggage: 'any' as 'any' | 'small' | 'medium' | 'large',
    ac: false,
    childFriendly: false
  });

  useEffect(() => {
    performSearch(1);
    loadRealDriverProfiles();
  }, [filters]);

  const loadRealDriverProfiles = () => {
    // Load actual driver profiles from localStorage
    const profiles = JSON.parse(localStorage.getItem('driverProfiles') || '[]');
    console.log('Loaded driver profiles:', profiles);
    // These will be displayed alongside the mock data
  };

  const performSearch = (page: number) => {
    setLoading(true);
    
    // Load real driver profiles from localStorage
    const realDriverProfiles = JSON.parse(localStorage.getItem('driverProfiles') || '[]');
    
    setTimeout(() => {
      // Get mock drivers from search
      const mockResults = searchDrivers({
        from: filters.from,
        to: filters.to || undefined,
        departureDate: filters.departureDate || undefined,
        minSeats: filters.minSeats,
        maxPrice: filters.maxPrice,
        verified: filters.verified || undefined,
        instantBooking: filters.instantBooking || undefined,
        page,
        limit: 12
      });

      // Convert real driver profiles to CarpoolDriver format
      const realDrivers: CarpoolDriver[] = realDriverProfiles
        .filter((profile: any) => {
          // Apply filters
          if (filters.from && profile.from !== filters.from) return false;
          if (filters.to && profile.to !== filters.to) return false;
          if (filters.maxPrice && profile.pricePerSeat > filters.maxPrice) return false;
          if (filters.minSeats && profile.totalSeats < filters.minSeats) return false;
          
          // Apply advanced filters
          if (filters.pets === 'allowed' && !profile.petsAllowed) return false;
          if (filters.pets === 'not-allowed' && profile.petsAllowed) return false;
          if (filters.smoking === 'smoking' && !profile.smokingAllowed) return false;
          if (filters.smoking === 'non-smoking' && profile.smokingAllowed) return false;
          if (filters.music === 'yes' && !profile.musicAllowed) return false;
          if (filters.music === 'no' && profile.musicAllowed) return false;
          if (filters.ac && !profile.acAvailable) return false;
          if (filters.childFriendly && !profile.childFriendly) return false;
          if (filters.gender !== 'any' && profile.gender !== filters.gender) return false;
          if (filters.ageGroup !== 'any' && profile.ageGroup !== filters.ageGroup) return false;
          
          return true;
        })
        .map((profile: any) => ({
          id: profile.id,
          name: profile.name,
          age: 30, // Default value
          gender: profile.gender === 'any' ? 'Male' : profile.gender,
          rating: profile.rating || 5.0,
          totalTrips: profile.totalRides || 0,
          verified: profile.verified,
          from: profile.from,
          to: profile.to,
          route: [profile.from, profile.to],
          departureDate: new Date().toISOString().split('T')[0],
          departureTime: profile.departureTime,
          seatsAvailable: profile.totalSeats,
          pricePerSeat: profile.pricePerSeat,
          carModel: profile.carModel,
          carNumber: profile.carNumber,
          carColor: 'White', // Default
          carYear: '2020', // Default
          totalDistance: '250 km', // Default
          estimatedDuration: '4 hrs', // Default
          amenities: [
            ...(profile.acAvailable ? ['AC'] : []),
            ...(profile.musicAllowed ? ['Music'] : []),
            ...(profile.petsAllowed ? ['Pets OK'] : []),
            ...(profile.childFriendly ? ['Child Friendly'] : [])
          ],
          rules: [
            profile.smokingAllowed ? 'Smoking allowed' : 'No smoking',
            profile.petsAllowed ? 'Pets allowed' : 'No pets',
            `Max luggage: ${profile.maxLuggage}`
          ],
          languages: profile.languages || ['Hindi', 'English'],
          bio: profile.bio || '',
          instantBooking: true,
          isOnline: true,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random&size=128`
        }));

      // Combine real and mock drivers
      const allDrivers = [...realDrivers, ...mockResults.drivers];
      const totalCount = realDrivers.length + mockResults.total;
      
      if (page === 1) {
        setSearchResults({
          drivers: allDrivers,
          total: totalCount,
          hasMore: mockResults.hasMore
        });
      } else {
        setSearchResults({
          drivers: [...searchResults.drivers, ...allDrivers],
          total: totalCount,
          hasMore: mockResults.hasMore
        });
      }
      
      setCurrentPage(page);
      setLoading(false);
    }, 150);
  };

  const loadMore = () => {
    performSearch(currentPage + 1);
  };

  const handleBooking = (driver: CarpoolDriver) => {
    setPaymentDriver(driver);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    if (paymentDriver) {
      setBookings([...bookings, paymentDriver.id]);
      
      // Save booking to globalState
      const bookingId = `carpool-${Date.now()}`;
      globalState.addBooking({
        id: bookingId,
        userId: globalState.getCurrentUser()?.id || 'guest',
        hotelId: paymentDriver.id,
        hotelName: `Carpool: ${paymentDriver.name}`,
        destination: `${paymentDriver.from} → ${paymentDriver.to}`,
        checkIn: paymentDriver.departureDate,
        checkOut: paymentDriver.departureDate,
        guests: 1,
        roomType: `${paymentDriver.carModel} - ${paymentDriver.seatsAvailable} seats`,
        totalPrice: paymentDriver.pricePerSeat,
        status: 'confirmed',
        paymentStatus: 'completed',
        bookingDate: new Date().toISOString()
      });
      
      // Add to expenses
      globalState.addExpense({
        id: `expense-${Date.now()}`,
        userId: globalState.getCurrentUser()?.id || 'guest',
        amount: paymentDriver.pricePerSeat,
        category: 'transport',
        description: `Carpool from ${paymentDriver.from} to ${paymentDriver.to} with ${paymentDriver.name}`,
        date: new Date().toISOString().split('T')[0],
        currency: 'INR',
        bookingId: bookingId
      });
      
      // Save to localStorage for backwards compatibility
      const booking = {
        id: bookingId,
        driverId: paymentDriver.id,
        driverName: paymentDriver.name,
        passengerName: globalState.getCurrentUser()?.name || 'Guest User',
        passengerPhone: '+91 98765 43210', // Default phone
        passengerEmail: globalState.getCurrentUser()?.email || 'guest@example.com',
        passengerId: globalState.getCurrentUser()?.id || 'guest-user',
        from: paymentDriver.from,
        to: paymentDriver.to,
        date: paymentDriver.departureDate,
        time: paymentDriver.departureTime,
        seats: 1,
        seatsBooked: 1,
        amount: paymentDriver.pricePerSeat,
        status: 'pending',
        transactionId,
        bookingDate: new Date().toISOString(),
        type: 'carpool'
      };
      
      // Save to allBookings array
      const allBookings = JSON.parse(localStorage.getItem('allBookings') || '[]');
      allBookings.push(booking);
      localStorage.setItem('allBookings', JSON.stringify(allBookings));
      
      addNotification({
        type: 'carpool',
        title: 'Carpool Booked Successfully',
        message: `Your ride from ${paymentDriver.from} to ${paymentDriver.to} is confirmed!`
      });
      
      setShowPayment(false);
      setPaymentDriver(null);
    }
  };

  const handleCancelBooking = (driverId: string) => {
    const allBookings = JSON.parse(localStorage.getItem('allBookings') || '[]');
    const booking = allBookings.find((b: any) => b.driverId === driverId && b.type === 'carpool');
    
    if (booking) {
      // Process refund
      const refund = {
        id: `refund-${Date.now()}`,
        originalTransactionId: booking.transactionId,
        amount: booking.amount,
        reason: 'Driver cancelled',
        date: new Date().toISOString(),
        status: 'processed'
      };
      
      const refunds = JSON.parse(localStorage.getItem('refunds') || '[]');
      refunds.push(refund);
      localStorage.setItem('refunds', JSON.stringify(refunds));
      
      // Add refund expense
      globalState.addExpense({
        id: `expense-refund-${Date.now()}`,
        userId: globalState.getCurrentUser()?.id || 'guest',
        amount: -booking.amount, // Negative for refund
        category: 'transport',
        description: `Refund: Carpool cancellation - ${booking.from} to ${booking.to}`,
        date: new Date().toISOString().split('T')[0],
        currency: 'INR',
        bookingId: booking.id
      });
      
      // Remove booking
      const updatedBookings = allBookings.filter((b: any) => b.id !== booking.id);
      localStorage.setItem('allBookings', JSON.stringify(updatedBookings));
      
      setBookings(bookings.filter(id => id !== driverId));
      
      addNotification({
        type: 'success',
        title: 'Refund Processed',
        message: `₹${booking.amount} has been refunded to your account`
      });
    }
  };

  const activeFiltersCount =
    (filters.to ? 1 : 0) +
    (filters.departureDate ? 1 : 0) +
    (filters.minSeats > 1 ? 1 : 0) +
    (filters.maxPrice < 10000 ? 1 : 0) +
    (filters.verified ? 1 : 0) +
    (filters.instantBooking ? 1 : 0);

  return (
    <NatureBackground 
      imageUrl="https://images.unsplash.com/photo-1598399929533-847def01aa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NzQ1NjE1N3ww&ixlib=rb-4.1.0&q=80&w=1080"
      overlay="light"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {onBack && (
          <AnimatedButton
            onClick={onBack}
            variant="success"
            icon={<ArrowLeft className="w-5 h-5" />}
            className="mb-6"
          >
            Back to Home
          </AnimatedButton>
        )}

        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-900 via-teal-900 to-cyan-900 text-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-4xl font-bold mb-3">Find Your Perfect Carpool</h2>
            <p className="text-green-200 text-lg">
              {searchResults.total.toLocaleString('en-IN')} drivers available • Share rides, Save money, Make friends
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 sticky top-20 z-30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <select
                  value={filters.from}
                  onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-900"
                >
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <input
                  type="text"
                  value={filters.to}
                  onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                  placeholder="Any destination"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-900"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                <input
                  type="date"
                  value={filters.departureDate}
                  onChange={(e) => setFilters({ ...filters, departureDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-900"
                />
              </div>

              {/* Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-900 to-teal-900 text-white rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 relative"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-sm">
                <span className="text-3xl font-bold text-green-900">{searchResults.total}</span>
                <span className="text-gray-600 ml-2">rides available</span>
              </div>
              
              {bookings.length > 0 && (
                <div className="px-4 py-2 bg-green-100 text-green-900 rounded-full text-sm font-medium flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {bookings.length} Booked
                </div>
              )}
              
              <div className="px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-medium flex items-center gap-2">
                <Car className="w-4 h-4" />
                {searchResults.drivers.filter(d => d.isOnline).length} Online Now
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl text-gray-900 font-semibold">Refine Your Search</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Min Seats */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Seats Needed
                  </label>
                  <select
                    value={filters.minSeats}
                    onChange={(e) => setFilters({ ...filters, minSeats: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-900"
                  >
                    {[1, 2, 3, 4].map(n => (
                      <option key={n} value={n}>{n} Seat{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price per Seat: ₹{filters.maxPrice.toLocaleString('en-IN')}
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="500"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Verified Only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verified Drivers Only
                  </label>
                  <button
                    onClick={() => setFilters({ ...filters, verified: !filters.verified })}
                    className={`w-full py-3 rounded-xl border-2 transition-all ${
                      filters.verified
                        ? 'border-green-900 bg-green-50 text-green-900 font-semibold'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {filters.verified ? '✓ Verified Only' : 'All Drivers'}
                  </button>
                </div>

                {/* Instant Booking */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instant Booking
                  </label>
                  <button
                    onClick={() => setFilters({ ...filters, instantBooking: !filters.instantBooking })}
                    className={`w-full py-3 rounded-xl border-2 transition-all ${
                      filters.instantBooking
                        ? 'border-green-900 bg-green-50 text-green-900 font-semibold'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {filters.instantBooking ? '⚡ Instant Only' : 'All Rides'}
                  </button>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver Gender
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) => setFilters({ ...filters, gender: e.target.value as 'any' | 'male' | 'female' | 'mixed' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-900"
                  >
                    <option value="any">Any</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                {/* Age Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver Age Group
                  </label>
                  <select
                    value={filters.ageGroup}
                    onChange={(e) => setFilters({ ...filters, ageGroup: e.target.value as 'any' | '18-25' | '26-35' | '36-50' | '50+' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-900"
                  >
                    <option value="any">Any</option>
                    <option value="18-25">18-25</option>
                    <option value="26-35">26-35</option>
                    <option value="36-50">36-50</option>
                    <option value="50+">50+</option>
                  </select>
                </div>

                {/* Smoking */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Smoking Preference
                  </label>
                  <select
                    value={filters.smoking}
                    onChange={(e) => setFilters({ ...filters, smoking: e.target.value as 'any' | 'smoking' | 'non-smoking' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-900"
                  >
                    <option value="any">Any</option>
                    <option value="smoking">Smoking</option>
                    <option value="non-smoking">Non-Smoking</option>
                  </select>
                </div>

                {/* Pets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Policy
                  </label>
                  <select
                    value={filters.pets}
                    onChange={(e) => setFilters({ ...filters, pets: e.target.value as 'any' | 'allowed' | 'not-allowed' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-900"
                  >
                    <option value="any">Any</option>
                    <option value="allowed">Allowed</option>
                    <option value="not-allowed">Not Allowed</option>
                  </select>
                </div>

                {/* Music */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Music Allowed
                  </label>
                  <select
                    value={filters.music}
                    onChange={(e) => setFilters({ ...filters, music: e.target.value as 'any' | 'yes' | 'no' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-900"
                  >
                    <option value="any">Any</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {/* Luggage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Luggage Capacity
                  </label>
                  <select
                    value={filters.luggage}
                    onChange={(e) => setFilters({ ...filters, luggage: e.target.value as 'any' | 'small' | 'medium' | 'large' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-900"
                  >
                    <option value="any">Any</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                {/* AC */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Air Conditioning
                  </label>
                  <button
                    onClick={() => setFilters({ ...filters, ac: !filters.ac })}
                    className={`w-full py-3 rounded-xl border-2 transition-all ${
                      filters.ac
                        ? 'border-green-900 bg-green-50 text-green-900 font-semibold'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {filters.ac ? '✓ AC Available' : 'No AC'}
                  </button>
                </div>

                {/* Child Friendly */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Child Friendly
                  </label>
                  <button
                    onClick={() => setFilters({ ...filters, childFriendly: !filters.childFriendly })}
                    className={`w-full py-3 rounded-xl border-2 transition-all ${
                      filters.childFriendly
                        ? 'border-green-900 bg-green-50 text-green-900 font-semibold'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {filters.childFriendly ? '✓ Child Friendly' : 'Not Child Friendly'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && currentPage === 1 && (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-green-900 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-lg">Finding available rides...</p>
            </div>
          )}

          {/* Drivers Grid */}
          {!loading || currentPage > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.drivers.map(driver => (
                <div
                  key={driver.id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-green-900 to-teal-900 text-white p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={driver.avatar}
                            alt={driver.name}
                            className="w-16 h-16 rounded-full border-3 border-white"
                          />
                          {driver.isOnline && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold flex items-center gap-2">
                            {driver.name}
                            {driver.verified && (
                              <Shield className="w-4 h-4 text-blue-400 fill-current" />
                            )}
                          </h3>
                          <p className="text-sm text-green-200">{driver.age} years • {driver.gender}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm">{driver.rating}</span>
                            <span className="text-sm text-green-200">({driver.totalTrips} trips)</span>
                          </div>
                        </div>
                      </div>
                      {driver.instantBooking && (
                        <span className="px-2 py-1 bg-yellow-400 text-yellow-900 rounded-lg text-xs font-bold">
                          ⚡ Instant
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Route */}
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-teal-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-green-900 rounded-full"></div>
                          <span className="font-bold text-gray-900">{driver.from}</span>
                        </div>
                        <div className="border-l-2 border-dashed border-green-900 h-4 ml-1.5"></div>
                        <div className="flex items-center gap-2">
                          <Navigation className="w-3 h-3 text-green-900" />
                          <span className="font-bold text-gray-900">{driver.to}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{driver.totalDistance}</p>
                        <p className="text-sm text-gray-600">{driver.estimatedDuration}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-3">
                    {/* Car Details */}
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="w-4 h-4 text-green-900" />
                      <span className="font-medium">{driver.carModel}</span>
                      <span className="text-gray-600">• {driver.carColor}</span>
                      <span className="text-gray-600">• {driver.carYear}</span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-green-900" />
                      <span>{new Date(driver.departureDate).toLocaleDateString('en-IN', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                      <Clock className="w-4 h-4 text-green-900 ml-2" />
                      <span>{driver.departureTime}</span>
                    </div>

                    {/* Seats & Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-green-900" />
                        <span className="font-medium">{driver.seatsAvailable} seats available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-900" />
                        <span className="text-2xl font-bold text-green-900">₹{driver.pricePerSeat}</span>
                        <span className="text-sm text-gray-600">/seat</span>
                      </div>
                    </div>

                    {/* Route Stops */}
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-600 mb-2">Route via:</p>
                      <div className="flex flex-wrap gap-1">
                        {driver.route.slice(1, -1).map(stop => (
                          <span key={stop} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            {stop}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Amenities:</p>
                      <div className="flex flex-wrap gap-1">
                        {driver.amenities.map(amenity => (
                          <span key={amenity} className="px-2 py-0.5 bg-green-50 text-green-900 rounded text-xs">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rules */}
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Rules:</p>
                      <div className="flex flex-wrap gap-1">
                        {driver.rules.slice(0, 3).map(rule => (
                          <span key={rule} className="px-2 py-0.5 bg-orange-50 text-orange-900 rounded text-xs">
                            {rule}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-200 pt-3">
                      {bookings.includes(driver.id) ? (
                        <div className="space-y-2">
                          <div className="px-4 py-3 bg-green-100 text-green-900 rounded-xl text-center font-medium flex items-center justify-center gap-2">
                            <Check className="w-5 h-5" />
                            Booking Request Sent
                          </div>
                          <button
                            onClick={() => {
                              setChatDriver({ id: driver.id, name: driver.name });
                              setShowChat(true);
                            }}
                            className="w-full px-4 py-3 bg-gradient-to-r from-green-900 to-teal-900 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <MessageCircle className="w-5 h-5" />
                            Contact Driver
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBooking(driver)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-900 to-teal-900 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                        >
                          Book This Ride
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* Load More */}
          {searchResults.hasMore && !loading && (
            <div className="text-center pt-8">
              <button
                onClick={loadMore}
                className="px-12 py-5 bg-gradient-to-r from-green-900 to-teal-900 text-white rounded-2xl hover:shadow-2xl transition-all text-lg font-medium"
              >
                Load More Rides ({searchResults.total - searchResults.drivers.length} remaining)
              </button>
            </div>
          )}

          {/* Loading More */}
          {loading && currentPage > 1 && (
            <div className="text-center py-8">
              <div className="inline-block w-12 h-12 border-4 border-green-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Payment Modal */}
          {showPayment && paymentDriver && (
            <UniversalPaymentGateway
              paymentDetails={{
                type: 'carpool',
                amount: paymentDriver.pricePerSeat,
                description: `Carpool from ${paymentDriver.from} to ${paymentDriver.to}`,
                itemName: `Carpool with ${paymentDriver.name}`,
                destination: `${paymentDriver.from} → ${paymentDriver.to}`,
                date: `${new Date(paymentDriver.departureDate).toLocaleDateString()} at ${paymentDriver.departureTime}`,
                metadata: {
                  driverId: paymentDriver.id,
                  driverName: paymentDriver.name,
                  carModel: paymentDriver.carModel
                }
              }}
              onSuccess={handlePaymentSuccess}
              onClose={() => {
                setShowPayment(false);
                setPaymentDriver(null);
              }}
            />
          )}

          {/* Chat Modal */}
          {showChat && chatDriver && (
            <CarpoolDriverChat
              driverId={chatDriver.id}
              driverName={chatDriver.name}
              onClose={() => {
                setShowChat(false);
                setChatDriver(null);
              }}
            />
          )}
        </div>
      </div>
    </NatureBackground>
  );
}