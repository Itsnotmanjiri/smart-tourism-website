import { Phone, MapPin, Heart, Shield, Navigation, WifiOff, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface EmergencyService {
  id: string;
  name: string;
  phone: string;
  type: 'police' | 'medical' | 'fire' | 'support';
  distance?: string;
  available24x7: boolean;
}

const emergencyServices: EmergencyService[] = [
  {
    id: 'police',
    name: 'Police Emergency',
    phone: '100',
    type: 'police',
    available24x7: true
  },
  {
    id: 'medical',
    name: 'Ambulance',
    phone: '108',
    type: 'medical',
    available24x7: true
  },
  {
    id: 'fire',
    name: 'Fire Brigade',
    phone: '101',
    type: 'fire',
    available24x7: true
  },
  {
    id: 'women',
    name: 'Women Helpline',
    phone: '1091',
    type: 'support',
    available24x7: true
  },
  {
    id: 'tourist',
    name: 'Tourist Helpline',
    phone: '1363',
    type: 'support',
    available24x7: true
  }
];

interface NearbyHospital {
  id: string;
  name: string;
  distance: string;
  phone: string;
  hasEmergency: boolean;
}

const mockNearbyHospitals: NearbyHospital[] = [
  {
    id: 'h1',
    name: 'City General Hospital',
    distance: '1.2 km',
    phone: '+91-141-2234567',
    hasEmergency: true
  },
  {
    id: 'h2',
    name: 'Fortis Healthcare',
    distance: '2.5 km',
    phone: '+91-141-2234890',
    hasEmergency: true
  }
];

interface EmergencyModeProps {
  isOffline?: boolean;
  currentLocation?: string;
}

export function EmergencyMode({ isOffline = false, currentLocation }: EmergencyModeProps) {
  const [sharingLocation, setSharingLocation] = useState(false);

  const handleEmergencyCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      setSharingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const message = `Emergency! My location: https://maps.google.com/?q=${latitude},${longitude}`;
          
          // In a real app, this would send to emergency contacts
          console.log('Location shared:', message);
          
          // For demo, show alert
          alert('Location shared with emergency contacts');
          setSharingLocation(false);
        },
        (error) => {
          // Silently handle geolocation errors
          setSharingLocation(false);
        },
        {
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Emergency Header */}
      <div className="bg-red-600 text-white rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8" />
          <div>
            <h2 className="text-white">Emergency Services</h2>
            <p className="text-red-100">Quick access to help when you need it most</p>
          </div>
        </div>

        {isOffline && (
          <div className="bg-red-700 rounded-lg p-3 flex items-center gap-3">
            <WifiOff className="w-5 h-5" />
            <div>
              <p className="text-white">Offline Mode Active</p>
              <p className="text-red-100">Emergency calls and SMS still work without internet</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={handleShareLocation}
          disabled={sharingLocation}
          className="bg-white border-2 border-blue-900 rounded-xl p-6 hover:bg-blue-50 transition-colors text-left disabled:opacity-50"
        >
          <div className="flex items-center justify-between mb-2">
            <Navigation className="w-8 h-8 text-blue-900" />
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-blue-900 mb-1">
            {sharingLocation ? 'Sharing Location...' : 'Share Live Location'}
          </h3>
          <p className="text-gray-600">Send your real-time location to emergency contacts</p>
        </button>

        <button
          onClick={() => handleEmergencyCall('108')}
          className="bg-red-600 rounded-xl p-6 hover:bg-red-700 transition-colors text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-8 h-8 text-white" />
            <ChevronRight className="w-5 h-5 text-red-200" />
          </div>
          <h3 className="text-white mb-1">Medical Emergency</h3>
          <p className="text-red-100">Call ambulance immediately</p>
        </button>
      </div>

      {/* Emergency Numbers */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-gray-900 mb-4">Emergency Contacts</h3>
        <div className="space-y-3">
          {emergencyServices.map((service) => (
            <button
              key={service.id}
              onClick={() => handleEmergencyCall(service.phone)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  service.type === 'police' ? 'bg-blue-100' :
                  service.type === 'medical' ? 'bg-red-100' :
                  service.type === 'fire' ? 'bg-orange-100' :
                  'bg-purple-100'
                }`}>
                  <Phone className={`w-6 h-6 ${
                    service.type === 'police' ? 'text-blue-600' :
                    service.type === 'medical' ? 'text-red-600' :
                    service.type === 'fire' ? 'text-orange-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <div className="text-left">
                  <p className="text-gray-900">{service.name}</p>
                  <p className="text-blue-900">{service.phone}</p>
                </div>
              </div>
              {service.available24x7 && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  24×7
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Hospitals */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Nearby Hospitals</h3>
          {!isOffline && (
            <button className="text-blue-900 hover:underline flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              View on Map
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {mockNearbyHospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-gray-900 mb-1">{hospital.name}</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{hospital.distance}</span>
                  </div>
                </div>
                {hospital.hasEmergency && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                    Emergency
                  </span>
                )}
              </div>
              
              <button
                onClick={() => handleEmergencyCall(hospital.phone)}
                className="w-full mt-3 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call {hospital.phone}
              </button>
            </div>
          ))}
        </div>

        {isOffline && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-amber-900">
              Hospital information cached from last online session. Verify availability before visiting.
            </p>
          </div>
        )}
      </div>

      {/* Safety Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-900 mb-2">Safety Tips</p>
        <ul className="space-y-1 text-blue-800">
          <li>• Stay calm and assess the situation</li>
          <li>• Share your location with trusted contacts</li>
          <li>• Keep your phone charged in emergency situations</li>
          <li>• Know your current address or nearby landmarks</li>
        </ul>
      </div>
    </div>
  );
}