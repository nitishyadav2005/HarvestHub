import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'blue' | 'amber' | 'red' | 'gray' | 'mint';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'green',
  size = 'md'
}) => {
  const styles = {
    green: 'bg-[#d8f3dc] text-[#1b4332] border border-[#b7e4c7]',
    blue: 'bg-blue-100 text-blue-800 border border-blue-200',
    amber: 'bg-amber-100 text-amber-900 border border-amber-200',
    red: 'bg-red-100 text-red-800 border border-red-200',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200',
    mint: 'bg-[#e8f5e9] text-[#2d6a4f] border border-[#a3e635]'
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full font-medium',
    md: 'text-xs md:text-sm px-3 py-1 rounded-full font-semibold'
  };

  return (
    <span className={`inline-flex items-center gap-1 shadow-xs ${styles[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};
