import { SearchX, Wifi, MessageSquare, MapPin, LucideIcon } from 'lucide-react';

export type EmptyStateType = 'no-results' | 'no-internet' | 'no-reviews' | 'limited-data';

interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  recommendations?: {
    title: string;
    items: string[];
  };
}

const emptyStateConfig: Record<EmptyStateType, {
  icon: LucideIcon;
  defaultTitle: string;
  defaultDescription: string;
  color: string;
}> = {
  'no-results': {
    icon: SearchX,
    defaultTitle: 'No results found',
    defaultDescription: 'We couldn\'t find any matches for your search criteria. Try adjusting your filters or search terms.',
    color: 'text-gray-400'
  },
  'no-internet': {
    icon: Wifi,
    defaultTitle: 'No internet connection',
    defaultDescription: 'You\'re currently offline. Some features are limited, but you can still access cached content.',
    color: 'text-amber-400'
  },
  'no-reviews': {
    icon: MessageSquare,
    defaultTitle: 'No reviews yet',
    defaultDescription: 'This place hasn\'t received any reviews yet. Be the first to share your experience!',
    color: 'text-blue-400'
  },
  'limited-data': {
    icon: MapPin,
    defaultTitle: 'Limited information available',
    defaultDescription: 'We\'re still building our database for this area. Check back soon for more options.',
    color: 'text-indigo-400'
  }
};

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction,
  recommendations
}: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return (
    <div className="py-12 px-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Icon className={`w-8 h-8 ${config.color}`} />
        </div>

        <h3 className="text-gray-900 mb-2">{title || config.defaultTitle}</h3>
        <p className="text-gray-600 mb-6">{description || config.defaultDescription}</p>

        {onAction && actionLabel && (
          <button
            onClick={onAction}
            className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors"
          >
            {actionLabel}
          </button>
        )}

        {recommendations && (
          <div className="mt-8 text-left bg-gray-50 rounded-lg p-6">
            <p className="text-gray-900 mb-3">{recommendations.title}</p>
            <ul className="space-y-2">
              {recommendations.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-blue-900 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
