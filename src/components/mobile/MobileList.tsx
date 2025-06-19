
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileListProps {
  children: ReactNode;
  onRefresh?: () => Promise<void>;
  onLoadMore?: () => Promise<void>;
  loading?: boolean;
  hasMore?: boolean;
  className?: string;
  pullThreshold?: number;
}

export const MobileList: React.FC<MobileListProps> = ({
  children,
  onRefresh,
  onLoadMore,
  loading = false,
  hasMore = false,
  className,
  pullThreshold = 60,
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!onRefresh || containerRef.current?.scrollTop !== 0) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startYRef.current);
    
    if (distance > 0) {
      setIsPulling(true);
      setPullDistance(Math.min(distance, pullThreshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (isPulling && pullDistance >= pullThreshold && onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setIsPulling(false);
    setPullDistance(0);
  };

  const handleScroll = () => {
    if (!onLoadMore || loading || !hasMore) return;

    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const threshold = 100;

    if (scrollHeight - scrollTop - clientHeight < threshold) {
      onLoadMore();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-auto',
        'webkit-overflow-scrolling-touch',
        className
      )}
      style={{
        WebkitOverflowScrolling: 'touch',
        transform: `translateY(${isPulling ? pullDistance * 0.5 : 0}px)`,
        transition: isPulling ? 'none' : 'transform 0.3s ease-out',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to Refresh Indicator */}
      {onRefresh && (
        <div
          className={cn(
            'absolute top-0 left-0 right-0 flex items-center justify-center',
            'text-gray-500 transition-opacity duration-200',
            'transform -translate-y-full',
            isPulling || isRefreshing ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            height: pullThreshold,
            transform: `translateY(${isPulling ? pullDistance - pullThreshold : isRefreshing ? 0 : -pullThreshold}px)`,
          }}
        >
          <RefreshCw 
            className={cn(
              'w-6 h-6 transition-transform duration-200',
              (isRefreshing || pullDistance >= pullThreshold) && 'animate-spin'
            )}
          />
        </div>
      )}

      {children}

      {/* Load More Indicator */}
      {loading && (
        <div className="flex items-center justify-center p-4">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      )}
    </div>
  );
};
