'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  address: string;
  category: Category;
  website?: string;
  imageUrl?: string;
  createdAt: string;
}

export default function RecommendationsList() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/recommendations');
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const filteredRecommendations = useMemo(() => {
    if (!searchQuery.trim()) return recommendations;

    const query = searchQuery.toLowerCase();
    return recommendations.filter((rec) => 
      rec.title.toLowerCase().includes(query) ||
      rec.description.toLowerCase().includes(query) ||
      rec.address.toLowerCase().includes(query) ||
      rec.category.name.toLowerCase().includes(query)
    );
  }, [recommendations, searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-500">Loading recommendations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-500">No recommendations yet.</div>
      </div>
    );
  }

  const renderGridView = (recommendations: Recommendation[]) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((recommendation) => (
        <div
          key={recommendation.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          {recommendation.imageUrl && (
            <div className="aspect-video w-full overflow-hidden relative">
              <Image
                src={recommendation.imageUrl}
                alt={recommendation.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {recommendation.title}
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {recommendation.category.name}
              </span>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
              {recommendation.description}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {recommendation.address}
            </p>
            {recommendation.website && (
              <a
                href={recommendation.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
              >
                Visit Website →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = (recommendations: Recommendation[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="w-2/5 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Address
            </th>
            <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {recommendations.map((recommendation) => (
            <tr key={recommendation.id}>
              <td className="w-2/5 px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {recommendation.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                  {recommendation.description}
                </div>
              </td>
              <td className="w-1/5 px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {recommendation.category.name}
                </span>
              </td>
              <td className="w-1/4 px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {recommendation.address}
              </td>
              <td className="w-1/6 px-6 py-4 text-sm">
                {recommendation.website && (
                  <a
                    href={recommendation.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                  >
                    Visit Website →
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recommendations..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-l-lg ${
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-r-lg ${
              viewMode === 'table'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {filteredRecommendations.length === 0 && searchQuery ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-gray-500">No recommendations found matching &quot;{searchQuery}&quot;</div>
        </div>
      ) : viewMode === 'grid' ? (
        renderGridView(filteredRecommendations)
      ) : (
        renderTableView(filteredRecommendations)
      )}
    </div>
  );
} 