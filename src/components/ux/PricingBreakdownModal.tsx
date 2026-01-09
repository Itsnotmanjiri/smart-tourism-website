import { X, Info, TrendingUp, Calendar, Shield } from 'lucide-react';

interface PriceBreakdown {
  basePrice: number;
  demandSurge?: number;
  seasonalFactor?: number;
  total: number;
  currency: string;
  isEmergency?: boolean;
  surgeCapped?: boolean;
}

interface PricingBreakdownModalProps {
  breakdown: PriceBreakdown;
  itemName: string;
  onClose: () => void;
}

export function PricingBreakdownModal({ breakdown, itemName, onClose }: PricingBreakdownModalProps) {
  const formatCurrency = (amount: number) => {
    return `${breakdown.currency}${amount.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-gray-900">Pricing Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Item Info */}
          <div>
            <p className="text-gray-600 mb-1">Booking for</p>
            <p className="text-gray-900">{itemName}</p>
          </div>

          {/* Emergency Pricing Notice */}
          {breakdown.isEmergency && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-900 mb-1">Emergency Pricing Active</p>
                  <p className="text-blue-700">
                    Surge pricing is frozen during emergency mode to ensure fair access to essential services.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Breakdown */}
          <div className="space-y-3">
            <p className="text-gray-900">Price Breakdown</p>

            {/* Base Price */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">Base Price</span>
              </div>
              <span className="text-gray-900">{formatCurrency(breakdown.basePrice)}</span>
            </div>

            {/* Demand Surge */}
            {breakdown.demandSurge !== undefined && breakdown.demandSurge > 0 && (
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-700">Demand Surge</span>
                  {breakdown.surgeCapped && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                      Capped
                    </span>
                  )}
                </div>
                <span className="text-orange-600">+{formatCurrency(breakdown.demandSurge)}</span>
              </div>
            )}

            {/* Seasonal Factor */}
            {breakdown.seasonalFactor !== undefined && breakdown.seasonalFactor !== 0 && (
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700">Seasonal Adjustment</span>
                </div>
                <span className={breakdown.seasonalFactor > 0 ? 'text-orange-600' : 'text-green-600'}>
                  {breakdown.seasonalFactor > 0 ? '+' : ''}{formatCurrency(breakdown.seasonalFactor)}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200">
              <span className="text-gray-900">Total Amount</span>
              <span className="text-blue-900">{formatCurrency(breakdown.total)}</span>
            </div>
          </div>

          {/* Surge Cap Info */}
          {breakdown.surgeCapped && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800">
                Surge pricing has been capped to maintain fair pricing during high demand periods.
              </p>
            </div>
          )}

          {/* Transparency Note */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">
              Our pricing is transparent and based on real-time factors including availability, demand, and seasonal trends. 
              We believe in fair pricing for all travelers.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
