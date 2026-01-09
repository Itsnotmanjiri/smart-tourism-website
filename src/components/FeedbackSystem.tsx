import { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, Award, Send, Filter, Calendar, User } from 'lucide-react';
import { globalState } from '../utils/globalState';

interface Feedback {
  id: string;
  type: 'hotel' | 'buddy';
  targetId: string;
  targetName: string;
  rating: number;
  cleanliness?: number;
  service?: number;
  value?: number;
  location?: number;
  communication?: number;
  reliability?: number;
  friendliness?: number;
  comment: string;
  date: string;
  userId: string;
  userName: string;
}

export function FeedbackSystem() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'hotel' | 'buddy'>('hotel');
  const [filterType, setFilterType] = useState<'all' | 'hotel' | 'buddy'>('all');
  const [formData, setFormData] = useState({
    targetId: '',
    targetName: '',
    rating: 5,
    cleanliness: 5,
    service: 5,
    value: 5,
    location: 5,
    communication: 5,
    reliability: 5,
    friendliness: 5,
    comment: ''
  });

  // Get completed bookings for hotel feedback
  const [completedBookings, setCompletedBookings] = useState<any[]>([]);
  
  // Get travel buddies for buddy feedback
  const [travelBuddies, setTravelBuddies] = useState<any[]>([]);

  useEffect(() => {
    loadFeedbacks();
    loadCompletedBookings();
    loadTravelBuddies();
  }, []);

  const loadFeedbacks = () => {
    const stored = localStorage.getItem('feedbacks');
    if (stored) {
      setFeedbacks(JSON.parse(stored));
    }
  };

  const loadCompletedBookings = () => {
    const bookings = globalState.getBookings();
    const completed = bookings.filter(b => {
      const checkoutDate = new Date(b.checkOut);
      return checkoutDate < new Date();
    });
    setCompletedBookings(completed);
  };

  const loadTravelBuddies = () => {
    // Load matched buddies from localStorage or use demo data
    const matches = globalState.getMatches();
    
    // Get demo buddies data from localStorage if available
    const storedBuddies = localStorage.getItem('travelBuddies');
    if (storedBuddies) {
      const allBuddies = JSON.parse(storedBuddies);
      // Filter to only matched buddies
      const matchedBuddyIds = matches.map(m => m.buddyId);
      const matched = allBuddies.filter((b: any) => matchedBuddyIds.includes(b.id));
      setTravelBuddies(matched.length > 0 ? matched : allBuddies.slice(0, 5));
    } else {
      // Create demo buddies if none exist
      const demoBuddies = [
        { id: 'buddy-1', name: 'Priya Sharma', destination: 'Goa' },
        { id: 'buddy-2', name: 'Rahul Kumar', destination: 'Manali' },
        { id: 'buddy-3', name: 'Anita Desai', destination: 'Jaipur' },
        { id: 'buddy-4', name: 'Vikram Singh', destination: 'Kerala' },
        { id: 'buddy-5', name: 'Sneha Patel', destination: 'Udaipur' }
      ];
      setTravelBuddies(demoBuddies);
    }
  };

  const handleSubmitFeedback = () => {
    if (!formData.targetName || !formData.comment) {
      alert('Please select a target and provide a comment');
      return;
    }

    const newFeedback: Feedback = {
      id: `feedback-${Date.now()}`,
      type: feedbackType,
      targetId: formData.targetId,
      targetName: formData.targetName,
      rating: formData.rating,
      ...(feedbackType === 'hotel' ? {
        cleanliness: formData.cleanliness,
        service: formData.service,
        value: formData.value,
        location: formData.location
      } : {
        communication: formData.communication,
        reliability: formData.reliability,
        friendliness: formData.friendliness
      }),
      comment: formData.comment,
      date: new Date().toISOString(),
      userId: globalState.getCurrentUser()?.id || 'guest',
      userName: globalState.getCurrentUser()?.name || 'Guest User'
    };

    const updated = [...feedbacks, newFeedback];
    setFeedbacks(updated);
    localStorage.setItem('feedbacks', JSON.stringify(updated));

    // Reset form
    setFormData({
      targetId: '',
      targetName: '',
      rating: 5,
      cleanliness: 5,
      service: 5,
      value: 5,
      location: 5,
      communication: 5,
      reliability: 5,
      friendliness: 5,
      comment: ''
    });
    setShowAddForm(false);
  };

  const renderStars = (rating: number, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange?.(star)}
            className={`${onChange ? 'cursor-pointer' : 'cursor-default'} transition-colors`}
            disabled={!onChange}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const filteredFeedbacks = feedbacks.filter(f => 
    filterType === 'all' ? true : f.type === filterType
  );

  const averageRatingByType = (type: 'hotel' | 'buddy') => {
    const typeFeedbacks = feedbacks.filter(f => f.type === type);
    if (typeFeedbacks.length === 0) return 0;
    const sum = typeFeedbacks.reduce((acc, f) => acc + f.rating, 0);
    return (sum / typeFeedbacks.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl p-6">
        <h2 className="text-2xl mb-2 flex items-center gap-3">
          <Award className="w-8 h-8" />
          Feedback & Reviews
        </h2>
        <p className="text-yellow-100 text-sm">Share your experience with hotels and travel buddies</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700 text-sm">Total Reviews</h3>
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl text-black font-bold">{feedbacks.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700 text-sm">Hotel Avg Rating</h3>
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </div>
          <p className="text-3xl text-black font-bold">{averageRatingByType('hotel') || 'N/A'}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700 text-sm">Buddy Avg Rating</h3>
            <ThumbsUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl text-black font-bold">{averageRatingByType('buddy') || 'N/A'}</p>
        </div>
      </div>

      {/* Add Feedback Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        <Send className="w-5 h-5" />
        Leave a Review
      </button>

      {/* Add Feedback Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-yellow-500">
          <h3 className="text-gray-900 mb-4">Share Your Experience</h3>

          {/* Type Selection */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">Review Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFeedbackType('hotel')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  feedbackType === 'hotel'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-300 hover:border-yellow-300'
                }`}
              >
                <div className="text-2xl mb-1">🏨</div>
                <p className="font-medium text-gray-900">Hotel</p>
              </button>
              <button
                onClick={() => setFeedbackType('buddy')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  feedbackType === 'buddy'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-300 hover:border-yellow-300'
                }`}
              >
                <div className="text-2xl mb-1">👥</div>
                <p className="font-medium text-gray-900">Travel Buddy</p>
              </button>
            </div>
          </div>

          {/* Target Selection */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">
              {feedbackType === 'hotel' ? 'Select Hotel (from past bookings)' : 'Select Travel Buddy'}
            </label>
            {feedbackType === 'hotel' ? (
              <select
                value={formData.targetName}
                onChange={(e) => {
                  const selected = completedBookings.find(b => b.hotelName === e.target.value);
                  setFormData({
                    ...formData,
                    targetId: selected?.id || '',
                    targetName: e.target.value
                  });
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-yellow-500"
              >
                <option value="">Choose a hotel...</option>
                {completedBookings.map((booking) => (
                  <option key={booking.id} value={booking.hotelName}>
                    {booking.hotelName} - {booking.destination}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={formData.targetName}
                onChange={(e) => {
                  const selected = travelBuddies.find(b => b.name === e.target.value);
                  setFormData({
                    ...formData,
                    targetId: selected?.id || '',
                    targetName: e.target.value
                  });
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-yellow-500"
              >
                <option value="">Choose a travel buddy...</option>
                {travelBuddies.map((buddy) => (
                  <option key={buddy.id} value={buddy.name}>
                    {buddy.name} - {buddy.destination}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Overall Rating */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">Overall Rating</label>
            {renderStars(formData.rating, (rating) => setFormData({ ...formData, rating }))}
          </div>

          {/* Detailed Ratings */}
          {feedbackType === 'hotel' ? (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-600 block mb-2">Cleanliness</label>
                {renderStars(formData.cleanliness, (rating) => setFormData({ ...formData, cleanliness: rating }))}
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-2">Service</label>
                {renderStars(formData.service, (rating) => setFormData({ ...formData, service: rating }))}
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-2">Value for Money</label>
                {renderStars(formData.value, (rating) => setFormData({ ...formData, value: rating }))}
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-2">Location</label>
                {renderStars(formData.location, (rating) => setFormData({ ...formData, location: rating }))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-600 block mb-2">Communication</label>
                {renderStars(formData.communication, (rating) => setFormData({ ...formData, communication: rating }))}
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-2">Reliability</label>
                {renderStars(formData.reliability, (rating) => setFormData({ ...formData, reliability: rating }))}
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-2">Friendliness</label>
                {renderStars(formData.friendliness, (rating) => setFormData({ ...formData, friendliness: rating }))}
              </div>
            </div>
          )}

          {/* Comment */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-2">Your Review</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Share your experience in detail..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-yellow-500 h-32 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitFeedback}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({feedbacks.length})
          </button>
          <button
            onClick={() => setFilterType('hotel')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'hotel'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hotels ({feedbacks.filter(f => f.type === 'hotel').length})
          </button>
          <button
            onClick={() => setFilterType('buddy')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'buddy'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Buddies ({feedbacks.filter(f => f.type === 'buddy').length})
          </button>
        </div>
      </div>

      {/* Feedbacks List */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg mb-2">No reviews yet</p>
            <p className="text-sm text-gray-400">Be the first to share your experience!</p>
          </div>
        ) : (
          filteredFeedbacks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-2xl">
                    {feedback.type === 'hotel' ? '🏨' : '👤'}
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-medium">{feedback.targetName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-3 h-3" />
                      {feedback.userName}
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      {new Date(feedback.date).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {renderStars(feedback.rating)}
                  <p className="text-sm text-gray-600 mt-1">{feedback.rating}/5</p>
                </div>
              </div>

              {/* Detailed Ratings */}
              {feedback.type === 'hotel' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 bg-gray-50 p-4 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Cleanliness</p>
                    {renderStars(feedback.cleanliness || 0)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Service</p>
                    {renderStars(feedback.service || 0)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Value</p>
                    {renderStars(feedback.value || 0)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Location</p>
                    {renderStars(feedback.location || 0)}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 mb-4 bg-gray-50 p-4 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Communication</p>
                    {renderStars(feedback.communication || 0)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Reliability</p>
                    {renderStars(feedback.reliability || 0)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Friendliness</p>
                    {renderStars(feedback.friendliness || 0)}
                  </div>
                </div>
              )}

              {/* Comment */}
              <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                <p className="text-gray-700">{feedback.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}