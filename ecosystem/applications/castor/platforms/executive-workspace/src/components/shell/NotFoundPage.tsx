import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="text-4xl mb-3" aria-hidden="true">🧭</div>
      <h1 className="text-lg font-semibold text-slate-800">Page not found</h1>
      <p className="text-sm text-slate-500 mt-1 max-w-sm">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/overview"
        className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-50"
      >
        Back to Overview
      </Link>
    </div>
  );
};

export default NotFoundPage;