import { useState } from 'react';
import { Plane, Train, ArrowLeft, MapPin, Calendar, Users, Search, Filter, Star, Clock, IndianRupee, CheckCircle, ArrowRight, Wifi, Utensils } from 'lucide-react';
import { RazorpayPaymentGateway, PaymentSuccessData } from './RazorpayPaymentGateway';
import { toast } from 'sonner';

// Simple UI Components
const Card = ({ className = '', children }: { className?: string; children: React.ReactNode }) => (
  <div className={`bg-white rounded-xl shadow-md ${className}`}>{children}</div>
);

const Button = ({ 
  className = '', 
  variant = 'default',
  onClick,
  children 
}: { 
  className?: string;
  variant?: 'default' | 'outline';
  onClick?: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-all ${
      variant === 'outline' 
        ? 'border border-gray-300 hover:bg-gray-50' 
        : 'bg-blue-900 text-white hover:bg-blue-950'
    } ${className}`}
  >
    {children}
  </button>
);

const Input = ({ 
  className = '', 
  ...props 
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full px-3 py-2 border rounded-lg ${className}`}
    {...props}
  />
);

const Badge = ({ 
  className = '', 
  variant = 'default',
  children 
}: { 
  className?: string;
  variant?: 'default' | 'outline';
  children: React.ReactNode;
}) => (
  <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
    variant === 'outline' 
      ? 'border border-gray-300 text-gray-700' 
      : 'bg-blue-100 text-blue-900'
  } ${className}`}>
    {children}
  </span>
);

const Tabs = ({ 
  value, 
  onValueChange, 
  className = '', 
  children 
}: { 
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={className}>{children}</div>
);

const TabsList = ({ className = '', children }: { className?: string; children: React.ReactNode }) => (
  <div className={`flex gap-2 ${className}`}>{children}</div>
);

const TabsTrigger = ({ 
  value, 
  className = '', 
  children 
}: { 
  value: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const tabs = document.querySelector('[data-tabs]');
  const currentValue = tabs?.getAttribute('data-value');
  const isActive = currentValue === value;
  
  return (
    <button
      onClick={() => {
        const event = new CustomEvent('tab-change', { detail: value });
        tabs?.dispatchEvent(event);
      }}
      className={`px-4 py-2 rounded-lg transition-all ${
        isActive ? 'bg-blue-900 text-white' : 'bg-gray-100 hover:bg-gray-200'
      } ${className}`}
    >
      {children}
    </button>
  );
};

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  class: 'Economy' | 'Business' | 'First';
  stops: number;
  amenities: string[];
  seatsAvailable: number;
  logo: string;
}

interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  class: 'Sleeper' | '3AC' | '2AC' | '1AC';
  seatsAvailable: number;
  days: string[];
}

interface FlightTrainBookingProps {
  onBack?: () => void;
}

export function FlightTrainBooking({ onBack }: FlightTrainBookingProps = {}) {
  const [bookingType, setBookingType] = useState<'flight' | 'train'>('flight');
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1,
    class: 'economy',
  });
  const [searchResults, setSearchResults] = useState<(Flight | Train)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Flight | Train | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Mock data
  const mockFlights: Flight[] = [
    {
      id: 'f1',
      airline: 'Air India',
      flightNumber: 'AI 101',
      from: 'Delhi (DEL)',
      to: 'Mumbai (BOM)',
      departure: '06:00',
      arrival: '08:30',
      duration: '2h 30m',
      price: 4500,
      class: 'Economy',
      stops: 0,
      amenities: ['WiFi', 'Meals', 'Entertainment'],
      seatsAvailable: 23,
      logo: '✈️',
    },
    {
      id: 'f2',
      airline: 'IndiGo',
      flightNumber: '6E 345',
      from: 'Delhi (DEL)',
      to: 'Mumbai (BOM)',
      departure: '09:15',
      arrival: '11:45',
      duration: '2h 30m',
      price: 3800,
      class: 'Economy',
      stops: 0,
      amenities: ['WiFi', 'Snacks'],
      seatsAvailable: 45,
      logo: '🛫',
    },
    {
      id: 'f3',
      airline: 'Vistara',
      flightNumber: 'UK 956',
      from: 'Delhi (DEL)',
      to: 'Mumbai (BOM)',
      departure: '14:30',
      arrival: '17:00',
      duration: '2h 30m',
      price: 5200,
      class: 'Economy',
      stops: 0,
      amenities: ['WiFi', 'Meals', 'Entertainment', 'Extra Legroom'],
      seatsAvailable: 12,
      logo: '✈️',
    },
    {
      id: 'f4',
      airline: 'SpiceJet',
      flightNumber: 'SG 234',
      from: 'Bangalore (BLR)',
      to: 'Goa (GOI)',
      departure: '10:00',
      arrival: '11:15',
      duration: '1h 15m',
      price: 2900,
      class: 'Economy',
      stops: 0,
      amenities: ['WiFi'],
      seatsAvailable: 67,
      logo: '🛬',
    },
  ];

  const mockTrains: Train[] = [
    {
      id: 't1',
      trainNumber: '12951',
      trainName: 'Mumbai Rajdhani Express',
      from: 'New Delhi (NDLS)',
      to: 'Mumbai Central (MMCT)',
      departure: '16:55',
      arrival: '08:35',
      duration: '15h 40m',
      price: 2450,
      class: '3AC',
      seatsAvailable: 34,
      days: ['Daily'],
    },
    {
      id: 't2',
      trainNumber: '12301',
      trainName: 'Howrah Rajdhani Express',
      from: 'New Delhi (NDLS)',
      to: 'Howrah (HWH)',
      departure: '17:00',
      arrival: '10:05',
      duration: '17h 05m',
      price: 2850,
      class: '2AC',
      seatsAvailable: 21,
      days: ['Daily'],
    },
    {
      id: 't3',
      trainNumber: '12430',
      trainName: 'Lucknow Mail',
      from: 'New Delhi (NDLS)',
      to: 'Lucknow (LKO)',
      departure: '22:20',
      arrival: '06:30',
      duration: '8h 10m',
      price: 985,
      class: 'Sleeper',
      seatsAvailable: 128,
      days: ['Daily'],
    },
    {
      id: 't4',
      trainNumber: '12002',
      trainName: 'Bhopal Shatabdi',
      from: 'New Delhi (NDLS)',
      to: 'Bhopal (BPL)',
      departure: '06:00',
      arrival: '13:50',
      duration: '7h 50m',
      price: 1560,
      class: '3AC',
      seatsAvailable: 56,
      days: ['Daily except Wed'],
    },
  ];

  const indianCities = [
    { name: 'Delhi', code: 'DEL' },
    { name: 'Mumbai', code: 'BOM' },
    { name: 'Bangalore', code: 'BLR' },
    { name: 'Goa', code: 'GOI' },
    { name: 'Kolkata', code: 'CCU' },
    { name: 'Chennai', code: 'MAA' },
    { name: 'Hyderabad', code: 'HYD' },
    { name: 'Jaipur', code: 'JAI' },
    { name: 'Agra', code: 'AGR' },
    { name: 'Varanasi', code: 'VNS' },
  ];

  const handleSearch = () => {
    if (!searchParams.from || !searchParams.to || !searchParams.date) {
      toast.error('Please fill all required fields');
      return;
    }

    if (searchParams.from === searchParams.to) {
      toast.error('Origin and destination cannot be the same');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (bookingType === 'flight') {
        setSearchResults(mockFlights);
      } else {
        setSearchResults(mockTrains);
      }
      setShowResults(true);
      toast.success(`Found ${bookingType === 'flight' ? mockFlights.length : mockTrains.length} results!`);
    }, 1000);
  };

  const handleBookNow = (item: Flight | Train) => {
    setSelectedItem(item);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentData: PaymentSuccessData) => {
    const booking = {
      id: paymentData.orderId,
      type: bookingType,
      item: selectedItem,
      passengers: searchParams.passengers,
      date: searchParams.date,
      paymentId: paymentData.paymentId,
      amount: paymentData.amount,
      status: 'Confirmed',
      pnr: `PNR${Date.now().toString().slice(-10)}`,
    };

    setConfirmedBooking(booking);

    // Save to bookings
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, booking]));

    setShowPayment(false);
    toast.success(`${bookingType === 'flight' ? 'Flight' : 'Train'} booked successfully! 🎉`);
  };

  const getTotalPrice = () => {
    if (!selectedItem) return 0;
    return selectedItem.price * searchParams.passengers;
  };

  if (confirmedBooking) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h2 className="text-3xl mb-2 text-green-900">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your {confirmedBooking.type} has been successfully booked
          </p>

          <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded-lg p-6 mb-6">
            <div className="text-4xl mb-4">
              {confirmedBooking.type === 'flight' ? '✈️' : '🚂'}
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm opacity-80 mb-1">PNR Number</p>
                <p className="text-xl">{confirmedBooking.pnr}</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-1">Booking ID</p>
                <p className="text-xl">{confirmedBooking.id.slice(0, 12)}...</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-1">Travel Date</p>
                <p className="text-xl">{confirmedBooking.date}</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-1">Passengers</p>
                <p className="text-xl">{confirmedBooking.passengers}</p>
              </div>
            </div>
          </div>

          {confirmedBooking.type === 'flight' ? (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-lg mb-4">Flight Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Airline</span>
                  <span>{confirmedBooking.item.airline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Flight Number</span>
                  <span>{confirmedBooking.item.flightNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Route</span>
                  <span>{confirmedBooking.item.from} → {confirmedBooking.item.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Departure</span>
                  <span>{confirmedBooking.item.departure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Arrival</span>
                  <span>{confirmedBooking.item.arrival}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-lg mb-4">Train Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Train</span>
                  <span>{confirmedBooking.item.trainName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Train Number</span>
                  <span>{confirmedBooking.item.trainNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Route</span>
                  <span>{confirmedBooking.item.from} → {confirmedBooking.item.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Departure</span>
                  <span>{confirmedBooking.item.departure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Class</span>
                  <span>{confirmedBooking.item.class}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              📧 Confirmation email and tickets sent to your registered email
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => window.print()} variant="outline" className="flex-1">
              Download Ticket
            </Button>
            <Button onClick={() => setConfirmedBooking(null)} className="flex-1">
              Book Another
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl mb-2 flex items-center gap-2">
          {bookingType === 'flight' ? (
            <Plane className="w-8 h-8 text-blue-900" />
          ) : (
            <Train className="w-8 h-8 text-blue-900" />
          )}
          Flight & Train Booking
        </h2>
        <p className="text-gray-600">Book flights and trains across India with best prices</p>
      </div>

      {/* Type Selector */}
      <Tabs value={bookingType} onValueChange={(v) => setBookingType(v as 'flight' | 'train')} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="flight" className="text-lg">
            <Plane className="w-5 h-5 mr-2" />
            Flights
          </TabsTrigger>
          <TabsTrigger value="train" className="text-lg">
            <Train className="w-5 h-5 mr-2" />
            Trains
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search Form */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm mb-2">From</label>
            <select
              value={searchParams.from}
              onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Origin</option>
              {indianCities.map(city => (
                <option key={city.code} value={city.name}>
                  {city.name} ({city.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">To</label>
            <select
              value={searchParams.to}
              onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Destination</option>
              {indianCities.map(city => (
                <option key={city.code} value={city.name}>
                  {city.name} ({city.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Date</label>
            <Input
              type="date"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Passengers</label>
            <Input
              type="number"
              value={searchParams.passengers}
              onChange={(e) => setSearchParams({ ...searchParams, passengers: parseInt(e.target.value) || 1 })}
              min={1}
              max={9}
            />
          </div>

          <div className="flex items-end">
            <Button onClick={handleSearch} className="w-full h-10">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </Card>

      {/* Search Results */}
      {showResults && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">
              {searchResults.length} {bookingType === 'flight' ? 'Flights' : 'Trains'} Available
            </h3>
            <Badge className="bg-green-100 text-green-900">
              <Star className="w-3 h-3 mr-1" />
              Best Prices Guaranteed
            </Badge>
          </div>

          <div className="space-y-4">
            {bookingType === 'flight' ? (
              // Flight Results
              (searchResults as Flight[]).map(flight => (
                <Card key={flight.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl">{flight.logo}</span>
                        <div>
                          <h4 className="text-lg">{flight.airline}</h4>
                          <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                        </div>
                        <Badge variant={flight.stops === 0 ? 'default' : 'outline'}>
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-2xl">{flight.departure}</p>
                          <p className="text-sm text-gray-600">{flight.from.split('(')[0]}</p>
                        </div>

                        <div className="flex-1 flex flex-col items-center">
                          <Clock className="w-4 h-4 text-gray-400 mb-1" />
                          <div className="w-full h-0.5 bg-gray-300 mb-1"></div>
                          <p className="text-sm text-gray-600">{flight.duration}</p>
                        </div>

                        <div>
                          <p className="text-2xl">{flight.arrival}</p>
                          <p className="text-sm text-gray-600">{flight.to.split('(')[0]}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {flight.amenities.includes('WiFi') && (
                          <Badge variant="outline"><Wifi className="w-3 h-3 mr-1" /> WiFi</Badge>
                        )}
                        {flight.amenities.includes('Meals') && (
                          <Badge variant="outline"><Utensils className="w-3 h-3 mr-1" /> Meals</Badge>
                        )}
                        {flight.amenities.includes('Entertainment') && (
                          <Badge variant="outline">📺 Entertainment</Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-right ml-8">
                      <p className="text-sm text-gray-600 mb-1">{flight.class}</p>
                      <p className="text-3xl mb-1">₹{flight.price.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500 mb-3">{flight.seatsAvailable} seats left</p>
                      <Button
                        onClick={() => handleBookNow(flight)}
                        className="bg-gradient-to-r from-blue-900 to-purple-900"
                      >
                        Book Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              // Train Results
              (searchResults as Train[]).map(train => (
                <Card key={train.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl">🚂</span>
                        <div>
                          <h4 className="text-lg">{train.trainName}</h4>
                          <p className="text-sm text-gray-600">Train #{train.trainNumber}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-900">
                          {train.class}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-2xl">{train.departure}</p>
                          <p className="text-sm text-gray-600">{train.from.split('(')[0]}</p>
                        </div>

                        <div className="flex-1 flex flex-col items-center">
                          <Clock className="w-4 h-4 text-gray-400 mb-1" />
                          <div className="w-full h-0.5 bg-gray-300 mb-1"></div>
                          <p className="text-sm text-gray-600">{train.duration}</p>
                        </div>

                        <div>
                          <p className="text-2xl">{train.arrival}</p>
                          <p className="text-sm text-gray-600">{train.to.split('(')[0]}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {train.days.map((day, i) => (
                          <Badge key={i} variant="outline">{day}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-right ml-8">
                      <p className="text-3xl mb-1">₹{train.price.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500 mb-3">{train.seatsAvailable} seats available</p>
                      <Button
                        onClick={() => handleBookNow(train)}
                        className="bg-gradient-to-r from-blue-900 to-purple-900"
                      >
                        Book Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && selectedItem && (
        <RazorpayPaymentGateway
          amount={getTotalPrice()}
          bookingDetails={{
            type: bookingType,
            title: bookingType === 'flight' 
              ? `${(selectedItem as Flight).airline} - ${(selectedItem as Flight).flightNumber}`
              : `${(selectedItem as Train).trainName} - ${(selectedItem as Train).trainNumber}`,
            description: `${selectedItem.from} → ${selectedItem.to}`,
            date: searchParams.date,
          }}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}