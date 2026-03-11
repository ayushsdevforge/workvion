const FormInput = ({ label, error, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2.5 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-brand-200'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;
