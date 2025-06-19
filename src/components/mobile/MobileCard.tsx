
import React, { useState, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  onTap?: () => void;
  loading?: boolean;
  interactive?: boolean;
  elevation?: 'low' | 'medium' | 'high';
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className,
  onTap,
  loading = false,
  interactive = true,
  elevation = 'medium',
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const elevationClasses = {
    low: 'shadow-sm',
    medium: 'shadow-md',
    high: 'shadow-lg',
  };

  const handleTouchStart = () => {
    if (interactive) {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (onTap) {
      onTap();
    }
  };

  if (loading) {
    return (
      <Card className={cn(
        'p-4 animate-pulse',
        elevationClasses[elevation],
        className
      )}>
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'transition-all duration-150 ease-out',
        'min-h-[44px]', // iOS touch target minimum
        elevationClasses[elevation],
        interactive && 'cursor-pointer select-none',
        interactive && 'active:scale-[0.98]',
        interactive && 'hover:shadow-lg',
        isPressed && 'scale-[0.98] shadow-sm',
        'transform-gpu will-change-transform',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => setIsPressed(false)}
      style={{
        transform: isPressed ? 'scale(0.98) translateZ(0)' : 'scale(1) translateZ(0)',
      }}
    >
      {children}
    </Card>
  );
};
