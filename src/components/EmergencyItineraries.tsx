import { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Clock, 
  MapPin, 
  Download, 
  Sparkles,
  Phone,
  Hospital,
  Navigation,
  Share2,
  Shield,
  Ambulance,
  FileText,
  Map as MapIcon
} from 'lucide-react';

interface EmergencyItinerary {
  id: string;
  destination: string;
  duration: string;
  type: string;
  activities: {
    time: string;
    title: string;
    description: string;
    location: string;
  }[];
}

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  icon: any;
  color: string;
}

const emergencyItineraries: EmergencyItinerary[] = [
  {
    id: '1',
    destination: 'Paris',
    duration: '1 Day',
    type: 'Quick City Tour',
    activities: [
      {
        time: '8:00 AM',
        title: 'Breakfast at Local Café',
        description: 'Start with fresh croissants and coffee',
        location: 'Le Marais District'
      },
      {
        time: '9:30 AM',
        title: 'Eiffel Tower Visit',
        description: 'Skip the line tickets recommended',
        location: 'Champ de Mars'
      },
      {
        time: '12:00 PM',
        title: 'Lunch at Bistro',
        description: 'Try authentic French cuisine',
        location: 'Latin Quarter'
      },
      {
        time: '2:00 PM',
        title: 'Louvre Museum',
        description: 'See the Mona Lisa and key artworks',
        location: 'Rue de Rivoli'
      },
      {
        time: '5:00 PM',
        title: 'Seine River Walk',
        description: 'Stroll along the river at sunset',
        location: 'Seine River Banks'
      },
      {
        time: '7:00 PM',
        title: 'Dinner in Montmartre',
        description: 'Enjoy dinner with city views',
        location: 'Montmartre'
      }
    ]
  },
  {
    id: '2',
    destination: 'Tokyo',
    duration: '1 Day',
    type: 'Cultural Experience',
    activities: [
      {
        time: '7:00 AM',
        title: 'Tsukiji Fish Market',
        description: 'Fresh sushi breakfast',
        location: 'Tsukiji'
      },
      {
        time: '9:00 AM',
        title: 'Senso-ji Temple',
        description: 'Ancient Buddhist temple visit',
        location: 'Asakusa'
      },
      {
        time: '11:30 AM',
        title: 'Traditional Ramen Lunch',
        description: 'Authentic Japanese ramen',
        location: 'Shibuya'
      },
      {
        time: '1:00 PM',
        title: 'Shibuya Crossing',
        description: 'Experience the famous crossing',
        location: 'Shibuya'
      },
      {
        time: '3:00 PM',
        title: 'Meiji Shrine',
        description: 'Peaceful shrine in the city',
        location: 'Harajuku'
      },
      {
        time: '6:00 PM',
        title: 'Tokyo Skytree',
        description: 'Sunset views from the tower',
        location: 'Sumida'
      }
    ]
  },
  {
    id: '3',
    destination: 'Bali',
    duration: '1 Day',
    type: 'Beach & Culture',
    activities: [
      {
        time: '6:00 AM',
        title: 'Sunrise at Beach',
        description: 'Yoga on the beach',
        location: 'Seminyak Beach'
      },
      {
        time: '8:30 AM',
        title: 'Breakfast Bowl',
        description: 'Healthy açai bowl',
        location: 'Canggu'
      },
      {
        time: '10:00 AM',
        title: 'Rice Terraces Visit',
        description: 'Explore Tegallalang terraces',
        location: 'Ubud'
      },
      {
        time: '12:30 PM',
        title: 'Traditional Lunch',
        description: 'Nasi goreng and local dishes',
        location: 'Ubud Center'
      },
      {
        time: '2:00 PM',
        title: 'Monkey Forest',
        description: 'Sacred monkey sanctuary',
        location: 'Ubud'
      },
      {
        time: '5:00 PM',
        title: 'Uluwatu Temple',
        description: 'Sunset temple on cliff',
        location: 'Uluwatu'
      }
    ]
  }
];

const emergencyContacts: EmergencyContact[] = [
  {
    id: 'police',
    name: 'Police',
    number: '911',
    icon: Shield,
    color: 'bg-blue-600'
  },
  {
    id: 'ambulance',
    name: 'Ambulance',
    number: '911',
    icon: Ambulance,
    color: 'bg-red-600'
  },
  {
    id: 'fire',
    name: 'Fire Department',
    number: '911',
    icon: AlertCircle,
    color: 'bg-orange-600'
  }
];

export function EmergencyItineraries() {
  const [selectedDestination, setSelectedDestination] = useState('');
  const [generatedItinerary, setGeneratedItinerary] = useState<EmergencyItinerary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeEmergencyTab, setActiveEmergencyTab] = useState<'services' | 'itineraries'>('services');
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationShared, setLocationShared] = useState(false);

  const destinations = ['Paris', 'Tokyo', 'Bali', 'New York', 'Dubai', 'London'];

  useEffect(() => {
    // Automatically get user location on component mount
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        // Silently handle geolocation errors
        setIsLoadingLocation(false);
      },
      {
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleEmergencyCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const findNearbyHospitals = () => {
    if (!userLocation) {
      alert('Please enable location services to find nearby hospitals');
      return;
    }

    // Open Google Maps with hospital search
    const url = `https://www.google.com/maps/search/hospitals/@${userLocation.latitude},${userLocation.longitude},15z`;
    window.open(url, '_blank');
  };

  const shareLocation = () => {
    if (!userLocation) {
      alert('Location not available. Please enable location services.');
      return;
    }

    const locationUrl = `https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`;
    const message = `My current location: ${locationUrl}`;

    if (navigator.share) {
      navigator.share({
        title: 'My Location',
        text: message,
        url: locationUrl
      }).then(() => {
        setLocationShared(true);
        setTimeout(() => setLocationShared(false), 3000);
      }).catch((error) => {
        // Fallback to copying to clipboard
        copyLocationToClipboard(message);
      });
    } else {
      // Fallback to copying to clipboard
      copyLocationToClipboard(message);
    }
  };

  const copyLocationToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setLocationShared(true);
      setTimeout(() => setLocationShared(false), 3000);
    });
  };

  const openInMaps = () => {
    if (!userLocation) {
      alert('Location not available. Please enable location services.');
      return;
    }

    const url = `https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`;
    window.open(url, '_blank');
  };

  const handleGenerate = () => {
    if (!selectedDestination) return;

    setIsGenerating(true);
    
    setTimeout(() => {
      const itinerary = emergencyItineraries.find(
        (it) => it.destination === selectedDestination
      ) || emergencyItineraries[0];
      
      setGeneratedItinerary(itinerary);
      setIsGenerating(false);
    }, 1500);
  };

  const handleDownload = () => {
    if (!generatedItinerary) return;
    
    const text = `
${generatedItinerary.destination} - ${generatedItinerary.duration} ${generatedItinerary.type}

${generatedItinerary.activities.map((activity) => `
${activity.time} - ${activity.title}
${activity.description}
Location: ${activity.location}
`).join('\n')}
    `;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedItinerary.destination}-itinerary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-blue-900 mb-2">Emergency Services & Itineraries</h2>
        <p className="text-gray-600">Quick access to emergency services and instant travel plans</p>
      </div>

      {/* Emergency Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveEmergencyTab('services')}
            className={`flex-1 py-4 px-6 transition-colors ${
              activeEmergencyTab === 'services'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-600 hover:text-red-600'
            }`}
          >
            <AlertCircle className="w-5 h-5 inline mr-2" />
            Emergency Services
          </button>
          <button
            onClick={() => setActiveEmergencyTab('itineraries')}
            className={`flex-1 py-4 px-6 transition-colors ${
              activeEmergencyTab === 'itineraries'
                ? 'border-b-2 border-blue-900 text-blue-900'
                : 'text-gray-600 hover:text-blue-900'
            }`}
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            Quick Itineraries
          </button>
        </div>
      </div>

      {/* Emergency Services Tab */}
      {activeEmergencyTab === 'services' && (
        <div className="space-y-6">
          {/* Location Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-red-600" />
              Your Location
            </h3>
            
            {isLoadingLocation && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-blue-600">Getting your location...</span>
              </div>
            )}

            {locationError && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <p className="text-yellow-800">{locationError}</p>
                <button
                  onClick={getCurrentLocation}
                  className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {userLocation && !isLoadingLocation && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <MapPin className="w-5 h-5" />
                    <span>Location detected successfully</span>
                  </div>
                  <p className="text-green-700">
                    Lat: {userLocation.latitude.toFixed(6)}, Long: {userLocation.longitude.toFixed(6)}
                  </p>
                  <p className="text-green-600">Accuracy: ±{Math.round(userLocation.accuracy)}m</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={shareLocation}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    {locationShared ? 'Location Shared!' : 'Share Location'}
                  </button>
                  <button
                    onClick={openInMaps}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors"
                  >
                    <MapIcon className="w-5 h-5" />
                    Open in Maps
                  </button>
                  <button
                    onClick={getCurrentLocation}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Navigation className="w-5 h-5" />
                    Refresh Location
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-red-600" />
              Emergency Contacts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emergencyContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleEmergencyCall(contact.number)}
                  className={`${contact.color} text-white p-6 rounded-xl hover:opacity-90 transition-opacity`}
                >
                  <contact.icon className="w-8 h-8 mx-auto mb-3" />
                  <h4 className="mb-2">{contact.name}</h4>
                  <p className="text-xl">{contact.number}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Services */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="mb-4">Quick Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={findNearbyHospitals}
                className="flex items-center gap-4 p-4 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <div className="p-3 bg-red-100 rounded-lg">
                  <Hospital className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-left">
                  <h4 className="mb-1">Find Hospitals</h4>
                  <p className="text-gray-600">Locate nearby medical facilities</p>
                </div>
              </button>

              <button
                onClick={() => {
                  if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const destination = encodeURIComponent('pharmacy');
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${destination}&origin=${position.coords.latitude},${position.coords.longitude}`,
                          '_blank'
                        );
                      },
                      () => {
                        // Fallback if geolocation fails
                        window.open(`https://www.google.com/maps/search/pharmacy`, '_blank');
                      }
                    );
                  } else {
                    window.open(`https://www.google.com/maps/search/pharmacy`, '_blank');
                  }
                }}
                className="flex items-center gap-4 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors"
              >
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h4 className="mb-1">Find Pharmacy</h4>
                  <p className="text-gray-600">Locate nearby pharmacies</p>
                </div>
              </button>

              <button
                onClick={() => {
                  if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const destination = encodeURIComponent('police station');
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${destination}&origin=${position.coords.latitude},${position.coords.longitude}`,
                          '_blank'
                        );
                      },
                      () => {
                        // Fallback if geolocation fails
                        window.open(`https://www.google.com/maps/search/police+station`, '_blank');
                      }
                    );
                  } else {
                    window.open(`https://www.google.com/maps/search/police+station`, '_blank');
                  }
                }}
                className="flex items-center gap-4 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="mb-1">Police Stations</h4>
                  <p className="text-gray-600">Find nearest police station</p>
                </div>
              </button>

              <button
                onClick={() => {
                  if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const destination = encodeURIComponent('embassy');
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${destination}&origin=${position.coords.latitude},${position.coords.longitude}`,
                          '_blank'
                        );
                      },
                      () => {
                        // Fallback if geolocation fails
                        window.open(`https://www.google.com/maps/search/embassy`, '_blank');
                      }
                    );
                  } else {
                    window.open(`https://www.google.com/maps/search/embassy`, '_blank');
                  }
                }}
                className="flex items-center gap-4 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MapIcon className="w-6 h-6 text-blue-900" />
                </div>
                <div className="text-left">
                  <h4 className="mb-1">Embassies</h4>
                  <p className="text-gray-600">Find embassy locations</p>
                </div>
              </button>
            </div>
          </div>

          {/* Emergency Tips */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-red-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Emergency Safety Tips
            </h3>
            <ul className="space-y-2 text-red-800">
              <li>• Always keep your phone charged and with you</li>
              <li>• Save important contacts in your phone</li>
              <li>• Know the local emergency numbers</li>
              <li>• Share your location with trusted contacts</li>
              <li>• Keep a copy of important documents</li>
              <li>• Have travel insurance information accessible</li>
            </ul>
          </div>
        </div>
      )}

      {/* Itineraries Tab */}
      {activeEmergencyTab === 'itineraries' && (
        <div>
          {/* Generator Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-900" />
              </div>
              <div>
                <h3>Generate Your Itinerary</h3>
                <p className="text-gray-600">AI-powered plans in seconds</p>
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="">Select destination...</option>
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>

              <button
                onClick={handleGenerate}
                disabled={!selectedDestination || isGenerating}
                className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Itinerary */}
          {generatedItinerary && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-blue-900 mb-1">{generatedItinerary.destination}</h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{generatedItinerary.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{generatedItinerary.type}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>

              <div className="space-y-4">
                {generatedItinerary.activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-900" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="mb-1">{activity.title}</h3>
                          <p className="text-blue-900">{activity.time}</p>
                        </div>
                        <p className="text-gray-600 mb-2">{activity.description}</p>
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{activity.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-900 mb-1">Emergency Travel Tips</p>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Book tickets in advance when possible</li>
                      <li>• Keep emergency contacts saved</li>
                      <li>• Share your itinerary with family/friends</li>
                      <li>• Have offline maps downloaded</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pre-made Templates */}
          {!generatedItinerary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {emergencyItineraries.map((itinerary) => (
                <div
                  key={itinerary.id}
                  className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => setGeneratedItinerary(itinerary)}
                >
                  <h3 className="mb-3">{itinerary.destination}</h3>
                  <div className="space-y-2 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{itinerary.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{itinerary.type}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {itinerary.activities.length} activities planned
                  </p>
                  <button className="w-full py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors">
                    View Itinerary
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}