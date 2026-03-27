'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '100vw',
  fill = false,
  width,
  height,
  style,
  onClick,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={style}
        {...props}
      >
        <span className="text-gray-400 text-2xl">📍</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      onError={() => setError(true)}
      className={className}
      style={style}
      onClick={onClick}
      {...props}
    />
  );
}
