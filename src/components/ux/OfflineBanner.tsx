import { WifiOff, CheckCircle } from 'lucide-react';

interface OfflineBannerProps {
  isOffline: boolean;
  cachedItemsCount?: number;
}

export function OfflineBanner({ isOffline, cachedItemsCount = 0 }: OfflineBannerProps) {
  if (!isOffline) return null;

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <WifiOff className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-amber-900 mb-1">Limited Mode - No Internet Connection</p>
          <p className="text-amber-800 mb-3">
            You're currently offline. Some features may be limited, but you can still access cached content.
          </p>
          
          <div className="space-y-2">
            <p className="text-amber-900">Available in offline mode:</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-amber-800">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>View previously loaded destinations ({cachedItemsCount} cached)</span>
              </div>
              <div className="flex items-center gap-2 text-amber-800">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Access saved itineraries</span>
              </div>
              <div className="flex items-center gap-2 text-amber-800">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>View emergency contact information</span>
              </div>
            </div>
          </div>

          <p className="text-amber-700 mt-3">
            Bookings, real-time updates, and chat support will be available when you're back online.
          </p>
        </div>
      </div>
    </div>
  );
}
