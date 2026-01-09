import { useState } from 'react';
import { User, MapPin, Calendar, Globe, Heart, Camera, Briefcase, Coffee, Mountain, Plane, DollarSign, Users, Music, Book, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { NatureBackground, FloatingGradientCard, AnimatedButton } from './ui/GlassCard';

interface ProfileData {
  // Step 1: Basic Info
  name: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  location: string;
  nationality: string;
  profileImage: string;
  
  // Step 2: Travel Preferences
  travelStyle: string[];
  budgetRange: string;
  preferredDestinations: string[];
  travelFrequency: string;
  
  // Step 3: Interests & Personality
  interests: string[];
  languages: string[];
  smokingPreference: string;
  drinkingPreference: string;
  
  // Step 4: Social Matching
  bio: string;
  lookingFor: string[];
  ageRangePreference: string;
  genderPreference: string;
}

interface ProfileCreationOnboardingProps {
  userEmail: string;
  userName: string;
  onComplete: (profileData: ProfileData) => void;
}

export function ProfileCreationOnboarding({ userEmail, userName, onComplete }: ProfileCreationOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: userName,
    dateOfBirth: '',
    gender: '',
    phone: '',
    location: '',
    nationality: 'Indian',
    profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=1e40af&color=fff&size=256`,
    
    travelStyle: [],
    budgetRange: '',
    preferredDestinations: [],
    travelFrequency: '',
    
    interests: [],
    languages: [],
    smokingPreference: '',
    drinkingPreference: '',
    
    bio: '',
    lookingFor: [],
    ageRangePreference: '',
    genderPreference: 'anyone'
  });

  const travelStyles = [
    { value: 'adventure', label: 'Adventure Seeker', icon: '🏔️' },
    { value: 'luxury', label: 'Luxury Traveler', icon: '✨' },
    { value: 'budget', label: 'Budget Explorer', icon: '🎒' },
    { value: 'cultural', label: 'Cultural Explorer', icon: '🏛️' },
    { value: 'beach', label: 'Beach Lover', icon: '🏖️' },
    { value: 'foodie', label: 'Food Explorer', icon: '🍜' },
    { value: 'party', label: 'Party & Nightlife', icon: '🎉' },
    { value: 'spiritual', label: 'Spiritual Journey', icon: '🕉️' }
  ];

  const interestsList = [
    { value: 'photography', label: 'Photography', icon: '📸' },
    { value: 'hiking', label: 'Hiking', icon: '🥾' },
    { value: 'food', label: 'Food & Cuisine', icon: '🍽️' },
    { value: 'yoga', label: 'Yoga & Wellness', icon: '🧘' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'music', label: 'Music & Concerts', icon: '🎵' },
    { value: 'history', label: 'History & Museums', icon: '🏛️' },
    { value: 'wildlife', label: 'Wildlife & Safari', icon: '🦁' },
    { value: 'sports', label: 'Sports & Adventure', icon: '⚽' },
    { value: 'art', label: 'Art & Culture', icon: '🎨' },
    { value: 'meditation', label: 'Meditation', icon: '🕉️' },
    { value: 'nightlife', label: 'Nightlife', icon: '🌃' }
  ];

  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Goa', 'Kerala', 'Udaipur',
    'Varanasi', 'Rishikesh', 'Shimla', 'Manali', 'Darjeeling', 'Ooty'
  ];

  const languages = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam',
    'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Spanish', 'French'
  ];

  const lookingForOptions = [
    { value: 'travel-buddy', label: 'Travel Buddy', icon: '👥' },
    { value: 'tour-guide', label: 'Local Guide', icon: '🗺️' },
    { value: 'carpool', label: 'Carpool Partner', icon: '🚗' },
    { value: 'activity-partner', label: 'Activity Partner', icon: '🎯' },
    { value: 'group', label: 'Travel Group', icon: '👨‍👩‍👧‍👦' },
    { value: 'friend', label: 'Make Friends', icon: '🤝' }
  ];

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const handleNext = () => {
    // Validation
    if (currentStep === 1) {
      if (!profileData.name || !profileData.dateOfBirth || !profileData.gender || !profileData.phone || !profileData.location) {
        toast.error('Please fill all required fields');
        return;
      }
    } else if (currentStep === 2) {
      if (profileData.travelStyle.length === 0 || !profileData.budgetRange || profileData.preferredDestinations.length === 0) {
        toast.error('Please complete your travel preferences');
        return;
      }
    } else if (currentStep === 3) {
      if (profileData.interests.length === 0 || profileData.languages.length === 0) {
        toast.error('Please select at least one interest and language');
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      if (!profileData.bio || profileData.lookingFor.length === 0) {
        toast.error('Please complete your profile');
        return;
      }
      onComplete(profileData);
    }
  };

  const handleImageChange = () => {
    const randomNum = Math.floor(Math.random() * 70);
    const newImage = `https://i.pravatar.cc/300?img=${randomNum}`;
    setProfileData({ ...profileData, profileImage: newImage });
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <NatureBackground
      imageUrl="https://images.unsplash.com/photo-1595368062405-e4d7840cba14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGFkdmVudHVyZSUyMGhpa2luZ3xlbnwxfHx8fDE3Njc0NDM1ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
      overlay="dark"
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <FloatingGradientCard className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-4 shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl mb-2 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
              Complete Your Profile
            </h2>
            <p className="text-gray-600 text-lg">Let's set up your travel profile to find perfect matches!</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-blue-900">{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[500px]">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl mb-6 text-center bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Basic Information
                </h3>

                {/* Profile Photo */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img
                      src={profileData.profileImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                    />
                    <button
                      onClick={handleImageChange}
                      className="absolute bottom-0 right-0 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:scale-110 transition-all shadow-xl"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">Click camera to change photo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Gender *</label>
                    <select
                      value={profileData.gender}
                      onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      City *
                    </label>
                    <select
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
                    >
                      <option value="">Select your city</option>
                      {indianCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={profileData.nationality}
                      onChange={(e) => setProfileData({ ...profileData, nationality: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
                      placeholder="Indian"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Travel Preferences */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <h3 className="text-2xl mb-6 text-center bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Travel Preferences
                </h3>

                <div>
                  <label className="block text-lg mb-4 text-gray-900">What's your travel style? *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {travelStyles.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setProfileData({
                          ...profileData,
                          travelStyle: toggleArrayItem(profileData.travelStyle, style.value)
                        })}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          profileData.travelStyle.includes(style.value)
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 shadow-lg scale-105'
                            : 'bg-white border-gray-200 hover:border-blue-600'
                        }`}
                      >
                        <div className="text-3xl mb-2">{style.icon}</div>
                        <div className="text-sm">{style.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg mb-4 text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Budget Range per Trip *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {['₹5K-15K', '₹15K-30K', '₹30K-60K', '₹60K+'].map((budget) => (
                      <button
                        key={budget}
                        onClick={() => setProfileData({ ...profileData, budgetRange: budget })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          profileData.budgetRange === budget
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-600 shadow-lg'
                            : 'bg-white border-gray-200 hover:border-green-600'
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg mb-4 text-gray-900">Preferred Destinations *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {indianCities.slice(0, 12).map((city) => (
                      <button
                        key={city}
                        onClick={() => setProfileData({
                          ...profileData,
                          preferredDestinations: toggleArrayItem(profileData.preferredDestinations, city)
                        })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          profileData.preferredDestinations.includes(city)
                            ? 'bg-gradient-to-r from-orange-600 to-pink-600 text-white border-orange-600'
                            : 'bg-white border-gray-200 hover:border-orange-600'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg mb-4 text-gray-900">How often do you travel?</label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {['Rarely', 'Few times a year', 'Monthly', 'Weekly'].map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setProfileData({ ...profileData, travelFrequency: freq })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          profileData.travelFrequency === freq
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600 shadow-lg'
                            : 'bg-white border-gray-200 hover:border-purple-600'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Interests */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <h3 className="text-2xl mb-6 text-center bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Interests & Preferences
                </h3>

                <div>
                  <label className="block text-lg mb-4 text-gray-900">What are you interested in? *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {interestsList.map((interest) => (
                      <button
                        key={interest.value}
                        onClick={() => setProfileData({
                          ...profileData,
                          interests: toggleArrayItem(profileData.interests, interest.value)
                        })}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          profileData.interests.includes(interest.value)
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 shadow-lg scale-105'
                            : 'bg-white border-gray-200 hover:border-blue-600'
                        }`}
                      >
                        <div className="text-2xl mb-2">{interest.icon}</div>
                        <div className="text-sm">{interest.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg mb-4 text-gray-900">Languages you speak *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setProfileData({
                          ...profileData,
                          languages: toggleArrayItem(profileData.languages, lang)
                        })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          profileData.languages.includes(lang)
                            ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white border-green-600'
                            : 'bg-white border-gray-200 hover:border-green-600'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg mb-4 text-gray-900">Smoking Preference</label>
                    <div className="space-y-2">
                      {['Non-smoker', 'Occasional', 'Smoker', 'No preference'].map((pref) => (
                        <button
                          key={pref}
                          onClick={() => setProfileData({ ...profileData, smokingPreference: pref })}
                          className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                            profileData.smokingPreference === pref
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600'
                              : 'bg-white border-gray-200 hover:border-blue-600'
                          }`}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg mb-4 text-gray-900">Drinking Preference</label>
                    <div className="space-y-2">
                      {['Non-drinker', 'Social drinker', 'Regular', 'No preference'].map((pref) => (
                        <button
                          key={pref}
                          onClick={() => setProfileData({ ...profileData, drinkingPreference: pref })}
                          className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                            profileData.drinkingPreference === pref
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600'
                              : 'bg-white border-gray-200 hover:border-purple-600'
                          }`}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Social Matching */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <h3 className="text-2xl mb-6 text-center bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Social & Matching Preferences
                </h3>

                <div>
                  <label className="block text-lg mb-4 text-gray-900">Tell us about yourself *</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-all"
                    placeholder="Share your travel experiences, what you love about traveling, and what makes you a great travel buddy! (Min 50 characters)"
                  />
                  <p className="text-sm text-gray-600 mt-2">{profileData.bio.length} / 500 characters</p>
                </div>

                <div>
                  <label className="block text-lg mb-4 text-gray-900">What are you looking for? *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {lookingForOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setProfileData({
                          ...profileData,
                          lookingFor: toggleArrayItem(profileData.lookingFor, option.value)
                        })}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          profileData.lookingFor.includes(option.value)
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 shadow-lg scale-105'
                            : 'bg-white border-gray-200 hover:border-blue-600'
                        }`}
                      >
                        <div className="text-3xl mb-2">{option.icon}</div>
                        <div className="text-sm">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg mb-4 text-gray-900">Preferred Travel Buddy Age Range</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {['18-25', '26-35', '36-45', '46-55', '55+'].map((age) => (
                      <button
                        key={age}
                        onClick={() => setProfileData({ ...profileData, ageRangePreference: age })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          profileData.ageRangePreference === age
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-600'
                            : 'bg-white border-gray-200 hover:border-green-600'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg mb-4 text-gray-900">Gender Preference for Travel Buddy</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['male', 'female', 'anyone'].map((gender) => (
                      <button
                        key={gender}
                        onClick={() => setProfileData({ ...profileData, genderPreference: gender })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          profileData.genderPreference === gender
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600 shadow-lg'
                            : 'bg-white border-gray-200 hover:border-purple-600'
                        }`}
                      >
                        {gender === 'anyone' ? 'Anyone' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <AnimatedButton
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="secondary"
                icon={<ArrowLeft className="w-5 h-5" />}
                className="flex-1"
              >
                Back
              </AnimatedButton>
            )}
            <AnimatedButton
              onClick={handleNext}
              variant="primary"
              icon={currentStep === totalSteps ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              className="flex-1"
            >
              {currentStep === totalSteps ? 'Complete Profile' : 'Next Step'}
            </AnimatedButton>
          </div>
        </FloatingGradientCard>
      </div>
    </NatureBackground>
  );
}
