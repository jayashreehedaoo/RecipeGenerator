import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center">
        <span className="text-9xl mb-6 block">🔍</span>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Recipe Not Found
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          The recipe you&#39;re looking for doesn&#39;t exist or may have been deleted.
        </p>
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
        >
          <span>←</span>
          <span>Back to Recipes</span>
        </Link>
      </div>
    </div>
  );
}