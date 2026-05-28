'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', variant = 'default', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-md px-3 py-2';
    const variantCls = variant === 'outline' ? 'border' : 'bg-primary text-white';
    return (
      <button ref={ref} className={`${base} ${variantCls} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
