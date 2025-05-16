export default function Articles() {
  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="rounded border border-gray-200 bg-gray-50 p-6 text-center">
        <h1 className="text-3xl font-normal">
          Welcome to <span className="text-blue-600">Wikipedia</span>,
        </h1>
        <p className="mt-2 text-base">
          the{" "}
          <a href="#" className="text-blue-600 hover:underline">
            free encyclopedia
          </a>{" "}
          that{" "}
          <a href="#" className="text-blue-600 hover:underline">
            anyone can edit
          </a>
          .
        </p>
      </div>
    </div>
  );
}
