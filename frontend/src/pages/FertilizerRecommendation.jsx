import { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import PredictionResultCard from '../components/PredictionResultCard';
import { predictFertilizer } from '../services/predictionService';

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

  const cropTypes = [
    'Rice', 'Maize', 'Chickpea', 'Kidney Beans', 'Pigeon Peas',
    'Moth Beans', 'Mung Bean', 'Black Gram', 'Lentil', 'Pomegranate',
    'Banana', 'Mango', 'Grapes', 'Watermelon', 'Muskmelon',
    'Apple', 'Orange', 'Papaya', 'Coconut', 'Cotton', 'Jute', 'Coffee'
  ];

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
      setError(err.response?.data?.detail || 'Failed to get fertilizer prediction. Please try again.');
      setResult({ success: false, message: err.response?.data?.detail || 'Prediction failed' });
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🧪</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Fertilizer Recommendation</h1>
          <p className="text-gray-600">Get the perfect fertilizer for your crop and soil conditions</p>
        </div>

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
    </div>
  );
};

export default FertilizerRecommendation;
