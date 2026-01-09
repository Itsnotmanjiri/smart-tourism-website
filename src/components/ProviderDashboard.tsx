import { useState } from 'react';
import { TrendingUp, Users, Star, MessageSquare, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrustBadges } from './ux/TrustBadges';

// Mock data for demand trends
const demandData = [
  { month: 'Jan', bookings: 45, revenue: 54000 },
  { month: 'Feb', bookings: 52, revenue: 62400 },
  { month: 'Mar', bookings: 68, revenue: 81600 },
  { month: 'Apr', bookings: 71, revenue: 85200 },
  { month: 'May', bookings: 58, revenue: 69600 },
  { month: 'Jun', bookings: 63, revenue: 75600 }
];

// Mock sentiment data
const sentimentBreakdown = {
  positive: 78,
  neutral: 15,
  negative: 7
};

// Mock reviews
const recentReviews = [
  {
    id: '1',
    guest: 'Priya S.',
    rating: 5,
    sentiment: 'positive' as const,
    comment: 'Excellent service and beautiful property. Highly recommend!',
    date: '2 days ago',
    responded: false
  },
  {
    id: '2',
    guest: 'Rahul M.',
    rating: 4,
    sentiment: 'positive' as const,
    comment: 'Great location and clean rooms. Staff was very helpful.',
    date: '5 days ago',
    responded: true
  },
  {
    id: '3',
    guest: 'Amit K.',
    rating: 3,
    sentiment: 'neutral' as const,
    comment: 'Decent stay but WiFi could be better.',
    date: '1 week ago',
    responded: false
  }
];

export function ProviderDashboard() {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  const handleRespond = (reviewId: string) => {
    setSelectedReview(reviewId);
  };

  const submitResponse = () => {
    // In real app, this would call API
    alert('Response submitted successfully!');
    setSelectedReview(null);
    setResponseText('');
  };

  // Calculate suggested pricing
  const currentPrice = 1200;
  const suggestedMin = 1000;
  const suggestedMax = 1500;
  const optimalPrice = 1350;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-blue-900 mb-2">Provider Dashboard</h2>
        <p className="text-gray-600">Analytics and insights for your property</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-900" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-600 mb-1">Total Bookings</p>
          <p className="text-blue-900">357</p>
          <p className="text-green-600">+12% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-700" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-600 mb-1">Revenue (This Month)</p>
          <p className="text-blue-900">₹85,200</p>
          <p className="text-green-600">+8% from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Average Rating</p>
          <p className="text-blue-900">4.6/5</p>
          <p className="text-gray-600">From 234 reviews</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-700" />
            </div>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-gray-600 mb-1">Pending Responses</p>
          <p className="text-blue-900">2</p>
          <p className="text-amber-600">Action needed</p>
        </div>
      </div>

      {/* Demand Trends */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-gray-900 mb-4">Demand Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={demandData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#1e3a8a"
              strokeWidth={2}
              dot={{ fill: '#1e3a8a', r: 4 }}
              name="Bookings"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Analysis */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-900 mb-4">Guest Sentiment Analysis</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Positive</span>
                </div>
                <span className="text-gray-900">{sentimentBreakdown.positive}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${sentimentBreakdown.positive}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-700">Neutral</span>
                </div>
                <span className="text-gray-900">{sentimentBreakdown.neutral}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-400"
                  style={{ width: `${sentimentBreakdown.neutral}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Negative</span>
                </div>
                <span className="text-gray-900">{sentimentBreakdown.negative}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${sentimentBreakdown.negative}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 mb-1">Overall Sentiment Score</p>
            <p className="text-blue-800">
              Your property has excellent guest satisfaction. Keep maintaining high service standards!
            </p>
          </div>
        </div>

        {/* Pricing Suggestions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-900 mb-4">Dynamic Pricing Insights</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 mb-2">Current Price</p>
              <p className="text-blue-900">₹{currentPrice}/night</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-900 mb-2">Optimal Price Range</p>
              <p className="text-green-800 mb-3">₹{suggestedMin} - ₹{suggestedMax}/night</p>
              <p className="text-green-700">
                Based on demand trends, competitor pricing, and seasonal factors
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <p className="text-blue-900">Recommended Action</p>
              </div>
              <p className="text-blue-800">
                Increase to ₹{optimalPrice}/night for upcoming weekend. High demand expected.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-700">Pricing Factors:</p>
              <ul className="space-y-1 text-gray-600">
                <li className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Peak season approaching</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>85% booking rate in your area</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gray-400" />
                  <span>Your rating supports premium pricing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Management */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-gray-900 mb-4">Recent Reviews</h3>
        
        <div className="space-y-4">
          {recentReviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-gray-900">{review.guest}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-700">{review.rating}/5</span>
                    </div>
                    <span className="text-gray-500">{review.date}</span>
                  </div>
                  <TrustBadges sentiment={review.sentiment} />
                </div>
                {review.responded && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    Responded
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 mb-3">{review.comment}</p>
              
              {!review.responded && selectedReview !== review.id && (
                <button
                  onClick={() => handleRespond(review.id)}
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors"
                >
                  Respond to Review
                </button>
              )}
              
              {selectedReview === review.id && (
                <div className="mt-3 space-y-3">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write your response..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={submitResponse}
                      className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors"
                    >
                      Submit Response
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReview(null);
                        setResponseText('');
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
