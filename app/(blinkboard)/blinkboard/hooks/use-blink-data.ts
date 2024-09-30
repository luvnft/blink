import { useEffect, useState } from 'react'
import { getBlinkActions } from '../api/blink-data'
import { BlinkAction } from '../types/blink'

export const useBlinkData = () => {
  const [blinkActions, setBlinkActions] = useState<BlinkAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlinkActions() {
      const data = await getBlinkActions()
      setBlinkActions(data)
      setLoading(false)
    }
    fetchBlinkActions()
  }, [])

  return { blinkActions, loading }
}
