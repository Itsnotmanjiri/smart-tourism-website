import { useState, useEffect } from 'react';
import { X, Phone, MapPin, Hospital, Shield, Share2, Navigation, AlertCircle, Copy, Check } from 'lucide-react';

interface SOSProps {
  onClose: () => void;
}

interface Hospital {
  name: string;
  address: string;
  phone: string;
  distance: string;
  specialties: string[];
  available247: boolean;
}

const HOSPITALS_BY_CITY: Record<string, Hospital[]> = {
  'Mumbai': [
    {
      name: 'Lilavati Hospital & Research Centre',
      address: 'A-791, Bandra Reclamation, Bandra West, Mumbai - 400050',
      phone: '022-26567891',
      distance: '2.3 km',
      specialties: ['Emergency', 'Trauma', 'Cardiology', 'Neurology'],
      available247: true
    },
    {
      name: 'Kokilaben Dhirubhai Ambani Hospital',
      address: 'Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai - 400053',
      phone: '022-30999999',
      distance: '3.5 km',
      specialties: ['Emergency', 'ICU', 'Surgery', 'Pediatrics'],
      available247: true
    },
    {
      name: 'Hinduja Hospital',
      address: 'Veer Savarkar Marg, Mahim West, Mumbai - 400016',
      phone: '022-24447777',
      distance: '4.1 km',
      specialties: ['Emergency', 'Cardiology', 'Orthopedics'],
      available247: true
    },
    {
      name: 'Breach Candy Hospital',
      address: '60-A, Bhulabhai Desai Road, Mumbai - 400026',
      phone: '022-23667788',
      distance: '5.2 km',
      specialties: ['Emergency', 'Trauma', 'ICU'],
      available247: true
    }
  ],
  'Delhi': [
    {
      name: 'AIIMS (All India Institute of Medical Sciences)',
      address: 'Ansari Nagar, New Delhi - 110029',
      phone: '011-26588500',
      distance: '1.8 km',
      specialties: ['Emergency', 'Trauma', 'All Specialties'],
      available247: true
    },
    {
      name: 'Apollo Hospital',
      address: 'Mathura Road, Sarita Vihar, New Delhi - 110076',
      phone: '011-26825858',
      distance: '3.2 km',
      specialties: ['Emergency', 'Cardiology', 'Neurology'],
      available247: true
    },
    {
      name: 'Fortis Escorts Heart Institute',
      address: 'Okhla Road, New Delhi - 110025',
      phone: '011-47135000',
      distance: '4.5 km',
      specialties: ['Emergency', 'Cardiac', 'Critical Care'],
      available247: true
    },
    {
      name: 'Max Super Speciality Hospital',
      address: 'Press Enclave Road, Saket, New Delhi - 110017',
      phone: '011-26515050',
      distance: '5.1 km',
      specialties: ['Emergency', 'Trauma', 'Surgery'],
      available247: true
    }
  ],
  'Bangalore': [
    {
      name: 'Manipal Hospital',
      address: '98, HAL Airport Road, Bangalore - 560017',
      phone: '080-25023344',
      distance: '2.1 km',
      specialties: ['Emergency', 'Multi-specialty'],
      available247: true
    },
    {
      name: 'Apollo Hospital',
      address: '154/11, Opp. IIM-B, Bannerghatta Road, Bangalore - 560076',
      phone: '080-26304050',
      distance: '3.8 km',
      specialties: ['Emergency', 'Critical Care'],
      available247: true
    },
    {
      name: 'Fortis Hospital',
      address: '14, Cunningham Road, Bangalore - 560052',
      phone: '080-66206666',
      distance: '4.2 km',
      specialties: ['Emergency', 'Cardiology'],
      available247: true
    },
    {
      name: 'Columbia Asia Hospital',
      address: 'Kirloskar Business Park, Hebbal, Bangalore - 560024',
      phone: '080-66581444',
      distance: '5.3 km',
      specialties: ['Emergency', 'Pediatrics'],
      available247: true
    }
  ],
  'Goa': [
    {
      name: 'Manipal Hospital Goa',
      address: 'Panaji-Ponda Highway, Dona Paula, Goa - 403004',
      phone: '0832-2519200',
      distance: '1.5 km',
      specialties: ['Emergency', 'Trauma'],
      available247: true
    },
    {
      name: 'Apollo Victor Hospital',
      address: 'Victor Albuquerque Road, Margao, Goa - 403601',
      phone: '0832-2736666',
      distance: '8.2 km',
      specialties: ['Emergency', 'Surgery'],
      available247: true
    }
  ],
  'Kerala': [
    {
      name: 'Amrita Institute of Medical Sciences',
      address: 'AIMS Ponekkara, Kochi - 682041',
      phone: '0484-2851234',
      distance: '2.8 km',
      specialties: ['Emergency', 'All Specialties'],
      available247: true
    },
    {
      name: 'KIMS Hospital',
      address: 'PB No.1, Trivandrum - 695029',
      phone: '0471-3041400',
      distance: '3.5 km',
      specialties: ['Emergency', 'Critical Care'],
      available247: true
    }
  ]
};

export function EnhancedSOSEmergency({ onClose }: SOSProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationShared, setLocationShared] = useState(false);
  const [city, setCity] = useState('Mumbai');
  const [copied, setCopied] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(true);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsGettingLocation(false);
          setLocationError('');
        },
        (error) => {
          // Suppress console error - we handle it gracefully
          setIsGettingLocation(false);
          
          // Provide user-friendly error messages
          if (error && typeof error.code !== 'undefined') {
            switch (error.code) {
              case 1: // PERMISSION_DENIED
                setLocationError('Location access denied. Please enable location permissions in your browser settings.');
                break;
              case 2: // POSITION_UNAVAILABLE
                setLocationError('Location information unavailable. Please check your device settings.');
                break;
              case 3: // TIMEOUT
                setLocationError('Location request timed out. Please try again.');
                break;
              default:
                setLocationError('Unable to get location. You can still use emergency services below.');
            }
          } else {
            setLocationError('Unable to get location. You can still use emergency services below.');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setIsGettingLocation(false);
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  const retryLocation = () => {
    setIsGettingLocation(true);
    setLocationError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsGettingLocation(false);
          setLocationError('');
        },
        (error) => {
          setIsGettingLocation(false);
          if (error && typeof error.code !== 'undefined') {
            switch (error.code) {
              case 1: // PERMISSION_DENIED
                setLocationError('Location access denied. Please enable location permissions in your browser settings.');
                break;
              case 2: // POSITION_UNAVAILABLE
                setLocationError('Location information unavailable. Please check your device settings.');
                break;
              case 3: // TIMEOUT
                setLocationError('Location request timed out. Please try again.');
                break;
              default:
                setLocationError('Unable to get location. You can still use emergency services below.');
            }
          } else {
            setLocationError('Unable to get location. You can still use emergency services below.');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  };

  const shareLocation = () => {
    if (location) {
      const locationUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
      const message = `🚨 EMERGENCY ALERT! I need help. My current location: ${locationUrl}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Emergency Location',
          text: message,
          url: locationUrl
        }).then(() => {
          setLocationShared(true);
        }).catch(console.error);
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(message);
        setLocationShared(true);
        alert('Location copied to clipboard! Share it with your emergency contacts.');
      }
    }
  };

  const callEmergency = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const copyHospitalInfo = (hospital: Hospital) => {
    const info = `${hospital.name}\n${hospital.address}\nPhone: ${hospital.phone}`;
    navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hospitals = HOSPITALS_BY_CITY[city] || HOSPITALS_BY_CITY['Mumbai'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl mb-2 flex items-center gap-3">
                <Shield className="w-8 h-8 animate-pulse" />
                Emergency SOS
              </h2>
              <p className="text-red-100 text-sm">Quick access to emergency services</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Location Sharing */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <Share2 className="w-6 h-6 text-blue-900" />
              Share Your Live Location
            </h3>
            {location ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Your Current Location</p>
                      <p className="text-lg">📍 Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}</p>
                    </div>
                    <a
                      href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Navigation className="w-4 h-4" />
                      View on Map
                    </a>
                  </div>
                </div>
                <button
                  onClick={shareLocation}
                  className={`w-full py-4 rounded-xl transition-all flex items-center justify-center gap-3 ${
                    locationShared
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-900 text-white hover:bg-blue-950'
                  }`}
                >
                  {locationShared ? (
                    <>
                      <Check className="w-6 h-6" />
                      Location Shared Successfully
                    </>
                  ) : (
                    <>
                      <Share2 className="w-6 h-6" />
                      Share Location with Emergency Contacts
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-600 text-center">
                  Location will be shared via messaging apps or copied to clipboard
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                {isGettingLocation ? (
                  <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <MapPin className="w-8 h-8 text-blue-900" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <MapPin className="w-8 h-8 text-red-900" />
                  </div>
                )}
                <p className="text-gray-700">Getting your location...</p>
                <p className="text-sm text-gray-600 mt-2">Please allow location access when prompted</p>
                {locationError && (
                  <div className="mt-4 text-sm text-red-500">
                    <p>{locationError}</p>
                    <button
                      onClick={retryLocation}
                      className="mt-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Emergency Numbers */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border-2 border-red-200">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-6 h-6 text-red-900" />
              Emergency Contact Numbers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: 'Universal Emergency', number: '112', icon: '🚨' },
                { name: 'Police', number: '100', icon: '👮' },
                { name: 'Ambulance', number: '102', icon: '🚑' },
                { name: 'Fire', number: '101', icon: '🚒' },
                { name: 'Women Helpline', number: '1091', icon: '👩' },
                { name: 'Tourist Helpline', number: '1363', icon: '🧳' }
              ].map((emergency) => (
                <button
                  key={emergency.number}
                  onClick={() => callEmergency(emergency.number)}
                  className="bg-white rounded-xl p-4 hover:shadow-lg transition-all text-left border-2 border-transparent hover:border-red-500"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{emergency.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{emergency.name}</p>
                        <p className="text-2xl text-red-900">{emergency.number}</p>
                      </div>
                    </div>
                    <Phone className="w-5 h-5 text-red-900" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Nearby Hospitals */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 flex items-center gap-2">
                <Hospital className="w-6 h-6 text-green-900" />
                Nearby Hospitals - 24/7 Emergency
              </h3>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="px-4 py-2 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-900"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Goa">Goa</option>
                <option value="Kerala">Kerala</option>
              </select>
            </div>
            <div className="space-y-3">
              {hospitals.map((hospital, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 border-2 border-green-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{hospital.name}</h4>
                        {hospital.available247 && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">24/7</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{hospital.address}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {hospital.specialties.map((spec, i) => (
                          <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-900 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {hospital.distance} away
                        </span>
                        <a
                          href={`tel:${hospital.phone}`}
                          className="text-red-900 flex items-center gap-1 hover:underline"
                        >
                          <Phone className="w-4 h-4" />
                          {hospital.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => copyHospitalInfo(hospital)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Copy info"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(hospital.name + ' ' + hospital.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                        title="Navigate"
                      >
                        <Navigation className="w-4 h-4 text-blue-900" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
            <h3 className="text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-yellow-900" />
              Safety Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Stay calm and assess the situation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Share your location with trusted contacts immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Call emergency services (112) for immediate help</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Move to a safe, well-lit public area if possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Keep your phone charged and accessible at all times</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}