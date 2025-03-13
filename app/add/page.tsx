import AddRecommendationForm from '../components/AddRecommendationForm';

export default function AddPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Add a Recommendation
        </h1>
        <AddRecommendationForm />
      </div>
    </main>
  );
} 