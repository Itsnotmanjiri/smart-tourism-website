import { useState, useEffect } from 'react';
import { AlertCircle, Phone, MapPin, Users, MessageSquare, Clock, CheckCircle, Shield } from 'lucide-react';

interface SOSEmergencyProps {
  onClose: () => void;
}

interface EmergencyContact {
  name: string;
  phone: string;
  type: string;
}

export function SOSEmergency({ onClose }: SOSEmergencyProps) {
  const [sosStatus, setSOSStatus] = useState<'idle' | 'triggered' | 'acknowledged' | 'resolved'>('idle');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [emergencyType, setEmergencyType] = useState('');
  const [description, setDescription] = useState('');
  const [alertCode, setAlertCode] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [showConfirm, setShowConfirm] = useState(false);

  const emergencyTypes = [
    { value: 'medical', label: 'Medical Emergency', icon: '🏥', color: 'red' },
    { value: 'accident', label: 'Accident', icon: '🚨', color: 'orange' },
    { value: 'theft', label: 'Theft/Robbery', icon: '🚔', color: 'purple' },
    { value: 'harassment', label: 'Harassment', icon: '⚠️', color: 'yellow' },
    { value: 'lost', label: 'Lost/Stranded', icon: '🧭', color: 'blue' },
    { value: 'other', label: 'Other Emergency', icon: '🆘', color: 'gray' }
  ];

  const emergencyContacts: EmergencyContact[] = [
    { name: 'Police', phone: '100', type: 'police' },
    { name: 'Ambulance', phone: '108', type: 'medical' },
    { name: 'Women Helpline', phone: '1091', type: 'women' },
    { name: 'Child Helpline', phone: '1098', type: 'child' },
    { name: 'Tourist Helpline', phone: '1363', type: 'tourist' },
    { name: 'Disaster Management', phone: '1078', type: 'disaster' }
  ];

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          // Silently handle geolocation errors - permissions may be disabled
          // Use default location or skip location-based features
          console.warn('Geolocation unavailable - using fallback mode');
        },
        {
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, []);

  useEffect(() => {
    if (showConfirm && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showConfirm && countdown === 0) {
      triggerSOS();
    }
  }, [showConfirm, countdown]);

  const handleTriggerSOS = () => {
    if (!emergencyType) {
      alert('Please select emergency type');
      return;
    }
    setShowConfirm(true);
  };

  const triggerSOS = () => {
    // Generate unique alert code
    const code = 'SOS' + Date.now().toString(36).toUpperCase();
    setAlertCode(code);
    setSOSStatus('triggered');
    setShowConfirm(false);

    // Simulate backend API call
    console.log('SOS Triggered:', {
      code,
      type: emergencyType,
      description,
      location,
      timestamp: new Date().toISOString()
    });

    // Simulate admin acknowledgment after 3 seconds
    setTimeout(() => {
      setSOSStatus('acknowledged');
    }, 3000);
  };

  const cancelSOS = () => {
    setShowConfirm(false);
    setCountdown(5);
  };

  if (sosStatus === 'triggered' || sosStatus === 'acknowledged') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          {/* Header */}
          <div className={`p-6 text-white ${sosStatus === 'triggered' ? 'bg-red-600' : 'bg-green-600'}`}>
            <div className="flex items-center gap-3">
              {sosStatus === 'triggered' ? (
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
                  <AlertCircle className="w-10 h-10" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
              )}
              <div>
                <h2 className="text-2xl">
                  {sosStatus === 'triggered' ? 'SOS Alert Triggered' : 'Help is On the Way'}
                </h2>
                <p className="text-sm opacity-90">
                  Alert Code: <strong>{alertCode}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Timeline */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">Alert Sent Successfully</h3>
                  <p className="text-sm text-gray-600">Your emergency alert has been sent to authorities</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleTimeString()}</p>
                </div>
              </div>

              {sosStatus === 'acknowledged' && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900">Alert Acknowledged</h3>
                    <p className="text-sm text-gray-600">Emergency response team has been notified</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  sosStatus === 'acknowledged' ? 'bg-yellow-100 animate-pulse' : 'bg-gray-100'
                }`}>
                  <Clock className={`w-6 h-6 ${sosStatus === 'acknowledged' ? 'text-yellow-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="text-gray-900">Help Arriving</h3>
                  <p className="text-sm text-gray-600">
                    {sosStatus === 'acknowledged' ? 'Estimated arrival: 10-15 minutes' : 'Waiting for response'}
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Details */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h3 className="text-gray-900">Emergency Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Type:</span>
                  <p className="text-gray-900 mt-1">
                    {emergencyTypes.find(t => t.value === emergencyType)?.label}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <p className="text-gray-900 mt-1">
                    {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Getting location...'}
                  </p>
                </div>
              </div>
              {description && (
                <div>
                  <span className="text-gray-600 text-sm">Description:</span>
                  <p className="text-gray-900 mt-1">{description}</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:100`}
                className="flex items-center justify-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-xl hover:bg-blue-950 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Police (100)
              </a>
              <a
                href={`tel:108`}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Ambulance (108)
              </a>
            </div>

            {/* Share Location */}
            {location && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-900" />
                  <h3 className="text-blue-900">Live Location Sharing</h3>
                </div>
                <p className="text-sm text-blue-800 mb-3">
                  Your location is being shared with emergency contacts and authorities
                </p>
                <a
                  href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-900 underline"
                >
                  View on Google Maps
                </a>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-900 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Keep Alert Active & Minimize
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <div className="text-5xl">{countdown}</div>
            </div>
            <h2 className="text-2xl text-gray-900 mb-2">Triggering SOS Alert</h2>
            <p className="text-gray-600 mb-6">
              Alert will be sent in {countdown} seconds
            </p>
            <div className="space-y-3">
              <button
                onClick={cancelSOS}
                className="w-full bg-gray-200 text-gray-900 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={triggerSOS}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
              >
                Send SOS Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-red-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl">Emergency SOS</h2>
                <p className="text-red-100 text-sm">We're here to help - Stay calm and safe</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Emergency Type Selection */}
          <div>
            <h3 className="text-gray-900 mb-4">What's your emergency?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {emergencyTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setEmergencyType(type.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    emergencyType === type.value
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-300 hover:border-red-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="text-sm text-gray-900">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-900 mb-2 block">
              Describe your situation (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any additional details that can help emergency responders..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-600 h-24"
            />
          </div>

          {/* Location Status */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-blue-900" />
              <h3 className="text-blue-900">Your Location</h3>
            </div>
            {location ? (
              <p className="text-sm text-blue-800">
                Location acquired: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            ) : (
              <p className="text-sm text-blue-800">Getting your location...</p>
            )}
          </div>

          {/* Emergency Contacts */}
          <div>
            <h3 className="text-gray-900 mb-4">Important Emergency Numbers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emergencyContacts.map((contact) => (
                <a
                  key={contact.phone}
                  href={`tel:${contact.phone}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-900" />
                    <div>
                      <div className="text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-600">{contact.phone}</div>
                    </div>
                  </div>
                  <div className="text-blue-900">→</div>
                </a>
              ))}
            </div>
          </div>

          {/* Trigger SOS Button */}
          <button
            onClick={handleTriggerSOS}
            disabled={!emergencyType}
            className={`w-full py-4 rounded-xl text-white text-lg transition-all ${
              emergencyType
                ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            🚨 TRIGGER SOS ALERT
          </button>

          {/* Info */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <p className="text-sm text-yellow-900">
              <strong>Important:</strong> Your SOS alert will be sent to local authorities, your emergency contacts,
              and our 24/7 safety team. Your live location will be shared until the emergency is resolved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}