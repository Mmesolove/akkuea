'use client';

import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export function Select({ children, className = '', ...props }: SelectProps) {
  return (
    <select className={`px-2 py-1 border rounded ${className}`} {...props}>
      {children}
    </select>
  );
}

export default Select;
