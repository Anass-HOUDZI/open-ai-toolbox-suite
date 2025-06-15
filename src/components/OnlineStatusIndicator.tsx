
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Wifi, WifiOff } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const OnlineStatusIndicator = () => {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (isOnline) {
      toast.success("Vous êtes de retour en ligne.", { id: 'online-status' });
    } else {
      toast.warning("Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.", { id: 'online-status', duration: Infinity });
    }
  }, [isOnline]);

  return (
    <div className="fixed bottom-4 right-4 z-50 transition-opacity duration-300">
      <div className={`flex items-center gap-2 p-2 rounded-full text-white shadow-lg ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`}>
        {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
        <span className="text-sm font-medium hidden sm:inline">{isOnline ? 'En ligne' : 'Hors ligne'}</span>
      </div>
    </div>
  );
};

export default OnlineStatusIndicator;
