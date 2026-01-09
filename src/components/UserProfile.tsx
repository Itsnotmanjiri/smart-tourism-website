import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit2, 
  Save, 
  X,
  Camera,
  Globe,
  Heart,
  Clock,
  CheckCircle,
  Award,
  TrendingUp,
  Target,
  Users,
  Plane,
  Star,
  ArrowLeft,
  Settings,
  Shield,
  Bell,
  CreditCard,
  Map
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getUserProfile, createOrUpdateUserProfile } from '../utils/supabase-api';
import { NatureBackground, FloatingGradientCard, AnimatedButton, GlassCard } from './ui/GlassCard';

interface UserData {
  name: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth: string;
  nationality: string;
  bio: string;
  interests: string[];
  profileImage: string;
}

interface Booking {
  id: string;
  hostelName: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'upcoming' | 'completed';
}

interface UserProfileProps {
  onBack: () => void;
}

export function UserProfile({ onBack }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'bookings' | 'preferences'>('details');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    nationality: '',
    bio: '',
    interests: [],
    profileImage: 'https://i.pravatar.cc/300?img=68'
  });

  const [editedData, setEditedData] = useState(userData);

  // Load user ID and fetch profile
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const storedCurrentUser = localStorage.getItem('currentUser');
    
    if (storedUserData) {
      const parsed = JSON.parse(storedUserData);
      const userEmail = parsed.email;
      const userName = parsed.name || 'Travel Enthusiast';
      // Use email as userId for now
      setUserId(userEmail);
      loadProfile(userEmail, userName);
    } else if (storedCurrentUser) {
      const parsed = JSON.parse(storedCurrentUser);
      const userEmail = parsed.email;
      const userName = parsed.name || 'Travel Enthusiast';
      setUserId(userEmail);
      loadProfile(userEmail, userName);
    } else {
      setLoading(false);
    }
  }, []);

  const loadProfile = async (email: string, name: string) => {
    try {
      const result = await getUserProfile(email);
      
      if (result.success && result.data) {
        const profile = {
          name: result.data.name || name || 'Travel Enthusiast',
          email: result.data.email || email,
          phone: result.data.phone || '+91 98765 43210',
          location: result.data.preferences?.location || 'Mumbai, India',
          dateOfBirth: result.data.preferences?.dateOfBirth || '1995-06-15',
          nationality: result.data.preferences?.nationality || 'Indian',
          bio: result.data.preferences?.bio || 'Passionate traveler exploring the incredible beauty of India! 🇮🇳 Love discovering hidden gems, trying local cuisines, and meeting amazing people along the way.',
          interests: result.data.preferences?.interests || ['Travel', 'Photography', 'Food', 'Culture', 'Adventure', 'Nature'],
          profileImage: result.data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=1e40af&color=fff&size=128`
        };
        setUserData(profile);
        setEditedData(profile);
      } else {
        // Profile doesn't exist yet, use defaults with email
        const defaultProfile = {
          name: name || 'Travel Enthusiast',
          email: email,
          phone: '+91 98765 43210',
          location: 'Mumbai, India',
          dateOfBirth: '1995-06-15',
          nationality: 'Indian',
          bio: 'Passionate traveler exploring the incredible beauty of India! 🇮🇳 Love discovering hidden gems, trying local cuisines, and meeting amazing people along the way.',
          interests: ['Travel', 'Photography', 'Food', 'Culture', 'Adventure', 'Nature'],
          profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=1e40af&color=fff&size=128`
        };
        setUserData(defaultProfile);
        setEditedData(defaultProfile);
        // Save default profile
        await saveProfile(email, defaultProfile);
      }
    } catch (error: any) {
      // Only log errors that aren't about missing tables
      if (error?.code !== 'PGRST205' && !error?.message?.includes('Could not find the table')) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      }
      // Still set default data on error
      const defaultProfile = {
        name: name || 'Travel Enthusiast',
        email: email,
        phone: '+91 98765 43210',
        location: 'Mumbai, India',
        dateOfBirth: '1995-06-15',
        nationality: 'Indian',
        bio: 'Passionate traveler exploring the incredible beauty of India! 🇮🇳 Love discovering hidden gems, trying local cuisines, and meeting amazing people along the way.',
        interests: ['Travel', 'Photography', 'Food', 'Culture', 'Adventure', 'Nature'],
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=1e40af&color=fff&size=128`
      };
      setUserData(defaultProfile);
      setEditedData(defaultProfile);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (email: string, profileData: UserData) => {
    try {
      const result = await createOrUpdateUserProfile(email, {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        avatar_url: profileData.profileImage,
        preferences: {
          location: profileData.location,
          dateOfBirth: profileData.dateOfBirth,
          nationality: profileData.nationality,
          bio: profileData.bio,
          interests: profileData.interests
        }
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save profile');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };

  const bookingHistory: Booking[] = [
    {
      id: '1',
      hostelName: 'Taj Hotel Mumbai',
      destination: 'Mumbai, India',
      checkIn: '2025-01-20',
      checkOut: '2025-01-25',
      guests: 2,
      totalPrice: 15000,
      status: 'upcoming'
    },
    {
      id: '2',
      hostelName: 'The Oberoi Delhi',
      destination: 'Delhi, India',
      checkIn: '2024-12-01',
      checkOut: '2024-12-08',
      guests: 1,
      totalPrice: 25000,
      status: 'completed'
    },
    {
      id: '3',
      hostelName: 'Taj Exotica Goa',
      destination: 'Goa, India',
      checkIn: '2025-02-10',
      checkOut: '2025-02-15',
      guests: 3,
      totalPrice: 28000,
      status: 'confirmed'
    },
    {
      id: '4',
      hostelName: 'ITC Grand Chola Chennai',
      destination: 'Chennai, India',
      checkIn: '2024-11-15',
      checkOut: '2024-11-20',
      guests: 2,
      totalPrice: 22000,
      status: 'completed'
    },
    {
      id: '5',
      hostelName: 'Leela Palace Bangalore',
      destination: 'Bangalore, India',
      checkIn: '2025-03-05',
      checkOut: '2025-03-10',
      guests: 1,
      totalPrice: 18500,
      status: 'confirmed'
    }
  ];

  const savedDestinations = ['Mumbai', 'Goa', 'Jaipur', 'Kerala', 'Delhi', 'Udaipur', 'Varanasi', 'Rishikesh'];

  const handleSave = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      await saveProfile(userId, editedData);
      setUserData(editedData);
      
      // CRITICAL FIX: Update localStorage to persist changes
      const storedUserData = localStorage.getItem('userData');
      const storedCurrentUser = localStorage.getItem('currentUser');
      
      if (storedUserData) {
        const parsed = JSON.parse(storedUserData);
        const updated = {
          ...parsed,
          name: editedData.name,
          email: editedData.email,
          phone: editedData.phone,
          location: editedData.location,
          dateOfBirth: editedData.dateOfBirth,
          nationality: editedData.nationality,
          bio: editedData.bio,
          interests: editedData.interests,
          profileImage: editedData.profileImage
        };
        localStorage.setItem('userData', JSON.stringify(updated));
      }
      
      if (storedCurrentUser) {
        const parsed = JSON.parse(storedCurrentUser);
        const updated = {
          ...parsed,
          name: editedData.name,
          email: editedData.email,
          phone: editedData.phone,
          location: editedData.location,
          dateOfBirth: editedData.dateOfBirth,
          nationality: editedData.nationality,
          bio: editedData.bio,
          interests: editedData.interests,
          profileImage: editedData.profileImage
        };
        localStorage.setItem('currentUser', JSON.stringify(updated));
      }
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const handleImageChange = () => {
    // Simulate image upload
    const randomNum = Math.floor(Math.random() * 70);
    const newImage = `https://i.pravatar.cc/300?img=${randomNum}`;
    setEditedData({ ...editedData, profileImage: newImage });
  };

  if (loading) {
    return (
      <NatureBackground
        imageUrl="https://images.unsplash.com/photo-1561987570-26d2f7f93fe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0cyUyMGF1cm9yYSUyMHNreXxlbnwxfHx8fDE3Njc1MjY1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080"
        overlay="dark"
      >
        <div className="flex items-center justify-center min-h-screen">
          <FloatingGradientCard className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-700">Loading your profile...</p>
          </FloatingGradientCard>
        </div>
      </NatureBackground>
    );
  }

  return (
    <NatureBackground
      imageUrl="https://images.unsplash.com/photo-1561987570-26d2f7f93fe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0cyUyMGF1cm9yYSUyMHNreXxlbnwxfHx8fDE3Njc1MjY1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080"
      overlay="dark"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatedButton
          onClick={onBack}
          variant="secondary"
          icon={<ArrowLeft className="w-5 h-5" />}
          className="mb-6"
        >
          Back to Home
        </AnimatedButton>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <FloatingGradientCard>
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-6">
                  <div className="relative">
                    <img
                      src={isEditing ? editedData.profileImage : userData.profileImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                    />
                    {isEditing && (
                      <button
                        onClick={handleImageChange}
                        className="absolute bottom-0 right-0 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:scale-110 transition-all shadow-xl"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl mb-2 bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
                  {userData.name}
                </h3>
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{userData.location}</span>
                </div>
                <p className="text-gray-600 mb-6 italic">{userData.bio}</p>

                {!isEditing ? (
                  <AnimatedButton
                    onClick={() => setIsEditing(true)}
                    variant="primary"
                    icon={<Edit2 className="w-4 h-4" />}
                    className="w-full"
                  >
                    Edit Profile
                  </AnimatedButton>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <AnimatedButton
                      onClick={handleSave}
                      variant="success"
                      icon={<Save className="w-4 h-4" />}
                    >
                      Save
                    </AnimatedButton>
                    <AnimatedButton
                      onClick={handleCancel}
                      variant="danger"
                      icon={<X className="w-4 h-4" />}
                    >
                      Cancel
                    </AnimatedButton>
                  </div>
                )}
              </div>
            </FloatingGradientCard>

            {/* Stats Card */}
            <FloatingGradientCard>
              <h4 className="text-xl mb-4 bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
                Travel Stats
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Trips</p>
                      <p className="text-2xl text-blue-900">12</p>
                    </div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Map className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Countries</p>
                      <p className="text-2xl text-purple-900">8</p>
                    </div>
                  </div>
                  <Award className="w-5 h-5 text-purple-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Buddies</p>
                      <p className="text-2xl text-pink-900">23</p>
                    </div>
                  </div>
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="text-2xl text-orange-900">4.9</p>
                    </div>
                  </div>
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </FloatingGradientCard>

            {/* Achievements */}
            <FloatingGradientCard>
              <h4 className="text-xl mb-4 bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
                Achievements
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="text-xs text-gray-600">Top Traveler</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                  <div className="text-3xl mb-2">⭐</div>
                  <p className="text-xs text-gray-600">Super Host</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="text-xs text-gray-600">Explorer</p>
                </div>
              </div>
            </FloatingGradientCard>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <FloatingGradientCard className="!p-0 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 bg-white/50">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 py-4 px-6 transition-all relative ${
                    activeTab === 'details'
                      ? 'text-blue-900'
                      : 'text-gray-600 hover:text-blue-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <User className="w-5 h-5" />
                    <span>Personal Details</span>
                  </div>
                  {activeTab === 'details' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`flex-1 py-4 px-6 transition-all relative ${
                    activeTab === 'bookings'
                      ? 'text-blue-900'
                      : 'text-gray-600 hover:text-blue-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span>My Bookings</span>
                  </div>
                  {activeTab === 'bookings' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`flex-1 py-4 px-6 transition-all relative ${
                    activeTab === 'preferences'
                      ? 'text-blue-900'
                      : 'text-gray-600 hover:text-blue-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Settings className="w-5 h-5" />
                    <span>Preferences</span>
                  </div>
                  {activeTab === 'preferences' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  )}
                </button>
              </div>

              {/* Personal Details Tab */}
              {activeTab === 'details' && (
                <div className="p-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedData.name}
                            onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-gray-900">
                            {userData.name}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editedData.email}
                            onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-gray-900">
                            {userData.email}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editedData.phone}
                            onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-gray-900">
                            {userData.phone}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Location
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedData.location}
                            onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-gray-900">
                            {userData.location}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date of Birth
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editedData.dateOfBirth}
                            onChange={(e) => setEditedData({ ...editedData, dateOfBirth: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-gray-900">
                            {new Date(userData.dateOfBirth).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Nationality
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedData.nationality}
                            onChange={(e) => setEditedData({ ...editedData, nationality: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-gray-900">
                            {userData.nationality}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Bio</label>
                      {isEditing ? (
                        <textarea
                          value={editedData.bio}
                          onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-gray-900">
                          {userData.bio}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-3">Interests</label>
                      <div className="flex flex-wrap gap-3">
                        {userData.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div className="p-8">
                  <h3 className="text-2xl mb-6 bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
                    Booking History
                  </h3>
                  <div className="space-y-4">
                    {bookingHistory.map((booking) => (
                      <div
                        key={booking.id}
                        className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:border-blue-600 transition-all bg-gradient-to-r from-white to-blue-50/30"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl mb-2 text-gray-900">{booking.hostelName}</h4>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.destination}</span>
                            </div>
                          </div>
                          <span
                            className={`px-4 py-2 rounded-xl shadow-md ${
                              booking.status === 'upcoming'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                : booking.status === 'confirmed'
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                            }`}
                          >
                            {booking.status === 'upcoming' && <Clock className="w-4 h-4 inline mr-1" />}
                            {booking.status === 'confirmed' && <CheckCircle className="w-4 h-4 inline mr-1" />}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="bg-blue-50 p-3 rounded-xl">
                            <p className="text-xs text-gray-600 mb-1">Check-in</p>
                            <p className="text-gray-900">
                              {new Date(booking.checkIn).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-xl">
                            <p className="text-xs text-gray-600 mb-1">Check-out</p>
                            <p className="text-gray-900">
                              {new Date(booking.checkOut).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="bg-pink-50 p-3 rounded-xl">
                            <p className="text-xs text-gray-600 mb-1">Guests</p>
                            <p className="text-gray-900">{booking.guests}</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-xl">
                            <p className="text-xs text-gray-600 mb-1">Total</p>
                            <p className="text-blue-900">₹{booking.totalPrice.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="p-8">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl mb-4 flex items-center gap-2 bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
                        <Heart className="w-6 h-6 text-pink-600" />
                        Saved Destinations
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {savedDestinations.map((destination, index) => (
                          <div
                            key={index}
                            className="p-5 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl text-center hover:scale-105 transition-all cursor-pointer shadow-lg"
                          >
                            <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-3" />
                            <p className="text-gray-900">{destination}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl mb-4 flex items-center gap-2 bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
                        <Bell className="w-6 h-6 text-orange-600" />
                        Notification Settings
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Email Notifications', checked: true },
                          { label: 'Travel Buddy Suggestions', checked: true },
                          { label: 'Special Offers', checked: true },
                          { label: 'Booking Reminders', checked: false }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                            <span className="text-gray-900">{item.label}</span>
                            <label className="relative inline-block w-14 h-7">
                              <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} />
                              <div className="w-full h-full bg-gray-300 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600 transition-all"></div>
                              <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-7 transition-transform shadow-lg"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl mb-4 flex items-center gap-2 bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
                        <Globe className="w-6 h-6 text-green-600" />
                        Language & Currency
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Preferred Language</label>
                          <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white">
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Currency</label>
                          <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white">
                            <option>INR (₹)</option>
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                            <option>JPY (¥)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </FloatingGradientCard>
          </div>
        </div>
      </div>
    </NatureBackground>
  );
}