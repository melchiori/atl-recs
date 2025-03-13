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

  return (
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
} 