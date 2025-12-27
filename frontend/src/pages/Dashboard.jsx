import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🌾</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AgriDoctor</h1>
                <p className="text-sm text-gray-600">Smart Agriculture Platform</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.username || 'User'}! 👋</h2>
          <p className="text-green-100 mb-4">Ready to make smarter farming decisions?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm text-green-100">Email</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
            {user?.full_name && (
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm text-green-100">Full Name</p>
                <p className="font-semibold">{user.full_name}</p>
              </div>
            )}
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm text-green-100">Member Since</p>
              <p className="font-semibold">{new Date(user?.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Available Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                  feature.disabled ? 'opacity-60' : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                }`}
                onClick={() => !feature.disabled && navigate(feature.path)}
              >
                <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-3xl`}>
                      {feature.icon}
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">{feature.title}</h4>
                  </div>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <button
                    disabled={feature.disabled}
                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                      feature.disabled
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : `bg-gradient-to-r ${feature.color} text-white hover:opacity-90`
                    }`}
                  >
                    {feature.disabled ? 'Coming Soon' : 'Get Started'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-600">Predictions Made</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600">Crops Analyzed</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="text-3xl font-bold text-purple-600">0</p>
              <p className="text-sm text-gray-600">Diseases Detected</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <p className="text-3xl font-bold text-orange-600">New</p>
              <p className="text-sm text-gray-600">Account Status</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
