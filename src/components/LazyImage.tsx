import React, { useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, referrerPolicy = 'no-referrer' }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy={referrerPolicy}
        className={`w-full h-full object-cover transition-all duration-500 ${isLoaded ? 'opacity-100 blur-none' : 'opacity-0 blur-sm'}`}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};
