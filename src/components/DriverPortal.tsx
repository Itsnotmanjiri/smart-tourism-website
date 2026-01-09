import { useState, useEffect } from 'react';
import { Car, Users, DollarSign, Calendar, Clock, Phone, MapPin, LogOut, Star, TrendingUp, CheckCircle, User, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DriverData {
  id: string;
  name: string;
  email: string;
  phone: string;
  carModel: string;
  carNumber: string;
  totalSeats: number;
  totalRides: number;
  totalEarnings: number;
  createdAt: string;
}

interface Booking {
  id: string;
  userId: string;
  userName: string;
  seatsBooked: number;
  bookingDate: string;
  amount?: number;
  phone?: string;
}

interface DriverBookingsData {
  bookings: Booking[];
  seatsAvailable: number;
  seatsBooked: number;
  totalSeats: number;
}

interface Props {
  onBack?: () => void;
}

export function DriverPortal({ onBack }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [bookingsData, setBookingsData] = useState<DriverBookingsData | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    carModel: '',
    carNumber: '',
    totalSeats: 4,
    // NEW: Complete driver profile fields
    from: 'Delhi',
    to: 'Jaipur',
    regularDays: [] as string[],
    departureTime: '06:00',
    pricePerSeat: 500,
    // Preferences
    petsAllowed: false,
    smokingAllowed: false,
    musicAllowed: true,
    acAvailable: true,
    childFriendly: true,
    maxLuggage: 'medium' as 'small' | 'medium' | 'large',
    gender: 'any' as 'any' | 'male' | 'female' | 'mixed',
    ageGroup: 'any' as 'any' | '18-25' | '26-35' | '36-50' | '50+',
    // Additional
    bio: '',
    languages: [] as string[]
  });

  useEffect(() => {
    // Check for existing driver session
    const storedDriver = localStorage.getItem('driverData');
    if (storedDriver) {
      const driver = JSON.parse(storedDriver);
      setDriverData(driver);
      setIsLoggedIn(true);
      loadBookings(driver.id);
    }
  }, []);

  const loadBookings = async (driverId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-95da31c9/driver/${driverId}/bookings`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setBookingsData(data);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-95da31c9/driver/login`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginForm)
        }
      );
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setDriverData(data.driver);
        setIsLoggedIn(true);
        localStorage.setItem('driverData', JSON.stringify(data.driver));
        loadBookings(data.driver.id);
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-95da31c9/driver/signup`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(signupForm)
        }
      );
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setDriverData(data.driver);
        setIsLoggedIn(true);
        localStorage.setItem('driverData', JSON.stringify(data.driver));
        loadBookings(data.driver.id);
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('driverData');
    setDriverData(null);
    setBookingsData(null);
    setIsLoggedIn(false);
    setLoginForm({ email: '', password: '' });
  };

  // Login/Signup Form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-teal-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          )}
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignup ? 'Join as Driver' : 'Driver Portal'}
            </h1>
            <p className="text-gray-600">
              {isSignup ? 'Register your vehicle and start earning' : 'Manage your rides and bookings'}
            </p>
          </div>

          {!isSignup ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignup(true)}
                  className="text-green-600 hover:underline"
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </form>
          ) : (
            // Signup Form
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={signupForm.phone}
                  onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  <Car className="w-4 h-4 inline mr-2" />
                  Car Model
                </label>
                <input
                  type="text"
                  required
                  value={signupForm.carModel}
                  onChange={(e) => setSignupForm({ ...signupForm, carModel: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Toyota Innova"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Car Number</label>
                <input
                  type="text"
                  required
                  value={signupForm.carNumber}
                  onChange={(e) => setSignupForm({ ...signupForm, carNumber: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="MH 12 AB 1234"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Total Seats
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="8"
                  value={signupForm.totalSeats}
                  onChange={(e) => setSignupForm({ ...signupForm, totalSeats: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
                  className="text-green-600 hover:underline"
                >
                  Already have an account? Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Driver Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Driver Portal</h1>
              <p className="text-sm text-gray-600">{driverData?.name}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-600 mb-1">Total Rides</p>
            <h3 className="text-2xl font-bold text-gray-900">{driverData?.totalRides || 0}</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-600 mb-1">Total Earnings</p>
            <h3 className="text-2xl font-bold text-gray-900">₹{driverData?.totalEarnings || 0}</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Seats Booked</p>
            <h3 className="text-2xl font-bold text-gray-900">{bookingsData?.seatsBooked || 0}/{bookingsData?.totalSeats || 0}</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Available Seats</p>
            <h3 className="text-2xl font-bold text-gray-900">{bookingsData?.seatsAvailable || 0}</h3>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Bookings</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading bookings...</p>
            </div>
          ) : bookingsData && bookingsData.bookings.length > 0 ? (
            <div className="space-y-4">
              {bookingsData.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{booking.userName}</h3>
                        <p className="text-gray-600">Passenger</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                      {booking.seatsBooked} {booking.seatsBooked === 1 ? 'Seat' : 'Seats'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>
                        {new Date(booking.bookingDate).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {booking.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{booking.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
              <p className="text-gray-600">Your bookings will appear here once passengers book your ride.</p>
            </div>
          )}
        </div>

        {/* Vehicle Info */}
        {driverData && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 mb-2">Car Model</label>
                <p className="text-lg font-semibold text-gray-900">{driverData.carModel}</p>
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Car Number</label>
                <p className="text-lg font-semibold text-gray-900">{driverData.carNumber}</p>
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Email</label>
                <p className="text-lg font-semibold text-gray-900">{driverData.email}</p>
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Phone</label>
                <p className="text-lg font-semibold text-gray-900">{driverData.phone}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}