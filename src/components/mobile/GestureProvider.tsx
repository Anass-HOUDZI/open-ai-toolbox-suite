
import React, { createContext, useContext, useRef, ReactNode } from 'react';

interface GestureState {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  minSwipeDistance?: number;
}

const GestureContext = createContext<GestureState>({});

export const useGestures = () => useContext(GestureContext);

interface GestureProviderProps extends GestureState {
  children: ReactNode;
  className?: string;
}

export const GestureProvider: React.FC<GestureProviderProps> = ({
  children,
  className,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  minSwipeDistance = 50,
}) => {
  const touchStartRef = useRef<{ x: number; y: number; distance?: number } | null>(null);
  const scaleRef = useRef(1);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if (e.touches.length === 2 && onPinch) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current = { x: 0, y: 0, distance };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && onPinch && touchStartRef.current?.distance) {
      e.preventDefault();
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = distance / touchStartRef.current.distance;
      scaleRef.current = scale;
      onPinch(scale);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    if (e.changedTouches.length === 1 && !touchStartRef.current.distance) {
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (Math.max(absX, absY) > minSwipeDistance) {
        if (absX > absY) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        } else {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }
    }

    touchStartRef.current = null;
    scaleRef.current = 1;
  };

  return (
    <GestureContext.Provider value={{
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      onPinch,
      minSwipeDistance,
    }}>
      <div
        className={className}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          touchAction: onPinch ? 'none' : 'pan-x pan-y',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
    </GestureContext.Provider>
  );
};
