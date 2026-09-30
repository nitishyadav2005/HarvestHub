import React from 'react';

interface ClayCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'green' | 'mint' | 'inset';
  interactive?: boolean;
  onClick?: () => void;
}

export const ClayCard: React.FC<ClayCardProps> = ({
  children,
  className = '',
  variant = 'white',
  interactive = false,
  onClick
}) => {
  let baseClass = 'clay-card';

  if (variant === 'green') {
    baseClass = 'clay-card-green';
  } else if (variant === 'mint') {
    baseClass = 'clay-card-mint';
  } else if (variant === 'inset') {
    baseClass = 'clay-inset';
  }

  const interactiveClass = interactive ? 'clay-card-interactive' : '';
  // Check if caller specified custom padding
  const hasCustomPadding = /\bp-\d|\bpx-|\bpy-/.test(className);
  const defaultPadding = hasCustomPadding ? '' : 'p-4 sm:p-5';

  return (
    <div
      onClick={onClick}
      className={`${baseClass} ${interactiveClass} min-w-0 overflow-hidden ${defaultPadding} ${className} transition-all duration-200`}
    >
      {children}
    </div>
  );
};
