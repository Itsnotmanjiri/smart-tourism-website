import { Shield, ThumbsUp, ThumbsDown, Minus, AlertTriangle } from 'lucide-react';

export type SentimentType = 'positive' | 'neutral' | 'negative';

interface TrustBadgesProps {
  sentiment?: SentimentType;
  sentimentScore?: number;
  isVerified?: boolean;
  isSuspicious?: boolean;
  showSentimentBar?: boolean;
}

export function TrustBadges({
  sentiment,
  sentimentScore,
  isVerified = false,
  isSuspicious = false,
  showSentimentBar = false
}: TrustBadgesProps) {
  const getSentimentConfig = (sent: SentimentType) => {
    switch (sent) {
      case 'positive':
        return {
          icon: ThumbsUp,
          label: 'Positive',
          color: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          barColor: 'bg-green-500'
        };
      case 'negative':
        return {
          icon: ThumbsDown,
          label: 'Negative',
          color: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          barColor: 'bg-red-500'
        };
      default:
        return {
          icon: Minus,
          label: 'Neutral',
          color: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          barColor: 'bg-gray-400'
        };
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Verified Badge */}
      {isVerified && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-blue-900">Verified</span>
        </div>
      )}

      {/* Sentiment Badge */}
      {sentiment && (
        <div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-md ${getSentimentConfig(sentiment).bgColor} ${getSentimentConfig(sentiment).borderColor}`}>
            {(() => {
              const Icon = getSentimentConfig(sentiment).icon;
              return <Icon className={`w-3.5 h-3.5 ${getSentimentConfig(sentiment).color}`} />;
            })()}
            <span className={getSentimentConfig(sentiment).color}>
              {getSentimentConfig(sentiment).label}
            </span>
          </div>

          {/* Sentiment Bar */}
          {showSentimentBar && sentimentScore !== undefined && (
            <div className="mt-2 w-full">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getSentimentConfig(sentiment).barColor} transition-all`}
                  style={{ width: `${Math.abs(sentimentScore) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suspicious Warning */}
      {isSuspicious && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-amber-900">Review flagged</span>
        </div>
      )}
    </div>
  );
}
