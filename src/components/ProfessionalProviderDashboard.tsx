import React, { useState, useEffect } from 'react';
import { Building, Calendar, DollarSign, Star, TrendingUp, Users, Eye, Edit, Trash2, Plus, Download, Filter, Search, Hotel, CheckCircle, XCircle, Clock, MapPin, BedDouble } from 'lucide-react';
import { addNotification } from './InAppNotifications';

interface Property {
  id: string;
  name: string;
  destination: string;
  propertyType: string;
  starRating: number;
  basePrice: number;
  totalRooms: number;
  availableRooms: number;
  rating: number;
  reviews: number;
  totalBookings: number;
  revenue: number;
  status: 'active' | 'inactive';
  image: string;
}

interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  guests: number;
  amount: number;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  bookingDate: string;
}

interface Review {
  id: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
  response?: string;
}

// Generate 100+ properties per provider
function generateProperties(providerId: string, count: number): Property[] {
  const cities = ['Goa', 'Mumbai', 'Jaipur', 'Udaipur', 'Delhi', 'Bangalore', 'Kerala', 'Manali', 'Shimla', 'Agra', 'Varanasi', 'Rishikesh', 'Darjeeling', 'Ooty', 'Pune'];
  const types = ['Hotel', 'Resort', 'Villa', 'Hostel', 'Apartment', 'Guesthouse'];
  const names = ['Grand', 'Royal', 'Imperial', 'Majestic', 'Premium', 'Elite', 'Luxury', 'Heritage', 'Paradise', 'Comfort'];
  
  return Array.from({ length: count }, (_, i) => {
    const city = cities[i % cities.length];
    const type = types[i % types.length];
    const name = `${names[i % names.length]} ${type} ${city}`;
    const basePrice = 1500 + (i % 10) * 500;
    const totalRooms = 20 + (i % 15) * 10;
    const availableRooms = Math.floor(totalRooms * (0.3 + Math.random() * 0.5));
    const totalBookings = 50 + i * 12;
    
    return {
      id: `prop-${providerId}-${i}`,
      name,
      destination: city,
      propertyType: type,
      starRating: 3 + (i % 3),
      basePrice,
      totalRooms,
      availableRooms,
      rating: 4.0 + Math.random() * 1.0,
      reviews: 20 + i * 5,
      totalBookings,
      revenue: totalBookings * basePrice * (2 + Math.random()),
      status: i % 20 === 0 ? 'inactive' : 'active',
      image: `https://images.unsplash.com/photo-${1566073771259 + i}?w=400`
    };
  });
}

// Generate bookings
function generateBookings(properties: Property[]): Booking[] {
  const bookings: Booking[] = [];
  const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh', 'Anjali Gupta', 'Raj Malhotra', 'Neha Kapoor'];
  
  properties.slice(0, 30).forEach((property, idx) => {
    const numBookings = 2 + (idx % 4);
    for (let i = 0; i < numBookings; i++) {
      const daysFromNow = -10 + i * 15;
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + daysFromNow);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 3);
      
      const bookingDate = new Date(checkIn);
      bookingDate.setDate(bookingDate.getDate() - 7);
      
      let status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' = 'confirmed';
      if (daysFromNow < -5) status = 'checked-out';
      else if (daysFromNow < 0) status = 'checked-in';
      
      bookings.push({
        id: `booking-${property.id}-${i}`,
        propertyId: property.id,
        propertyName: property.name,
        guestName: names[i % names.length],
        guestEmail: `${names[i % names.length].toLowerCase().replace(' ', '.')}@email.com`,
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        rooms: 1 + (i % 3),
        guests: 2 + (i % 4),
        amount: property.basePrice * (1 + (i % 3)) * 3,
        status,
        bookingDate: bookingDate.toISOString().split('T')[0]
      });
    }
  });
  
  return bookings.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
}

// Generate reviews
function generateReviews(properties: Property[]): Review[] {
  const reviews: Review[] = [];
  const comments = [
    'Excellent stay! The staff was very helpful and rooms were clean.',
    'Great location and amenities. Would definitely recommend.',
    'Good value for money. Enjoyed my stay here.',
    'Beautiful property with amazing views. Loved it!',
    'Comfortable rooms and delicious food. Great experience.',
    'Nice hotel but could improve breakfast options.',
    'Wonderful hospitality. Made our trip memorable.',
    'Clean rooms, friendly staff. Perfect for families.'
  ];
  
  properties.slice(0, 25).forEach((property, idx) => {
    const numReviews = 1 + (idx % 3);
    for (let i = 0; i < numReviews; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 10 + idx));
      
      reviews.push({
        id: `review-${property.id}-${i}`,
        propertyId: property.id,
        propertyName: property.name,
        guestName: `Guest ${idx + i}`,
        rating: 3 + (i % 3),
        comment: comments[i % comments.length],
        date: date.toISOString().split('T')[0],
        response: i % 2 === 0 ? 'Thank you for your feedback! We look forward to hosting you again.' : undefined
      });
    }
  });
  
  return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function ProfessionalProviderDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'bookings' | 'reviews'>('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  
  const providerData = JSON.parse(localStorage.getItem('providerData') || '{}');
  
  useEffect(() => {
    // Initialize provider data
    const props = generateProperties(providerData.id, providerData.totalProperties || 100);
    setProperties(props);
    setBookings(generateBookings(props));
    setReviews(generateReviews(props));
  }, []);
  
  // Calculate stats
  const totalRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.amount, 0);
  
  const thisMonthRevenue = bookings
    .filter(b => {
      const bookingDate = new Date(b.bookingDate);
      const now = new Date();
      return bookingDate.getMonth() === now.getMonth() && 
             bookingDate.getFullYear() === now.getFullYear() &&
             b.status !== 'cancelled';
    })
    .reduce((sum, b) => sum + b.amount, 0);
  
  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in').length;
  const avgRating = properties.reduce((sum, p) => sum + p.rating, 0) / properties.length;
  
  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-full flex items-center justify-center">
              <Building className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{providerData.companyName}</h1>
              <p className="text-gray-600">Provider Dashboard</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Welcome back,</p>
            <p className="text-lg font-semibold text-gray-900">{providerData.name}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Hotel className="w-6 h-6 text-blue-900" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Properties</p>
          <p className="text-3xl font-bold text-gray-900">{properties.length}</p>
          <p className="text-xs text-green-600 mt-2">{properties.filter(p => p.status === 'active').length} active</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-900" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">₹{(totalRevenue / 100000).toFixed(1)}L</p>
          <p className="text-xs text-green-600 mt-2">₹{(thisMonthRevenue / 1000).toFixed(0)}K this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-900" />
            </div>
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Bookings</p>
          <p className="text-3xl font-bold text-gray-900">{activeBookings}</p>
          <p className="text-xs text-gray-500 mt-2">{bookings.length} total bookings</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-900" />
            </div>
            <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Average Rating</p>
          <p className="text-3xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
          <p className="text-xs text-gray-500 mt-2">{reviews.length} reviews</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'properties'
                  ? 'bg-blue-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Properties ({properties.length})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'bookings'
                  ? 'bg-blue-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-blue-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Properties Tab */}
          {activeTab === 'properties' && (
            <div>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{property.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {property.destination}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        property.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Base Price</p>
                        <p className="font-semibold">₹{property.basePrice}/night</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{property.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Rooms</p>
                        <p className="font-semibold">{property.availableRooms}/{property.totalRooms}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Revenue</p>
                        <p className="font-semibold">₹{(property.revenue / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="max-h-[600px] overflow-y-auto">
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{booking.propertyName}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'checked-in' ? 'bg-green-100 text-green-800' :
                            booking.status === 'checked-out' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">Guest</p>
                            <p className="font-medium">{booking.guestName}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Check-in</p>
                            <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Check-out</p>
                            <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Amount</p>
                            <p className="font-semibold text-green-600">₹{booking.amount.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="max-h-[600px] overflow-y-auto">
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{review.propertyName}</h3>
                        <p className="text-sm text-gray-600">{review.guestName}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-3">{review.comment}</p>
                    
                    {review.response && (
                      <div className="bg-blue-50 border-l-4 border-blue-900 p-3 rounded">
                        <p className="text-xs text-blue-900 font-medium mb-1">Your Response:</p>
                        <p className="text-sm text-gray-700">{review.response}</p>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Bookings
                  </h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm">{booking.propertyName}</p>
                          <span className="text-sm font-semibold text-green-600">
                            ₹{booking.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>{booking.guestName}</span>
                          <span>•</span>
                          <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Reviews */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Recent Reviews
                  </h3>
                  <div className="space-y-3">
                    {reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm">{review.propertyName}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
