const Button = ({ 
  children, 
  type = 'button', 
  onClick, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  fullWidth = true,
  className = '',
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: `
      bg-gradient-to-r from-green-600 to-emerald-600 text-white
      hover:from-green-700 hover:to-emerald-700
      active:scale-95
      shadow-lg shadow-green-500/30
      disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed
    `,
    secondary: `
      bg-white text-green-600 border-2 border-green-600
      hover:bg-green-50
      active:scale-95
      disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {loading ? 'Please wait...' : children}
    </button>
  );
};

export default Button;
