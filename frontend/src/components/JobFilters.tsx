// JobFilters.tsx
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
};

export default function JobFilters({ search, setSearch, status, setStatus }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const hasActiveFilters = search !== "" || status !== "";

  const clearFilters = () => {
    setSearch("");
    setStatus("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all outline-none bg-white text-gray-900 placeholder:text-gray-400"
              placeholder="Search by company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="md:w-56 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all outline-none appearance-none bg-white text-gray-900 cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Clear Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}

          {/* Advanced Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date Range</label>
                <select className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-900">
                  <option>All time</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>This year</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
                <select className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-900">
                  <option>Date applied (newest)</option>
                  <option>Date applied (oldest)</option>
                  <option>Company (A-Z)</option>
                  <option>Role (A-Z)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Applications per page</label>
                <select className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-900">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="px-4 pb-4 pt-0 flex flex-wrap gap-2">
          {search && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">
              Search: {search}
              <button onClick={() => setSearch("")} className="hover:text-gray-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {status && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">
              Status: {status}
              <button onClick={() => setStatus("")} className="hover:text-gray-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}