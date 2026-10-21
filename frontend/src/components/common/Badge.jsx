import React from 'react';

export const Badge = ({
  children,
  variant = 'caramel', // 'caramel', 'mocha', 'latte', 'sale', 'demo'
  className = '',
  ...props
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
