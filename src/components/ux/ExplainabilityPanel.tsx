import { ChevronDown, ChevronUp, MapPin, Star, TrendingUp, DollarSign, Users, Clock } from 'lucide-react';
import { useState } from 'react';

export interface ExplanationFactor {
  type: 'distance' | 'rating' | 'price' | 'crowd' | 'time' | 'trending';
  label: string;
  value: string;
  impact: 'high' | 'medium' | 'low';
}

interface ExplainabilityPanelProps {
  factors: ExplanationFactor[];
  defaultOpen?: boolean;
}

const factorIcons = {
  distance: MapPin,
  rating: Star,
  price: DollarSign,
  crowd: Users,
  time: Clock,
  trending: TrendingUp
};

const impactColors = {
  high: 'text-blue-900 bg-blue-50 border-blue-200',
  medium: 'text-gray-700 bg-gray-50 border-gray-200',
  low: 'text-gray-500 bg-gray-50 border-gray-200'
};

export function ExplainabilityPanel({ factors, defaultOpen = false }: ExplainabilityPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (factors.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-gray-900">Why this is recommended</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 bg-white">
          <div className="space-y-2">
            {factors.map((factor, index) => {
              const Icon = factorIcons[factor.type];
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 px-3 py-2 border rounded-md ${impactColors[factor.impact]}`}
                >
                  <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{factor.label}</span>
                    </div>
                    <p className="text-gray-600 mt-0.5">{factor.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
