interface LoadingCardProps {
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export default function LoadingCard({ variant = 'default', className = '' }: LoadingCardProps) {
  if (variant === 'featured') {
    return (
      <div className={`bg-white rounded-card overflow-hidden shadow-lg aspect-card animate-pulse ${className}`}>
        <div className="h-64 bg-gray-200"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-card overflow-hidden shadow-sm border border-gray-100 animate-pulse ${className}`}>
        <div className="flex">
          <div className="w-20 h-20 bg-gray-200"></div>
          <div className="flex-1 p-4">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-card overflow-hidden shadow-lg animate-pulse ${className}`}>
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mt-3"></div>
      </div>
    </div>
  );
}