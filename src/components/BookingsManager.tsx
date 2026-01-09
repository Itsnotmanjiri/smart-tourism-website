import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Download, X, CheckCircle, Clock, XCircle, Building2, Phone, Mail, Search, Eye, CreditCard, Plane, Train } from 'lucide-react';
import { globalState, Booking } from '../utils/globalState';
import { getHotelById } from '../data/properHotelsDatabase';
import { dataService, STORAGE_KEYS } from '../utils/dataService';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';

export function BookingsManager() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'hotels' | 'flights' | 'trains' | 'all'>('all');

  // Load bookings from globalState AND flight/train bookings
  useEffect(() => {
    const loadBookings = () => {
      // Load hotel bookings
      const userBookings = globalState.getBookings();
      
      // Transform hotel bookings to match UI interface
      const transformedHotelBookings = userBookings.map(booking => {
        const hotel = getHotelById(booking.hotelId);
        const checkInDate = new Date(booking.checkIn);
        const checkOutDate = new Date(booking.checkOut);
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Determine status based on dates
        const now = new Date();
        let status: 'confirmed' | 'completed' | 'cancelled' = booking.status;
        if (booking.status === 'confirmed' && checkOutDate < now) {
          status = 'completed';
        }
        
        const currentUser = globalState.getCurrentUser();
        const bookingRef = booking.id.replace('booking-', 'BK');
        
        // Generate QR code data with full booking information
        const qrData = JSON.stringify({
          ref: bookingRef,
          type: 'hotel',
          name: booking.hotelName,
          destination: booking.destination,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          room: booking.roomType,
          guests: booking.guests,
          amount: booking.totalPrice,
          status: status,
          guest: {
            name: currentUser?.name || 'Guest',
            email: currentUser?.email || 'guest@example.com',
            phone: currentUser?.phone || '+91 00000 00000'
          }
        });
        
        return {
          id: booking.id,
          type: 'hotel',
          bookingReference: bookingRef,
          hotelName: booking.hotelName,
          name: booking.hotelName,
          hotelImage: hotel?.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
          destination: booking.destination,
          from: booking.destination,
          to: booking.destination,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          date: booking.checkIn,
          time: '14:00',
          nights,
          guests: booking.guests,
          passengers: booking.guests,
          roomType: booking.roomType,
          totalAmount: booking.totalPrice,
          price: booking.totalPrice,
          status,
          paymentStatus: booking.paymentStatus === 'completed' ? 'paid' : 'pending',
          bookingDate: booking.bookingDate,
          guestDetails: {
            name: currentUser?.name || 'Guest',
            email: currentUser?.email || 'guest@example.com',
            phone: currentUser?.phone || '+91 00000 00000'
          },
          qrCode: qrData,
          pnr: undefined
        };
      });
      
      // Load flight and train bookings from dataService
      const flightTrainBookings = (dataService.getData<any[]>(STORAGE_KEYS.BOOKINGS) || []).map(booking => {
        // Generate QR code data for flight/train
        const qrData = JSON.stringify({
          ref: booking.pnr || booking.bookingReference || booking.id,
          type: booking.type,
          name: booking.name,
          from: booking.from,
          to: booking.to,
          date: booking.date,
          time: booking.time,
          seats: booking.details?.seatNumbers,
          passengers: booking.passengers,
          amount: booking.price,
          status: booking.status,
          guest: booking.details?.passengers?.[0] || {}
        });
        
        return {
          ...booking,
          qrCode: qrData
        };
      });
      
      // Combine all bookings
      const allBookings = [...transformedHotelBookings, ...flightTrainBookings];
      
      setBookings(allBookings);
    };

    loadBookings();
    
    // Refresh bookings every 5 seconds to catch new bookings
    const interval = setInterval(loadBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const generatePDF = (booking: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(30, 58, 138); // Navy blue
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('BOOKING CONFIRMATION', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Smart Tourism & Hospitality Platform - India', 105, 30, { align: 'center' });
    
    // Booking Reference
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Booking Reference: ${booking.bookingReference || booking.id}`, 20, 55);
    
    if (booking.pnr) {
      doc.setFontSize(12);
      doc.text(`PNR: ${booking.pnr}`, 20, 63);
    }
    
    let yPos = 75;
    
    // Type-specific details
    if (booking.type === 'hotel') {
      // Hotel Details
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Hotel Information', 20, yPos);
      yPos += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(`Hotel Name: ${booking.hotelName || booking.name}`, 20, yPos += 8);
      doc.text(`Destination: ${booking.destination}`, 20, yPos += 8);
      doc.text(`Room Type: ${booking.roomType}`, 20, yPos += 8);
      
      // Stay Details
      yPos += 12;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Stay Details', 20, yPos);
      yPos += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(`Check-in: ${new Date(booking.checkIn).toLocaleDateString('en-IN', { 
        day: 'numeric', month: 'long', year: 'numeric' 
      })} at 14:00`, 20, yPos += 8);
      doc.text(`Check-out: ${new Date(booking.checkOut).toLocaleDateString('en-IN', { 
        day: 'numeric', month: 'long', year: 'numeric' 
      })} at 11:00`, 20, yPos += 8);
      doc.text(`Number of Nights: ${booking.nights}`, 20, yPos += 8);
      doc.text(`Number of Guests: ${booking.guests}`, 20, yPos += 8);
    } else if (booking.type === 'flight') {
      // Flight Details
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Flight Information', 20, yPos);
      yPos += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(`Flight: ${booking.name}`, 20, yPos += 8);
      doc.text(`From: ${booking.from}`, 20, yPos += 8);
      doc.text(`To: ${booking.to}`, 20, yPos += 8);
      doc.text(`Date: ${new Date(booking.date).toLocaleDateString('en-IN', { 
        day: 'numeric', month: 'long', year: 'numeric' 
      })}`, 20, yPos += 8);
      doc.text(`Departure Time: ${booking.time}`, 20, yPos += 8);
      doc.text(`Passengers: ${booking.passengers}`, 20, yPos += 8);
      
      if (booking.details?.seatNumbers) {
        doc.text(`Seat Numbers: ${booking.details.seatNumbers.join(', ')}`, 20, yPos += 8);
      }
    } else if (booking.type === 'train') {
      // Train Details
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Train Information', 20, yPos);
      yPos += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(`Train: ${booking.name}`, 20, yPos += 8);
      doc.text(`From: ${booking.from}`, 20, yPos += 8);
      doc.text(`To: ${booking.to}`, 20, yPos += 8);
      doc.text(`Date: ${new Date(booking.date).toLocaleDateString('en-IN', { 
        day: 'numeric', month: 'long', year: 'numeric' 
      })}`, 20, yPos += 8);
      doc.text(`Departure Time: ${booking.time}`, 20, yPos += 8);
      doc.text(`Passengers: ${booking.passengers}`, 20, yPos += 8);
      
      if (booking.details?.seatNumbers) {
        doc.text(`Seat Numbers: ${booking.details.seatNumbers.join(', ')}`, 20, yPos += 8);
      }
    }
    
    // Guest Details
    yPos += 12;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Guest Information', 20, yPos);
    yPos += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const guestDetails = booking.guestDetails || booking.details?.passengers?.[0] || {};
    doc.text(`Name: ${guestDetails.name || 'N/A'}`, 20, yPos += 8);
    doc.text(`Email: ${guestDetails.email || 'N/A'}`, 20, yPos += 8);
    doc.text(`Phone: ${guestDetails.phone || 'N/A'}`, 20, yPos += 8);
    
    // Payment Summary
    yPos += 12;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Summary', 20, yPos);
    yPos += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const amount = booking.totalAmount || booking.price || 0;
    doc.text(`Subtotal: Rs. ${amount.toLocaleString('en-IN')}`, 20, yPos += 8);
    doc.text(`Taxes & Fees (12%): Rs. ${(amount * 0.12).toLocaleString('en-IN')}`, 20, yPos += 8);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Total Amount: Rs. ${(amount * 1.12).toLocaleString('en-IN')}`, 20, yPos += 10);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Payment Status: ${booking.paymentStatus || booking.status || 'Confirmed'}`, 20, yPos += 8);
    
    // QR Code Placeholder
    yPos += 12;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, 40, 40, 'F');
    doc.setFontSize(8);
    doc.text('QR CODE', 40, yPos + 20, { align: 'center' });
    doc.text(booking.qrCode || booking.id, 40, yPos + 25, { align: 'center' });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing Smart Tourism Platform!', 105, 280, { align: 'center' });
    doc.text('For support: support@smarttourism.in | +91 1800 123 4567', 105, 285, { align: 'center' });
    
    // Download
    const fileName = `${booking.type || 'booking'}_${booking.bookingReference || booking.id}_${Date.now()}.pdf`;
    doc.save(fileName);
  };

  const filteredBookings = bookings.filter(booking => {
    // Status filter
    if (filter === 'upcoming' && booking.status !== 'confirmed') return false;
    if (filter === 'completed' && booking.status !== 'completed') return false;
    if (filter === 'cancelled' && booking.status !== 'cancelled') return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const bookingRef = (booking.bookingReference || booking.id || '').toLowerCase();
      const name = (booking.hotelName || booking.name || '').toLowerCase();
      const dest = (booking.destination || booking.from || booking.to || '').toLowerCase();
      
      return (
        bookingRef.includes(query) ||
        name.includes(query) ||
        dest.includes(query)
      );
    }
    
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-2xl p-6">
        <h2 className="text-2xl mb-2">My Bookings</h2>
        <p className="text-blue-200 text-sm">Manage and track all your hotel reservations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl text-gray-900">{bookings.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-900" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl text-gray-900">
                {bookings.filter(b => b.status === 'confirmed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-900" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl text-gray-900">
                {bookings.filter(b => b.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-900" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl text-gray-900">
                ₹{bookings.reduce((sum, b) => sum + (b.totalAmount || b.price || 0), 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-orange-900" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by booking reference, hotel, or destination..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'upcoming' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'completed' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row">
                {/* Booking Image */}
                <div className="md:w-64 h-48 md:h-auto relative">
                  {booking.type === 'flight' ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                      <Plane className="w-20 h-20 text-white" />
                    </div>
                  ) : booking.type === 'train' ? (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                      <Train className="w-20 h-20 text-white" />
                    </div>
                  ) : (
                    <img 
                      src={booking.hotelImage} 
                      alt={booking.hotelName || booking.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-semibold text-gray-900">
                    {booking.type === 'flight' ? '✈️ Flight' : booking.type === 'train' ? '🚂 Train' : '🏨 Hotel'}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl text-gray-900">{booking.hotelName || booking.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {booking.type === 'hotel' ? booking.destination : `${booking.from} → ${booking.to}`}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {booking.guests || booking.passengers} {booking.type === 'hotel' ? 'Guests' : 'Passengers'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{booking.pnr ? 'PNR' : 'Booking Ref'}</p>
                      <p className="text-gray-900 font-mono">{booking.pnr || booking.bookingReference}</p>
                    </div>
                  </div>

                  {/* Type-specific details */}
                  {booking.type === 'hotel' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Check-in</p>
                        <p className="text-gray-900">
                          {new Date(booking.checkIn).toLocaleDateString('en-IN', { 
                            day: 'numeric', month: 'short', year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Check-out</p>
                        <p className="text-gray-900">
                          {new Date(booking.checkOut).toLocaleDateString('en-IN', { 
                            day: 'numeric', month: 'short', year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Room Type</p>
                        <p className="text-gray-900">{booking.roomType}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Date</p>
                        <p className="text-gray-900">
                          {new Date(booking.date).toLocaleDateString('en-IN', { 
                            day: 'numeric', month: 'short', year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Time</p>
                        <p className="text-gray-900">{booking.time}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Seats</p>
                        <p className="text-gray-900">{booking.details?.seatNumbers?.join(', ') || 'N/A'}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl text-blue-900">₹{(booking.totalAmount || booking.price || 0).toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-600">
                        {booking.type === 'hotel' ? `${booking.nights} nights` : `${booking.passengers} passenger(s)`}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => generatePDF(booking)}
                        className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-900 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl mb-2">Booking Details</h2>
              <p className="text-blue-200">{selectedBooking.bookingReference}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* QR Code */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 text-center">
                <div className="w-56 h-56 bg-white mx-auto rounded-xl border-4 border-blue-900 shadow-xl flex items-center justify-center mb-4 p-4">
                  <QRCodeSVG 
                    value={selectedBooking.qrCode} 
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-sm mb-2">
                  {selectedBooking.type === 'hotel' ? '🏨 Show this QR code at hotel check-in' : 
                   selectedBooking.type === 'flight' ? '✈️ Show this QR code at airport boarding' :
                   '🚂 Show this QR code at railway station'}
                </p>
                <p className="text-xs text-gray-600">Scan with any QR code scanner app to view ticket details</p>
              </div>

              {/* Type-specific Information */}
              {selectedBooking.type === 'hotel' ? (
                <div>
                  <h3 className="text-gray-900 mb-3">🏨 Hotel Information</h3>
                  <img 
                    src={selectedBooking.hotelImage} 
                    alt={selectedBooking.hotelName}
                    className="w-full h-48 object-cover rounded-xl mb-3"
                  />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hotel Name:</span>
                      <span className="text-gray-900">{selectedBooking.hotelName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Destination:</span>
                      <span className="text-gray-900">{selectedBooking.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room Type:</span>
                      <span className="text-gray-900">{selectedBooking.roomType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="text-gray-900">
                        {new Date(selectedBooking.checkIn).toLocaleDateString('en-IN', { 
                          day: 'numeric', month: 'long', year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="text-gray-900">
                        {new Date(selectedBooking.checkOut).toLocaleDateString('en-IN', { 
                          day: 'numeric', month: 'long', year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nights:</span>
                      <span className="text-gray-900">{selectedBooking.nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span className="text-gray-900">{selectedBooking.guests}</span>
                    </div>
                  </div>
                </div>
              ) : selectedBooking.type === 'flight' ? (
                <div>
                  <h3 className="text-gray-900 mb-3">✈️ Flight Information</h3>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 mb-3">
                    <div className="flex items-center justify-center">
                      <Plane className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Flight:</span>
                      <span className="text-gray-900">{selectedBooking.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">From:</span>
                      <span className="text-gray-900">{selectedBooking.from}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To:</span>
                      <span className="text-gray-900">{selectedBooking.to}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">
                        {new Date(selectedBooking.date).toLocaleDateString('en-IN', { 
                          day: 'numeric', month: 'long', year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="text-gray-900">{selectedBooking.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passengers:</span>
                      <span className="text-gray-900">{selectedBooking.passengers}</span>
                    </div>
                    {selectedBooking.details?.seatNumbers && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seats:</span>
                        <span className="text-gray-900">{selectedBooking.details.seatNumbers.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-gray-900 mb-3">🚂 Train Information</h3>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 mb-3">
                    <div className="flex items-center justify-center">
                      <Train className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Train:</span>
                      <span className="text-gray-900">{selectedBooking.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">From:</span>
                      <span className="text-gray-900">{selectedBooking.from}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To:</span>
                      <span className="text-gray-900">{selectedBooking.to}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">
                        {new Date(selectedBooking.date).toLocaleDateString('en-IN', { 
                          day: 'numeric', month: 'long', year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="text-gray-900">{selectedBooking.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passengers:</span>
                      <span className="text-gray-900">{selectedBooking.passengers}</span>
                    </div>
                    {selectedBooking.details?.seatNumbers && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seats:</span>
                        <span className="text-gray-900">{selectedBooking.details.seatNumbers.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Guest Details */}
              <div>
                <h3 className="text-gray-900 mb-3">👤 Guest Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="text-gray-900">{selectedBooking.guestDetails?.name || selectedBooking.details?.passengers?.[0]?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-900">{selectedBooking.guestDetails?.email || selectedBooking.details?.passengers?.[0]?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="text-gray-900">{selectedBooking.guestDetails?.phone || selectedBooking.details?.passengers?.[0]?.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <h3 className="text-gray-900 mb-3">💳 Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">₹{(selectedBooking.totalAmount || selectedBooking.price || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees:</span>
                    <span className="text-gray-900">₹{((selectedBooking.totalAmount || selectedBooking.price || 0) * 0.12).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-gray-200">
                    <span className="text-gray-900">Total Amount:</span>
                    <span className="text-xl text-blue-900">₹{((selectedBooking.totalAmount || selectedBooking.price || 0) * 1.12).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    generatePDF(selectedBooking);
                    setSelectedBooking(null);
                  }}
                  className="flex-1 bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-950 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}