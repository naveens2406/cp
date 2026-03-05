import React from 'react';

/**
 * FloatingLabelInput - Input with floating label animation
 */
const FloatingLabelInput = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required, 
  error,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = React.useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`form-group relative ${className}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`form-input peer ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
        {...props}
      />
      <label 
        className={`form-label absolute left-4 transition-all duration-200 pointer-events-none
          ${focused || hasValue 
            ? 'top-0 -translate-y-1/2 text-xs bg-white px-1' 
            : 'top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]'
          }
          ${focused ? 'text-[var(--color-primary)]' : ''}
          ${error ? 'text-red-500' : ''}
        `}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {error && (
        <p className="text-red-500 text-xs mt-1 animate-fade-in">{error}</p>
      )}
    </div>
  );
};

/**
 * FloatingLabelTextarea - Textarea with floating label
 */
const FloatingLabelTextarea = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required, 
  error,
  rows = 4,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = React.useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`form-group relative ${className}`}>
      <textarea
        value={value}
        onChange={onChange}
        placeholder=" "
        required={required}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`form-input peer pt-4 h-auto resize-none ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
        {...props}
      />
      <label 
        className={`form-label absolute left-4 transition-all duration-200 pointer-events-none
          ${focused || hasValue 
            ? 'top-0 -translate-y-1/2 text-xs bg-white px-1' 
            : 'top-4 -translate-y-1/2 text-[var(--color-ink-muted)]'
          }
          ${focused ? 'text-[var(--color-primary)]' : ''}
          ${error ? 'text-red-500' : ''}
        `}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {error && (
        <p className="text-red-500 text-xs mt-1 animate-fade-in">{error}</p>
      )}
    </div>
  );
};

/**
 * SelectInput - Custom styled select
 */
const SelectInput = ({ 
  label, 
  value, 
  onChange, 
  options = [],
  required, 
  error,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = React.useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`form-group relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`form-input peer appearance-none cursor-pointer ${error ? 'border-red-500' : ''}`}
        {...props}
      >
        <option value="">Select...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <label 
        className={`form-label absolute left-4 transition-all duration-200 pointer-events-none
          ${focused || hasValue 
            ? 'top-0 -translate-y-1/2 text-xs bg-white px-1' 
            : 'top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]'
          }
          ${focused ? 'text-[var(--color-primary)]' : ''}
          ${error ? 'text-red-500' : ''}
        `}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {error && (
        <p className="text-red-500 text-xs mt-1 animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export { FloatingLabelInput, FloatingLabelTextarea, SelectInput };
