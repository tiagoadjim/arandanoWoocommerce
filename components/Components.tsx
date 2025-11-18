import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }> = ({ className = '', variant = 'primary', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  const variants = {
    primary: "border-transparent text-white bg-tn-600 hover:bg-tn-700 focus:ring-tn-500",
    secondary: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-tn-500",
    danger: "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    ghost: "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 shadow-none"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props} />
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, className = '', ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-tn-500 focus:border-tn-500 sm:text-sm ${className}`}
      {...props}
    />
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }> = ({ children, className = '', title, action }) => (
  <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
    {(title || action) && (
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        {title && <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="px-4 py-5 sm:p-6">
      {children}
    </div>
  </div>
);

export const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-yellow-100 text-yellow-800',
    pending: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    publish: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
  };

  const defaultStyle = 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || defaultStyle}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};