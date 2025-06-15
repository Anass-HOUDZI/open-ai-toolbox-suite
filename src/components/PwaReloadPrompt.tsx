
import { useRegisterSW } from 'virtual:pwa-register/react'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useEffect } from 'react'

function PwaReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        console.log('SW Registered:', r)
      }
    },
    onRegisterError(error) {
      console.log('SW registration error:', error)
    },
  })

  useEffect(() => {
    if (needRefresh) {
      const toastId = toast.info("Une nouvelle version est disponible.", {
        action: (
          <Button size="sm" onClick={() => {
            updateServiceWorker(true)
            toast.dismiss(toastId)
          }}>
            Mettre à jour
          </Button>
        ),
        duration: Infinity,
        dismissible: true,
        onDismiss: () => setNeedRefresh(false),
        onAutoClose: () => setNeedRefresh(false),
      })
    }
  }, [needRefresh, setNeedRefresh, updateServiceWorker])

  return null
}

export default PwaReloadPrompt
