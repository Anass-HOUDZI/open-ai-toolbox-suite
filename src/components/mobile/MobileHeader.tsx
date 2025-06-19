
import React, { ReactNode } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  rightActions?: ReactNode;
  className?: string;
  compact?: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onSearch,
  searchPlaceholder = "Rechercher...",
  rightActions,
  className,
  compact = false,
}) => {
  return (
    <div className={cn(
      'flex flex-col space-y-2',
      compact ? 'py-2' : 'py-4',
      className
    )}>
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="min-h-[44px] min-w-[44px] p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex-1 min-w-0">
            {title && (
              <h1 className={cn(
                'font-semibold truncate',
                compact ? 'text-lg' : 'text-xl'
              )}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {rightActions && (
          <div className="flex items-center space-x-1">
            {rightActions}
          </div>
        )}
      </div>

      {/* Search Bar */}
      {onSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-10 h-11" // Increased height for better touch targets
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
