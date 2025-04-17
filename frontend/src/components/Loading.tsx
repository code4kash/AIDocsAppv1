import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ fullScreen = false, text = 'Loading...' }) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm'
    : 'flex items-center justify-center';

  return (
    <div 
      className={containerClasses}
      role="status"
      aria-live="polite"
      data-testid="loading-container"
    >
      <div className="text-center">
        <div 
          className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"
          aria-hidden="true"
        />
        {text && (
          <p className="mt-4 text-secondary" aria-label={text}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}; 