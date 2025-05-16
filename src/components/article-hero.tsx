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
        <p className="mt-4 text-sm text-gray-700">
          <span className="text-blue-600">118,315</span> active editors •{" "}
          <span className="text-blue-600">6,994,313</span> articles in{" "}
          <a href="#" className="text-blue-600 hover:underline">
            English
          </a>
        </p>
      </div>
    </div>
  );
}
