import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, X, Layers, Route, Star, Phone, Clock, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'hotel' | 'attraction' | 'restaurant' | 'transport';
  rating?: number;
  price?: number;
  address?: string;
  phone?: string;
  hours?: string;
  image?: string;
}

interface GoogleMapsIntegrationProps {
  centerCity?: string;
  showHotels?: boolean;
  showAttractions?: boolean;
  highlightedLocationId?: string;
  onLocationSelect?: (location: Location) => void;
  onBack?: () => void;
}

export function GoogleMapsIntegration({ 
  centerCity = 'Delhi', 
  showHotels = true,
  showAttractions = true,
  highlightedLocationId,
  onLocationSelect,
  onBack
}: GoogleMapsIntegrationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [routeMode, setRouteMode] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<Location[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock data for Indian cities with real coordinates
  const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    Delhi: { lat: 28.6139, lng: 77.2090 },
    Mumbai: { lat: 19.0760, lng: 72.8777 },
    Bangalore: { lat: 12.9716, lng: 77.5946 },
    Goa: { lat: 15.2993, lng: 74.1240 },
    Jaipur: { lat: 26.9124, lng: 75.7873 },
    Agra: { lat: 27.1767, lng: 78.0081 },
    Kerala: { lat: 10.8505, lng: 76.2711 },
    Varanasi: { lat: 25.3176, lng: 82.9739 },
    Udaipur: { lat: 24.5854, lng: 73.7125 },
    Manali: { lat: 32.2396, lng: 77.1887 },
    Rishikesh: { lat: 30.0869, lng: 78.2676 }
  };

  // Mock locations data for demonstration
  const mockLocations: Location[] = [
    // Hotels
    { id: 'h1', name: 'The Oberoi Delhi', lat: 28.6158, lng: 77.2110, type: 'hotel', rating: 4.8, price: 12000, address: 'Dr Zakir Hussain Marg, New Delhi', phone: '+91-11-2436-3030', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
    { id: 'h2', name: 'Taj Palace Mumbai', lat: 19.0820, lng: 72.8845, type: 'hotel', rating: 4.7, price: 15000, address: 'Colaba, Mumbai', phone: '+91-22-6665-3366', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400' },
    { id: 'h3', name: 'Leela Palace Bangalore', lat: 12.9750, lng: 77.6088, type: 'hotel', rating: 4.9, price: 14000, address: 'Old Airport Road, Bangalore', phone: '+91-80-2521-1234', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400' },
    
    // Attractions
    { id: 'a1', name: 'India Gate', lat: 28.6129, lng: 77.2295, type: 'attraction', rating: 4.6, address: 'Rajpath, New Delhi', hours: 'Open 24 hours', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400' },
    { id: 'a2', name: 'Qutub Minar', lat: 28.5244, lng: 77.1855, type: 'attraction', rating: 4.5, address: 'Mehrauli, New Delhi', hours: '7 AM - 5 PM', image: 'https://images.unsplash.com/photo-1586339277861-b0b895343ba5?w=400' },
    { id: 'a3', name: 'Red Fort', lat: 28.6562, lng: 77.2410, type: 'attraction', rating: 4.4, address: 'Netaji Subhash Marg, Old Delhi', hours: '9:30 AM - 4:30 PM', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=400' },
    
    // Restaurants
    { id: 'r1', name: 'Indian Accent', lat: 28.5984, lng: 77.2176, type: 'restaurant', rating: 4.7, price: 3000, address: 'The Lodhi, New Delhi', hours: '12 PM - 11 PM', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' },
    { id: 'r2', name: 'Bukhara', lat: 28.5672, lng: 77.1211, type: 'restaurant', rating: 4.8, price: 4000, address: 'ITC Maurya, New Delhi', hours: '12:30 PM - 11:45 PM', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400' },
    
    // Transport
    { id: 't1', name: 'IGI Airport', lat: 28.5562, lng: 77.1000, type: 'transport', address: 'Indira Gandhi International Airport', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400' },
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    // Filter nearby places based on city
    const filtered = mockLocations.filter(loc => {
      if (!showHotels && loc.type === 'hotel') return false;
      if (!showAttractions && loc.type === 'attraction') return false;
      return true;
    });
    setNearbyPlaces(filtered);
  }, [showHotels, showAttractions, centerCity]);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const getDirections = (destination: Location) => {
    if (userLocation) {
      // Open Google Maps with directions
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destination.lat},${destination.lng}`;
      window.open(url, '_blank');
    } else {
      alert('Please enable location access to get directions');
    }
  };

  const calculateDistance = (loc: Location) => {
    if (!userLocation) return null;
    const R = 6371; // Earth's radius in km
    const dLat = (loc.lat - userLocation.lat) * Math.PI / 180;
    const dLon = (loc.lng - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(loc.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  const filteredLocations = nearbyPlaces.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'hotel': return '🏨';
      case 'attraction': return '🏛️';
      case 'restaurant': return '🍽️';
      case 'transport': return '✈️';
      default: return '📍';
    }
  };

  const cityCenter = cityCoordinates[centerCity] || cityCoordinates.Delhi;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Interactive Map - {centerCity}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBack ? onBack() : window.history.back()}
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hotels, attractions, restaurants..."
            className="pl-10 pr-4 py-3 text-lg"
          />
        </div>

        {/* Map Controls */}
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            variant={mapType === 'roadmap' ? 'default' : 'outline'}
            onClick={() => setMapType('roadmap')}
            className="text-sm"
          >
            <Layers className="w-4 h-4 mr-1" />
            Map
          </Button>
          <Button
            size="sm"
            variant={mapType === 'satellite' ? 'default' : 'outline'}
            onClick={() => setMapType('satellite')}
            className="text-sm"
          >
            <Layers className="w-4 h-4 mr-1" />
            Satellite
          </Button>
          <Button
            size="sm"
            variant={routeMode ? 'default' : 'outline'}
            onClick={() => setRouteMode(!routeMode)}
            className="text-sm"
          >
            <Route className="w-4 h-4 mr-1" />
            Routes
          </Button>
          {userLocation && (
            <Badge className="bg-green-500 text-white">
              <Navigation className="w-3 h-3 mr-1" />
              Location Active
            </Badge>
          )}
        </div>
      </div>

      {/* Map and Sidebar Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 relative bg-gray-100">
          {/* Embedded Google Maps with real API */}
          <iframe
            ref={mapRef}
            src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=hotels+in+${centerCity},India&zoom=12&center=${cityCenter.lat},${cityCenter.lng}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />

          {/* Overlay Info */}
          {selectedLocation && (
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-2xl p-4 max-h-64 overflow-y-auto">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{getTypeIcon(selectedLocation.type)}</span>
                    <h3 className="text-lg">{selectedLocation.name}</h3>
                  </div>
                  {selectedLocation.rating && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{selectedLocation.rating}/5</span>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLocation(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {selectedLocation.image && (
                <img
                  src={selectedLocation.image}
                  alt={selectedLocation.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}

              <div className="space-y-2 text-sm">
                {selectedLocation.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-600">{selectedLocation.address}</span>
                  </div>
                )}
                {selectedLocation.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{selectedLocation.phone}</span>
                  </div>
                )}
                {selectedLocation.hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{selectedLocation.hours}</span>
                  </div>
                )}
                {selectedLocation.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">₹{selectedLocation.price.toLocaleString('en-IN')}</span>
                    <span className="text-gray-500 text-xs">per night</span>
                  </div>
                )}
                {userLocation && (
                  <Badge variant="outline" className="text-xs">
                    <Navigation className="w-3 h-3 mr-1" />
                    {calculateDistance(selectedLocation)} km away
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => getDirections(selectedLocation)}
                  className="flex-1 bg-blue-900"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Directions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedLocation.lat},${selectedLocation.lng}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Locations List */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg mb-2">Nearby Places</h3>
            <p className="text-sm text-gray-600">
              Found {filteredLocations.length} locations
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                onClick={() => handleLocationClick(location)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedLocation?.id === location.id ? 'bg-blue-50 border-l-4 border-blue-900' : ''
                } ${highlightedLocationId === location.id ? 'bg-yellow-50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getTypeIcon(location.type)}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm mb-1 truncate">{location.name}</h4>
                    {location.rating && (
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">{location.rating}</span>
                      </div>
                    )}
                    {location.address && (
                      <p className="text-xs text-gray-500 line-clamp-2">{location.address}</p>
                    )}
                    {location.price && (
                      <p className="text-sm mt-1">₹{location.price.toLocaleString('en-IN')}/night</p>
                    )}
                    {userLocation && (
                      <p className="text-xs text-blue-900 mt-1">
                        <Navigation className="w-3 h-3 inline mr-1" />
                        {calculateDistance(location)} km away
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No locations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-gray-50 border-t border-gray-200 p-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-gray-600">🏨 Hotels</span>
          <span className="text-gray-600">🏛️ Attractions</span>
          <span className="text-gray-600">🍽️ Restaurants</span>
          <span className="text-gray-600">✈️ Transport</span>
        </div>
        <Badge variant="outline">
          Powered by Google Maps
        </Badge>
      </div>
    </div>
  );
}