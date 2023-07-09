import { useAuth } from "../context/authContext";

export default function ErrorMessage() {
  const { error, setError } = useAuth();

  return (
    error && (
      <div className="flex justify-center px-4">
        <div className="rounded-md max-w-md w-full bg-red-50 p-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="h-6 w-6 text-red-500" onClick={() => setError("")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error: {error}
              </h3>
            </div>
          </div>
        </div>
      </div>
    )
  );
}