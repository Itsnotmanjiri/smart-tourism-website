import { useState, useEffect } from 'react';
import { Plus, Hotel, Calendar, DollarSign, Users, TrendingUp, Star, Edit, Trash2, Eye, Download, LogOut, X } from 'lucide-react';
import { allHotels as realAllHotels, Hotel as RealHotel } from '../data/massiveProperHotels';

interface Hotel {
  id: string;
  name: string;
  destination: string;
  propertyType: string;
  starRating: number;
  basePrice: number;
  totalRooms: number;
  availableRooms: number;
  rating: number;
  totalBookings: number;
  revenue: number;
  status: 'active' | 'inactive';
  images: string[];
}

interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  amount: number;
  status: 'confirmed' | 'checked-in' | 'checked-out';
}

export function EnhancedProviderDashboard({ provider, onLogout }: { provider: any; onLogout: () => void }) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'hotels' | 'bookings' | 'reviews' | 'add-hotel'>('overview');
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [viewingHotel, setViewingHotel] = useState<Hotel | null>(null);
  
  const [newHotelData, setNewHotelData] = useState({
    name: '',
    destination: 'Goa',
    propertyType: 'Hotel',
    starRating: 3,
    basePrice: 2000,
    totalRooms: 50,
    address: '',
    amenities: [] as string[],
    description: ''
  });

  const DESTINATIONS = ['Goa', 'Manali', 'Jaipur', 'Kerala', 'Udaipur', 'Rishikesh', 'Varanasi', 'Amritsar', 'Hampi', 'Darjeeling'];
  const PROPERTY_TYPES = ['Hotel', 'Resort', 'Homestay', 'Hostel', 'Villa'];
  const AMENITIES = ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Parking', 'AC', 'Room Service'];

  // Load provider hotels and bookings on mount
  useEffect(() => {
    // Load provider's hotels
    const savedHotels = JSON.parse(localStorage.getItem('providerHotels') || '[]');
    const providerOwnedHotels = savedHotels.filter((h: any) => h.providerId === provider.id);
    
    if (providerOwnedHotels.length > 0) {
      setHotels(providerOwnedHotels);
    }

    // Load hotel bookings from allBookings
    const allBookings = JSON.parse(localStorage.getItem('allBookings') || '[]');
    const hotelBookings = allBookings.filter((b: any) => b.type === 'hotel');
    
    // Get hotel IDs owned by this provider
    const ownedHotelIds = providerOwnedHotels.map((h: any) => h.id);
    
    // Filter bookings to only show those for hotels owned by this provider
    const providerBookings = hotelBookings.filter((b: any) => ownedHotelIds.includes(b.hotelId));
    
    // Map to provider's booking format
    const mappedBookings = providerBookings.map((b: any) => ({
      id: b.id || b.bookingId,
      hotelId: b.hotelId,
      hotelName: b.hotelName,
      guestName: b.guestName,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      rooms: b.rooms || 1,
      amount: b.totalAmount || b.amount,
      status: b.status || 'confirmed'
    }));
    
    setBookings(mappedBookings);
  }, [provider.id]);

  const handleAddHotel = () => {
    if (!newHotelData.name || !newHotelData.address) {
      alert('Please fill all required fields');
      return;
    }

    const newHotel: Hotel = {
      id: `provider-hotel-${Date.now()}`,
      name: newHotelData.name,
      destination: newHotelData.destination,
      propertyType: newHotelData.propertyType,
      starRating: newHotelData.starRating,
      basePrice: newHotelData.basePrice,
      totalRooms: newHotelData.totalRooms,
      availableRooms: newHotelData.totalRooms,
      rating: 5.0,
      totalBookings: 0,
      revenue: 0,
      status: 'active',
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400']
    };

    const updatedHotels = [...hotels, newHotel];
    setHotels(updatedHotels);

    // Save to localStorage for provider view
    const allProviderHotels = JSON.parse(localStorage.getItem('providerHotels') || '[]');
    const newProviderHotel = {
      ...newHotel,
      providerId: provider.id,
      providerName: provider.name,
      providerEmail: provider.email
    };
    allProviderHotels.push(newProviderHotel);
    localStorage.setItem('providerHotels', JSON.stringify(allProviderHotels));

    // Also save in format compatible with tourist hotel search
    const touristHotels = JSON.parse(localStorage.getItem('touristHotels') || '[]');
    const touristHotelFormat = {
      id: newHotel.id,
      name: newHotelData.name,
      destination: newHotelData.destination,
      area: 'City Center', // Default area
      propertyType: newHotelData.propertyType as any,
      starRating: newHotelData.starRating,
      basePrice: newHotelData.basePrice,
      discountedPrice: newHotelData.basePrice * 0.9, // 10% discount
      rating: 5.0,
      reviewCount: 0,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'],
      amenities: newHotelData.amenities,
      address: newHotelData.address,
      description: newHotelData.description || `Beautiful ${newHotelData.propertyType.toLowerCase()} in ${newHotelData.destination}`,
      rooms: [
        { type: 'Standard Room', price: newHotelData.basePrice, available: Math.floor(newHotelData.totalRooms * 0.4) },
        { type: 'Deluxe Room', price: newHotelData.basePrice * 1.5, available: Math.floor(newHotelData.totalRooms * 0.3) },
        { type: 'Suite', price: newHotelData.basePrice * 2, available: Math.floor(newHotelData.totalRooms * 0.3) }
      ],
      checkInTime: '2:00 PM',
      checkOutTime: '11:00 AM',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      ownerId: provider.id,
      ownerName: provider.name,
      ownerPhone: '+91 98765 43210',
      verified: true,
      available: true,
      tags: ['New Property', 'Great Value'],
      isDeal: true,
      isNew: true,
      isPopular: false,
      bookingsToday: 0
    };
    touristHotels.push(touristHotelFormat);
    localStorage.setItem('touristHotels', JSON.stringify(touristHotels));

    setShowAddHotel(false);
    setActiveTab('hotels');
    
    // Reset form
    setNewHotelData({
      name: '',
      destination: 'Goa',
      propertyType: 'Hotel',
      starRating: 3,
      basePrice: 2000,
      totalRooms: 50,
      address: '',
      amenities: [],
      description: ''
    });

    alert('Hotel added successfully! It will now appear in tourist searches.');
  };

  const toggleAmenity = (amenity: string) => {
    if (newHotelData.amenities.includes(amenity)) {
      setNewHotelData({
        ...newHotelData,
        amenities: newHotelData.amenities.filter(a => a !== amenity)
      });
    } else {
      setNewHotelData({
        ...newHotelData,
        amenities: [...newHotelData.amenities, amenity]
      });
    }
  };

  const handleDeleteHotel = (hotelId: string) => {
    if (confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
      setHotels(hotels.filter(h => h.id !== hotelId));
      alert('Hotel deleted successfully');
    }
  };

  const handleViewHotel = (hotel: Hotel) => {
    setViewingHotel(hotel);
  };

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setNewHotelData({
      name: hotel.name,
      destination: hotel.destination,
      propertyType: hotel.propertyType,
      starRating: hotel.starRating,
      basePrice: hotel.basePrice,
      totalRooms: hotel.totalRooms,
      address: '',
      amenities: [],
      description: ''
    });
  };

  const handleSaveEdit = () => {
    if (!editingHotel) return;
    
    const updatedHotels = hotels.map(h => 
      h.id === editingHotel.id 
        ? {
            ...h,
            name: newHotelData.name,
            destination: newHotelData.destination,
            propertyType: newHotelData.propertyType,
            starRating: newHotelData.starRating,
            basePrice: newHotelData.basePrice,
            totalRooms: newHotelData.totalRooms
          }
        : h
    );
    
    setHotels(updatedHotels);
    setEditingHotel(null);
    alert('Hotel updated successfully!');
  };

  const handleExportBookings = () => {
    const csvContent = [
      ['Booking ID', 'Guest', 'Hotel', 'Check-in', 'Check-out', 'Amount', 'Status'],
      ...bookings.map(b => [
        b.id,
        b.guestName,
        b.hotelName,
        b.checkIn,
        b.checkOut,
        b.amount,
        b.status
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Calculate metrics
  const today = new Date().toISOString().split('T')[0];
  
  // Today's bookings - filter by bookingDate OR checkIn date being today
  const todaysBookings = bookings.filter(b => {
    const bookingDate = b.id.includes('booking-') ? 
      new Date(parseInt(b.id.split('-')[1])).toISOString().split('T')[0] : 
      today;
    const checkInDate = new Date(b.checkIn).toISOString().split('T')[0];
    return bookingDate === today || checkInDate === today;
  });
  
  // Today's revenue (gross)
  const todaysGrossRevenue = todaysBookings.reduce((sum, b) => sum + b.amount, 0);
  
  // Platform commission (12% of gross revenue)
  const PLATFORM_COMMISSION_RATE = 0.12;
  const todaysCommission = Math.round(todaysGrossRevenue * PLATFORM_COMMISSION_RATE);
  
  // Net revenue after commission
  const todaysNetRevenue = todaysGrossRevenue - todaysCommission;
  
  // All-time totals
  const totalGrossRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const totalCommission = Math.round(totalGrossRevenue * PLATFORM_COMMISSION_RATE);
  const totalNetRevenue = totalGrossRevenue - totalCommission;
  
  const totalBookings = bookings.length;
  const avgRating = hotels.length > 0 ? hotels.reduce((sum, h) => sum + h.rating, 0) / hotels.length : 0;
  
  // Calculate proper occupancy rate
  const totalRoomsAcrossAllHotels = hotels.reduce((sum, h) => sum + h.totalRooms, 0);
  const availableRoomsAcrossAllHotels = hotels.reduce((sum, h) => sum + h.availableRooms, 0);
  const occupiedRooms = totalRoomsAcrossAllHotels - availableRoomsAcrossAllHotels;
  const occupancyRate = totalRoomsAcrossAllHotels > 0 ? (occupiedRooms / totalRoomsAcrossAllHotels * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-2">Provider Dashboard</h2>
            <p className="text-indigo-200 text-sm">Manage your properties and track performance</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 border border-white/20"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-indigo-900 text-white' : 'hover:bg-gray-100'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('hotels')}
          className={`px-6 py-3 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'hotels' ? 'bg-indigo-900 text-white' : 'hover:bg-gray-100'
          }`}
        >
          My Hotels ({hotels.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'bookings' ? 'bg-indigo-900 text-white' : 'hover:bg-gray-100'
          }`}
        >
          Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'reviews' ? 'bg-indigo-900 text-white' : 'hover:bg-gray-100'
          }`}
        >
          <span className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Reviews
          </span>
        </button>
        <button
          onClick={() => {
            setActiveTab('add-hotel');
            setShowAddHotel(true);
          }}
          className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add New Hotel
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Today's Performance - Highlighted Section */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl">Today's Performance</h3>
              <span className="text-indigo-200 text-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Today's Bookings */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-8 h-8 text-indigo-200" />
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Today</span>
                </div>
                <p className="text-3xl mb-1">{todaysBookings.length}</p>
                <p className="text-indigo-200 text-sm">New Bookings Today</p>
              </div>

              {/* Today's Gross Revenue */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-green-300" />
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">Gross</span>
                </div>
                <p className="text-3xl mb-1">₹{todaysGrossRevenue.toLocaleString('en-IN')}</p>
                <p className="text-indigo-200 text-sm">Total Revenue Today</p>
              </div>

              {/* Today's Net Revenue (After Commission) */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-yellow-300" />
                  <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">Net</span>
                </div>
                <p className="text-3xl mb-1">₹{todaysNetRevenue.toLocaleString('en-IN')}</p>
                <p className="text-indigo-200 text-sm">After 12% Platform Fee</p>
              </div>
            </div>

            {/* Commission Breakdown for Today */}
            <div className="mt-4 bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-indigo-200 text-sm">Commission Breakdown (Today)</span>
                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">12% Fee</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-indigo-300 mb-1">Gross Revenue</p>
                  <p className="text-lg">₹{todaysGrossRevenue.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-300 mb-1">Platform Fee</p>
                  <p className="text-lg text-orange-300">-₹{todaysCommission.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-300 mb-1">You Receive</p>
                  <p className="text-lg text-green-300">₹{todaysNetRevenue.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* All-Time Stats */}
          <div>
            <h3 className="text-gray-900 mb-4">All-Time Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Net Revenue</p>
                    <p className="text-2xl text-gray-900">₹{totalNetRevenue.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500 mt-1">After ₹{totalCommission.toLocaleString('en-IN')} commission</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-900" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-2xl text-gray-900">{totalBookings}</p>
                    <p className="text-xs text-green-600 mt-1">+{todaysBookings.length} today</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-900" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-2xl text-gray-900">{avgRating.toFixed(1)} ⭐</p>
                    <p className="text-xs text-gray-500 mt-1">Across {hotels.length} {hotels.length === 1 ? 'property' : 'properties'}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-900" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Occupancy Rate</p>
                    <p className="text-2xl text-gray-900">{occupancyRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 mt-1">{occupiedRooms}/{totalRoomsAcrossAllHotels} rooms occupied</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-900" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-900 mb-4">Recent Bookings</h3>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No bookings yet</p>
                <p className="text-sm text-gray-400">Once tourists book your hotels, they'll appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map(booking => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="text-gray-900">{booking.guestName}</p>
                      <p className="text-sm text-gray-600">{booking.hotelName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.checkIn).toLocaleDateString('en-IN')} - {new Date(booking.checkOut).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">₹{booking.amount.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500 mb-1">Net: ₹{Math.round(booking.amount * (1 - PLATFORM_COMMISSION_RATE)).toLocaleString('en-IN')}</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hotels Tab */}
      {activeTab === 'hotels' && (
        <div className="space-y-4">
          {hotels.map(hotel => (
            <div key={hotel.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 h-48 md:h-auto">
                  <img 
                    src={hotel.images[0]} 
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl text-gray-900">{hotel.name}</h3>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {hotel.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{hotel.destination}</span>
                        <span>•</span>
                        <span>{hotel.propertyType}</span>
                        <span>•</span>
                        <span>{'⭐'.repeat(hotel.starRating)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Base Price</p>
                      <p className="text-gray-900">₹{hotel.basePrice}/night</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Occupancy</p>
                      <p className="text-gray-900">{hotel.totalRooms - hotel.availableRooms}/{hotel.totalRooms}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                      <p className="text-gray-900">₹{(hotel.revenue / 100000).toFixed(1)}L</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Rating</p>
                      <p className="text-gray-900">{hotel.rating} ⭐</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditHotel(hotel)}
                      className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleViewHotel(hotel)}
                      className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteHotel(hotel.id)}
                      className="px-4 py-2 bg-red-100 text-red-900 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900">All Bookings</h3>
            <button
              onClick={handleExportBookings}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Booking ID</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Guest</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Hotel</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Check-in</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Check-out</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-mono text-sm">{booking.id}</td>
                    <td className="py-4 px-4">{booking.guestName}</td>
                    <td className="py-4 px-4">{booking.hotelName}</td>
                    <td className="py-4 px-4 text-sm">{new Date(booking.checkIn).toLocaleDateString('en-IN')}</td>
                    <td className="py-4 px-4 text-sm">{new Date(booking.checkOut).toLocaleDateString('en-IN')}</td>
                    <td className="py-4 px-4">₹{booking.amount.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-gray-900 mb-6">Customer Reviews</h3>
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Reviews feature coming soon!</p>
            <p className="text-sm text-gray-400">You'll be able to view and respond to customer reviews here.</p>
          </div>
        </div>
      )}

      {/* Add Hotel Form */}
      {showAddHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-indigo-900 text-white p-6 rounded-t-2xl sticky top-0 z-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl">Add New Hotel</h2>
                <p className="text-indigo-200 text-sm">Fill in the details to list your property</p>
              </div>
              <button
                onClick={() => {
                  setShowAddHotel(false);
                  setActiveTab('hotels');
                }}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-2">Hotel Name *</label>
                    <input
                      type="text"
                      value={newHotelData.name}
                      onChange={(e) => setNewHotelData({ ...newHotelData, name: e.target.value })}
                      placeholder="e.g., Royal Palace Hotel"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-900"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-2">Destination *</label>
                    <select
                      value={newHotelData.destination}
                      onChange={(e) => setNewHotelData({ ...newHotelData, destination: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-900"
                    >
                      {DESTINATIONS.map(dest => (
                        <option key={dest} value={dest}>{dest}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-2">Property Type *</label>
                    <select
                      value={newHotelData.propertyType}
                      onChange={(e) => setNewHotelData({ ...newHotelData, propertyType: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-900"
                    >
                      {PROPERTY_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-2">Star Rating</label>
                    <select
                      value={newHotelData.starRating}
                      onChange={(e) => setNewHotelData({ ...newHotelData, starRating: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-900"
                    >
                      {[2, 3, 4, 5].map(star => (
                        <option key={star} value={star}>{star} Stars</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-2">Base Price (₹/night) *</label>
                    <input
                      type="number"
                      value={newHotelData.basePrice}
                      onChange={(e) => setNewHotelData({ ...newHotelData, basePrice: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-900"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-2">Total Rooms *</label>
                    <input
                      type="number"
                      value={newHotelData.totalRooms}
                      onChange={(e) => setNewHotelData({ ...newHotelData, totalRooms: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600 block mb-2">Address *</label>
                    <textarea
                      value={newHotelData.address}
                      onChange={(e) => setNewHotelData({ ...newHotelData, address: e.target.value })}
                      placeholder="Complete address with pin code"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-900 h-24"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-gray-900 mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map(amenity => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        newHotelData.amenities.includes(amenity)
                          ? 'bg-indigo-900 text-white border-indigo-900'
                          : 'border-gray-300 hover:border-indigo-900'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-gray-900 mb-4">Description</h3>
                <textarea
                  value={newHotelData.description}
                  onChange={(e) => setNewHotelData({ ...newHotelData, description: e.target.value })}
                  placeholder="Describe your property, facilities, nearby attractions..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-900 h-32"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => {
                    setShowAddHotel(false);
                    setActiveTab('hotels');
                  }}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddHotel}
                  className="flex-1 bg-indigo-900 text-white py-3 rounded-xl hover:bg-indigo-950 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Hotel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Hotel Modal */}
      {editingHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-900 text-white p-6 rounded-t-2xl sticky top-0 z-10">
              <h2 className="text-2xl">Edit Hotel</h2>
              <p className="text-blue-200 text-sm">Update property information</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-2">Hotel Name</label>
                <input
                  type="text"
                  value={newHotelData.name}
                  onChange={(e) => setNewHotelData({ ...newHotelData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Destination</label>
                  <select
                    value={newHotelData.destination}
                    onChange={(e) => setNewHotelData({ ...newHotelData, destination: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
                  >
                    {DESTINATIONS.map(dest => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-2">Property Type</label>
                  <select
                    value={newHotelData.propertyType}
                    onChange={(e) => setNewHotelData({ ...newHotelData, propertyType: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
                  >
                    {PROPERTY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Base Price (₹/night)</label>
                  <input
                    type="number"
                    value={newHotelData.basePrice}
                    onChange={(e) => setNewHotelData({ ...newHotelData, basePrice: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-2">Total Rooms</label>
                  <input
                    type="number"
                    value={newHotelData.totalRooms}
                    onChange={(e) => setNewHotelData({ ...newHotelData, totalRooms: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => setEditingHotel(null)}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-950 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Hotel Modal */}
      {viewingHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={viewingHotel.images[0]}
                alt={viewingHotel.name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setViewingHotel(null)}
                className="absolute top-4 right-4 bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl text-gray-900 mb-2">{viewingHotel.name}</h2>
                  <div className="flex items-center gap-3 text-gray-600">
                    <span>{viewingHotel.destination}</span>
                    <span>•</span>
                    <span>{viewingHotel.propertyType}</span>
                    <span>•</span>
                    <span>{'⭐'.repeat(viewingHotel.starRating)}</span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-lg ${
                  viewingHotel.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {viewingHotel.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Base Price</p>
                  <p className="text-xl text-gray-900">₹{viewingHotel.basePrice}</p>
                  <p className="text-xs text-gray-500">per night</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Rooms</p>
                  <p className="text-xl text-gray-900">{viewingHotel.totalRooms}</p>
                  <p className="text-xs text-gray-500">{viewingHotel.availableRooms} available</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Occupancy</p>
                  <p className="text-xl text-gray-900">{((1 - viewingHotel.availableRooms / viewingHotel.totalRooms) * 100).toFixed(0)}%</p>
                  <p className="text-xs text-gray-500">current rate</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-xl text-gray-900">₹{(viewingHotel.revenue / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-gray-500">all time</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Rating</p>
                  <p className="text-xl text-gray-900">{viewingHotel.rating} ⭐</p>
                  <p className="text-xs text-gray-500">guest rating</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Bookings</p>
                  <p className="text-xl text-gray-900">{viewingHotel.totalBookings}</p>
                  <p className="text-xs text-gray-500">total bookings</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleEditHotel(viewingHotel);
                    setViewingHotel(null);
                  }}
                  className="flex-1 bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-950 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Hotel
                </button>
                <button
                  onClick={() => setViewingHotel(null)}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}