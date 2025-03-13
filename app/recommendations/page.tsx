import RecommendationsList from '../components/RecommendationsList';

export default function RecommendationsPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Recommendations
        </h1>
        <RecommendationsList />
      </div>
    </main>
  );
} 