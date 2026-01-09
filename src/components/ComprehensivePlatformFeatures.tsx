import { useState, useEffect } from 'react';
import { 
  Globe, Wifi, MapPin, Heart, ArrowLeftRight, Cloud, Camera, Share2, 
  Gift, Shield, FileText, Download, Users, Bell, Mic, Eye, DollarSign, 
  Phone, Sparkles, ChevronRight, X, Star, Check, Calendar, Clock, ArrowLeft
} from 'lucide-react';

interface ComprehensivePlatformFeaturesProps {
  onBack: () => void;
}

export function ComprehensivePlatformFeatures({ onBack }: ComprehensivePlatformFeaturesProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'ux' | 'social' | 'safety' | 'smart'>('all');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const features = [
    // UX & ACCESSIBILITY
    {
      id: 'multilanguage',
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Hindi, English, Tamil, Telugu, Marathi, Bengali, Gujarati, Kannada, Malayalam',
      category: 'ux',
      status: 'available',
      color: 'blue'
    },
    {
      id: 'offline',
      icon: Wifi,
      title: 'Offline Mode (PWA)',
      description: 'Download bookings, itineraries, maps - works without internet, syncs when online',
      category: 'ux',
      status: 'available',
      color: 'green'
    },
    {
      id: 'accessibility',
      icon: Eye,
      title: 'Accessibility Features',
      description: 'Screen reader support, keyboard navigation, high contrast mode, text-to-speech',
      category: 'ux',
      status: 'available',
      color: 'purple'
    },
    {
      id: 'voice',
      icon: Mic,
      title: 'Voice Search & Commands',
      description: 'Search by voice: "Find hotels in Delhi under 2000", "Book carpool to Goa"',
      category: 'smart',
      status: 'available',
      color: 'indigo'
    },

    // PERSONALIZATION & SMART FEATURES
    {
      id: 'wishlist',
      icon: Heart,
      title: 'Wishlist & Favorites',
      description: 'Save hotels, drivers, travel buddies, destinations - sync across devices',
      category: 'smart',
      status: 'available',
      color: 'red'
    },
    {
      id: 'comparison',
      icon: ArrowLeftRight,
      title: 'Smart Comparison Tool',
      description: 'Compare 2-3 hotels/drivers side-by-side with AI recommendations',
      category: 'smart',
      status: 'available',
      color: 'orange'
    },
    {
      id: 'ai-recommendations',
      icon: Sparkles,
      title: 'AI Learning & Recommendations',
      description: 'Platform learns your preferences and suggests personalized options over time',
      category: 'smart',
      status: 'available',
      color: 'yellow'
    },
    {
      id: 'price-alerts',
      icon: Bell,
      title: 'Price Drop Alerts',
      description: 'Get notified when saved hotel prices drop or carpool seats become available',
      category: 'smart',
      status: 'available',
      color: 'cyan'
    },

    // REAL-TIME & LOCATION
    {
      id: 'live-tracking',
      icon: MapPin,
      title: 'Live Location Tracking',
      description: 'Real-time GPS tracking for carpools, share live location with emergency contacts',
      category: 'safety',
      status: 'available',
      color: 'teal'
    },
    {
      id: 'weather',
      icon: Cloud,
      title: 'Weather Integration',
      description: 'Real-time weather forecasts for all destinations, 7-day predictions',
      category: 'smart',
      status: 'available',
      color: 'sky'
    },

    // SOCIAL & SHARING
    {
      id: 'photo-gallery',
      icon: Camera,
      title: 'Trip Photo Gallery',
      description: 'Upload and share trip photos, create albums, tag travel buddies',
      category: 'social',
      status: 'available',
      color: 'pink'
    },
    {
      id: 'trip-sharing',
      icon: Share2,
      title: 'Trip Sharing',
      description: 'Share itinerary on WhatsApp, Instagram, Facebook with beautiful cards',
      category: 'social',
      status: 'available',
      color: 'violet'
    },
    {
      id: 'referral',
      icon: Gift,
      title: 'Referral & Rewards Program',
      description: 'Earn ₹500 for each friend invited, get cashback on bookings',
      category: 'social',
      status: 'available',
      color: 'emerald'
    },
    {
      id: 'group-booking',
      icon: Users,
      title: 'Group Booking Features',
      description: 'Book for multiple people, split payments, group chat for trip planning',
      category: 'social',
      status: 'available',
      color: 'lime'
    },

    // SAFETY & DOCUMENTATION
    {
      id: 'insurance',
      icon: Shield,
      title: 'Travel Insurance Integration',
      description: 'Book comprehensive travel insurance from ₹99, covers medical, cancellation',
      category: 'safety',
      status: 'available',
      color: 'slate'
    },
    {
      id: 'documents',
      icon: FileText,
      title: 'Smart Document Checklist',
      description: 'Never forget ID, tickets, bookings - AI reminds you before departure',
      category: 'safety',
      status: 'available',
      color: 'amber'
    },
    {
      id: 'emergency-contacts',
      icon: Phone,
      title: 'Local Emergency Database',
      description: 'Police, hospital, embassy contacts for every city - one-tap calling',
      category: 'safety',
      status: 'available',
      color: 'rose'
    },

    // EXPORT & PRODUCTIVITY
    {
      id: 'export',
      icon: Download,
      title: 'Export & Download Features',
      description: 'Download itinerary as PDF, email booking confirmations, save offline',
      category: 'ux',
      status: 'available',
      color: 'fuchsia'
    },
    {
      id: 'currency',
      icon: DollarSign,
      title: 'Currency Converter',
      description: 'For international tourists - convert USD, EUR, GBP to INR in real-time',
      category: 'ux',
      status: 'available',
      color: 'stone'
    },
    {
      id: 'live-support',
      icon: Phone,
      title: 'Live Chat Support 24/7',
      description: 'Customer service chat in Hindi & English, 2-minute average response time',
      category: 'safety',
      status: 'available',
      color: 'zinc'
    }
  ];

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(f => f.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Features', count: features.length },
    { id: 'smart', label: 'Smart & AI', count: features.filter(f => f.category === 'smart').length },
    { id: 'social', label: 'Social & Sharing', count: features.filter(f => f.category === 'social').length },
    { id: 'safety', label: 'Safety & Support', count: features.filter(f => f.category === 'safety').length },
    { id: 'ux', label: 'UX & Accessibility', count: features.filter(f => f.category === 'ux').length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-10 h-10" />
          <h2 className="text-4xl font-bold">20 World-Class Features</h2>
        </div>
        <p className="text-purple-200 text-lg">
          Production-grade features that make this the most advanced tourism platform in India
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <span className="text-2xl font-bold">{features.length}</span>
            <span className="ml-2 text-purple-200">Total Features</span>
          </div>
          <div className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <span className="text-2xl font-bold">{features.filter(f => f.status === 'available').length}</span>
            <span className="ml-2 text-purple-200">Available Now</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-purple-900 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
            }`}
          >
            {cat.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeCategory === cat.id
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.id}
              onClick={() => setSelectedFeature(feature.id)}
              className={`bg-white rounded-2xl p-6 border-2 border-${feature.color}-100 hover:border-${feature.color}-400 hover:shadow-xl transition-all group text-left relative overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${feature.color}-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                
                <h3 className="font-bold mb-2 text-gray-900 group-hover:text-purple-900 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {feature.description}
                </p>
                
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    feature.status === 'available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {feature.status === 'available' ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Available
                      </span>
                    ) : (
                      'Coming Soon'
                    )}
                  </span>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-purple-100">
        <h3 className="font-bold text-xl mb-4 text-gray-900">Platform Capabilities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-purple-100">
            <Globe className="w-6 h-6 text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">9</div>
            <div className="text-sm text-gray-600">Languages</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-purple-100">
            <Shield className="w-6 h-6 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">24/7</div>
            <div className="text-sm text-gray-600">Support</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-purple-100">
            <MapPin className="w-6 h-6 text-red-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">Live</div>
            <div className="text-sm text-gray-600">GPS Tracking</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-purple-100">
            <Sparkles className="w-6 h-6 text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">AI</div>
            <div className="text-sm text-gray-600">Powered</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual Feature Detail Components

export function MultiLanguageSupport() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', speakers: '125M+' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳', speakers: '550M+' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', speakers: '75M+' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', speakers: '80M+' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳', speakers: '85M+' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳', speakers: '265M+' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳', speakers: '55M+' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', speakers: '45M+' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', speakers: '38M+' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Globe className="w-8 h-8 text-blue-600" />
        Multi-Language Support
      </h3>
      <p className="text-gray-600 mb-6">
        Experience the platform in your preferred language. All features, notifications, and support available in 9 Indian languages.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => setSelectedLanguage(lang.code)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedLanguage === lang.code
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{lang.flag}</span>
              {selectedLanguage === lang.code && (
                <Check className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="font-bold text-lg">{lang.native}</div>
            <div className="text-sm text-gray-600">{lang.name}</div>
            <div className="text-xs text-gray-500 mt-1">{lang.speakers} speakers</div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="font-bold mb-2">What's Translated:</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            All UI elements, buttons, and labels
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            Hotel descriptions, destination info
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            Chat messages and notifications
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            Customer support in your language
          </li>
        </ul>
      </div>
    </div>
  );
}

export function WishlistFavorites() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistItems(saved);
  }, []);

  const categories = [
    { id: 'hotels', label: 'Hotels', icon: '🏨', count: wishlistItems.filter(i => i.type === 'hotel').length },
    { id: 'destinations', label: 'Destinations', icon: '🗺️', count: wishlistItems.filter(i => i.type === 'destination').length },
    { id: 'drivers', label: 'Drivers', icon: '🚗', count: wishlistItems.filter(i => i.type === 'driver').length },
    { id: 'buddies', label: 'Travel Buddies', icon: '👥', count: wishlistItems.filter(i => i.type === 'buddy').length }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Heart className="w-8 h-8 text-red-600" />
        Wishlist & Favorites
      </h3>
      <p className="text-gray-600 mb-6">
        Save your favorite hotels, destinations, drivers, and travel buddies. Access them anytime, anywhere.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
            <div className="text-3xl mb-2">{cat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{cat.count}</div>
            <div className="text-sm text-gray-600">{cat.label}</div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-xl border border-pink-200">
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-600" />
          Smart Features
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span><strong>Auto-sync</strong> across all your devices</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span><strong>Price alerts</strong> when wishlist items have discounts</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span><strong>Share wishlist</strong> with friends for group planning</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span><strong>Collections</strong> - organize by trip, budget, or theme</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function LiveLocationTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: 28.6139, lng: 77.2090 });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <MapPin className="w-8 h-8 text-red-600" />
        Live Location Tracking
      </h3>
      <p className="text-gray-600 mb-6">
        Real-time GPS tracking for carpools and emergency SOS. Share your live location with family and friends.
      </p>

      <div className="bg-gray-900 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-400">Current Location</div>
            <div className="font-bold text-lg">Delhi, India</div>
          </div>
          <button
            onClick={() => setIsTracking(!isTracking)}
            className={`px-4 py-2 rounded-lg transition-all ${
              isTracking
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Clock className="w-4 h-4" />
          Updated: Just now
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            For Carpools
          </h4>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• Real-time driver location</li>
            <li>• ETA updates every minute</li>
            <li>• Route deviation alerts</li>
            <li>• Share trip with contacts</li>
          </ul>
        </div>

        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            For Emergency SOS
          </h4>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• One-tap SOS activation</li>
            <li>• Auto-share location</li>
            <li>• Alert emergency contacts</li>
            <li>• Contact nearby police/hospital</li>
          </ul>
        </div>
      </div>
    </div>
  );
}