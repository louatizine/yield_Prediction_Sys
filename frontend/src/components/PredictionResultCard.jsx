const PredictionResultCard = ({ result, type, onReset }) => {
  if (!result) return null;

  const isSuccess = result.success;

  return (
    <div className={`mt-6 rounded-2xl shadow-xl p-8 ${
      isSuccess 
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200' 
        : 'bg-red-50 border-2 border-red-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isSuccess ? (
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {isSuccess ? 'Prediction Successful' : 'Prediction Failed'}
            </h3>
            <p className="text-sm text-gray-600">
              {type === 'crop' ? 'Crop Recommendation' : 'Fertilizer Recommendation'}
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Make another prediction"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {isSuccess ? (
        <>
          {/* Main Result */}
          <div className="bg-white rounded-xl p-6 mb-4 shadow-md">
            <div className="flex items-center gap-4">
              <div className="text-5xl">
                {type === 'crop' ? '🌾' : '🧪'}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Recommended {type === 'crop' ? 'Crop' : 'Fertilizer'}</p>
                <h2 className="text-3xl font-bold text-green-700">
                  {type === 'crop' ? result.crop : result.fertilizer}
                </h2>
              </div>
            </div>
          </div>

          {/* Message/Explanation */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex gap-3">
              <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Analysis</h4>
                <p className="text-gray-700 leading-relaxed">{result.message}</p>
                {result.explanation && (
                  <p className="text-gray-600 mt-3 leading-relaxed">
                    <span className="font-medium">Details: </span>
                    {result.explanation}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onReset}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
            >
              Make Another Prediction
            </button>
            <button className="px-6 bg-white text-green-600 border-2 border-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all">
              Save Result
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-red-700 mb-4">{result.message || 'An error occurred during prediction.'}</p>
          <button
            onClick={onReset}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default PredictionResultCard;
