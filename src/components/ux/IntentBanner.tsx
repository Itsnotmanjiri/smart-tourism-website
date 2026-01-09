import { useState } from 'react';
import { X, Sparkles, Map, Wallet, Crown, AlertCircle } from 'lucide-react';

export type UserIntent = 'explorer' | 'planner' | 'budget' | 'luxury' | 'emergency' | null;

interface IntentBannerProps {
  detectedIntent: UserIntent;
  onIntentChange: (intent: UserIntent) => void;
  onDismiss?: () => void;
}

const intentConfig = {
  explorer: {
    icon: Map,
    label: 'Explorer',
    description: 'Focused on discovering new places and experiences',
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    iconColor: 'text-blue-600'
  },
  planner: {
    icon: Sparkles,
    label: 'Planner',
    description: 'Organized itineraries and structured travel plans',
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-900',
    iconColor: 'text-indigo-600'
  },
  budget: {
    icon: Wallet,
    label: 'Budget Traveler',
    description: 'Best value accommodations and cost-effective options',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-900',
    iconColor: 'text-green-600'
  },
  luxury: {
    icon: Crown,
    label: 'Luxury Traveler',
    description: 'Premium experiences and high-end accommodations',
    color: 'amber',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-900',
    iconColor: 'text-amber-600'
  },
  emergency: {
    icon: AlertCircle,
    label: 'Emergency Mode',
    description: 'Priority services and immediate assistance',
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-900',
    iconColor: 'text-red-600'
  }
};

export function IntentBanner({ detectedIntent, onIntentChange, onDismiss }: IntentBannerProps) {
  const [showSelector, setShowSelector] = useState(false);

  if (!detectedIntent) return null;

  const config = intentConfig[detectedIntent];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 mb-6`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Icon className={`w-5 h-5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`${config.textColor}`}>
                {config.label} Mode
              </span>
            </div>
            <p className="text-gray-700">{config.description}</p>
            
            {!showSelector && (
              <button
                onClick={() => setShowSelector(true)}
                className={`mt-2 ${config.textColor} hover:underline`}
              >
                Change travel style
              </button>
            )}

            {showSelector && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(intentConfig) as UserIntent[]).map((intent) => {
                  if (!intent) return null;
                  const cfg = intentConfig[intent];
                  const IntentIcon = cfg.icon;
                  return (
                    <button
                      key={intent}
                      onClick={() => {
                        onIntentChange(intent);
                        setShowSelector(false);
                      }}
                      className={`p-2 border rounded-lg flex items-center gap-2 transition-colors ${
                        intent === detectedIntent
                          ? `${cfg.bgColor} ${cfg.borderColor} ${cfg.textColor}`
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IntentIcon className={`w-4 h-4 ${intent === detectedIntent ? cfg.iconColor : 'text-gray-600'}`} />
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
