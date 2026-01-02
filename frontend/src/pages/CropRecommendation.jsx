import { useState, useEffect } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import PredictionResultCard from '../components/PredictionResultCard';
import DashboardLayout from '../components/DashboardLayout';
import { predictCrop, getCropHistory } from '../services/predictionService';

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getCropHistory();
      // Ensure data is always an array
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadExample = () => {
    setFormData({
      N: '90',
      P: '42',
      K: '43',
      temperature: '20.5',
      humidity: '82',
      ph: '6.5',
      rainfall: '202',
    });
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert string values to numbers
      const payload = {
        N: parseFloat(formData.N),
        P: parseFloat(formData.P),
        K: parseFloat(formData.K),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        ph: parseFloat(formData.ph),
        rainfall: parseFloat(formData.rainfall),
      };

      console.log('Sending payload:', payload);
      const response = await predictCrop(payload);
      setResult(response);
    } catch (err) {
      console.error('Prediction error:', err.response?.data);
      
      // Handle validation errors (422)
      let errorMessage = 'Failed to get crop prediction. Please try again.';
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          // Format validation errors
          errorMessage = err.response.data.detail.map(e => `${e.loc[1]}: ${e.msg}`).join(', ');
        } else {
          errorMessage = err.response.data.detail;
        }
      }
      
      setError(errorMessage);
      setResult({ success: false, message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData({
      N: '',
      P: '',
      K: '',
      temperature: '',
      humidity: '',
      ph: '',
      rainfall: '',
    });
  };

  const NutrientIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );

  const WeatherIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🌾</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Crop Recommendation</h1>
          <p className="text-gray-600">Get AI-powered crop suggestions based on your soil and climate data</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6 justify-center flex-wrap">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg font-medium hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showGuide ? 'Hide' : 'Show'} User Guide
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg font-medium hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showHistory ? 'Hide' : 'View'} History
          </button>
          <button
            onClick={loadExample}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg font-medium hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Load Example
          </button>
        </div>

        {/* User Guide */}
        {showGuide && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              How to Use Crop Recommendation
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">📊 Step 1: Collect Soil Data</h3>
                <p className="text-gray-700 mb-2">Get your soil tested at a local agricultural lab. You need:</p>
                <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
                  <li><strong>Nitrogen (N):</strong> 0-200 kg/ha - Essential for leaf growth</li>
                  <li><strong>Phosphorus (P):</strong> 0-200 kg/ha - Promotes root development</li>
                  <li><strong>Potassium (K):</strong> 0-300 kg/ha - Improves disease resistance</li>
                  <li><strong>pH:</strong> 0-14 scale - Most crops prefer 5.5-7.5</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">🌤️ Step 2: Record Climate Data</h3>
                <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
                  <li><strong>Temperature:</strong> Average temperature in °C (check weather forecast)</li>
                  <li><strong>Humidity:</strong> Percentage (0-100%) - Use weather station data</li>
                  <li><strong>Rainfall:</strong> Expected rainfall in mm per season</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">💡 Example Values:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">N:</span> <span className="font-semibold">90</span>
                  </div>
                  <div>
                    <span className="text-gray-600">P:</span> <span className="font-semibold">42</span>
                  </div>
                  <div>
                    <span className="text-gray-600">K:</span> <span className="font-semibold">43</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Temp:</span> <span className="font-semibold">20.5°C</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Humidity:</span> <span className="font-semibold">82%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">pH:</span> <span className="font-semibold">6.5</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Rainfall:</span> <span className="font-semibold">202mm</span>
                  </div>
                  <div className="text-green-600 font-semibold">→ Rice</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">✅ Tips for Best Results:</h3>
                <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
                  <li>Use recent soil test results (less than 6 months old)</li>
                  <li>Consider the upcoming growing season's expected weather</li>
                  <li>Ensure all measurements are in the correct units</li>
                  <li>Click "Load Example" to see sample data</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* History View */}
        {showHistory && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Prediction History
            </h2>
            
            {loadingHistory ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading history...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No predictions yet. Make your first prediction!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended Crop</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Soil (N-P-K)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Climate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {history.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {item.prediction.crop}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.input_data.N}-{item.input_data.P}-{item.input_data.K}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.input_data.temperature}°C, {item.input_data.humidity}%, {item.input_data.rainfall}mm
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Form Card */}
        {!result && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Soil Nutrients Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <NutrientIcon />
                  Soil Nutrients (kg/ha)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Nitrogen (N)"
                    type="number"
                    name="N"
                    value={formData.N}
                    onChange={handleChange}
                    placeholder="0-200"
                    required
                    icon={NutrientIcon}
                  />
                  <InputField
                    label="Phosphorus (P)"
                    type="number"
                    name="P"
                    value={formData.P}
                    onChange={handleChange}
                    placeholder="0-200"
                    required
                    icon={NutrientIcon}
                  />
                  <InputField
                    label="Potassium (K)"
                    type="number"
                    name="K"
                    value={formData.K}
                    onChange={handleChange}
                    placeholder="0-300"
                    required
                    icon={NutrientIcon}
                  />
                </div>
              </div>

              {/* Climate Conditions Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <WeatherIcon />
                  Climate Conditions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Temperature (°C)"
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder="0-60"
                    required
                    icon={WeatherIcon}
                  />
                  <InputField
                    label="Humidity (%)"
                    type="number"
                    name="humidity"
                    value={formData.humidity}
                    onChange={handleChange}
                    placeholder="0-100"
                    required
                    icon={WeatherIcon}
                  />
                  <InputField
                    label="Soil pH"
                    type="number"
                    name="ph"
                    value={formData.ph}
                    onChange={handleChange}
                    placeholder="0-14"
                    step="0.1"
                    required
                    icon={NutrientIcon}
                  />
                  <InputField
                    label="Rainfall (mm)"
                    type="number"
                    name="rainfall"
                    value={formData.rainfall}
                    onChange={handleChange}
                    placeholder="0-500"
                    required
                    icon={WeatherIcon}
                  />
                </div>
              </div>

              <Button type="submit" loading={loading} disabled={loading}>
                Get Crop Recommendation
              </Button>
            </form>
          </div>
        )}

        {/* Result Display */}
        <PredictionResultCard result={result} type="crop" onReset={handleReset} />
      </div>
    </DashboardLayout>
  );
};

export default CropRecommendation;
