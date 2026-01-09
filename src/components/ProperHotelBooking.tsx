import { useState } from 'react';
import { X, Calendar, Users, ChevronRight, Info } from 'lucide-react';
import { Hotel } from '../data/properHotelsDatabase';
import { ProperPaymentGateway } from './ProperPaymentGateway';

interface ProperHotelBookingProps {
  hotel: Hotel;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProperHotelBooking({ hotel, onClose, onSuccess }: ProperHotelBookingProps) {
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [selectedRoom, setSelectedRoom] = useState(hotel.rooms[0]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate nights and price when dates change
  const handleDateChange = (checkInDate: string, checkOutDate: string) => {
    setCheckIn(checkInDate);
    setCheckOut(checkOutDate);
    
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const nightCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      if (nightCount > 0) {
        setNights(nightCount);
        // Calculate total with taxes (12%)
        const basePrice = selectedRoom.price * nightCount;
        const totalWithTax = Math.round(basePrice * 1.12);
        setTotalPrice(totalWithTax);
      }
    }
  };

  const handleRoomChange = (room: typeof hotel.rooms[0]) => {
    setSelectedRoom(room);
    if (nights > 0) {
      // Calculate total with taxes (12%)
      const basePrice = room.price * nights;
      const totalWithTax = Math.round(basePrice * 1.12);
      setTotalPrice(totalWithTax);
    }
  };

  const handleProceedToPayment = () => {
    if (!checkIn || !checkOut || nights <= 0) {
      alert('Please select valid check-in and check-out dates');
      return;
    }
    if (guests > selectedRoom.available) {
      alert(`Only ${selectedRoom.available} rooms available for this type`);
      return;
    }
    setStep('payment');
  };

  const handlePaymentSuccess = (bookingId: string) => {
    onSuccess();
    onClose();
  };

  if (step === 'payment') {
    return (
      <ProperPaymentGateway
        amount={totalPrice}
        description={`${nights} night${nights > 1 ? 's' : ''}`}
        bookingDetails={{
          hotelId: hotel.id,
          hotelName: hotel.name,
          destination: hotel.destination,
          roomType: selectedRoom.type,
          checkIn,
          checkOut,
          guests
        }}
        onSuccess={handlePaymentSuccess}
        onClose={() => setStep('details')}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-8 animate-fadeIn">
        {/* Header */}
        <div className="relative">
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-full h-64 object-cover rounded-t-3xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h2 className="text-3xl font-bold text-white mb-2">{hotel.name}</h2>
            <p className="text-white text-opacity-90">{hotel.area}, {hotel.destination}</p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="p-6">
          {/* Room Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Select Room Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {hotel.rooms.map((room) => (
                <button
                  key={room.type}
                  onClick={() => handleRoomChange(room)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    selectedRoom.type === room.type
                      ? 'border-blue-900 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-1">{room.type}</p>
                  <p className="text-2xl font-bold text-blue-900">₹{room.price.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {room.available} {room.available === 1 ? 'room' : 'rooms'} available
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Check-in Date
              </label>
              <input
                type="date"
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(e.target.value, checkOut)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
              />
              <p className="text-xs text-gray-500 mt-1">From {hotel.checkInTime}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Check-out Date
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(checkIn, e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
              />
              <p className="text-xs text-gray-500 mt-1">Until {hotel.checkOutTime}</p>
            </div>
          </div>

          {/* Guests */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Number of Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-900"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          {/* Price Summary */}
          {nights > 0 && (
            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">₹{selectedRoom.price.toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''}</span>
                  <span className="font-medium">₹{(selectedRoom.price * nights).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees (12%)</span>
                  <span className="font-medium">₹{Math.round(selectedRoom.price * nights * 0.12).toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total Amount</span>
                    <span className="font-bold text-2xl text-blue-900">
                      ₹{Math.round(selectedRoom.price * nights * 1.12).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Policy */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 mb-1">Cancellation Policy</p>
                <p className="text-sm text-gray-600">{hotel.cancellationPolicy}</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Book Button */}
          <button
            onClick={handleProceedToPayment}
            disabled={!checkIn || !checkOut || nights <= 0}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl hover:shadow-2xl transition-all text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Proceed to Payment
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}