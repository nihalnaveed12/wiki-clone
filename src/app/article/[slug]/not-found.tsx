export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
      <p className="text-gray-600 mb-8">
        The article you&#39;re looking for doesn&#39;t exist or has been
        removed.
      </p>
      <a
        href="/articles-page"
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Browse All Articles
      </a>
    </div>
  );
}
