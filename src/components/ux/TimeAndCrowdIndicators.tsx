import { Clock, Users, Calendar } from 'lucide-react';

export type CrowdLevel = 'low' | 'medium' | 'high';

interface TimeAndCrowdIndicatorsProps {
  bestTimeToVisit?: string;
  crowdLevel?: CrowdLevel;
  expectedWaitTime?: string;
  compact?: boolean;
}

const crowdConfig = {
  low: {
    label: 'Low',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    dotColor: 'bg-green-500'
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    dotColor: 'bg-amber-500'
  },
  high: {
    label: 'High',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    dotColor: 'bg-red-500'
  }
};

export function TimeAndCrowdIndicators({
  bestTimeToVisit,
  crowdLevel,
  expectedWaitTime,
  compact = false
}: TimeAndCrowdIndicatorsProps) {
  if (!bestTimeToVisit && !crowdLevel && !expectedWaitTime) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {bestTimeToVisit && (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-200 rounded-md">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-blue-900">{bestTimeToVisit}</span>
          </div>
        )}

        {crowdLevel && (
          <div className={`inline-flex items-center gap-1.5 px-2 py-1 border rounded-md ${crowdConfig[crowdLevel].bgColor} ${crowdConfig[crowdLevel].borderColor}`}>
            <div className={`w-2 h-2 rounded-full ${crowdConfig[crowdLevel].dotColor}`} />
            <span className={crowdConfig[crowdLevel].color}>
              {crowdConfig[crowdLevel].label} crowd
            </span>
          </div>
        )}

        {expectedWaitTime && (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md">
            <Clock className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gray-700">{expectedWaitTime}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {bestTimeToVisit && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-blue-900">Best time to visit</p>
            <p className="text-blue-700">{bestTimeToVisit}</p>
          </div>
        </div>
      )}

      {crowdLevel && (
        <div className={`flex items-center gap-2 px-3 py-2 border rounded-lg ${crowdConfig[crowdLevel].bgColor} ${crowdConfig[crowdLevel].borderColor}`}>
          <Users className={`w-4 h-4 flex-shrink-0 ${crowdConfig[crowdLevel].color}`} />
          <div>
            <p className={crowdConfig[crowdLevel].color}>Crowd Level</p>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${crowdConfig[crowdLevel].dotColor}`} />
              <p className={crowdConfig[crowdLevel].color}>
                {crowdConfig[crowdLevel].label}
              </p>
            </div>
          </div>
        </div>
      )}

      {expectedWaitTime && (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
          <Clock className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <div>
            <p className="text-gray-900">Expected wait time</p>
            <p className="text-gray-700">{expectedWaitTime}</p>
          </div>
        </div>
      )}
    </div>
  );
}
