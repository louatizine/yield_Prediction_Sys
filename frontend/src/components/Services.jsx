const Services = () => {
  const services = [
    {
      icon: '🌾',
      title: 'Crop Recommendation',
      description: 'Get personalized crop suggestions based on soil composition, climate conditions, and regional data to maximize your harvest.',
      features: ['Soil Analysis', 'Climate Optimization', 'Yield Prediction', 'Seasonal Planning'],
      gradient: 'from-green-600 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      icon: '🧪',
      title: 'Fertilizer Recommendation',
      description: 'Receive optimal fertilizer recommendations tailored to your crop type and soil nutrients for healthy plant growth.',
      features: ['NPK Analysis', 'Custom Blends', 'Cost Optimization', 'Application Timing'],
      gradient: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      icon: '🦠',
      title: 'Plant Disease Detection',
      description: 'Upload plant images to identify diseases instantly using advanced AI and get treatment recommendations.',
      features: ['Image Recognition', 'Disease Diagnosis', 'Treatment Plans', 'Prevention Tips'],
      gradient: 'from-purple-600 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4">
            <span>Our Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            AI-Powered Agricultural Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Leverage the power of artificial intelligence to optimize every aspect of your farming operations
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 overflow-hidden"
            >
              {/* Background Pattern */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-900">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient}`}></div>
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Learn More Button */}
                <button className={`group/btn w-full py-3 px-6 bg-gradient-to-r ${service.gradient} text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2`}>
                  <span>Learn More</span>
                  <svg
                    className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          ))}
        </div>

        {/* Why Choose Section */}
        <div className="mt-20 bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-12 text-white shadow-2xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Why Choose AgriDoctor?</h3>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              We combine advanced technology with agricultural expertise to deliver unmatched value
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🎯', title: 'AI-Powered Insights', desc: '98% accuracy in predictions' },
              { icon: '⚡', title: 'Real-Time Results', desc: 'Instant analysis and recommendations' },
              { icon: '🌍', title: 'Local Adaptation', desc: 'Optimized for your region' },
              { icon: '💚', title: 'Sustainable', desc: 'Eco-friendly solutions' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-green-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
