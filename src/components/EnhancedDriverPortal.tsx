import { useState, useEffect } from 'react';
import { Car, Users, DollarSign, Calendar, Clock, Phone, MapPin, LogOut, Star, TrendingUp, CheckCircle, User, Mail, Lock, Eye, EyeOff, ArrowLeft, PieChart, BarChart3, Percent, Heart, Music, Cigarette, Baby, Briefcase, Shield, Check, X, CreditCard, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { UniversalPaymentGateway } from './UniversalPaymentGateway';

interface DriverProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  // Vehicle
  carModel: string;
  carNumber: string;
  totalSeats: number;
  // Route
  from: string;
  to: string;
  departureTime: string;
  pricePerSeat: number;
  regularDays: string[];
  // Preferences
  petsAllowed: boolean;
  smokingAllowed: boolean;
  musicAllowed: boolean;
  acAvailable: boolean;
  childFriendly: boolean;
  maxLuggage: 'small' | 'medium' | 'large';
  gender: 'any' | 'male' | 'female' | 'mixed';
  ageGroup: 'any' | '18-25' | '26-35' | '36-50' | '50+';
  // Additional
  bio: string;
  languages: string[];
  rating: number;
  totalRides: number;
  verified: boolean;
  createdAt: string;
}

interface Booking {
  id: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  seatsBooked: number;
  amount: number;
  bookingDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
}

interface Props {
  onBack?: () => void;
}

const INDIAN_CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Jaipur', 'Goa', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Lucknow', 'Chandigarh'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const LANGUAGES = ['Hindi', 'English', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Gujarati', 'Malayalam'];

export function EnhancedDriverPortal({ onBack }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupStep, setSignupStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    carModel: '',
    carNumber: '',
    totalSeats: 4,
    from: 'Delhi',
    to: 'Jaipur',
    departureTime: '06:00',
    pricePerSeat: 500,
    regularDays: [],
    petsAllowed: false,
    smokingAllowed: false,
    musicAllowed: true,
    acAvailable: true,
    childFriendly: true,
    maxLuggage: 'medium',
    gender: 'any',
    ageGroup: 'any',
    bio: '',
    languages: ['Hindi', 'English']
  });
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCommissionPayment, setShowCommissionPayment] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  // Check for existing session
  useEffect(() => {
    const stored = localStorage.getItem('driverProfile');
    if (stored) {
      const profile = JSON.parse(stored);
      setDriverProfile(profile);
      setIsLoggedIn(true);
      loadBookings(profile.id);
    }
  }, []);

  const loadBookings = (driverId: string) => {
    // Load from localStorage
    const allBookings = JSON.parse(localStorage.getItem('allBookings') || '[]');
    const driverBookings = allBookings.filter((b: any) => 
      b.driverId === driverId && b.type === 'carpool'
    );
    setBookings(driverBookings);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Check localStorage for driver profiles
    const drivers = JSON.parse(localStorage.getItem('driverProfiles') || '[]');
    const driver = drivers.find((d: DriverProfile) => 
      d.email === loginForm.email && d.password === loginForm.password
    );

    setTimeout(() => {
      if (driver) {
        setDriverProfile(driver);
        setIsLoggedIn(true);
        localStorage.setItem('driverProfile', JSON.stringify(driver));
        localStorage.setItem('driverSession', JSON.stringify({
          isLoggedIn: true,
          driverId: driver.id,
          timestamp: Date.now()
        }));
        loadBookings(driver.id);
      } else {
        alert('Invalid credentials');
      }
      setLoading(false);
    }, 500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupStep < 3) {
      setSignupStep(signupStep + 1);
      return;
    }

    setLoading(true);

    // Create new driver profile
    const newProfile: DriverProfile = {
      id: `driver-${Date.now()}`,
      ...signupForm as DriverProfile,
      rating: 5.0,
      totalRides: 0,
      verified: true,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const drivers = JSON.parse(localStorage.getItem('driverProfiles') || '[]');
    drivers.push(newProfile);
    localStorage.setItem('driverProfiles', JSON.stringify(drivers));
    localStorage.setItem('driverProfile', JSON.stringify(newProfile));
    localStorage.setItem('driverSession', JSON.stringify({
      isLoggedIn: true,
      driverId: newProfile.id,
      timestamp: Date.now()
    }));

    setTimeout(() => {
      setDriverProfile(newProfile);
      setIsLoggedIn(true);
      setLoading(false);
      alert('Registration successful! Welcome to the driver portal.');
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('driverProfile');
    localStorage.removeItem('driverSession');
    setDriverProfile(null);
    setBookings([]);
    setIsLoggedIn(false);
    setLoginForm({ email: '', password: '' });
  };

  const toggleDay = (day: string) => {
    const days = signupForm.regularDays || [];
    if (days.includes(day)) {
      setSignupForm({ ...signupForm, regularDays: days.filter(d => d !== day) });
    } else {
      setSignupForm({ ...signupForm, regularDays: [...days, day] });
    }
  };

  const toggleLanguage = (lang: string) => {
    const languages = signupForm.languages || [];
    if (languages.includes(lang)) {
      setSignupForm({ ...signupForm, languages: languages.filter(l => l !== lang) });
    } else {
      setSignupForm({ ...signupForm, languages: [...languages, lang] });
    }
  };

  // Calculate analytics
  const totalEarnings = bookings.reduce((sum, b) => sum + b.amount, 0);
  const APP_COMMISSION_RATE = 0.15; // 15% commission
  const appCommission = totalEarnings * APP_COMMISSION_RATE;
  const netEarnings = totalEarnings - appCommission;
  const totalSeatsBooked = bookings.reduce((sum, b) => sum + b.seatsBooked, 0);
  const seatsAvailable = (driverProfile?.totalSeats || 0) - totalSeatsBooked;

  // Chart data
  const monthlyData = [
    { month: 'Jan', revenue: 12000, commission: 1800 },
    { month: 'Feb', revenue: 15000, commission: 2250 },
    { month: 'Mar', revenue: 18000, commission: 2700 },
    { month: 'Apr', revenue: 22000, commission: 3300 },
    { month: 'May', revenue: 25000, commission: 3750 },
    { month: 'Jun', revenue: totalEarnings, commission: appCommission }
  ];

  const seatData = [
    { name: 'Booked', value: totalSeatsBooked, color: '#10b981' },
    { name: 'Available', value: seatsAvailable, color: '#f59e0b' }
  ];

  // Login/Signup UI
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          )}

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignup ? 'Become a Carpool Driver' : 'Driver Login'}
            </h1>
            <p className="text-gray-600">
              {isSignup ? 'Complete your profile and start earning' : 'Manage your rides and earnings'}
            </p>
          </div>

          {!isSignup ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                  placeholder="driver@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
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
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login to Dashboard'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignup(true)}
                  className="text-orange-600 hover:underline"
                >
                  New driver? Create your profile →
                </button>
              </div>
            </form>
          ) : (
            // Multi-step Signup Form
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      signupStep >= step ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-1 ${signupStep > step ? 'bg-orange-600' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Basic Info */}
              {signupStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-xl mb-4">📋 Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                        placeholder="driver@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Password *</label>
                      <input
                        type="password"
                        required
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Car Model *</label>
                      <input
                        type="text"
                        required
                        value={signupForm.carModel}
                        onChange={(e) => setSignupForm({ ...signupForm, carModel: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                        placeholder="Toyota Innova"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Car Number *</label>
                      <input
                        type="text"
                        required
                        value={signupForm.carNumber}
                        onChange={(e) => setSignupForm({ ...signupForm, carNumber: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                        placeholder="MH 12 AB 1234"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-2">Total Seats Available *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="8"
                        value={signupForm.totalSeats}
                        onChange={(e) => setSignupForm({ ...signupForm, totalSeats: parseInt(e.target.value) || 4 })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Route & Pricing */}
              {signupStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-xl mb-4">🗺️ Route & Pricing</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">From (City) *</label>
                      <select
                        value={signupForm.from}
                        onChange={(e) => setSignupForm({ ...signupForm, from: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                      >
                        {INDIAN_CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">To (City) *</label>
                      <select
                        value={signupForm.to}
                        onChange={(e) => setSignupForm({ ...signupForm, to: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                      >
                        {INDIAN_CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Departure Time *</label>
                      <input
                        type="time"
                        value={signupForm.departureTime}
                        onChange={(e) => setSignupForm({ ...signupForm, departureTime: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Price Per Seat (₹) *</label>
                      <input
                        type="number"
                        required
                        min="100"
                        step="50"
                        value={signupForm.pricePerSeat}
                        onChange={(e) => setSignupForm({ ...signupForm, pricePerSeat: parseInt(e.target.value) || 500 })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-3">Regular Travel Days</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {DAYS.map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-4 py-2 rounded-xl font-medium transition-all ${
                            signupForm.regularDays?.includes(day)
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Preferences */}
              {signupStep === 3 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-xl mb-4">⚙️ Ride Preferences</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-pink-600" />
                        <span className="text-gray-700">Pets Allowed</span>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={signupForm.petsAllowed}
                          onChange={(e) => setSignupForm({ ...signupForm, petsAllowed: e.target.checked })}
                          className="sr-only peer"
                        />
                        <span className="absolute inset-0 bg-gray-300 rounded-full peer-checked:bg-orange-600 transition-colors"></span>
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Cigarette className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Smoking Allowed</span>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={signupForm.smokingAllowed}
                          onChange={(e) => setSignupForm({ ...signupForm, smokingAllowed: e.target.checked })}
                          className="sr-only peer"
                        />
                        <span className="absolute inset-0 bg-gray-300 rounded-full peer-checked:bg-orange-600 transition-colors"></span>
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Music className="w-5 h-5 text-purple-600" />
                        <span className="text-gray-700">Music Allowed</span>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={signupForm.musicAllowed}
                          onChange={(e) => setSignupForm({ ...signupForm, musicAllowed: e.target.checked })}
                          className="sr-only peer"
                        />
                        <span className="absolute inset-0 bg-gray-300 rounded-full peer-checked:bg-orange-600 transition-colors"></span>
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Car className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">AC Available</span>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={signupForm.acAvailable}
                          onChange={(e) => setSignupForm({ ...signupForm, acAvailable: e.target.checked })}
                          className="sr-only peer"
                        />
                        <span className="absolute inset-0 bg-gray-300 rounded-full peer-checked:bg-orange-600 transition-colors"></span>
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Baby className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Child Friendly</span>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={signupForm.childFriendly}
                          onChange={(e) => setSignupForm({ ...signupForm, childFriendly: e.target.checked })}
                          className="sr-only peer"
                        />
                        <span className="absolute inset-0 bg-gray-300 rounded-full peer-checked:bg-orange-600 transition-colors"></span>
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Max Luggage Size</label>
                      <select
                        value={signupForm.maxLuggage}
                        onChange={(e) => setSignupForm({ ...signupForm, maxLuggage: e.target.value as any })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                      >
                        <option value="small">Small (Backpack)</option>
                        <option value="medium">Medium (Suitcase)</option>
                        <option value="large">Large (Multiple bags)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Preferred Gender</label>
                      <select
                        value={signupForm.gender}
                        onChange={(e) => setSignupForm({ ...signupForm, gender: e.target.value as any })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                      >
                        <option value="any">Any</option>
                        <option value="male">Male Only</option>
                        <option value="female">Female Only</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Age Group Preference</label>
                      <select
                        value={signupForm.ageGroup}
                        onChange={(e) => setSignupForm({ ...signupForm, ageGroup: e.target.value as any })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                      >
                        <option value="any">Any Age</option>
                        <option value="18-25">18-25</option>
                        <option value="26-35">26-35</option>
                        <option value="36-50">36-50</option>
                        <option value="50+">50+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-3">Languages Spoken</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleLanguage(lang)}
                          className={`px-4 py-2 rounded-xl font-medium transition-all ${
                            signupForm.languages?.includes(lang)
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Short Bio (Optional)</label>
                    <textarea
                      value={signupForm.bio}
                      onChange={(e) => setSignupForm({ ...signupForm, bio: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600"
                      rows={3}
                      placeholder="Tell passengers about yourself..."
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {signupStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setSignupStep(signupStep - 1)}
                    className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                  >
                    ← Previous
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating...' : signupStep === 3 ? '✓ Complete Signup' : 'Next →'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(false);
                    setSignupStep(1);
                  }}
                  className="text-orange-600 hover:underline"
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
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Driver Dashboard</h1>
              <p className="text-sm text-gray-600">{driverProfile?.name}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8" />
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-blue-100 mb-1">Total Bookings</p>
            <h3 className="text-4xl font-bold">{bookings.length}</h3>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8" />
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-green-100 mb-1">Gross Revenue</p>
            <h3 className="text-4xl font-bold">₹{totalEarnings.toLocaleString('en-IN')}</h3>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Percent className="w-8 h-8" />
            </div>
            <p className="text-orange-100 mb-1">App Commission (15%)</p>
            <h3 className="text-4xl font-bold">₹{appCommission.toLocaleString('en-IN')}</h3>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8" />
              <CheckCircle className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-purple-100 mb-1">Net Earnings</p>
            <h3 className="text-4xl font-bold">₹{netEarnings.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-orange-600" />
              Monthly Revenue & Commission
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                <Bar dataKey="revenue" fill="#f97316" name="Revenue" />
                <Bar dataKey="commission" fill="#ef4444" name="Commission" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-orange-600" />
              Seat Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={seatData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {seatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-gray-700">Seats Booked</span>
                <span className="font-bold text-green-600">{totalSeatsBooked}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                <span className="text-gray-700">Seats Available</span>
                <span className="font-bold text-orange-600">{seatsAvailable}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">💰 Earnings Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
              <p className="text-gray-700 mb-2">Gross Revenue</p>
              <p className="text-3xl font-bold text-green-900">₹{totalEarnings.toLocaleString('en-IN')}</p>
              <p className="text-sm text-gray-600 mt-2">Total from all bookings</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200">
              <p className="text-gray-700 mb-2">Platform Commission (15%)</p>
              <p className="text-3xl font-bold text-red-900">-₹{appCommission.toLocaleString('en-IN')}</p>
              <p className="text-sm text-gray-600 mt-2">Covers app maintenance & support</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
              <p className="text-gray-700 mb-2">Your Net Earnings</p>
              <p className="text-3xl font-bold text-blue-900">₹{netEarnings.toLocaleString('en-IN')}</p>
              <p className="text-sm text-gray-600 mt-2">Amount you receive</p>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📋 Recent Bookings</h2>
          
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <User className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{booking.passengerName}</h3>
                        <p className="text-gray-600 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {booking.passengerPhone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold mb-2">
                        {booking.seatsBooked} {booking.seatsBooked === 1 ? 'Seat' : 'Seats'}
                      </div>
                      <p className="text-2xl font-bold text-gray-900">₹{booking.amount}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-medium">Status: {booking.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Car className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
              <p className="text-gray-600">Your bookings will appear here once passengers book your ride.</p>
            </div>
          )}
        </div>

        {/* Tourist Feedback & Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Tourist Feedback & Reviews
            </h2>
            <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-gray-900">{driverProfile?.rating || 4.5}</span>
              <span className="text-gray-600">({(() => {
                const reviews = JSON.parse(localStorage.getItem('worldClassReviews') || '[]');
                return reviews.filter((r: any) => r.targetId === driverProfile?.id && (r.type === 'carpool' || r.type === 'driver')).length;
              })()})</span>
            </div>
          </div>

          {(() => {
            const allReviews = JSON.parse(localStorage.getItem('worldClassReviews') || '[]');
            const driverReviews = allReviews.filter((r: any) => 
              r.targetId === driverProfile?.id && (r.type === 'carpool' || r.type === 'driver')
            );

            if (driverReviews.length === 0) {
              return (
                <div className="text-center py-16">
                  <Star className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600">Tourist feedback will appear here after they review your service.</p>
                  <p className="text-sm text-gray-500 mt-2">Keep providing great service to get 5-star reviews! ⭐</p>
                </div>
              );
            }

            return (
              <div className="space-y-6">
                {driverReviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{review.userName}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full">
                        <Star className="w-5 h-5 text-white fill-white" />
                        <span className="text-white font-bold">{review.rating}.0</span>
                      </div>
                    </div>

                    {/* Rating Categories */}
                    {review.categoryRatings && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {Object.entries(review.categoryRatings).map(([category, rating]: [string, any]) => (
                          <div key={category} className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1 capitalize">{category}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Review Text */}
                    <div className="space-y-3 mb-4">
                      <p className="text-gray-700 leading-relaxed">{review.text}</p>
                      
                      {/* Pros & Cons */}
                      {(review.pros || review.cons) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {review.pros && (
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                              <p className="font-bold text-green-900 mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Pros
                              </p>
                              <p className="text-sm text-green-700">{review.pros}</p>
                            </div>
                          )}
                          {review.cons && (
                            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                              <p className="font-bold text-red-900 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Cons
                              </p>
                              <p className="text-sm text-red-700">{review.cons}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Travel Tips */}
                      {review.tips && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <p className="font-bold text-blue-900 mb-2">💡 Traveler's Tip</p>
                          <p className="text-sm text-blue-700">{review.tips}</p>
                        </div>
                      )}
                    </div>

                    {/* Review Photos */}
                    {review.photos && review.photos.length > 0 && (
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {review.photos.map((photo: string, idx: number) => (
                          <img
                            key={idx}
                            src={photo}
                            alt={`Review photo ${idx + 1}`}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    {/* Helpful Count */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-600">
                        {review.helpfulCount || 0} people found this helpful
                      </span>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          <CheckCircle className="w-4 h-4" />
                          Verified Trip
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Driver Profile Preview */}
        <div className="mt-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-6 border-2 border-orange-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">👤 Your Profile (As Seen by Tourists)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Route Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <span><strong>From:</strong> {driverProfile?.from}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span><strong>To:</strong> {driverProfile?.to}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span><strong>Time:</strong> {driverProfile?.departureTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span><strong>Price:</strong> ₹{driverProfile?.pricePerSeat}/seat</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Amenities & Preferences</h3>
              <div className="grid grid-cols-2 gap-2">
                {driverProfile?.petsAllowed && (
                  <div className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm">✓ Pets OK</div>
                )}
                {driverProfile?.smokingAllowed && (
                  <div className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm">✓ Smoking OK</div>
                )}
                {driverProfile?.musicAllowed && (
                  <div className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm">✓ Music OK</div>
                )}
                {driverProfile?.acAvailable && (
                  <div className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm">✓ AC Available</div>
                )}
                {driverProfile?.childFriendly && (
                  <div className="px-3 py-2 bg-pink-100 text-pink-700 rounded-lg text-sm">✓ Child Friendly</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}