import { useState } from 'react';
import { X, Calendar, Users, CreditCard } from 'lucide-react';

interface Hostel {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
  amenities: string[];
  description: string;
  available: boolean;
}

interface BookingModalProps {
  hostel: Hostel;
  onClose: () => void;
}

export function BookingModal({ hostel, onClose }: BookingModalProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isBooked, setIsBooked] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const totalPrice = calculateNights() * hostel.price * guests;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2>Book {hostel.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isBooked ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600">Your reservation has been successfully made.</p>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="p-6">
            <img
              src={hostel.image}
              alt={hostel.name}
              className="w-full h-48 object-cover rounded-lg mb-6"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Number of Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="mb-3">Booking Summary</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>${hostel.price} × {calculateNights()} nights × {guests} guests</span>
                  <span>${totalPrice || 0}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span>Total</span>
                  <span className="text-blue-900">${totalPrice || 0}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />
                Payment Method
              </label>
              <select
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="">Select payment method</option>
                <option value="card">Credit/Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors"
            >
              Confirm Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
}