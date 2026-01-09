import { useState } from 'react';
import { 
  Plane, Train, ArrowLeft, MapPin, Calendar, Users, Search, Filter, 
  Star, Clock, IndianRupee, CheckCircle, ArrowRight, Wifi, Utensils,
  Luggage, Armchair, CreditCard, Shield, Navigation, TrendingDown,
  Zap, Award, QrCode, Download, Share2, Bell, X, Check, ChevronDown,
  ChevronRight, RefreshCw, AlertCircle, Info, Sparkles, Route, MapPinned
} from 'lucide-react';
import { RazorpayPaymentGateway, PaymentSuccessData } from './RazorpayPaymentGateway';
import { toast } from 'sonner@2.0.3';
import { dataService, STORAGE_KEYS } from '../utils/dataService';

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  originalPrice?: number;
  class: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  stops: number;
  stopCities?: string[];
  amenities: string[];
  seatsAvailable: number;
  logo: string;
  aircraftType: string;
  carbonEmission: number;
  rating: number;
  reviews: number;
  refundable: boolean;
  baggage: string;
  mealIncluded: boolean;
}

interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  originalPrice?: number;
  class: 'Sleeper' | '3AC' | '2AC' | '1AC' | 'Chair Car' | 'Executive';
  seatsAvailable: number;
  days: string[];
  type: 'Superfast' | 'Express' | 'Shatabdi' | 'Rajdhani' | 'Duronto' | 'Vande Bharat' | 'Local';
  rating: number;
  amenities: string[];
  pantryAvailable: boolean;
  tatkalAvailable: boolean;
}

interface BookingDetails {
  type: 'flight' | 'train';
  item: Flight | Train;
  passengers: PassengerInfo[];
  totalPrice: number;
  bookingId: string;
  pnr?: string;
  seatNumbers?: string[];
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  eTicket?: string;
  qrCode?: string;
}

interface PassengerInfo {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  seatPreference?: string;
  mealPreference?: string;
  specialAssistance?: string;
}

interface FlightTrainBookingProps {
  onBack?: () => void;
}

export function WorldClassFlightTrainBooking({ onBack }: FlightTrainBookingProps = {}) {
  const [bookingType, setBookingType] = useState<'flight' | 'train'>('flight');
  const [currentStep, setCurrentStep] = useState<'search' | 'results' | 'details' | 'passengers' | 'payment' | 'confirmation'>('search');
  
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    returnDate: '',
    passengers: 1,
    class: 'Economy',
    tripType: 'one-way' as 'one-way' | 'round-trip',
  });
  
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    stops: 'any' as 'any' | 'nonstop' | '1-stop',
    airlines: [] as string[],
    departureTime: 'any' as 'any' | 'morning' | 'afternoon' | 'evening' | 'night',
    sortBy: 'price' as 'price' | 'duration' | 'departure' | 'rating',
  });
  
  const [searchResults, setSearchResults] = useState<(Flight | Train)[]>([]);
  const [selectedItem, setSelectedItem] = useState<Flight | Train | null>(null);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<BookingDetails | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Indian cities with airport/railway codes
  const indianCities = [
    { name: 'Delhi', airportCode: 'DEL', railCode: 'NDLS' },
    { name: 'Mumbai', airportCode: 'BOM', railCode: 'CSTM' },
    { name: 'Bangalore', airportCode: 'BLR', railCode: 'SBC' },
    { name: 'Goa', airportCode: 'GOI', railCode: 'MAO' },
    { name: 'Jaipur', airportCode: 'JAI', railCode: 'JP' },
    { name: 'Agra', airportCode: 'AGR', railCode: 'AGC' },
    { name: 'Kochi', airportCode: 'COK', railCode: 'ERS' },
    { name: 'Varanasi', airportCode: 'VNS', railCode: 'BSB' },
    { name: 'Udaipur', airportCode: 'UDR', railCode: 'UDZ' },
    { name: 'Manali', airportCode: 'KUU', railCode: 'KULU' },
    { name: 'Rishikesh', airportCode: 'DED', railCode: 'RKSH' },
    { name: 'Chennai', airportCode: 'MAA', railCode: 'MAS' },
    { name: 'Kolkata', airportCode: 'CCU', railCode: 'HWH' },
    { name: 'Hyderabad', airportCode: 'HYD', railCode: 'SC' },
    { name: 'Ahmedabad', airportCode: 'AMD', railCode: 'ADI' },
    { name: 'Pune', airportCode: 'PNQ', railCode: 'PUNE' },
  ];

  // Enhanced flight data
  const generateFlights = (from: string, to: string): Flight[] => {
    const airlines = [
      { name: 'IndiGo', code: '6E', logo: '🛫' },
      { name: 'Air India', code: 'AI', logo: '✈️' },
      { name: 'SpiceJet', code: 'SG', logo: '🌶️' },
      { name: 'Vistara', code: 'UK', logo: '⭐' },
      { name: 'Go First', code: 'G8', logo: '🚀' },
      { name: 'AirAsia India', code: 'I5', logo: '🔴' },
    ];

    const fromCity = indianCities.find(c => c.name === from);
    const toCity = indianCities.find(c => c.name === to);
    
    if (!fromCity || !toCity) return [];

    return airlines.flatMap((airline, idx) => {
      const basePrice = 3500 + Math.random() * 8000;
      const times = ['06:00', '09:30', '13:15', '16:45', '20:00'];
      
      return times.slice(0, 3 + Math.floor(Math.random() * 2)).map((time, timeIdx) => {
        const stops = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : 0) : 0;
        const duration = `${2 + stops}h ${15 + Math.floor(Math.random() * 45)}m`;
        const priceMultiplier = 1 + (stops * 0.15) + (timeIdx * 0.1);
        
        return {
          id: `FL-${idx}-${timeIdx}`,
          airline: airline.name,
          flightNumber: `${airline.code}-${2100 + idx * 100 + timeIdx}`,
          from: fromCity.name,
          to: toCity.name,
          fromCode: fromCity.airportCode,
          toCode: toCity.airportCode,
          departure: time,
          arrival: addHours(time, 2 + stops + Math.random()),
          duration,
          price: Math.round(basePrice * priceMultiplier),
          originalPrice: Math.random() > 0.5 ? Math.round(basePrice * priceMultiplier * 1.3) : undefined,
          class: 'Economy' as const,
          stops,
          stopCities: stops > 0 ? [indianCities[Math.floor(Math.random() * indianCities.length)].name] : [],
          amenities: ['WiFi', 'In-flight Entertainment', 'USB Charging', 'Snacks', 'Beverages'],
          seatsAvailable: 15 + Math.floor(Math.random() * 35),
          logo: airline.logo,
          aircraftType: ['Boeing 737', 'Airbus A320', 'ATR 72'][Math.floor(Math.random() * 3)],
          carbonEmission: Math.round(80 + Math.random() * 40),
          rating: 3.5 + Math.random() * 1.5,
          reviews: 100 + Math.floor(Math.random() * 500),
          refundable: Math.random() > 0.5,
          baggage: '15 kg Check-in + 7 kg Cabin',
          mealIncluded: Math.random() > 0.6,
        };
      });
    });
  };

  // Enhanced train data
  const generateTrains = (from: string, to: string): Train[] => {
    const trainTypes = [
      { type: 'Rajdhani', prefix: '12', speed: 'Superfast' },
      { type: 'Shatabdi', prefix: '12', speed: 'Superfast' },
      { type: 'Duronto', prefix: '12', speed: 'Superfast' },
      { type: 'Vande Bharat', prefix: '22', speed: 'Express' },
      { type: 'Express', prefix: '12', speed: 'Express' },
      { type: 'Superfast', prefix: '12', speed: 'Superfast' },
    ];

    const fromCity = indianCities.find(c => c.name === from);
    const toCity = indianCities.find(c => c.name === to);
    
    if (!fromCity || !toCity) return [];

    return trainTypes.map((train, idx) => {
      const basePrice = 800 + Math.random() * 2000;
      const times = ['05:30', '08:45', '14:20', '18:15', '22:00'];
      const time = times[idx % times.length];
      const duration = `${4 + Math.floor(Math.random() * 8)}h ${15 + Math.floor(Math.random() * 45)}m`;
      
      return {
        id: `TR-${idx}`,
        trainNumber: `${train.prefix}${300 + idx * 10}`,
        trainName: `${train.type} Express`,
        from: fromCity.name,
        to: toCity.name,
        fromCode: fromCity.railCode,
        toCode: toCity.railCode,
        departure: time,
        arrival: addHours(time, 4 + Math.random() * 8),
        duration,
        price: Math.round(basePrice),
        originalPrice: Math.random() > 0.5 ? Math.round(basePrice * 1.25) : undefined,
        class: '3AC' as const,
        seatsAvailable: 20 + Math.floor(Math.random() * 60),
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        type: train.speed as any,
        rating: 3.8 + Math.random() * 1.2,
        amenities: ['AC', 'Charging Point', 'Reading Light', 'Bedding', 'Toilet'],
        pantryAvailable: Math.random() > 0.4,
        tatkalAvailable: true,
      };
    });
  };

  const addHours = (time: string, hours: number): string => {
    const [h, m] = time.split(':').map(Number);
    const totalMinutes = h * 60 + m + hours * 60;
    const newH = Math.floor(totalMinutes / 60) % 24;
    const newM = Math.floor(totalMinutes % 60);
    return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
  };

  const handleSearch = () => {
    if (!searchParams.from || !searchParams.to) {
      toast.error('Please select departure and destination cities');
      return;
    }
    
    if (searchParams.from === searchParams.to) {
      toast.error('Departure and destination cities must be different');
      return;
    }

    const results = bookingType === 'flight' 
      ? generateFlights(searchParams.from, searchParams.to)
      : generateTrains(searchParams.from, searchParams.to);
    
    setSearchResults(results);
    setCurrentStep('results');
    toast.success(`Found ${results.length} ${bookingType}s!`);
  };

  const handleSelectItem = (item: Flight | Train) => {
    setSelectedItem(item);
    setCurrentStep('details');
  };

  const handleProceedToPassengers = () => {
    setPassengers(Array(searchParams.passengers).fill(null).map((_, i) => ({
      name: '',
      age: 0,
      gender: 'Male',
      seatPreference: bookingType === 'flight' ? 'Window' : 'Lower',
      mealPreference: 'Vegetarian',
      specialAssistance: '',
    })));
    setCurrentStep('passengers');
  };

  const handleProceedToPayment = () => {
    // Validate passenger info
    const allFilled = passengers.every(p => p.name && p.age > 0);
    if (!allFilled) {
      toast.error('Please fill all passenger details');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = (data: PaymentSuccessData) => {
    const bookingId = `BK${Date.now()}`;
    const pnr = `PNR${Math.random().toString(36).substr(2, 10).toUpperCase()}`;
    
    const booking: BookingDetails = {
      type: bookingType,
      item: selectedItem!,
      passengers,
      totalPrice: selectedItem!.price * searchParams.passengers,
      bookingId,
      pnr,
      seatNumbers: passengers.map((_, i) => `${String.fromCharCode(65 + Math.floor(Math.random() * 6))}${10 + i}`),
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      eTicket: `E-TICKET-${bookingId}`,
      qrCode: `QR-${bookingId}`,
    };

    setCompletedBooking(booking);
    
    // Save to bookings
    const existingBookings = dataService.getData<any[]>(STORAGE_KEYS.BOOKINGS) || [];
    existingBookings.push({
      id: bookingId,
      type: bookingType === 'flight' ? 'flight' : 'train',
      name: bookingType === 'flight' 
        ? `${(selectedItem as Flight).airline} - ${(selectedItem as Flight).flightNumber}`
        : `${(selectedItem as Train).trainName} - ${(selectedItem as Train).trainNumber}`,
      from: (selectedItem as any).from,
      to: (selectedItem as any).to,
      date: searchParams.date,
      time: (selectedItem as any).departure,
      price: booking.totalPrice,
      status: 'confirmed',
      passengers: searchParams.passengers,
      pnr: pnr,
      bookingDate: new Date().toISOString(),
      details: booking,
    });
    dataService.saveData(STORAGE_KEYS.BOOKINGS, existingBookings);
    
    // Save to expense tracker
    const existingExpenses = dataService.getData<any[]>(STORAGE_KEYS.EXPENSES) || [];
    existingExpenses.push({
      id: `EXP-${bookingId}`,
      bookingId: bookingId,
      category: bookingType === 'flight' ? 'Flights' : 'Transport',
      description: bookingType === 'flight'
        ? `${(selectedItem as Flight).airline} flight from ${(selectedItem as any).from} to ${(selectedItem as any).to}`
        : `${(selectedItem as Train).trainName} train from ${(selectedItem as any).from} to ${(selectedItem as any).to}`,
      amount: booking.totalPrice,
      date: new Date().toISOString(),
      type: 'expense',
      paymentMethod: 'Razorpay',
      paymentId: data.razorpay_payment_id,
      status: 'completed',
      receipt: `RCPT-${bookingId}`,
    });
    dataService.saveData(STORAGE_KEYS.EXPENSES, existingExpenses);
    
    setShowPayment(false);
    setCurrentStep('confirmation');
    toast.success('🎉 Booking confirmed successfully! Added to bookings & expenses.');
  };

  const downloadTicket = () => {
    toast.success('E-Ticket downloaded!');
  };

  const shareTicket = () => {
    toast.success('Ticket shared successfully!');
  };

  // Render Search Screen
  const renderSearch = () => (
    <div className="space-y-6">
      {/* Trip Type Selector */}
      <div className="flex gap-3 p-2 bg-gray-100 rounded-xl">
        <button
          onClick={() => setSearchParams(prev => ({ ...prev, tripType: 'one-way' }))}
          className={`flex-1 px-4 py-3 rounded-lg transition-all ${
            searchParams.tripType === 'one-way'
              ? 'bg-white shadow-md text-blue-900'
              : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <ArrowRight className="w-4 h-4" />
            One Way
          </div>
        </button>
        <button
          onClick={() => setSearchParams(prev => ({ ...prev, tripType: 'round-trip' }))}
          className={`flex-1 px-4 py-3 rounded-lg transition-all ${
            searchParams.tripType === 'round-trip'
              ? 'bg-white shadow-md text-blue-900'
              : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Round Trip
          </div>
        </button>
      </div>

      {/* From/To Selection */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm mb-2 text-gray-700">
            <MapPin className="w-4 h-4 inline mr-1" />
            From
          </label>
          <select
            value={searchParams.from}
            onChange={(e) => setSearchParams(prev => ({ ...prev, from: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-900 focus:outline-none bg-white"
          >
            <option value="">Select city</option>
            {indianCities.map(city => (
              <option key={city.name} value={city.name}>
                {city.name} ({bookingType === 'flight' ? city.airportCode : city.railCode})
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <label className="block text-sm mb-2 text-gray-700">
            <MapPinned className="w-4 h-4 inline mr-1" />
            To
          </label>
          <select
            value={searchParams.to}
            onChange={(e) => setSearchParams(prev => ({ ...prev, to: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-900 focus:outline-none bg-white"
          >
            <option value="">Select city</option>
            {indianCities.map(city => (
              <option key={city.name} value={city.name}>
                {city.name} ({bookingType === 'flight' ? city.airportCode : city.railCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date & Passengers */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-2 text-gray-700">
            <Calendar className="w-4 h-4 inline mr-1" />
            Departure Date
          </label>
          <input
            type="date"
            value={searchParams.date}
            onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-900 focus:outline-none"
          />
        </div>

        {searchParams.tripType === 'round-trip' && (
          <div>
            <label className="block text-sm mb-2 text-gray-700">
              <Calendar className="w-4 h-4 inline mr-1" />
              Return Date
            </label>
            <input
              type="date"
              value={searchParams.returnDate}
              onChange={(e) => setSearchParams(prev => ({ ...prev, returnDate: e.target.value }))}
              min={searchParams.date}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-900 focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="block text-sm mb-2 text-gray-700">
            <Users className="w-4 h-4 inline mr-1" />
            Passengers
          </label>
          <select
            value={searchParams.passengers}
            onChange={(e) => setSearchParams(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-900 focus:outline-none bg-white"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Class Selection */}
      {bookingType === 'flight' ? (
        <div>
          <label className="block text-sm mb-2 text-gray-700">
            <Armchair className="w-4 h-4 inline mr-1" />
            Class
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Economy', 'Premium Economy', 'Business', 'First'].map((cls) => (
              <button
                key={cls}
                onClick={() => setSearchParams(prev => ({ ...prev, class: cls }))}
                className={`px-4 py-3 rounded-xl border-2 transition-all ${
                  searchParams.class === cls
                    ? 'border-blue-900 bg-blue-50 text-blue-900'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm mb-2 text-gray-700">
            <Armchair className="w-4 h-4 inline mr-1" />
            Class
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Sleeper', '3AC', '2AC', '1AC', 'Chair Car', 'Executive'].map((cls) => (
              <button
                key={cls}
                onClick={() => setSearchParams(prev => ({ ...prev, class: cls }))}
                className={`px-4 py-3 rounded-xl border-2 transition-all ${
                  searchParams.class === cls
                    ? 'border-blue-900 bg-blue-50 text-blue-900'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="w-full bg-gradient-to-r from-blue-900 to-purple-900 text-white px-6 py-4 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
      >
        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="text-lg">Search {bookingType === 'flight' ? 'Flights' : 'Trains'}</span>
        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );

  // Render Results Screen
  const renderResults = () => (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl">
            {searchResults.length} {bookingType}s found
          </h3>
          <p className="text-sm text-gray-600">
            {searchParams.from} → {searchParams.to} • {searchParams.date}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-xl hover:border-blue-900 transition-all"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { value: 'price', label: 'Cheapest', icon: TrendingDown },
          { value: 'duration', label: 'Fastest', icon: Zap },
          { value: 'departure', label: 'Earliest', icon: Clock },
          { value: 'rating', label: 'Best Rated', icon: Star },
        ].map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setFilters(prev => ({ ...prev, sortBy: value as any }))}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              filters.sortBy === value
                ? 'bg-blue-900 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {searchResults.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelectItem(item)}
            className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-900 hover:shadow-lg transition-all cursor-pointer p-4"
          >
            {bookingType === 'flight' ? (
              <FlightCard flight={item as Flight} passengers={searchParams.passengers} />
            ) : (
              <TrainCard train={item as Train} passengers={searchParams.passengers} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render Details Screen
  const renderDetails = () => {
    if (!selectedItem) return null;

    return (
      <div className="space-y-6">
        {/* Item Header */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded-xl p-6">
          {bookingType === 'flight' ? (
            <FlightDetailHeader flight={selectedItem as Flight} />
          ) : (
            <TrainDetailHeader train={selectedItem as Train} />
          )}
        </div>

        {/* Amenities & Features */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="text-lg mb-4">Amenities & Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(selectedItem as any).amenities.map((amenity: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                {amenity}
              </div>
            ))}
          </div>
        </div>

        {/* Fare Breakup */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="text-lg mb-4">Fare Breakup</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Base Fare × {searchParams.passengers}</span>
              <span>₹{selectedItem.price * searchParams.passengers}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Taxes & Fees</span>
              <span>₹{Math.round(selectedItem.price * searchParams.passengers * 0.12)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg">
              <span>Total</span>
              <span className="text-blue-900">
                ₹{Math.round(selectedItem.price * searchParams.passengers * 1.12)}
              </span>
            </div>
          </div>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleProceedToPassengers}
          className="w-full bg-gradient-to-r from-blue-900 to-purple-900 text-white px-6 py-4 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
        >
          Continue to Passenger Details
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  };

  // Render Passengers Screen
  const renderPassengers = () => (
    <div className="space-y-6">
      <h3 className="text-xl">Passenger Details</h3>
      {passengers.map((passenger, idx) => (
        <div key={idx} className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-4">
          <h4 className="font-medium">Passenger {idx + 1}</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700">Full Name</label>
              <input
                type="text"
                value={passenger.name}
                onChange={(e) => {
                  const newPassengers = [...passengers];
                  newPassengers[idx].name = e.target.value;
                  setPassengers(newPassengers);
                }}
                placeholder="Enter full name"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">Age</label>
                <input
                  type="number"
                  value={passenger.age || ''}
                  onChange={(e) => {
                    const newPassengers = [...passengers];
                    newPassengers[idx].age = parseInt(e.target.value);
                    setPassengers(newPassengers);
                  }}
                  placeholder="Age"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">Gender</label>
                <select
                  value={passenger.gender}
                  onChange={(e) => {
                    const newPassengers = [...passengers];
                    newPassengers[idx].gender = e.target.value as any;
                    setPassengers(newPassengers);
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-900 focus:outline-none bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700">Seat Preference</label>
              <select
                value={passenger.seatPreference}
                onChange={(e) => {
                  const newPassengers = [...passengers];
                  newPassengers[idx].seatPreference = e.target.value;
                  setPassengers(newPassengers);
                }}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-900 focus:outline-none bg-white"
              >
                {bookingType === 'flight' ? (
                  <>
                    <option value="Window">Window</option>
                    <option value="Aisle">Aisle</option>
                    <option value="Middle">Middle</option>
                  </>
                ) : (
                  <>
                    <option value="Lower">Lower Berth</option>
                    <option value="Middle">Middle Berth</option>
                    <option value="Upper">Upper Berth</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Meal Preference</label>
              <select
                value={passenger.mealPreference}
                onChange={(e) => {
                  const newPassengers = [...passengers];
                  newPassengers[idx].mealPreference = e.target.value;
                  setPassengers(newPassengers);
                }}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-900 focus:outline-none bg-white"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Jain">Jain</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleProceedToPayment}
        className="w-full bg-gradient-to-r from-blue-900 to-purple-900 text-white px-6 py-4 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
      >
        Proceed to Payment
        <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );

  // Render Confirmation Screen
  const renderConfirmation = () => {
    if (!completedBooking) return null;

    return (
      <div className="space-y-6">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-2xl mb-2">Booking Confirmed!</h2>
          <p className="text-white/90">Your {bookingType} has been successfully booked</p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Booking ID</p>
              <p className="text-lg">{completedBooking.bookingId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">PNR</p>
              <p className="text-lg">{completedBooking.pnr}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Route</span>
              <span>{(completedBooking.item as any).from} → {(completedBooking.item as any).to}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Date</span>
              <span>{searchParams.date}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Passengers</span>
              <span>{completedBooking.passengers.length}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Seats</span>
              <span>{completedBooking.seatNumbers?.join(', ')}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="border-t pt-4">
            <div className="bg-gray-100 p-8 rounded-xl flex flex-col items-center">
              <QrCode className="w-32 h-32 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Scan QR code at check-in</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadTicket}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-950 transition-all"
          >
            <Download className="w-5 h-5" />
            Download E-Ticket
          </button>
          <button
            onClick={shareTicket}
            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-blue-900 transition-all"
          >
            <Share2 className="w-5 h-5" />
            Share Ticket
          </button>
        </div>

        <button
          onClick={() => {
            setCurrentStep('search');
            setCompletedBooking(null);
            setSelectedItem(null);
            setSearchResults([]);
          }}
          className="w-full bg-gradient-to-r from-blue-900 to-purple-900 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all"
        >
          Book Another {bookingType === 'flight' ? 'Flight' : 'Train'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <div className="flex-1">
              <h1 className="text-2xl flex items-center gap-3">
                {bookingType === 'flight' ? <Plane className="w-7 h-7" /> : <Train className="w-7 h-7" />}
                {bookingType === 'flight' ? 'Flight' : 'Train'} Booking
              </h1>
              <p className="text-white/80 text-sm">Book your journey across India</p>
            </div>
          </div>

          {/* Type Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setBookingType('flight');
                setCurrentStep('search');
                setSearchResults([]);
              }}
              className={`flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                bookingType === 'flight'
                  ? 'bg-white text-blue-900 shadow-lg'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Plane className="w-5 h-5" />
              Flights
            </button>
            <button
              onClick={() => {
                setBookingType('train');
                setCurrentStep('search');
                setSearchResults([]);
              }}
              className={`flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                bookingType === 'train'
                  ? 'bg-white text-blue-900 shadow-lg'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Train className="w-5 h-5" />
              Trains
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      {currentStep !== 'search' && currentStep !== 'confirmation' && (
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {['search', 'results', 'details', 'passengers', 'payment'].map((step, idx) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center gap-2 ${
                    ['search', 'results', 'details', 'passengers', 'payment'].indexOf(currentStep) >= idx
                      ? 'text-blue-900'
                      : 'text-gray-400'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ['search', 'results', 'details', 'passengers', 'payment'].indexOf(currentStep) >= idx
                        ? 'bg-blue-900 text-white'
                        : 'bg-gray-200'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className="hidden md:block text-sm capitalize">{step}</span>
                  </div>
                  {idx < 4 && <ChevronRight className="w-5 h-5 mx-2 text-gray-400" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {currentStep === 'search' && renderSearch()}
        {currentStep === 'results' && renderResults()}
        {currentStep === 'details' && renderDetails()}
        {currentStep === 'passengers' && renderPassengers()}
        {currentStep === 'confirmation' && renderConfirmation()}
      </div>

      {/* Payment Modal */}
      {showPayment && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl">Complete Payment</h3>
                <button
                  onClick={() => setShowPayment(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <RazorpayPaymentGateway
                amount={Math.round(selectedItem.price * searchParams.passengers * 1.12)}
                bookingDetails={{
                  type: bookingType,
                  title: bookingType === 'flight' 
                    ? `${(selectedItem as Flight).airline} - ${(selectedItem as Flight).flightNumber}`
                    : `${(selectedItem as Train).trainName}`,
                  description: `${bookingType === 'flight' ? 'Flight' : 'Train'} from ${(selectedItem as any).from} to ${(selectedItem as any).to}`,
                  itemName: bookingType === 'flight' 
                    ? (selectedItem as Flight).airline 
                    : (selectedItem as Train).trainName,
                  date: searchParams.date,
                }}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPayment(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Flight Card Component
function FlightCard({ flight, passengers }: { flight: Flight; passengers: number }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-4xl">{flight.logo}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm text-gray-600">{flight.airline}</p>
            <p className="text-xs text-gray-500">{flight.flightNumber} • {flight.aircraftType}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{flight.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({flight.reviews})</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-2">
          <div>
            <p className="text-lg">{flight.departure}</p>
            <p className="text-xs text-gray-600">{flight.fromCode}</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <p className="text-xs text-gray-600">{flight.duration}</p>
            <div className="w-full h-px bg-gray-300 my-1 relative">
              {flight.stops > 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                  <p className="text-xs text-orange-600">{flight.stops} stop{flight.stops > 1 ? 's' : ''}</p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-600">{flight.stops === 0 ? 'Non-stop' : flight.stopCities?.join(', ')}</p>
          </div>
          <div>
            <p className="text-lg">{flight.arrival}</p>
            <p className="text-xs text-gray-600">{flight.toCode}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Luggage className="w-3 h-3" />
            <span>{flight.baggage}</span>
            {flight.mealIncluded && (
              <>
                <Utensils className="w-3 h-3" />
                <span>Meal</span>
              </>
            )}
            {flight.refundable && (
              <>
                <Shield className="w-3 h-3" />
                <span>Refundable</span>
              </>
            )}
          </div>
          <div className="text-right">
            {flight.originalPrice && (
              <p className="text-xs text-gray-500 line-through">₹{flight.originalPrice * passengers}</p>
            )}
            <p className="text-xl text-blue-900">₹{flight.price * passengers}</p>
            <p className="text-xs text-gray-600">{passengers} passenger{passengers > 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Train Card Component
function TrainCard({ train, passengers }: { train: Train; passengers: number }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-4xl">🚂</div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm">{train.trainName}</p>
            <p className="text-xs text-gray-500">{train.trainNumber} • {train.type}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{train.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-2">
          <div>
            <p className="text-lg">{train.departure}</p>
            <p className="text-xs text-gray-600">{train.fromCode}</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <p className="text-xs text-gray-600">{train.duration}</p>
            <div className="w-full h-px bg-gray-300 my-1"></div>
            <p className="text-xs text-gray-600">Direct</p>
          </div>
          <div>
            <p className="text-lg">{train.arrival}</p>
            <p className="text-xs text-gray-600">{train.toCode}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="px-2 py-1 bg-blue-100 text-blue-900 rounded">{train.class}</span>
            {train.pantryAvailable && (
              <>
                <Utensils className="w-3 h-3" />
                <span>Pantry</span>
              </>
            )}
            {train.tatkalAvailable && (
              <span className="px-2 py-1 bg-orange-100 text-orange-900 rounded">Tatkal</span>
            )}
          </div>
          <div className="text-right">
            {train.originalPrice && (
              <p className="text-xs text-gray-500 line-through">₹{train.originalPrice * passengers}</p>
            )}
            <p className="text-xl text-blue-900">₹{train.price * passengers}</p>
            <p className="text-xs text-gray-600">{passengers} passenger{passengers > 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Flight Detail Header
function FlightDetailHeader({ flight }: { flight: Flight }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-5xl">{flight.logo}</div>
        <div>
          <h2 className="text-2xl">{flight.airline}</h2>
          <p className="text-white/80">{flight.flightNumber} • {flight.aircraftType}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl">{flight.departure}</p>
          <p className="text-white/80">{flight.from}</p>
          <p className="text-sm text-white/60">{flight.fromCode}</p>
        </div>
        <div className="text-center">
          <Plane className="w-8 h-8 mx-auto mb-1" />
          <p className="text-white/80">{flight.duration}</p>
          <p className="text-sm text-white/60">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl">{flight.arrival}</p>
          <p className="text-white/80">{flight.to}</p>
          <p className="text-sm text-white/60">{flight.toCode}</p>
        </div>
      </div>
    </div>
  );
}

// Train Detail Header
function TrainDetailHeader({ train }: { train: Train }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-5xl">🚂</div>
        <div>
          <h2 className="text-2xl">{train.trainName}</h2>
          <p className="text-white/80">{train.trainNumber} • {train.type}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl">{train.departure}</p>
          <p className="text-white/80">{train.from}</p>
          <p className="text-sm text-white/60">{train.fromCode}</p>
        </div>
        <div className="text-center">
          <Train className="w-8 h-8 mx-auto mb-1" />
          <p className="text-white/80">{train.duration}</p>
          <p className="text-sm text-white/60">{train.class}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl">{train.arrival}</p>
          <p className="text-white/80">{train.to}</p>
          <p className="text-sm text-white/60">{train.toCode}</p>
        </div>
      </div>
    </div>
  );
}