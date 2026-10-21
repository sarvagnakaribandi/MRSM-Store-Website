import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'caramel', 'outline', 'outline-caramel'
  size = 'md',         // 'sm', 'md', 'lg'
  isFullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon = null,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`btn btn-${variant} btn-${size} ${isFullWidth ? 'btn-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
