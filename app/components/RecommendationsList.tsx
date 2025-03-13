'use client';

import { useState, useEffect } from 'react';

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

  const renderGridView = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((recommendation) => (
        <div
          key={recommendation.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          {recommendation.imageUrl && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={recommendation.imageUrl}
                alt={recommendation.title}
                className="w-full h-full object-cover"
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

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Address
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {recommendations.map((recommendation) => (
            <tr key={recommendation.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {recommendation.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                  {recommendation.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {recommendation.category.name}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {recommendation.address}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
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
      <div className="flex justify-end mb-6">
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

      {viewMode === 'grid' ? renderGridView() : renderTableView()}
    </div>
  );
} 