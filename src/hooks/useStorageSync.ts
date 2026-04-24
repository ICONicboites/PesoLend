import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Keeps component state in sync with a localStorage key — across tabs AND within the same tab.
 *
 * HOW IT WORKS:
 * - Cross-tab:  The native `storage` event fires in every OTHER open tab/window whenever
 *               localStorage is written to. We listen for that event and re-run the fetcher.
 * - Same-tab:   The `storage` event does NOT fire in the tab that made the write, so we
 *               supplement with polling every `pollIntervalMs` milliseconds.
 *
 * WHY DATA IS SAFE AFTER USER LOGOUT:
 * - `clearUser()` only removes the `pesolend_user` session key.
 * - Loan data stored under `pesolend_loans` is NEVER deleted on logout.
 * - Even if the User logs out immediately after submitting a request, the loan record
 *   remains in localStorage and will be detected by the Admin on the next poll or
 *   storage event.
 *
 * @param storageKey     The localStorage key to watch (e.g. 'pesolend_loans')
 * @param fetcher        Pure function that reads & returns the current data from localStorage
 * @param pollIntervalMs How often to poll for same-tab changes (default 3 s)
 */
export function useStorageSync<T>(
  storageKey: string,
  fetcher: () => T,
  pollIntervalMs = 3000
): { data: T; newCount: number; clearAlert: () => void } {
  // Keep fetcher in a ref so the effect closure never goes stale without re-subscribing
  const fetcherRef = useRef(fetcher)
  useEffect(() => {
    fetcherRef.current = fetcher
  })

  // seenCount tracks how many array items were present when the component first mounted.
  // Any items beyond that number are considered "new" for the notification badge.
  const seenCountRef = useRef(0)

  const [data, setData] = useState<T>(() => {
    const initial = fetcher()
    seenCountRef.current = Array.isArray(initial) ? (initial as unknown[]).length : 0
    return initial
  })

  const [newCount, setNewCount] = useState(0)

  // sync: reads fresh data, updates state, increments newCount if new array items appeared
  const sync = useCallback(() => {
    const fresh = fetcherRef.current()
    setData(fresh)
    if (Array.isArray(fresh)) {
      const incoming = (fresh as unknown[]).length - seenCountRef.current
      if (incoming > 0) {
        setNewCount((n) => n + incoming)
        seenCountRef.current = (fresh as unknown[]).length
      }
    }
  }, [])

  useEffect(() => {
    // Cross-tab: storage event fires in every tab EXCEPT the one that wrote
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey || e.key === null) {
        sync()
      }
    }
    window.addEventListener('storage', onStorage)

    // Same-tab fallback: poll every pollIntervalMs
    const timer = setInterval(sync, pollIntervalMs)

    return () => {
      window.removeEventListener('storage', onStorage)
      clearInterval(timer)
    }
  }, [storageKey, pollIntervalMs, sync])

  // Call this when the admin acknowledges the notification to reset the badge
  const clearAlert = useCallback(() => {
    setNewCount(0)
    if (Array.isArray(data)) {
      seenCountRef.current = (data as unknown[]).length
    }
  }, [data])

  return { data, newCount, clearAlert }
}
