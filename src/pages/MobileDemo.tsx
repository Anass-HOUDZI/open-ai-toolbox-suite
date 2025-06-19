
import React, { useState } from 'react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { MobileCard } from '@/components/mobile/MobileCard';
import { MobileList } from '@/components/mobile/MobileList';
import { GestureProvider } from '@/components/mobile/GestureProvider';
import { Button } from '@/components/ui/button';
import { Home, Settings, User, Search } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';
import { toast } from 'sonner';

const MobileDemo = () => {
  const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`));
  const [loading, setLoading] = useState(false);
  const responsive = useResponsive();

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setItems(Array.from({ length: 20 }, (_, i) => `Refreshed Item ${i + 1}`));
    setLoading(false);
    toast.success('Liste rafraîchie !');
  };

  const handleLoadMore = async () => {
    if (loading) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setItems(prev => [...prev, ...Array.from({ length: 10 }, (_, i) => `New Item ${prev.length + i + 1}`)]);
    setLoading(false);
  };

  const sidebar = (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Navigation</h2>
      <div className="space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          <Home className="mr-2 h-4 w-4" />
          Accueil
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Search className="mr-2 h-4 w-4" />
          Recherche
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <User className="mr-2 h-4 w-4" />
          Profil
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </Button>
      </div>
    </div>
  );

  const bottomNav = (
    <div className="flex justify-around items-center py-2">
      <Button variant="ghost" size="sm" className="flex-col space-y-1 min-h-[44px]">
        <Home className="h-5 w-5" />
        <span className="text-xs">Accueil</span>
      </Button>
      <Button variant="ghost" size="sm" className="flex-col space-y-1 min-h-[44px]">
        <Search className="h-5 w-5" />
        <span className="text-xs">Recherche</span>
      </Button>
      <Button variant="ghost" size="sm" className="flex-col space-y-1 min-h-[44px]">
        <User className="h-5 w-5" />
        <span className="text-xs">Profil</span>
      </Button>
      <Button variant="ghost" size="sm" className="flex-col space-y-1 min-h-[44px]">
        <Settings className="h-5 w-5" />
        <span className="text-xs">Paramètres</span>
      </Button>
    </div>
  );

  const header = (
    <MobileHeader
      title="Démo Mobile"
      subtitle="Test des composants mobiles"
      onSearch={(query) => toast.info(`Recherche: ${query}`)}
      rightActions={
        <Button variant="ghost" size="sm">
          <Settings className="h-5 w-5" />
        </Button>
      }
    />
  );

  return (
    <MobileLayout
      sidebar={sidebar}
      bottomNav={responsive.isMobile ? bottomNav : undefined}
      header={header}
    >
      <div className="p-4 space-y-4">
        {/* Responsive Info */}
        <MobileCard>
          <div className="p-4">
            <h3 className="font-semibold mb-2">Informations Responsive</h3>
            <div className="space-y-1 text-sm">
              <p>Breakpoint: {responsive.breakpoint}</p>
              <p>Device: {responsive.isMobile ? 'Mobile' : responsive.isTablet ? 'Tablet' : 'Desktop'}</p>
              <p>Orientation: {responsive.isPortrait ? 'Portrait' : 'Landscape'}</p>
              <p>Taille: {responsive.width}x{responsive.height}</p>
            </div>
          </div>
        </MobileCard>

        {/* Gesture Demo */}
        <GestureProvider
          onSwipeLeft={() => toast.info('Swipe à gauche détecté!')}
          onSwipeRight={() => toast.info('Swipe à droite détecté!')}
          onSwipeUp={() => toast.info('Swipe vers le haut détecté!')}
          onSwipeDown={() => toast.info('Swipe vers le bas détecté!')}
          className="touch-target"
        >
          <MobileCard>
            <div className="p-4 text-center">
              <h3 className="font-semibold mb-2">Zone de Gestes</h3>
              <p className="text-sm text-muted-foreground">
                Swipez dans n'importe quelle direction
              </p>
            </div>
          </MobileCard>
        </GestureProvider>

        {/* Interactive Cards */}
        <div className="space-y-3">
          <h3 className="font-semibold">Cartes Interactives</h3>
          <MobileCard onTap={() => toast.success('Carte tapée!')} elevation="low">
            <div className="p-4">
              <h4 className="font-medium">Carte avec feedback tactile</h4>
              <p className="text-sm text-muted-foreground">Tapez pour tester l'interaction</p>
            </div>
          </MobileCard>
          <MobileCard loading>
            <div className="p-4">
              <h4 className="font-medium">Carte en chargement</h4>
              <p className="text-sm text-muted-foreground">Démonstration du skeleton loader</p>
            </div>
          </MobileCard>
          <MobileCard elevation="high">
            <div className="p-4">
              <h4 className="font-medium">Carte élevée</h4>
              <p className="text-sm text-muted-foreground">Avec ombre importante</p>
            </div>
          </MobileCard>
        </div>

        {/* Mobile List */}
        <div className="space-y-3">
          <h3 className="font-semibold">Liste avec Pull-to-Refresh</h3>
          <div className="border rounded-lg overflow-hidden" style={{ height: '300px' }}>
            <MobileList
              onRefresh={handleRefresh}
              onLoadMore={handleLoadMore}
              loading={loading}
              hasMore={items.length < 100}
            >
              <div className="space-y-2 p-4">
                {items.map((item, index) => (
                  <MobileCard key={index} className="p-3">
                    <p>{item}</p>
                  </MobileCard>
                ))}
              </div>
            </MobileList>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default MobileDemo;
