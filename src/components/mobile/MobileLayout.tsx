
import React, { ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  bottomNav?: ReactNode;
  header?: ReactNode;
  className?: string;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  sidebar,
  bottomNav,
  header,
  className,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile, safeAreaInsets } = useResponsive();

  if (!isMobile) {
    // Desktop layout with permanent sidebar
    return (
      <div className={cn('flex min-h-screen', className)}>
        {sidebar && (
          <aside className="w-64 border-r bg-background">
            {sidebar}
          </aside>
        )}
        <div className="flex-1 flex flex-col">
          {header}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn('flex flex-col min-h-screen', className)}
      style={{
        paddingTop: safeAreaInsets.top,
        paddingBottom: bottomNav ? safeAreaInsets.bottom : 0,
        paddingLeft: safeAreaInsets.left,
        paddingRight: safeAreaInsets.right,
      }}
    >
      {/* Mobile Header */}
      {header && (
        <header className="sticky top-0 z-40 bg-background border-b">
          <div className="flex items-center justify-between p-4">
            {sidebar && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="min-h-[44px] min-w-[44px]">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="h-full overflow-auto">
                    {sidebar}
                  </div>
                </SheetContent>
              </Sheet>
            )}
            <div className="flex-1">
              {header}
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main 
        className={cn(
          'flex-1 overflow-auto',
          bottomNav && 'pb-16' // Space for bottom navigation
        )}
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      {bottomNav && (
        <nav 
          className="fixed bottom-0 left-0 right-0 bg-background border-t z-40"
          style={{
            paddingBottom: safeAreaInsets.bottom,
            paddingLeft: safeAreaInsets.left,
            paddingRight: safeAreaInsets.right,
          }}
        >
          {bottomNav}
        </nav>
      )}
    </div>
  );
};
