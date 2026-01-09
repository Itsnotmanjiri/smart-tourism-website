import { MassiveTravelBuddyFinder } from './components/MassiveTravelBuddyFinder';
import { MassiveCarpoolFinder } from './components/MassiveCarpoolFinder';
import { InAppNotifications } from './components/InAppNotifications';
import { OfflineBanner } from './components/ux/OfflineBanner';
import { PremiumAuthSystem } from './components/PremiumAuthSystem';
import { EnhancedDestinationsList } from './components/EnhancedDestinationsList';
import { EnhancedDestinationDetail } from './components/EnhancedDestinationDetail';
import { ExpenseTracker } from './components/ExpenseTracker';
import { TravelChecklist } from './components/TravelChecklist';
import { FullSentenceTranslator } from './components/FullSentenceTranslator';
import { BookingsManager } from './components/BookingsManager';
import { EmergencyMode } from './components/ux/EmergencyMode';
import { UserProfile } from './components/UserProfile';
import { WorldClassReviewSystem } from './components/WorldClassReviewSystem';
import { EnhancedAIItineraryPlanner } from './components/EnhancedAIItineraryPlanner';
import { TripPlannerAI } from './components/TripPlannerAI';
import { WorldClassGoogleMaps } from './components/WorldClassGoogleMapsNEW';
import { WorldClassPhotoGallery } from './components/WorldClassPhotoGallery';
import { WorldClassFlightTrainBooking } from './components/WorldClassFlightTrainBooking';
import { ChatBot } from './components/ChatBot';
import { EnhancedSOSEmergency } from './components/EnhancedSOSEmergency';
import { CurrencyConverter } from './components/CurrencyConverter';
import { PWAInstaller } from './components/PWAInstaller';
import { EnhancedProviderDashboard } from './components/EnhancedProviderDashboard';
import { ProviderAuthPage } from './components/ProviderAuthPage';
import { EnhancedDriverPortal } from './components/EnhancedDriverPortal';
import { NatureBackground, FloatingGradientCard, AnimatedButton } from './components/ui/GlassCard';
import { globalState, initializeDemoUsers } from './utils/globalState';
import { dataService, STORAGE_KEYS } from './utils/dataService';
import { initializeReviews } from './utils/reviewsData';
import { initializeAppDatabase } from './utils/database-manager';
import { useState, useEffect } from 'react';
import { Map, Users, AlertCircle, Home, MessageCircle, User, LogOut, ChevronDown, BarChart3, ArrowRightLeft, Shield, Car, DollarSign, CheckSquare, Languages, Calendar, Hotel, Zap, ArrowLeft, Star, Bell, Sparkles, Plane, Camera, Navigation } from 'lucide-react';

type Page = 'home' | 'destination' | 'buddy' | 'carpool' | 'expenses' | 'checklist' | 'translator' | 'bookings' | 'emergency' | 'profile' | 'feedback' | 'itinerary' | 'trip-planner' | 'maps' | 'notifications' | 'photos' | 'flights';
type UserType = 'user' | 'provider' | 'carpool-driver' | null;

interface UserData {
  name: string;
  email: string;
}

interface ProviderData {
  id: string;
  name: string;
  email: string;
  businessName: string;
  hotelCount: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isCurrencyConverterOpen, setIsCurrencyConverterOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthChoice, setShowAuthChoice] = useState(true);
  const [needsProfileCreation, setNeedsProfileCreation] = useState(false);
  const [tempUserEmail, setTempUserEmail] = useState('');

  // Check for existing session on mount
  useEffect(() => {
    // Initialize centralized database
    initializeAppDatabase();
    
    // Initialize demo users and global state
    initializeDemoUsers();
    
    // Initialize review system with seed data
    initializeReviews();
    
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      setIsAuthenticated(true);
      setUserType('user');
      setShowAuthChoice(false);
    }

    const storedProviderData = localStorage.getItem('providerData');
    if (storedProviderData) {
      const parsedData = JSON.parse(storedProviderData);
      setProviderData(parsedData);
      setIsAuthenticated(true);
      setUserType('provider');
      setShowAuthChoice(false);
    }
  }, []);

  // Offline/Online detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = (user: UserData) => {
    setUserData(user);
    setIsAuthenticated(true);
    setUserType('user');
  };

  const handleProviderLogin = (provider: ProviderData) => {
    setProviderData(provider);
    setIsAuthenticated(true);
    setUserType('provider');
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('providerData');
    setUserData(null);
    setProviderData(null);
    setIsAuthenticated(false);
    setUserType(null);
    setShowAuthChoice(true);
    setCurrentPage('home');
    setIsChatOpen(false);
  };

  const handleDestinationSelect = (destinationId: string) => {
    setSelectedDestination(destinationId);
    setCurrentPage('destination');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedDestination(null);
  };

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    // Show provider auth if user chose provider
    if (showAuthChoice) {
      return (
        <NatureBackground
          imageUrl="https://images.unsplash.com/photo-1551857704-ba9b620ad444?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWolMjBtYWhhbCUyMHN1bnJpc2V8ZW58MXx8fHwxNzY3NTI2MzE1fDA&ixlib=rb-4.1.0&q=80&w=1080"
          overlay="gradient"
          className="min-h-screen flex items-center justify-center p-4"
        >
          <FloatingGradientCard className="max-w-2xl w-full text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Map className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl mb-4 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
              Welcome to AI Smart Tourism
            </h1>
            <p className="text-2xl text-gray-600 mb-10">India's Most Advanced Tourism Platform</p>

            <div className="space-y-4">
              <AnimatedButton
                onClick={() => setShowAuthChoice(false)}
                variant="primary"
                icon={<User className="w-8 h-8" />}
                className="w-full !py-6 !text-xl"
              >
                Continue as Tourist / Traveler
              </AnimatedButton>

              <AnimatedButton
                onClick={() => {
                  setShowAuthChoice(false);
                  setUserType('provider');
                }}
                variant="success"
                icon={<Hotel className="w-8 h-8" />}
                className="w-full !py-6 !text-xl"
              >
                Login as Hotel Provider
              </AnimatedButton>
              
              <AnimatedButton
                onClick={() => {
                  setShowAuthChoice(false);
                  setUserType('carpool-driver');
                }}
                variant="secondary"
                icon={<Car className="w-8 h-8" />}
                className="w-full !py-6 !text-xl"
              >
                Login as Carpool Driver
              </AnimatedButton>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mt-10 pt-10 border-t border-gray-200">
              <div>
                <div className="text-3xl mb-1">🏨</div>
                <div className="text-2xl text-blue-900">50K+</div>
                <div className="text-sm text-gray-600">Hotels</div>
              </div>
              <div>
                <div className="text-3xl mb-1">👥</div>
                <div className="text-2xl text-purple-900">1M+</div>
                <div className="text-sm text-gray-600">Users</div>
              </div>
              <div>
                <div className="text-3xl mb-1">🚗</div>
                <div className="text-2xl text-green-900">500K+</div>
                <div className="text-sm text-gray-600">Rides</div>
              </div>
              <div>
                <div className="text-3xl mb-1">⭐</div>
                <div className="text-2xl text-orange-900">4.9/5</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </FloatingGradientCard>
        </NatureBackground>
      );
    }

    // Show appropriate login page based on selection
    if (userType === 'carpool-driver') {
      return <EnhancedDriverPortal onBack={() => {
        setUserType(null);
        setShowAuthChoice(true);
      }} />;
    }
    
    if (userType === 'provider') {
      return <ProviderAuthPage 
        onLogin={handleProviderLogin} 
        onBackToUser={() => {
          setUserType(null);
          setShowAuthChoice(true);
        }}
      />;
    }
    
    return <PremiumAuthSystem onLoginSuccess={handleLogin} />;
  }

  // If provider is logged in, show ONLY provider dashboard
  if (isAuthenticated && userType === 'provider' && providerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100">
        <EnhancedProviderDashboard 
          provider={providerData}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // Tourist/User interface - PROVIDER BUTTON REMOVED
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 relative">
      {/* Beautiful Nature Background Overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1597434429739-2574d7e06807?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBtb3VudGFpbnMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzY3NDM2MjgyfDA&ixlib=rb-4.1.0&q=80&w=1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/90 shadow-2xl sticky top-0 z-40 border-b border-white/50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                  <Map className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                    AI Smart Tourism
                  </h1>
                  <p className="text-xs text-gray-600">India's #1 Travel Platform</p>
                </div>
              </div>
              
              {/* Navigation - FIXED: Provider button removed */}
              <nav className="hidden md:flex gap-2">
                <button
                  onClick={handleBackToHome}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'home' ? 'bg-blue-900 text-white' : 'hover:bg-blue-100'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Destinations</span>
                </button>
                <button
                  onClick={() => setCurrentPage('bookings')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'bookings' ? 'bg-blue-900 text-white' : 'hover:bg-blue-100'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Bookings</span>
                </button>
                <button
                  onClick={() => setCurrentPage('buddy')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'buddy' ? 'bg-blue-900 text-white' : 'hover:bg-blue-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Travel Buddy</span>
                </button>
                <button
                  onClick={() => setCurrentPage('emergency')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'emergency' ? 'bg-blue-900 text-white' : 'hover:bg-blue-100'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Emergency</span>
                </button>
                <button
                  onClick={() => setCurrentPage('profile')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'profile' ? 'bg-blue-900 text-white' : 'hover:bg-blue-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
              </nav>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                {/* Notifications Button */}
                <button
                  onClick={() => setShowNotifications(true)}
                  className="relative p-3 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-full hover:shadow-lg transition-all"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 text-white" />
                </button>

                <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-full hover:shadow-lg transition-all"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-lg shadow-inner">
                    {userData?.name?.charAt(0).toUpperCase() || userData?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block text-white text-left">
                    <p className="text-sm font-medium">
                      {userData?.name || userData?.email || 'User'}
                    </p>
                    <p className="text-xs text-blue-200">
                      Traveler
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-white" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {userData?.name?.charAt(0).toUpperCase() || userData?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">
                            {userData?.name || userData?.email || 'User'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {userData?.email || 'Email'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-blue-100 text-blue-900 rounded">
                          Premium
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-900 rounded">Verified</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentPage('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                    >
                      <User className="w-5 h-5 text-blue-900" />
                      <div>
                        <p className="text-gray-900">My Profile</p>
                        <p className="text-xs text-gray-600">View and edit profile</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage('bookings');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                    >
                      <Calendar className="w-5 h-5 text-blue-900" />
                      <div>
                        <p className="text-gray-900">My Bookings</p>
                        <p className="text-xs text-gray-600">Track reservations</p>
                      </div>
                    </button>
                    <div className="border-t border-gray-100 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-3 transition-colors rounded-b-2xl"
                    >
                      <LogOut className="w-5 h-5" />
                      <div>
                        <p>Logout</p>
                        <p className="text-xs">Sign out from your account</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Offline Banner */}
          <OfflineBanner isOffline={isOffline} cachedItemsCount={5} />

          {/* Quick Access Feature Cards - Only on home */}
          {currentPage === 'home' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                <button
                  onClick={() => setCurrentPage('itinerary')}
                  className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all text-left relative overflow-hidden"
                >
                  <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold">AI</div>
                  <Sparkles className="w-8 h-8 mb-2" />
                  <h3>AI Itinerary</h3>
                  <p className="text-xs opacity-90">Smart plans</p>
                </button>
                
                <button
                  onClick={() => setCurrentPage('maps')}
                  className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all text-left relative overflow-hidden"
                >
                  <div className="absolute top-1 right-1 bg-green-400 text-green-900 text-xs px-2 py-0.5 rounded-full font-bold">NEW</div>
                  <Navigation className="w-8 h-8 mb-2" />
                  <h3>Maps</h3>
                  <p className="text-xs opacity-90">Explore locations</p>
                </button>
                
                <button
                  onClick={() => setCurrentPage('flights')}
                  className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all text-left relative overflow-hidden"
                >
                  <div className="absolute top-1 right-1 bg-orange-400 text-orange-900 text-xs px-2 py-0.5 rounded-full font-bold">HOT</div>
                  <Plane className="w-8 h-8 mb-2" />
                  <h3>Flights & Trains</h3>
                  <p className="text-xs opacity-90">Book transport</p>
                </button>
                
                <button
                  onClick={() => setCurrentPage('photos')}
                  className="bg-gradient-to-br from-pink-600 to-rose-600 text-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all text-left relative overflow-hidden"
                >
                  <Camera className="w-8 h-8 mb-2" />
                  <h3>Photo Gallery</h3>
                  <p className="text-xs opacity-90">Share moments</p>
                </button>
                
                <button
                  onClick={() => setCurrentPage('carpool')}
                  className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-left"
                >
                  <Car className="w-8 h-8 text-orange-600 mb-2" />
                  <h3 className="text-gray-900">Carpool</h3>
                  <p className="text-xs text-gray-600">Share rides</p>
                </button>
                
                <button
                  onClick={() => setCurrentPage('expenses')}
                  className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-left"
                >
                  <DollarSign className="w-8 h-8 text-green-600 mb-2" />
                  <h3 className="text-gray-900">Expenses</h3>
                  <p className="text-xs text-gray-600">Track spending</p>
                </button>
                
                <button
                  onClick={() => setCurrentPage('checklist')}
                  className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-left"
                >
                  <CheckSquare className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="text-gray-900">Checklist</h3>
                  <p className="text-xs text-gray-600">Pack smart</p>
                </button>
                
                <button
                  onClick={() => setCurrentPage('translator')}
                  className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-left"
                >
                  <Languages className="w-8 h-8 text-purple-600 mb-2" />
                  <h3 className="text-gray-900">Translator</h3>
                  <p className="text-xs text-gray-600">Communicate</p>
                </button>

                <button
                  onClick={() => setCurrentPage('feedback')}
                  className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-left"
                >
                  <Star className="w-8 h-8 text-yellow-600 mb-2" />
                  <h3 className="text-gray-900">Feedback</h3>
                  <p className="text-xs text-gray-600">Rate & review</p>
                </button>
              </div>
            </>
          )}

          {currentPage === 'home' && (
            <EnhancedDestinationsList onDestinationSelect={handleDestinationSelect} />
          )}
          
          {currentPage === 'destination' && selectedDestination && (
            <EnhancedDestinationDetail 
              destinationId={selectedDestination} 
              onBack={handleBackToHome}
            />
          )}
          
          {currentPage === 'buddy' && <MassiveTravelBuddyFinder onBack={handleBackToHome} />}
          
          {currentPage === 'carpool' && <MassiveCarpoolFinder onBack={handleBackToHome} />}
          
          {currentPage === 'expenses' && <ExpenseTracker onBack={handleBackToHome} />}
          
          {currentPage === 'checklist' && <TravelChecklist onBack={handleBackToHome} />}
          
          {currentPage === 'translator' && <FullSentenceTranslator onBack={handleBackToHome} />}
          
          {currentPage === 'bookings' && <BookingsManager onBack={handleBackToHome} />}
          
          {currentPage === 'emergency' && <EmergencyMode isOffline={isOffline} onBack={handleBackToHome} />}
          
          {currentPage === 'profile' && <UserProfile onBack={handleBackToHome} />}

          {currentPage === 'feedback' && <WorldClassReviewSystem onBack={handleBackToHome} />}
          
          {currentPage === 'itinerary' && <EnhancedAIItineraryPlanner onBack={handleBackToHome} />}
          
          {currentPage === 'trip-planner' && <TripPlannerAI onBack={handleBackToHome} />}
          
          {currentPage === 'maps' && <WorldClassGoogleMaps onBack={handleBackToHome} />}
          
          {currentPage === 'notifications' && <InAppNotifications onClose={() => setShowNotifications(false)} />}
          
          {currentPage === 'photos' && <WorldClassPhotoGallery onBack={handleBackToHome} />}
          
          {currentPage === 'flights' && <WorldClassFlightTrainBooking onBack={handleBackToHome} />}
        </main>

        {/* Floating Chat Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 bg-blue-900 text-white p-4 rounded-full shadow-lg hover:bg-blue-950 transition-all z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>

        {/* ChatBot */}
        {isChatOpen && (
          <div className="fixed bottom-24 right-6 z-50">
            <ChatBot onClose={() => setIsChatOpen(false)} />
          </div>
        )}

        {/* FLOATING SOS EMERGENCY BUTTON - CRITICAL SAFETY FEATURE */}
        <button
          onClick={() => setIsSOSOpen(true)}
          className="fixed bottom-24 left-6 bg-red-600 text-white p-5 rounded-full shadow-2xl hover:bg-red-700 transition-all z-50 animate-pulse group"
          title="Emergency SOS"
        >
          <Shield className="w-7 h-7" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Emergency SOS
          </span>
        </button>

        {/* SOS Emergency Modal */}
        {isSOSOpen && (
          <EnhancedSOSEmergency onClose={() => setIsSOSOpen(false)} />
        )}

        {/* Floating Currency Converter Button */}
        <button
          onClick={() => setIsCurrencyConverterOpen(!isCurrencyConverterOpen)}
          className="fixed bottom-6 left-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all z-50 group"
          title="Currency Converter"
        >
          <ArrowRightLeft className="w-6 h-6" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Currency Converter
          </span>
        </button>

        {/* Currency Converter Modal */}
        {isCurrencyConverterOpen && (
          <CurrencyConverter 
            onClose={() => setIsCurrencyConverterOpen(false)}
            onGoToExpenses={() => {
              setIsCurrencyConverterOpen(false);
              setCurrentPage('expenses');
            }}
          />
        )}

        {/* In-App Notifications */}
        {showNotifications && (
          <InAppNotifications onClose={() => setShowNotifications(false)} />
        )}
        
        {/* PWA Install Prompt */}
        <PWAInstaller />
      </div>
    </div>
  );
}