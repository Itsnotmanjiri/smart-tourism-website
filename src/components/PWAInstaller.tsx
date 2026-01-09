import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check, Wifi, WifiOff } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install banner after 3 seconds
      setTimeout(() => {
        setShowInstallBanner(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      toast.success('🎉 App installed successfully!');
    });

    // Register service worker
    if ('serviceWorker' in navigator) {
      // Check if we're in an iframe or restricted environment
      const isInIframe = window.self !== window.top;
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isFigma = window.location.hostname.includes('figma');
      
      // Only attempt registration in proper environments
      if (!isInIframe && !isFigma) {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    toast.info('New version available! Refresh to update.', {
                      duration: 10000,
                      action: {
                        label: 'Refresh',
                        onClick: () => window.location.reload(),
                      },
                    });
                  }
                });
              }
            });
          })
          .catch((error) => {
            // Silent fail - expected in some environments
          });
      }
    }

    // Monitor online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineNotice(false);
      toast.success('🌐 Back online!');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineNotice(true);
      toast.error('📡 You are offline. Some features may be limited.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error('Installation not available on this browser');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('Installing app...');
    } else {
      toast.info('Installation cancelled');
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show anything if already installed
  if (isInstalled) {
    return showOfflineNotice ? (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-top">
        <Badge className="bg-orange-500 text-white px-4 py-2">
          <WifiOff className="w-4 h-4 mr-2" />
          Offline Mode Active
        </Badge>
      </div>
    ) : null;
  }

  // Show offline notice
  if (showOfflineNotice) {
    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-top">
        <Card className="bg-orange-50 border-orange-200 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-orange-900">You are currently offline</p>
              <p className="text-sm text-orange-600">Some features may be limited</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowOfflineNotice(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show install banner
  if (!showInstallBanner || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-bottom">
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg mb-1">Install Our App</h3>
              <p className="text-sm text-white/80">
                Get instant access and work offline!
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-white hover:bg-white/20 -mr-2 -mt-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-300" />
            <span>Works offline - no internet needed</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-300" />
            <span>Faster loading & better performance</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-300" />
            <span>Home screen icon & app-like experience</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-300" />
            <span>Push notifications for bookings</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleInstallClick}
            className="flex-1 bg-white text-blue-900 hover:bg-gray-100"
          >
            <Download className="w-4 h-4 mr-2" />
            Install Now
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Later
          </Button>
        </div>

        <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-center gap-2 text-xs text-white/60">
          <Badge variant="outline" className="border-white/30 text-white">
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 mr-1" />
                Online
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </>
            )}
          </Badge>
          <span>•</span>
          <span>Free • No Signup Required</span>
        </div>
      </Card>
    </div>
  );
}