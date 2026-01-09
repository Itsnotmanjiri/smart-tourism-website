import { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, Award, Send, Filter, Calendar, User, TrendingUp, Clock, CheckCircle, Image as ImageIcon, X, Upload, MapPin, Hotel as HotelIcon, Users, Sparkles } from 'lucide-react';
import { globalState } from '../utils/globalState';
import { allHotels as massiveProperHotels } from '../data/massiveProperHotels';
import { allTravelBuddies as massiveProperBuddies } from '../data/massiveProperBuddies';
import { toast } from 'sonner';

interface Review {
  id: string;
  type: 'hotel' | 'buddy';
  targetId: string;
  targetName: string;
  targetLocation?: string;
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
  photos?: string[];
  helpful: number;
  verified: boolean;
}

interface CompletedBooking {
  id: string;
  hotelId: string;
  hotelName: string;
  destination: string;
  checkOut: string;
  hasReview: boolean;
}

interface CompletedBuddyTrip {
  id: string;
  buddyId: string;
  buddyName: string;
  destination: string;
  completedDate: string;
  hasReview: boolean;
}

export function EnhancedFeedbackSystem() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'hotel' | 'buddy'>('hotel');
  const [filterType, setFilterType] = useState<'all' | 'hotel' | 'buddy'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');
  const [completedBookings, setCompletedBookings] = useState<CompletedBooking[]>([]);
  const [completedBuddyTrips, setCompletedBuddyTrips] = useState<CompletedBuddyTrip[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    targetId: '',
    targetName: '',
    targetLocation: '',
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

  useEffect(() => {
    loadReviews();
    loadCompletedBookings();
    loadCompletedBuddyTrips();
  }, []);

  const loadReviews = () => {
    const stored = localStorage.getItem('reviews');
    if (stored) {
      setReviews(JSON.parse(stored));
    }
  };

  const loadCompletedBookings = () => {
    const bookings = globalState.getBookings();
    const now = new Date();
    
    const completed = bookings
      .filter(b => {
        const checkoutDate = new Date(b.checkOut);
        return checkoutDate < now && b.status === 'confirmed';
      })
      .map(b => {
        // Get hotel details from database
        const hotel = massiveProperHotels.find(h => h.id === b.hotelId || h.name === b.hotelName);
        
        return {
          id: b.id,
          hotelId: b.hotelId,
          hotelName: hotel?.name || b.hotelName,
          destination: hotel?.destination || b.destination,
          checkOut: b.checkOut,
          hasReview: false
        };
      });

    // Check which bookings already have reviews
    const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    completed.forEach(booking => {
      booking.hasReview = existingReviews.some((r: Review) => 
        r.type === 'hotel' && (r.targetId === booking.hotelId || r.targetName === booking.hotelName)
      );
    });

    setCompletedBookings(completed);
  };

  const loadCompletedBuddyTrips = () => {
    const matches = globalState.getMatches();
    const now = new Date();
    
    const completed = matches
      .filter(m => {
        const matchDate = new Date(m.matchedAt);
        const daysSinceMatch = (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceMatch > 7 && m.status === 'active'; // Trips completed after 7 days
      })
      .map(m => {
        // Get buddy details from database
        const buddy = massiveProperBuddies.find(b => b.id === m.buddyId);
        
        return {
          id: m.id,
          buddyId: m.buddyId,
          buddyName: buddy?.name || 'Travel Buddy',
          destination: m.destination,
          completedDate: m.matchedAt,
          hasReview: false
        };
      });

    // Check which trips already have reviews
    const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    completed.forEach(trip => {
      trip.hasReview = existingReviews.some((r: Review) => 
        r.type === 'buddy' && r.targetId === trip.buddyId
      );
    });

    setCompletedBuddyTrips(completed);
  };

  const handleSubmitReview = () => {
    if (!formData.targetName || !formData.comment) {
      toast.error('Please select a target and provide a review');
      return;
    }

    if (formData.comment.length < 20) {
      toast.error('Please write at least 20 characters in your review');
      return;
    }

    const currentUser = globalState.getCurrentUser();
    const newReview: Review = {
      id: `review-${Date.now()}`,
      type: feedbackType,
      targetId: formData.targetId,
      targetName: formData.targetName,
      targetLocation: formData.targetLocation,
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
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Guest User',
      photos: selectedPhotos,
      helpful: 0,
      verified: true
    };

    const updated = [...reviews, newReview];
    setReviews(updated);
    localStorage.setItem('reviews', JSON.stringify(updated));

    // Update completion status
    if (feedbackType === 'hotel') {
      loadCompletedBookings();
    } else {
      loadCompletedBuddyTrips();
    }

    // Reset form
    setFormData({
      targetId: '',
      targetName: '',
      targetLocation: '',
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
    setSelectedPhotos([]);
    setShowAddForm(false);

    toast.success('Review submitted successfully! 🎉');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const photoUrls = fileArray.map(file => URL.createObjectURL(file));
    
    setSelectedPhotos([...selectedPhotos, ...photoUrls].slice(0, 5)); // Max 5 photos
    toast.success(`${fileArray.length} photo(s) added`);
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(selectedPhotos.filter((_, i) => i !== index));
  };

  const markHelpful = (reviewId: string) => {
    const updated = reviews.map(r => 
      r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
    );
    setReviews(updated);
    localStorage.setItem('reviews', JSON.stringify(updated));
    toast.success('Marked as helpful!');
  };

  const renderStars = (rating: number, onChange?: (rating: number) => void, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange?.(star)}
            className={`${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!onChange}
          >
            <Star
              className={`${sizeClass} ${
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

  const filteredReviews = reviews
    .filter(r => filterType === 'all' ? true : r.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else {
        return b.helpful - a.helpful;
      }
    });

  const averageRatingByType = (type: 'hotel' | 'buddy') => {
    const typeReviews = reviews.filter(r => r.type === type);
    if (typeReviews.length === 0) return 0;
    const sum = typeReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / typeReviews.length).toFixed(1);
  };

  const pendingReviewsCount = completedBookings.filter(b => !b.hasReview).length + 
                               completedBuddyTrips.filter(t => !t.hasReview).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white rounded-2xl p-6">
        <h2 className="text-2xl mb-2 flex items-center gap-3">
          <Award className="w-8 h-8" />
          Reviews & Feedback System
        </h2>
        <p className="text-yellow-100 text-sm">Share your real travel experiences and help the community</p>
      </div>

      {/* Pending Reviews Alert */}
      {pendingReviewsCount > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl p-6 shadow-xl border-4 border-blue-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-blue-500 animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl mb-2">You have {pendingReviewsCount} pending review{pendingReviewsCount > 1 ? 's' : ''}!</h3>
              <p className="text-blue-100 text-sm mb-3">
                Share your experience to help other travelers make better decisions
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Write a Review Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700 text-sm">Total Reviews</h3>
            <MessageSquare className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl text-black">{reviews.length}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700 text-sm">Hotel Avg Rating</h3>
            <Star className="w-5 h-5 text-blue-500 fill-blue-500" />
          </div>
          <p className="text-3xl text-black">{averageRatingByType('hotel') || 'N/A'}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700 text-sm">Buddy Avg Rating</h3>
            <ThumbsUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl text-black">{averageRatingByType('buddy') || 'N/A'}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700 text-sm">Pending Reviews</h3>
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl text-black">{pendingReviewsCount}</p>
        </div>
      </div>

      {/* Add Review Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        <Send className="w-5 h-5" />
        {showAddForm ? 'Cancel Review' : 'Write a Review'}
      </button>

      {/* Add Review Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-2xl p-6 border-4 border-yellow-400">
          <h3 className="text-gray-900 mb-6 flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Share Your Experience
          </h3>

          {/* Type Selection */}
          <div className="mb-6">
            <label className="text-sm text-gray-600 block mb-3">What would you like to review?</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setFeedbackType('hotel');
                  setFormData({ ...formData, targetId: '', targetName: '', targetLocation: '' });
                }}
                className={`p-6 rounded-xl border-3 transition-all ${
                  feedbackType === 'hotel'
                    ? 'border-yellow-500 bg-yellow-50 shadow-lg transform scale-105'
                    : 'border-gray-300 hover:border-yellow-300 hover:bg-gray-50'
                }`}
              >
                <HotelIcon className={`w-12 h-12 mx-auto mb-2 ${feedbackType === 'hotel' ? 'text-yellow-500' : 'text-gray-400'}`} />
                <p className="text-gray-900">Hotel / Accommodation</p>
                <p className="text-xs text-gray-500 mt-1">{completedBookings.filter(b => !b.hasReview).length} pending</p>
              </button>
              <button
                onClick={() => {
                  setFeedbackType('buddy');
                  setFormData({ ...formData, targetId: '', targetName: '', targetLocation: '' });
                }}
                className={`p-6 rounded-xl border-3 transition-all ${
                  feedbackType === 'buddy'
                    ? 'border-yellow-500 bg-yellow-50 shadow-lg transform scale-105'
                    : 'border-gray-300 hover:border-yellow-300 hover:bg-gray-50'
                }`}
              >
                <Users className={`w-12 h-12 mx-auto mb-2 ${feedbackType === 'buddy' ? 'text-yellow-500' : 'text-gray-400'}`} />
                <p className="text-gray-900">Travel Buddy</p>
                <p className="text-xs text-gray-500 mt-1">{completedBuddyTrips.filter(t => !t.hasReview).length} pending</p>
              </button>
            </div>
          </div>

          {/* Target Selection */}
          <div className="mb-6">
            <label className="text-sm text-gray-600 block mb-3">
              {feedbackType === 'hotel' ? 'Select Hotel (from completed stays)' : 'Select Travel Buddy (from completed trips)'}
            </label>
            {feedbackType === 'hotel' ? (
              completedBookings.length > 0 ? (
                <div className="space-y-2">
                  {completedBookings.map((booking) => (
                    <button
                      key={booking.id}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          targetId: booking.hotelId,
                          targetName: booking.hotelName,
                          targetLocation: booking.destination
                        });
                      }}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        formData.targetName === booking.hotelName
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-300 hover:border-yellow-300 hover:bg-gray-50'
                      } ${booking.hasReview ? 'opacity-50' : ''}`}
                      disabled={booking.hasReview}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-gray-900">{booking.hotelName}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {booking.destination} • Checked out: {new Date(booking.checkOut).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        {booking.hasReview && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-xl text-center border-2 border-dashed border-gray-300">
                  <HotelIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">No completed hotel stays yet</p>
                  <p className="text-sm text-gray-400 mt-1">Complete a hotel booking to leave a review</p>
                </div>
              )
            ) : (
              completedBuddyTrips.length > 0 ? (
                <div className="space-y-2">
                  {completedBuddyTrips.map((trip) => (
                    <button
                      key={trip.id}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          targetId: trip.buddyId,
                          targetName: trip.buddyName,
                          targetLocation: trip.destination
                        });
                      }}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        formData.targetName === trip.buddyName
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-300 hover:border-yellow-300 hover:bg-gray-50'
                      } ${trip.hasReview ? 'opacity-50' : ''}`}
                      disabled={trip.hasReview}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-gray-900">{trip.buddyName}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {trip.destination} • Trip completed: {new Date(trip.completedDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        {trip.hasReview && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-xl text-center border-2 border-dashed border-gray-300">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">No completed buddy trips yet</p>
                  <p className="text-sm text-gray-400 mt-1">Match with a travel buddy to leave a review</p>
                </div>
              )
            )}
          </div>

          {formData.targetName && (
            <>
              {/* Overall Rating */}
              <div className="mb-6">
                <label className="text-sm text-gray-600 block mb-3">Overall Rating *</label>
                <div className="flex items-center gap-4">
                  {renderStars(formData.rating, (rating) => setFormData({ ...formData, rating }), 'lg')}
                  <span className="text-2xl text-yellow-600">{formData.rating}/5</span>
                </div>
              </div>

              {/* Detailed Ratings */}
              <div className="mb-6">
                <label className="text-sm text-gray-600 block mb-3">Detailed Ratings</label>
                {feedbackType === 'hotel' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="text-sm text-gray-700 block mb-2">Cleanliness</label>
                      {renderStars(formData.cleanliness, (rating) => setFormData({ ...formData, cleanliness: rating }))}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="text-sm text-gray-700 block mb-2">Service Quality</label>
                      {renderStars(formData.service, (rating) => setFormData({ ...formData, service: rating }))}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="text-sm text-gray-700 block mb-2">Value for Money</label>
                      {renderStars(formData.value, (rating) => setFormData({ ...formData, value: rating }))}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="text-sm text-gray-700 block mb-2">Location</label>
                      {renderStars(formData.location, (rating) => setFormData({ ...formData, location: rating }))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="text-sm text-gray-700 block mb-2">Communication</label>
                      {renderStars(formData.communication, (rating) => setFormData({ ...formData, communication: rating }))}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="text-sm text-gray-700 block mb-2">Reliability</label>
                      {renderStars(formData.reliability, (rating) => setFormData({ ...formData, reliability: rating }))}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="text-sm text-gray-700 block mb-2">Friendliness</label>
                      {renderStars(formData.friendliness, (rating) => setFormData({ ...formData, friendliness: rating }))}
                    </div>
                  </div>
                )}
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="text-sm text-gray-600 block mb-3">Your Detailed Review * (min 20 characters)</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share your experience in detail... What did you like? What could be improved?"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-yellow-500 h-40 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.comment.length} / 500 characters</p>
              </div>

              {/* Photo Upload */}
              <div className="mb-6">
                <label className="text-sm text-gray-600 block mb-3">Add Photos (Optional, max 5)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                    disabled={selectedPhotos.length >= 5}
                  />
                  <label
                    htmlFor="photo-upload"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors cursor-pointer ${
                      selectedPhotos.length >= 5
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    Upload Photos
                  </label>
                  <p className="text-xs text-gray-500 mt-2">{selectedPhotos.length} / 5 photos</p>
                </div>
                
                {selectedPhotos.length > 0 && (
                  <div className="grid grid-cols-5 gap-3 mt-4">
                    {selectedPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img src={photo} alt={`Upload ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedPhotos([]);
                  }}
                  className="flex-1 bg-gray-200 text-gray-900 py-4 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Submit Review
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Filter & Sort */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600" />
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                filterType === 'all'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setFilterType('hotel')}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                filterType === 'hotel'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hotels ({reviews.filter(r => r.type === 'hotel').length})
            </button>
            <button
              onClick={() => setFilterType('buddy')}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                filterType === 'buddy'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Buddies ({reviews.filter(r => r.type === 'buddy').length})
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="ml-auto px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 text-sm"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Award className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg mb-2">No reviews yet</p>
            <p className="text-sm text-gray-400">Be the first to share your experience!</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 bg-gradient-to-br ${
                    review.type === 'hotel' ? 'from-blue-400 to-blue-500' : 'from-green-400 to-green-500'
                  } rounded-full flex items-center justify-center text-2xl`}>
                    {review.type === 'hotel' ? '🏨' : '👤'}
                  </div>
                  <div>
                    <h3 className="text-gray-900">{review.targetName}</h3>
                    {review.targetLocation && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {review.targetLocation}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <User className="w-3 h-3" />
                      {review.userName}
                      {review.verified && <CheckCircle className="w-4 h-4 text-blue-500" title="Verified review" />}
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      {new Date(review.date).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {renderStars(review.rating)}
                  <p className="text-sm text-gray-600 mt-1">{review.rating}/5</p>
                </div>
              </div>

              {/* Detailed Ratings */}
              {review.type === 'hotel' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 bg-gray-50 p-4 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Cleanliness</p>
                    {renderStars(review.cleanliness || 0, undefined, 'sm')}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Service</p>
                    {renderStars(review.service || 0, undefined, 'sm')}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Value</p>
                    {renderStars(review.value || 0, undefined, 'sm')}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Location</p>
                    {renderStars(review.location || 0, undefined, 'sm')}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 mb-4 bg-gray-50 p-4 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Communication</p>
                    {renderStars(review.communication || 0, undefined, 'sm')}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Reliability</p>
                    {renderStars(review.reliability || 0, undefined, 'sm')}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Friendliness</p>
                    {renderStars(review.friendliness || 0, undefined, 'sm')}
                  </div>
                </div>
              )}

              {/* Comment */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-blue-500 mb-4">
                <p className="text-gray-700">{review.comment}</p>
              </div>

              {/* Photos */}
              {review.photos && review.photos.length > 0 && (
                <div className="grid grid-cols-5 gap-3 mb-4">
                  {review.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Review photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              )}

              {/* Helpful Button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => markHelpful(review.id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">Helpful ({review.helpful})</span>
                </button>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <TrendingUp className="w-3 h-3" />
                  Verified Purchase
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}