import { useState } from 'react';
import { X, User, Calendar, DollarSign, Heart, Camera, CheckCircle } from 'lucide-react';
import { TravelBuddy, allTravelBuddies } from '../data/properTravelBuddies';
import { globalState } from '../utils/globalState';

interface CreateBuddyProfileProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateBuddyProfile({ onClose, onSuccess }: CreateBuddyProfileProps) {
  const currentUser = globalState.getCurrentUser();
  const [step, setStep] = useState<'form' | 'success'>('form');
  
  // Form state
  const [name, setName] = useState(currentUser?.name || '');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [destination, setDestination] = useState('Goa');
  const [travelDates, setTravelDates] = useState('');
  const [budget, setBudget] = useState('₹10,000-15,000');
  const [interests, setInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState('Explorer');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState<string[]>(['Hindi', 'English']);
  const [hometown, setHometown] = useState('');
  const [lookingFor, setLookingFor] = useState<string[]>([]);

  const availableInterests = [
    'Beach', 'Mountains', 'Adventure', 'Food', 'Photography', 'Culture',
    'Nightlife', 'Nature', 'Trekking', 'Water Sports', 'Shopping', 'Wellness',
    'Yoga', 'Spiritual', 'Camping', 'Biking', 'Party', 'Museums'
  ];

  const availableLanguages = ['Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Bengali', 'Kannada', 'Malayalam', 'Punjabi'];

  const travelStyles = ['Adventure', 'Luxury', 'Budget', 'Explorer', 'Relaxed', 'Party', 'Cultural', 'Spiritual', 'Social'];

  const lookingForOptions = ['Travel Partner', 'Adventure Buddy', 'Room Sharing', 'Split Costs', 'Photography Partner', 'Food Explorer', 'Cultural Exchange', 'Party Buddy'];

  const destinations = ['Goa', 'Manali', 'Jaipur', 'Kerala', 'Ladakh', 'Rishikesh', 'Udaipur', 'Shimla', 'Darjeeling', 'Andaman'];

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const toggleLanguage = (language: string) => {
    if (languages.includes(language)) {
      if (languages.length > 1) {
        setLanguages(languages.filter(l => l !== language));
      }
    } else {
      setLanguages([...languages, language]);
    }
  };

  const toggleLookingFor = (option: string) => {
    if (lookingFor.includes(option)) {
      setLookingFor(lookingFor.filter(o => o !== option));
    } else {
      setLookingFor([...lookingFor, option]);
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!name || !bio || interests.length === 0 || lookingFor.length === 0 || !travelDates || !hometown) {
      alert('Please fill all required fields');
      return;
    }

    // Create new buddy profile
    const newBuddy: TravelBuddy = {
      id: `buddy-${currentUser?.id || Date.now()}`,
      name,
      age: parseInt(age),
      gender,
      avatar: gender === 'Male' 
        ? `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 99)}.jpg`
        : `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 99)}.jpg`,
      destination,
      travelDates,
      budget,
      interests,
      travelStyle,
      bio,
      languages,
      hometown,
      verified: true,
      rating: 5.0,
      tripsCompleted: 0,
      isOnline: true,
      lookingFor
    };

    // Add to global buddies list
    allTravelBuddies.push(newBuddy);
    
    // Save to localStorage for persistence
    localStorage.setItem('myBuddyProfile', JSON.stringify(newBuddy));

    setStep('success');
    
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-fadeIn">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Profile Created!</h2>
          <p className="text-gray-600 mb-2">Your travel buddy profile is now live</p>
          <p className="text-sm text-gray-500">
            Other travelers can now see your profile and connect with you!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-8 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Create Your Travel Buddy Profile</h2>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-blue-100 text-sm">Let others find you as their perfect travel companion!</p>
        </div>

        {/* Form */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="18"
                  max="80"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hometown *</label>
                <input
                  type="text"
                  value={hometown}
                  onChange={(e) => setHometown(e.target.value)}
                  placeholder="e.g., Mumbai"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself and what kind of travel companion you're looking for..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
              />
            </div>
          </div>

          {/* Travel Details */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Travel Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
                >
                  {destinations.map(dest => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travel Dates *</label>
                <input
                  type="text"
                  value={travelDates}
                  onChange={(e) => setTravelDates(e.target.value)}
                  placeholder="e.g., 15 Jan - 20 Jan"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
                >
                  <option value="₹5,000-10,000">₹5,000-10,000</option>
                  <option value="₹10,000-15,000">₹10,000-15,000</option>
                  <option value="₹15,000-20,000">₹15,000-20,000</option>
                  <option value="₹20,000-30,000">₹20,000-30,000</option>
                  <option value="₹30,000+">₹30,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travel Style *</label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
                >
                  {travelStyles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Interests * (Select at least 1)</label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    interests.includes(interest)
                      ? 'bg-blue-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken *</label>
            <div className="flex flex-wrap gap-2">
              {availableLanguages.map(language => (
                <button
                  key={language}
                  onClick={() => toggleLanguage(language)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    languages.includes(language)
                      ? 'bg-blue-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          {/* Looking For */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Looking For * (Select at least 1)</label>
            <div className="flex flex-wrap gap-2">
              {lookingForOptions.map(option => (
                <button
                  key={option}
                  onClick={() => toggleLookingFor(option)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    lookingFor.includes(option)
                      ? 'bg-blue-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl hover:shadow-2xl transition-all text-lg font-bold"
          >
            Create My Profile
          </button>
        </div>
      </div>
    </div>
  );
}
