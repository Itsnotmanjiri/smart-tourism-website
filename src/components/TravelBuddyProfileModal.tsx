import { useState, useEffect } from 'react';
import { X, Star, MapPin, Calendar, DollarSign, Heart, MessageCircle, Award, ThumbsUp, User, CheckCircle, Shield, Globe, Languages, TrendingUp } from 'lucide-react';
import { TravelBuddy } from '../data/massiveProperBuddies';
import { globalState } from '../utils/globalState';
import { ProperChat } from './ProperChat';
import { getBuddyReviews, getBuddyAverageRatings, addBuddyReview, markReviewHelpful, BuddyReview } from '../utils/reviewsData';

interface Props {
  buddy: TravelBuddy;
  onClose: () => void;
  onMatch?: (buddyId: string) => void;
}

export function TravelBuddyProfileModal({ buddy, onClose, onMatch }: Props) {
  const [activeTab, setActiveTab] = useState<'profile' | 'reviews'>('profile');
  const [reviews, setReviews] = useState<BuddyReview[]>([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    communication: 5,
    reliability: 5,
    friendliness: 5,
    comment: '',
    tripDestination: ''
  });

  useEffect(() => {
    loadReviews();
  }, [buddy.id]);

  const loadReviews = () => {
    const buddyReviews = getBuddyReviews(buddy.id);
    setReviews(buddyReviews);
  };

  const handleSubmitReview = () => {
    if (!newReview.comment.trim() || !newReview.tripDestination.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const user = globalState.getCurrentUser();
    const review: BuddyReview = {
      id: `buddy-review-${Date.now()}`,
      buddyId: buddy.id,
      userId: user?.id || 'guest',
      userName: user?.name || 'Guest User',
      userAvatar: '👤',
      rating: newReview.rating,
      communication: newReview.communication,
      reliability: newReview.reliability,
      friendliness: newReview.friendliness,
      comment: newReview.comment,
      tripDestination: newReview.tripDestination,
      date: new Date().toISOString(),
      helpful: 0,
      verified: true,
      tripDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    };

    addBuddyReview(review);
    setReviews([review, ...reviews]);
    setShowAddReview(false);
    setNewReview({
      rating: 5,
      communication: 5,
      reliability: 5,
      friendliness: 5,
      comment: '',
      tripDestination: ''
    });
  };

  const handleMarkHelpful = (reviewId: string) => {
    markReviewHelpful(reviewId, 'buddy');
    loadReviews();
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md', interactive = false, onChange?: (rating: number) => void) => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6';
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onChange?.(star)}
            disabled={!interactive}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
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

  const averageRatings = getBuddyAverageRatings(buddy.id);

  if (showChat) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 flex items-center justify-between">
            <h3 className="text-xl font-bold">Chat with {buddy.name}</h3>
            <button
              onClick={() => setShowChat(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[600px]">
            <ProperChat matchedBuddy={buddy} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-5xl shadow-xl">
              {buddy.avatar}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">{buddy.name}</h2>
                <span className="text-blue-200">{buddy.age}</span>
                {buddy.verified && (
                  <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Verified</span>
                  </div>
                )}
                {buddy.isOnline && (
                  <span className="flex items-center gap-1 bg-green-400 text-white px-3 py-1 rounded-full text-sm">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Online
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-blue-100 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>From {buddy.hometown}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>Going to {buddy.destination}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-yellow-500 text-black px-3 py-1.5 rounded-full">
                  <Star className="w-4 h-4 fill-yellow-600" />
                  <span className="font-bold">{averageRatings.overall}</span>
                </div>
                <span className="text-blue-200">{reviews.length > 0 ? reviews.length : buddy.tripsCompleted} trips</span>
                <span className="text-blue-200">{buddy.responseRate}% response rate</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-blue-200">Budget</div>
              <div className="text-2xl font-bold">{buddy.budget}</div>
              <div className="text-sm text-blue-200 mt-1">{buddy.travelDates}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 px-6 font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-white border-b-4 border-purple-900 text-purple-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-4 px-6 font-medium transition-all ${
              activeTab === 'reviews'
                ? 'bg-white border-b-4 border-purple-900 text-purple-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Reviews ({reviews.length > 0 ? reviews.length : buddy.tripsCompleted})
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-300px)] p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Bio */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">About {buddy.name.split(' ')[0]}</h3>
                <p className="text-gray-700 leading-relaxed">{buddy.bio}</p>
              </div>

              {/* Travel Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    Travel Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Destination:</span>
                      <span className="font-medium text-gray-900">{buddy.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Travel Dates:</span>
                      <span className="font-medium text-gray-900">{buddy.travelDates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium text-gray-900">{buddy.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Travel Style:</span>
                      <span className="font-medium text-gray-900">{buddy.travelStyle}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Languages className="w-5 h-5 text-purple-600" />
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {buddy.languages.map((lang, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-900 px-3 py-1.5 rounded-lg text-sm font-medium">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {buddy.interests.map((interest, idx) => (
                    <span key={idx} className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-900 px-4 py-2 rounded-full font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Looking For */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Looking For</h3>
                <div className="flex flex-wrap gap-2">
                  {buddy.lookingFor.map((item, idx) => (
                    <span key={idx} className="bg-green-100 text-green-900 px-4 py-2 rounded-full font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowChat(true)}
                  className="flex-1 bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-4 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Send Message
                </button>
                {onMatch && (
                  <button
                    onClick={() => onMatch(buddy.id)}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5" />
                    Connect
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Rating Summary */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex items-start gap-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-gray-900 mb-2">{averageRatings.overall}</div>
                    {renderStars(Math.round(parseFloat(averageRatings.overall)), 'lg')}
                    <p className="text-gray-600 mt-2">
                      {reviews.length > 0 ? `${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}` : `${buddy.tripsCompleted} trips`}
                    </p>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">Communication</p>
                      <div className="flex items-center gap-2">
                        {renderStars(Math.round(parseFloat(averageRatings.communication)), 'sm')}
                        <span className="font-bold text-gray-900">{averageRatings.communication}</span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">Reliability</p>
                      <div className="flex items-center gap-2">
                        {renderStars(Math.round(parseFloat(averageRatings.reliability)), 'sm')}
                        <span className="font-bold text-gray-900">{averageRatings.reliability}</span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">Friendliness</p>
                      <div className="flex items-center gap-2">
                        {renderStars(Math.round(parseFloat(averageRatings.friendliness)), 'sm')}
                        <span className="font-bold text-gray-900">{averageRatings.friendliness}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Review Button */}
              <button
                onClick={() => setShowAddReview(!showAddReview)}
                className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-4 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Write a Review
              </button>

              {/* Add Review Form */}
              {showAddReview && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">Share Your Experience</h3>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Trip Destination</label>
                    <input
                      type="text"
                      value={newReview.tripDestination}
                      onChange={(e) => setNewReview({ ...newReview, tripDestination: e.target.value })}
                      placeholder="Where did you travel together?"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Overall Rating</label>
                    {renderStars(newReview.rating, 'lg', true, (rating) => setNewReview({ ...newReview, rating }))}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Communication</label>
                      {renderStars(newReview.communication, 'md', true, (rating) => setNewReview({ ...newReview, communication: rating }))}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Reliability</label>
                      {renderStars(newReview.reliability, 'md', true, (rating) => setNewReview({ ...newReview, reliability: rating }))}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Friendliness</label>
                      {renderStars(newReview.friendliness, 'md', true, (rating) => setNewReview({ ...newReview, friendliness: rating }))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Your Review</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your travel experience with this buddy..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 h-32 resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddReview(false)}
                      className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReview}
                      className="flex-1 bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-3 rounded-xl hover:shadow-xl transition-all"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 text-lg">No reviews yet</p>
                    <p className="text-gray-400 text-sm">Be the first to review this travel buddy!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
                            {review.userAvatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{review.userName}</p>
                              {review.verified && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              Traveled to {review.tripDestination} • {new Date(review.date).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {renderStars(review.rating, 'sm')}
                          <p className="text-sm text-gray-600 mt-1">{review.rating}/5</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4 bg-gray-50 p-4 rounded-xl">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Communication</p>
                          {renderStars(review.communication, 'sm')}
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Reliability</p>
                          {renderStars(review.reliability, 'sm')}
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Friendliness</p>
                          {renderStars(review.friendliness, 'sm')}
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

                      <button
                        onClick={() => handleMarkHelpful(review.id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-purple-900 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}