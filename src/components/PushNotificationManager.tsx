import { useState, useEffect } from 'react';
import { Bell, BellOff, Check, X, MessageCircle, Hotel, Car, Users, AlertCircle, Sparkles } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

interface NotificationSettings {
  enabled: boolean;
  bookings: boolean;
  travelBuddy: boolean;
  carpool: boolean;
  emergency: boolean;
  offers: boolean;
  priceAlerts: boolean;
}

export function PushNotificationManager() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    bookings: true,
    travelBuddy: true,
    carpool: true,
    emergency: true,
    offers: true,
    priceAlerts: true,
  });

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setNotificationPermission(Notification.permission);

      // Load saved settings
      const savedSettings = localStorage.getItem('notificationSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast.error('Notifications are not supported in your browser');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        toast.success('Notifications enabled! 🔔');
        
        // Subscribe to push notifications
        await subscribeToPush();
        
        // Update settings
        const newSettings = { ...settings, enabled: true };
        setSettings(newSettings);
        localStorage.setItem('notificationSettings', JSON.stringify(newSettings));

        // Send welcome notification
        sendWelcomeNotification();
      } else if (permission === 'denied') {
        toast.error('Notifications blocked. Please enable them in your browser settings.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to enable notifications');
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Subscribe to push notifications
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrEcxmSiN2l7nJEzDXXrT9WpgPd_2gE0LhZA3jHFfN7jBFwGpBE'
          ),
        });

        console.log('Push subscription created:', subscription);

        // Send subscription to server (in production)
        // await fetch('/api/push-subscribe', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(subscription),
        // });
      }
    } catch (error) {
      console.error('Error subscribing to push:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const sendWelcomeNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('Welcome to Smart Tourism! 🎉', {
        body: 'You\'ll now receive updates about your bookings, travel buddies, and exclusive offers!',
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'welcome',
      });
    }
  };

  const sendTestNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('Test Notification 🔔', {
        body: 'This is how notifications will appear on your device!',
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'test',
        actions: [
          { action: 'view', title: 'View' },
          { action: 'dismiss', title: 'Dismiss' },
        ],
      });
      toast.success('Test notification sent!');
    } else {
      toast.error('Please enable notifications first');
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    toast.success(`${key} notifications ${newSettings[key] ? 'enabled' : 'disabled'}`);
  };

  const disableNotifications = () => {
    const newSettings = { ...settings, enabled: false };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    toast.info('Notifications disabled');
  };

  // Simulate different types of notifications
  const simulateBookingNotification = () => {
    if (settings.enabled && settings.bookings) {
      new Notification('🏨 Booking Confirmed!', {
        body: 'Your hotel booking at The Oberoi Delhi has been confirmed for 15 Jan 2026',
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'booking',
        data: { type: 'booking', id: '12345' },
      });
    }
  };

  const simulateBuddyNotification = () => {
    if (settings.enabled && settings.travelBuddy) {
      new Notification('👥 New Travel Buddy Match!', {
        body: 'Priya Kumar from Mumbai wants to connect for your trip to Goa',
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'buddy',
        data: { type: 'buddy', userId: '67890' },
      });
    }
  };

  const simulateCarpoolNotification = () => {
    if (settings.enabled && settings.carpool) {
      new Notification('🚗 Carpool Request', {
        body: 'Raj Singh wants to join your ride from Delhi to Agra on 20 Jan',
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'carpool',
        data: { type: 'carpool', rideId: '111' },
      });
    }
  };

  const simulatePriceAlert = () => {
    if (settings.enabled && settings.priceAlerts) {
      new Notification('💰 Price Drop Alert!', {
        body: 'Taj Palace Mumbai - Price dropped by ₹2,000! Book now and save big!',
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'price-alert',
        data: { type: 'price', hotelId: '222' },
      });
    }
  };

  if (!isSupported) {
    return (
      <Card className="p-6 bg-gray-50">
        <div className="text-center">
          <BellOff className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg mb-2">Notifications Not Supported</h3>
          <p className="text-sm text-gray-600">
            Your browser doesn't support push notifications
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              settings.enabled ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {settings.enabled ? (
                <Bell className="w-6 h-6 text-blue-900" />
              ) : (
                <BellOff className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg mb-1">Push Notifications</h3>
              <p className="text-sm text-gray-600">
                {notificationPermission === 'granted' 
                  ? 'Stay updated with real-time alerts'
                  : 'Enable notifications to never miss important updates'}
              </p>
            </div>
          </div>
          {notificationPermission === 'granted' && (
            <Badge className={settings.enabled ? 'bg-green-100 text-green-900' : 'bg-gray-100 text-gray-600'}>
              {settings.enabled ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <X className="w-3 h-3 mr-1" />
                  Paused
                </>
              )}
            </Badge>
          )}
        </div>

        {notificationPermission === 'default' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-900 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-900 mb-3">
                  Enable push notifications to get instant updates about:
                </p>
                <ul className="space-y-2 text-sm text-blue-800 mb-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Booking confirmations & updates
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Travel buddy match alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Carpool requests & confirmations
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Exclusive offers & price drops
                  </li>
                </ul>
                <Button onClick={requestPermission} className="w-full">
                  <Bell className="w-4 h-4 mr-2" />
                  Enable Notifications
                </Button>
              </div>
            </div>
          </div>
        )}

        {notificationPermission === 'denied' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-900 mb-2">
                  Notifications are blocked. To enable them:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-red-800">
                  <li>Click the lock icon in your browser's address bar</li>
                  <li>Find "Notifications" in the permissions list</li>
                  <li>Change the setting to "Allow"</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {notificationPermission === 'granted' && (
          <>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Hotel className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm">Booking Updates</p>
                    <p className="text-xs text-gray-500">Confirmations & changes</p>
                  </div>
                </div>
                <Switch
                  checked={settings.bookings}
                  onCheckedChange={() => toggleSetting('bookings')}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm">Travel Buddy</p>
                    <p className="text-xs text-gray-500">Match alerts & messages</p>
                  </div>
                </div>
                <Switch
                  checked={settings.travelBuddy}
                  onCheckedChange={() => toggleSetting('travelBuddy')}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm">Carpool</p>
                    <p className="text-xs text-gray-500">Ride requests & updates</p>
                  </div>
                </div>
                <Switch
                  checked={settings.carpool}
                  onCheckedChange={() => toggleSetting('carpool')}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm">Emergency Alerts</p>
                    <p className="text-xs text-gray-500">Critical notifications</p>
                  </div>
                </div>
                <Switch
                  checked={settings.emergency}
                  onCheckedChange={() => toggleSetting('emergency')}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm">Offers & Deals</p>
                    <p className="text-xs text-gray-500">Exclusive promotions</p>
                  </div>
                </div>
                <Switch
                  checked={settings.offers}
                  onCheckedChange={() => toggleSetting('offers')}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💰</span>
                  <div>
                    <p className="text-sm">Price Alerts</p>
                    <p className="text-xs text-gray-500">Price drops & deals</p>
                  </div>
                </div>
                <Switch
                  checked={settings.priceAlerts}
                  onCheckedChange={() => toggleSetting('priceAlerts')}
                  disabled={!settings.enabled}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={sendTestNotification}
                variant="outline"
                className="flex-1"
                disabled={!settings.enabled}
              >
                <Bell className="w-4 h-4 mr-2" />
                Test Notification
              </Button>
              {settings.enabled ? (
                <Button onClick={disableNotifications} variant="outline">
                  <BellOff className="w-4 h-4 mr-2" />
                  Pause All
                </Button>
              ) : (
                <Button onClick={() => toggleSetting('enabled')}>
                  <Bell className="w-4 h-4 mr-2" />
                  Enable All
                </Button>
              )}
            </div>
          </>
        )}
      </Card>

      {/* Demo Section */}
      {notificationPermission === 'granted' && settings.enabled && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <h4 className="mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-900" />
            Try Demo Notifications
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={simulateBookingNotification}
              variant="outline"
              size="sm"
              disabled={!settings.bookings}
            >
              🏨 Booking
            </Button>
            <Button
              onClick={simulateBuddyNotification}
              variant="outline"
              size="sm"
              disabled={!settings.travelBuddy}
            >
              👥 Buddy Match
            </Button>
            <Button
              onClick={simulateCarpoolNotification}
              variant="outline"
              size="sm"
              disabled={!settings.carpool}
            >
              🚗 Carpool
            </Button>
            <Button
              onClick={simulatePriceAlert}
              variant="outline"
              size="sm"
              disabled={!settings.priceAlerts}
            >
              💰 Price Alert
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
