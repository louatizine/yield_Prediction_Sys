import { useState, useEffect } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import PredictionResultCard from '../components/PredictionResultCard';
import DashboardLayout from '../components/DashboardLayout';
import { predictFertilizer, getFertilizerHistory } from '../services/predictionService';

const FertilizerRecommendation = () => {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
    crop_type: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const cropTypes = [
    'Rice', 'Maize', 'Chickpea', 'Kidney Beans', 'Pigeon Peas',
    'Moth Beans', 'Mung Bean', 'Black Gram', 'Lentil', 'Pomegranate',
    'Banana', 'Mango', 'Grapes', 'Watermelon', 'Muskmelon',
    'Apple', 'Orange', 'Papaya', 'Coconut', 'Cotton', 'Jute', 'Coffee'
  ];

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getFertilizerHistory();
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
      N: '37',
      P: '25',
      K: '18',
      temperature: '25',
      humidity: '65',
      ph: '6.2',
      rainfall: '180',
      crop_type: 'Rice',
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
      const payload = {
        N: parseFloat(formData.N),
        P: parseFloat(formData.P),
        K: parseFloat(formData.K),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        ph: parseFloat(formData.ph),
        rainfall: parseFloat(formData.rainfall),
        crop_type: formData.crop_type,
      };

      const response = await predictFertilizer(payload);
      setResult(response);
    } catch (err) {
      let errorMessage = 'Failed to get fertilizer prediction. Please try again.';
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
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
      crop_type: '',
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

  const CropIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🌱</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Fertilizer Recommendation</h1>
          <p className="text-gray-600">Get optimal fertilizer suggestions for your crops</p>
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
              How to Use Fertilizer Recommendation
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">🎯 Purpose</h3>
                <p className="text-gray-700">Get precise fertilizer recommendations based on your current soil nutrients and the specific crop you're growing. This helps optimize yield while reducing waste and environmental impact.</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">📋 Required Information</h3>
                <ul className="list-disc list-inside text-gray-600 ml-4 space-y-2">
                  <li><strong>Current Soil Nutrients (N-P-K):</strong> Get a recent soil test to know existing nutrient levels</li>
                  <li><strong>Crop Type:</strong> Select the crop you're planning to grow or are currently growing</li>
                  <li><strong>Climate Data:</strong> Temperature, humidity, and expected rainfall</li>
                  <li><strong>Soil pH:</strong> Affects nutrient availability to plants</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">💡 Example: Rice Cultivation</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-gray-600">N:</span> <span className="font-semibold">37 kg/ha</span></div>
                  <div><span className="text-gray-600">P:</span> <span className="font-semibold">25 kg/ha</span></div>
                  <div><span className="text-gray-600">K:</span> <span className="font-semibold">18 kg/ha</span></div>
                  <div><span className="text-gray-600">Temp:</span> <span className="font-semibold">25°C</span></div>
                  <div><span className="text-gray-600">Humidity:</span> <span className="font-semibold">65%</span></div>
                  <div><span className="text-gray-600">pH:</span> <span className="font-semibold">6.2</span></div>
                  <div><span className="text-gray-600">Rainfall:</span> <span className="font-semibold">180mm</span></div>
                  <div><span className="text-gray-600">Crop:</span> <span className="font-semibold text-green-600">Rice</span></div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">🌾 Understanding N-P-K Ratio</h3>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <div className="font-semibold text-amber-800 mb-1">Nitrogen (N)</div>
                    <div className="text-gray-600">Promotes leafy green growth. Essential for photosynthesis.</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="font-semibold text-blue-800 mb-1">Phosphorus (P)</div>
                    <div className="text-gray-600">Strengthens roots. Critical for flowering and fruiting.</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <div className="font-semibold text-purple-800 mb-1">Potassium (K)</div>
                    <div className="text-gray-600">Improves disease resistance and overall plant health.</div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-lg text-green-800 mb-2">✅ Best Practices</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Test your soil every 6-12 months for accurate nutrient levels</li>
                  <li>Apply fertilizers during the crop's active growth phase</li>
                  <li>Split applications are better than single large doses</li>
                  <li>Consider organic alternatives when possible</li>
                  <li>Store fertilizers in a cool, dry place</li>
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
              Recommendation History
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
                <p>No recommendations yet. Make your first prediction!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fertilizer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Soil (N-P-K)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {history.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                            {item.prediction.fertilizer}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.input_data.crop_type}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.input_data.N}-{item.input_data.P}-{item.input_data.K}
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
              {/* Crop Type Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CropIcon />
                  Crop Information
                </h3>
                <div className="mb-4">
                  <label htmlFor="crop_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="crop_type"
                      name="crop_type"
                      value={formData.crop_type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 text-gray-800"
                    >
                      <option value="">Select a crop</option>
                      {cropTypes.map((crop) => (
                        <option key={crop} value={crop.toLowerCase()}>
                          {crop}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <CropIcon />
                    </div>
                  </div>
                </div>
              </div>

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
                Get Fertilizer Recommendation
              </Button>
            </form>
          </div>
        )}

        {/* Result Display */}
        <PredictionResultCard result={result} type="fertilizer" onReset={handleReset} />
      </div>
    </DashboardLayout>
  );
};

export default FertilizerRecommendation;
