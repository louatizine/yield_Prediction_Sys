import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getCropHistory, getFertilizerHistory } from '../services/predictionService';
import { getDiseaseHistory } from '../services/diseaseService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPredictions: 0,
    cropsAnalyzed: 0,
    diseasesDetected: 0,
    avgYieldIncrease: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all history data
      const [cropHistory, fertilizerHistory, diseaseHistory] = await Promise.all([
        getCropHistory().catch(() => []),
        getFertilizerHistory().catch(() => []),
        getDiseaseHistory().catch(() => []),
      ]);

      // Calculate statistics
      const totalPredictions = cropHistory.length + fertilizerHistory.length;
      const uniqueCrops = new Set(cropHistory.map(item => item.prediction?.crop).filter(Boolean));
      const diseasesDetected = diseaseHistory.length;
      
      // Calculate average yield increase (mock calculation based on predictions)
      const avgYieldIncrease = totalPredictions > 0 ? Math.min(15 + (totalPredictions * 0.5), 35) : 0;

      setStats({
        totalPredictions,
        cropsAnalyzed: uniqueCrops.size,
        diseasesDetected,
        avgYieldIncrease: Math.round(avgYieldIncrease * 10) / 10,
      });

      // Build recent activities
      const activities = [];
      
      // Add crop predictions
      cropHistory.slice(0, 2).forEach(item => {
        activities.push({
          type: 'crop',
          action: `Crop recommendation: ${item.prediction?.crop || 'N/A'}`,
          time: formatTimeAgo(item.created_at),
          icon: '🌾',
          color: 'green',
        });
      });

      // Add fertilizer predictions
      fertilizerHistory.slice(0, 1).forEach(item => {
        activities.push({
          type: 'fertilizer',
          action: `Fertilizer: ${item.prediction?.fertilizer || 'N/A'}`,
          time: formatTimeAgo(item.created_at),
          icon: '🧪',
          color: 'blue',
        });
      });

      // Add disease detections
      diseaseHistory.slice(0, 1).forEach(item => {
        activities.push({
          type: 'disease',
          action: `Disease detected: ${item.prediction?.disease_name || 'Unknown'}`,
          time: formatTimeAgo(item.created_at),
          icon: '🦠',
          color: 'purple',
        });
      });

      // Sort by time and take top 3
      setRecentActivities(activities.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const yieldTrendData = [
    { month: 'Jan', yield: 2.8, rainfall: 45 },
    { month: 'Feb', yield: 3.2, rainfall: 52 },
    { month: 'Mar', yield: 3.5, rainfall: 48 },
    { month: 'Apr', yield: 4.1, rainfall: 65 },
    { month: 'May', yield: 4.5, rainfall: 78 },
    { month: 'Jun', yield: 4.2, rainfall: 92 },
  ];

  const cropDistribution = [
    { name: 'Rice', value: 35, color: '#10b981' },
    { name: 'Wheat', value: 25, color: '#f59e0b' },
    { name: 'Maize', value: 20, color: '#3b82f6' },
    { name: 'Others', value: 20, color: '#8b5cf6' },
  ];

  const weatherData = {
    temperature: 28,
    humidity: 65,
    rainfall: 78,
    soilMoisture: 72,
  };

  const features = [
    {
      icon: '🌾',
      title: 'Crop Recommendation',
      description: 'Get AI-powered crop suggestions based on your soil and climate data',
      path: '/crop-recommendation',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: '🧪',
      title: 'Fertilizer Recommendation',
      description: 'Find the perfect fertilizer for your crop and soil conditions',
      path: '/fertilizer-recommendation',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '🦠',
      title: 'Disease Detection',
      description: 'Identify plant diseases using AI-powered image recognition',
      path: '/disease-detection',
      color: 'from-purple-500 to-pink-500',
      disabled: false,
    },
  ];

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-2">Welcome back, {user?.username || 'User'}! 👋</h2>
          <p className="text-green-100 mb-6 text-lg">Ready to make data-driven farming decisions?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-30">
              <p className="text-sm text-green-100">Email</p>
              <p className="font-semibold text-lg">{user?.email}</p>
            </div>
            {user?.full_name && (
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-30">
                <p className="text-sm text-green-100">Full Name</p>
                <p className="font-semibold text-lg">{user.full_name}</p>
              </div>
            )}
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-30">
              <p className="text-sm text-green-100">Member Since</p>
              <p className="font-semibold text-lg">{new Date(user?.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  

        {/* Crops Analyzed */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🌾</span>
            </div>
            <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Crops Analyzed</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.cropsAnalyzed}</p>
          <p className="text-xs text-gray-500 mt-2">Different varieties</p>
        </div>

        {/* Diseases Detected */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🦠</span>
            </div>
            <span className="text-orange-600 text-sm font-semibold bg-orange-50 px-2 py-1 rounded-full">
              Monitor
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Diseases Detected</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.diseasesDetected}</p>
          <p className="text-xs text-gray-500 mt-2">Early detection saves crops</p>
        </div>

        {/* Avg Yield Increase */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Predictions</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalPredictions}</p>
          <p className="text-xs text-gray-500 mt-2">All-time count</p>
        </div>

       

    

        {/* Avg Yield Increase */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded-full">
              ↑ Trending
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Avg Yield Increase</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.avgYieldIncrease}%</p>
          <p className="text-xs text-gray-500 mt-2">vs. traditional methods</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Yield Trend Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Yield Trends</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Last 6 months</span>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {yieldTrendData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg hover:from-green-600 hover:to-emerald-500 transition-all relative group-hover:shadow-lg"
                     style={{ height: `${data.yield * 20}%` }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {data.yield} tons/ha
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2 font-medium">{data.month}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Yield (tons/ha)</span>
            </div>
          </div>
        </div>

        {/* Crop Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Crop Distribution</h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              {cropDistribution.map((crop, index) => {
                const prevTotal = cropDistribution.slice(0, index).reduce((sum, c) => sum + c.value, 0);
                const dashArray = `${crop.value * 3.14159} ${314.159 - crop.value * 3.14159}`;
                const dashOffset = -prevTotal * 3.14159;
                
                return (
                  <svg key={index} className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="50"
                      fill="none"
                      stroke={crop.color}
                      strokeWidth="40"
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  </svg>
                );
              })}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800">100%</p>
                  <p className="text-xs text-gray-500">Coverage</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {cropDistribution.map((crop, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: crop.color }}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{crop.name}</p>
                  <p className="text-xs text-gray-500">{crop.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weather & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Weather Widget */}
        <div className="lg:col-span-1 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span>☀️</span>
            Weather Conditions
          </h3>
          <div className="space-y-4">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Temperature</span>
                <span className="text-2xl font-bold">{weatherData.temperature}°C</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Humidity</span>
                <span className="text-2xl font-bold">{weatherData.humidity}%</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Rainfall</span>
                <span className="text-2xl font-bold">{weatherData.rainfall}mm</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Soil Moisture</span>
                <span className="text-2xl font-bold">{weatherData.soilMoisture}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className={`flex items-center gap-4 p-4 rounded-xl bg-${activity.color}-50 border border-${activity.color}-100 hover:shadow-md transition-all`}>
                <div className={`w-12 h-12 bg-${activity.color}-100 rounded-full flex items-center justify-center text-2xl`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <button className={`text-${activity.color}-600 hover:text-${activity.color}-700 font-medium text-sm`}>
                  View →
                </button>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No recent activities</p>
                <p className="text-sm mt-2">Start by making your first prediction!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>🎯</span>
          Available Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                feature.disabled ? 'opacity-60' : 'hover:shadow-2xl hover:-translate-y-2 cursor-pointer group'
              }`}
              onClick={() => !feature.disabled && navigate(feature.path)}
            >
              <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">{feature.title}</h4>
                </div>
                <p className="text-gray-600 mb-6 min-h-[60px]">{feature.description}</p>
                <button
                  disabled={feature.disabled}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    feature.disabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : `bg-gradient-to-r ${feature.color} text-white hover:shadow-lg group-hover:scale-105`
                  }`}
                >
                  {feature.disabled ? 'Coming Soon' : 'Get Started →'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
