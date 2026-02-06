"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import {
  Search,
  X,
  FileText,
  Calendar,
  Activity,
  History,
  Loader2,
} from "lucide-react";

interface SearchResult {
  _id: string;
  content: string;
  contentType: string;
  title: string;
  path?: string;
  referenceId?: string;
  lastModified: number;
  relevanceScore?: number;
}

interface GlobalSearchProps {
  onResultClick?: (result: SearchResult) => void;
  placeholder?: string;
  debounceMs?: number;
}

const contentTypeIcons: Record<string, React.ReactNode> = {
  memory_file: <FileText className="w-4 h-4 text-purple-500" />,
  workspace_doc: <FileText className="w-4 h-4 text-blue-500" />,
  activity: <Activity className="w-4 h-4 text-green-500" />,
  task: <Calendar className="w-4 h-4 text-orange-500" />,
};

const contentTypeLabels: Record<string, string> = {
  memory_file: "Memory",
  workspace_doc: "Document",
  activity: "Activity",
  task: "Task",
};

export function GlobalSearch({
  onResultClick,
  placeholder = "Search across memories, docs, activities, and tasks...",
  debounceMs = 300,
}: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Debounce search query
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const results = useQuery(
    api.search.search,
    debouncedQuery.length >= 2
      ? {
          query: debouncedQuery,
          contentTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
          limit: 20,
        }
      : "skip"
  );

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
    setShowResults(false);
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
    setShowResults(false);
  };

  const toggleContentType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isSearching ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : query ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.entries(contentTypeLabels).map(([type, label]) => (
          <button
            key={type}
            onClick={() => toggleContentType(type)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              selectedTypes.includes(type)
                ? "bg-blue-100 text-blue-800 border border-blue-300"
                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Results Dropdown */}
      {showResults && query.length >= 2 && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowResults(false)}
          />

          {/* Results Panel */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-y-auto">
            {results && results.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {results.map((result) => (
                  <button
                    key={result._id}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {contentTypeIcons[result.contentType] || (
                          <FileText className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 truncate">
                            {result.title}
                          </span>
                          <span className="text-xs text-gray-400">
                            {contentTypeLabels[result.contentType] || result.contentType}
                          </span>
                          {result.relevanceScore && (
                            <span className="text-xs text-gray-400">
                              Score: {result.relevanceScore.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {highlightText(result.content.slice(0, 200), debouncedQuery)}
                          {result.content.length > 200 && "..."}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          {result.path && (
                            <span className="truncate">{result.path}</span>
                          )}
                          <span>•</span>
                          <span>
                            {formatDistanceToNow(result.lastModified, {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                {isSearching ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </div>
                ) : (
                  <>
                    <History className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No results found for &quot;{debouncedQuery}&quot;</p>
                    <p className="text-sm mt-1">
                      Try different keywords or check your spelling
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}