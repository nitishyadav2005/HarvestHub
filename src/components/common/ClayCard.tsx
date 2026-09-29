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

  return (
    <div
      onClick={onClick}
      className={`${baseClass} ${interactiveClass} ${className} p-5 transition-all duration-200`}
    >
      {children}
    </div>
  );
};
