import { X, SlidersHorizontal } from 'lucide-react';

export interface ActiveFilter {
  id: string;
  label: string;
  value: string;
}

interface FilterSummaryBarProps {
  sortBy?: string;
  activeFilters: ActiveFilter[];
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
  resultsCount?: number;
}

export function FilterSummaryBar({
  sortBy,
  activeFilters,
  onRemoveFilter,
  onClearAll,
  resultsCount
}: FilterSummaryBarProps) {
  if (activeFilters.length === 0 && !sortBy) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <p className="text-blue-900">
            {resultsCount !== undefined && `${resultsCount} results`}
            {sortBy && ` • Sorted by ${sortBy}`}
          </p>
        </div>
        {activeFilters.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-blue-900 hover:text-blue-950 hover:underline flex-shrink-0"
          >
            Clear all
          </button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <div
              key={filter.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-200 rounded-lg"
            >
              <span className="text-gray-700">
                {filter.label}: <span className="text-gray-900">{filter.value}</span>
              </span>
              <button
                onClick={() => onRemoveFilter(filter.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
