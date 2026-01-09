import { useState } from 'react';
import { Car, MapPin, Calendar, Users, DollarSign, Clock, Star, Phone, CheckCircle, ArrowLeft } from 'lucide-react';

interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  driverRating: number;
  driverPhone: string;
  from: string;
  to: string;
  date: string;
  time: string;
  availableSeats: number;
  totalSeats: number;
  costPerSeat: number;
  vehicleType: string;
  vehicleModel: string;
  vehicleNumber: string;
  status: 'available' | 'ongoing' | 'completed';
  isVerified: boolean;
  avatar: string;
}

interface RideRequest {
  id: string;
  rideId: string;
  passengerName: string;
  seatsRequested: number;
  status: 'pending' | 'accepted' | 'completed';
}

const MOCK_RIDES: Ride[] = [
  {
    id: 'r1',
    driverId: 'd1',
    driverName: 'Rajesh Kumar',
    driverRating: 4.8,
    driverPhone: '+91 98765 43210',
    from: 'Delhi',
    to: 'Jaipur',
    date: '2025-01-20',
    time: '06:00 AM',
    availableSeats: 3,
    totalSeats: 4,
    costPerSeat: 500,
    vehicleType: 'SUV',
    vehicleModel: 'Toyota Innova',
    vehicleNumber: 'DL 01 AB 1234',
    status: 'available',
    isVerified: true,
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 'r2',
    driverId: 'd2',
    driverName: 'Priya Sharma',
    driverRating: 4.9,
    driverPhone: '+91 98765 43211',
    from: 'Mumbai',
    to: 'Goa',
    date: '2025-01-22',
    time: '05:00 AM',
    availableSeats: 2,
    totalSeats: 3,
    costPerSeat: 800,
    vehicleType: 'Sedan',
    vehicleModel: 'Honda City',
    vehicleNumber: 'MH 02 CD 5678',
    status: 'available',
    isVerified: true,
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 'r3',
    driverId: 'd3',
    driverName: 'Amit Patel',
    driverRating: 4.7,
    driverPhone: '+91 98765 43212',
    from: 'Bangalore',
    to: 'Chennai',
    date: '2025-01-25',
    time: '07:00 AM',
    availableSeats: 4,
    totalSeats: 4,
    costPerSeat: 400,
    vehicleType: 'SUV',
    vehicleModel: 'Mahindra XUV',
    vehicleNumber: 'KA 03 EF 9012',
    status: 'available',
    isVerified: false,
    avatar: 'https://i.pravatar.cc/150?img=13'
  }
];

export function CarpoolSystem() {
  const [rides, setRides] = useState<Ride[]>(MOCK_RIDES);
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  const [offerFormData, setOfferFormData] = useState({
    from: 'Delhi',
    to: 'Jaipur',
    date: '',
    time: '06:00',
    availableSeats: 3,
    costPerSeat: 500,
    vehicleType: 'Sedan',
    vehicleModel: '',
    vehicleNumber: ''
  });

  const [requestFormData, setRequestFormData] = useState({
    from: 'Delhi',
    to: 'Jaipur',
    date: '',
    seatsNeeded: 1
  });

  const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Jaipur', 'Goa', 'Chennai', 'Kolkata', 'Hyderabad'];

  const handleOfferRide = () => {
    if (!offerFormData.date || !offerFormData.vehicleModel || !offerFormData.vehicleNumber) {
      alert('Please fill all required fields');
      return;
    }

    const newRide: Ride = {
      id: `ride-${Date.now()}`,
      driverId: 'current-user',
      driverName: 'You',
      driverRating: 5.0,
      driverPhone: '+91 98765 00000',
      from: offerFormData.from,
      to: offerFormData.to,
      date: offerFormData.date,
      time: offerFormData.time,
      availableSeats: offerFormData.availableSeats,
      totalSeats: offerFormData.availableSeats,
      costPerSeat: offerFormData.costPerSeat,
      vehicleType: offerFormData.vehicleType,
      vehicleModel: offerFormData.vehicleModel,
      vehicleNumber: offerFormData.vehicleNumber,
      status: 'available',
      isVerified: false,
      avatar: 'https://i.pravatar.cc/150?img=20'
    };

    setMyRides([...myRides, newRide]);
    setRides([...rides, newRide]);
    setShowOfferForm(false);
    alert('Ride offered successfully!');
  };

  const handleRequestRide = () => {
    if (!requestFormData.date) {
      alert('Please select a date');
      return;
    }

    const matchingRides = rides.filter(ride => 
      ride.from === requestFormData.from &&
      ride.to === requestFormData.to &&
      ride.date === requestFormData.date &&
      ride.availableSeats >= requestFormData.seatsNeeded
    );

    if (matchingRides.length === 0) {
      alert('No matching rides found. Try different dates or routes.');
    } else {
      setShowRequestForm(false);
      alert(`Found ${matchingRides.length} matching rides!`);
    }
  };

  const handleJoinRide = (ride: Ride, seatsRequested: number) => {
    if (seatsRequested > ride.availableSeats) {
      alert('Not enough seats available');
      return;
    }

    const newRequest: RideRequest = {
      id: `req-${Date.now()}`,
      rideId: ride.id,
      passengerName: 'You',
      seatsRequested,
      status: 'pending'
    };

    setRideRequests([...rideRequests, newRequest]);
    
    // Update available seats
    const updatedRides = rides.map(r => 
      r.id === ride.id 
        ? { ...r, availableSeats: r.availableSeats - seatsRequested }
        : r
    );
    setRides(updatedRides);

    alert('Ride request sent! Driver will confirm shortly.');
    
    // Simulate acceptance
    setTimeout(() => {
      const updatedRequests = rideRequests.map(req =>
        req.id === newRequest.id ? { ...req, status: 'accepted' as const } : req
      );
      setRideRequests(updatedRequests);
      alert('Ride request accepted! Check your bookings.');
    }, 2000);
  };

  const calculateSavings = (costPerSeat: number, seats: number) => {
    const totalCost = costPerSeat * seats;
    const uberCost = totalCost * 2.5;
    const savings = uberCost - totalCost;
    return {
      carpoolCost: totalCost,
      uberCost: Math.round(uberCost),
      savings: Math.round(savings)
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl p-6">
        <h2 className="text-2xl mb-2 flex items-center gap-3">
          <Car className="w-8 h-8" />
          Carpool & Ride Sharing
        </h2>
        <p className="text-orange-100 text-sm">Save money and travel sustainably</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setShowOfferForm(true)}
          className="bg-green-600 text-white p-6 rounded-2xl hover:bg-green-700 transition-all shadow-lg"
        >
          <Car className="w-8 h-8 mb-2" />
          <div className="text-xl">Offer a Ride</div>
          <div className="text-sm text-green-200">Share your car & earn</div>
        </button>

        <button
          onClick={() => setShowRequestForm(true)}
          className="bg-blue-900 text-white p-6 rounded-2xl hover:bg-blue-950 transition-all shadow-lg"
        >
          <Users className="w-8 h-8 mb-2" />
          <div className="text-xl">Find a Ride</div>
          <div className="text-sm text-blue-200">Join existing rides</div>
        </button>
      </div>

      {/* Offer Ride Form */}
      {showOfferForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-600">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setShowOfferForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h3 className="text-gray-900">Offer Your Ride</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-600 block mb-2">From *</label>
              <select
                value={offerFormData.from}
                onChange={(e) => setOfferFormData({ ...offerFormData, from: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600"
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">To *</label>
              <select
                value={offerFormData.to}
                onChange={(e) => setOfferFormData({ ...offerFormData, to: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600"
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">Date *</label>
              <input
                type="date"
                value={offerFormData.date}
                onChange={(e) => setOfferFormData({ ...offerFormData, date: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">Departure Time *</label>
              <input
                type="time"
                value={offerFormData.time}
                onChange={(e) => setOfferFormData({ ...offerFormData, time: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">Available Seats</label>
              <input
                type="number"
                min="1"
                max="7"
                value={offerFormData.availableSeats}
                onChange={(e) => setOfferFormData({ ...offerFormData, availableSeats: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">Cost per Seat (₹)</label>
              <input
                type="number"
                min="100"
                step="50"
                value={offerFormData.costPerSeat}
                onChange={(e) => setOfferFormData({ ...offerFormData, costPerSeat: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">Vehicle Type</label>
              <select
                value={offerFormData.vehicleType}
                onChange={(e) => setOfferFormData({ ...offerFormData, vehicleType: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600"
              >
                <option>Sedan</option>
                <option>SUV</option>
                <option>Hatchback</option>
                <option>Luxury</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">Vehicle Model *</label>
              <input
                type="text"
                value={offerFormData.vehicleModel}
                onChange={(e) => setOfferFormData({ ...offerFormData, vehicleModel: e.target.value })}
                placeholder="e.g., Honda City"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 block mb-2">Vehicle Number *</label>
              <input
                type="text"
                value={offerFormData.vehicleNumber}
                onChange={(e) => setOfferFormData({ ...offerFormData, vehicleNumber: e.target.value })}
                placeholder="e.g., DL 01 AB 1234"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-600"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowOfferForm(false)}
              className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleOfferRide}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors"
            >
              Offer Ride
            </button>
          </div>
        </div>
      )}

      {/* Request Ride Form */}
      {showRequestForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-900">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setShowRequestForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h3 className="text-gray-900">Find a Ride</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-600 block mb-2">From *</label>
              <select
                value={requestFormData.from}
                onChange={(e) => setRequestFormData({ ...requestFormData, from: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">To *</label>
              <select
                value={requestFormData.to}
                onChange={(e) => setRequestFormData({ ...requestFormData, to: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">Date *</label>
              <input
                type="date"
                value={requestFormData.date}
                onChange={(e) => setRequestFormData({ ...requestFormData, date: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">Seats Needed</label>
              <input
                type="number"
                min="1"
                max="5"
                value={requestFormData.seatsNeeded}
                onChange={(e) => setRequestFormData({ ...requestFormData, seatsNeeded: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowRequestForm(false)}
              className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRequestRide}
              className="flex-1 bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-950 transition-colors"
            >
              Search Rides
            </button>
          </div>
        </div>
      )}

      {/* Available Rides */}
      <div className="space-y-4">
        <h3 className="text-gray-900">Available Rides ({rides.filter(r => r.status === 'available').length})</h3>
        
        {rides.filter(r => r.status === 'available').length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No rides available yet. Be the first to offer!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {rides.filter(r => r.status === 'available').map(ride => {
              const savings = calculateSavings(ride.costPerSeat, 1);
              
              return (
                <div key={ride.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src={ride.avatar}
                      alt={ride.driverName}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-gray-900 flex items-center gap-2">
                            {ride.driverName}
                            {ride.isVerified && (
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            )}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {ride.driverRating}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl text-blue-900">₹{ride.costPerSeat}</p>
                          <p className="text-sm text-gray-600">per seat</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">From</p>
                      <p className="text-gray-900 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {ride.from}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">To</p>
                      <p className="text-gray-900 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {ride.to}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                      <p className="text-gray-900 flex items-center gap-1 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(ride.date).toLocaleDateString('en-IN')}
                      </p>
                      <p className="text-gray-900 flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4" />
                        {ride.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Available Seats</p>
                      <p className="text-gray-900">{ride.availableSeats}/{ride.totalSeats}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">Vehicle Details</p>
                    <p className="text-gray-900">{ride.vehicleType} - {ride.vehicleModel}</p>
                    <p className="text-sm text-gray-600">{ride.vehicleNumber}</p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
                    <p className="text-sm text-green-900 mb-2">💰 Cost Comparison</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Carpool</p>
                        <p className="text-green-900">₹{savings.carpoolCost}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Uber/Ola</p>
                        <p className="text-gray-900 line-through">₹{savings.uberCost}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">You Save</p>
                        <p className="text-green-600">₹{savings.savings}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinRide(ride, 1)}
                    disabled={ride.availableSeats === 0}
                    className={`w-full py-3 rounded-xl transition-colors ${
                      ride.availableSeats > 0
                        ? 'bg-blue-900 text-white hover:bg-blue-950'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {ride.availableSeats > 0 ? 'Join This Ride' : 'Fully Booked'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}