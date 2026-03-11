const Card = ({ children, className = '', title, subtitle, action, ...props }) => {
  return (
    <div className={`bg-white/70 backdrop-blur-sm rounded-2xl border border-brand-100/50 p-6 shadow-sm ${className}`} {...props}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-brand-950">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
