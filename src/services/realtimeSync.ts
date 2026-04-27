type StorageSyncMessage = {
  type: "storage-sync"
  key: string
  value: string | null
  senderId: string
  timestamp: number
}

const MANAGED_PREFIX = "pesolend_"
export const REALTIME_STORAGE_EVENT = "pesolend-storage-updated"

const senderId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
const wsUrl = import.meta.env.VITE_REALTIME_WS_URL || "ws://localhost:8787"

let started = false
let socket: WebSocket | null = null
let reconnectAttempt = 0
let reconnectTimer: number | undefined
let suppressBroadcast = false
const outbox: StorageSyncMessage[] = []

function isManagedKey(key: string): boolean {
  return key.startsWith(MANAGED_PREFIX)
}

function emitStorageUpdate(key: string) {
  window.dispatchEvent(
    new CustomEvent(REALTIME_STORAGE_EVENT, {
      detail: { key },
    })
  )
}

function queueOrSend(message: StorageSyncMessage) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message))
    return
  }
  outbox.push(message)
}

function flushOutbox() {
  if (!socket || socket.readyState !== WebSocket.OPEN) return
  while (outbox.length > 0) {
    const message = outbox.shift()
    if (!message) break
    socket.send(JSON.stringify(message))
  }
}

function broadcastStorageUpdate(key: string, value: string | null) {
  if (!isManagedKey(key) || suppressBroadcast) return
  queueOrSend({
    type: "storage-sync",
    key,
    value,
    senderId,
    timestamp: Date.now(),
  })
}

function applyRemoteStorageUpdate(key: string, value: string | null) {
  suppressBroadcast = true
  try {
    if (value === null) {
      Storage.prototype.removeItem.call(localStorage, key)
    } else {
      Storage.prototype.setItem.call(localStorage, key, value)
    }
  } finally {
    suppressBroadcast = false
  }

  emitStorageUpdate(key)
}

function scheduleReconnect() {
  if (reconnectTimer) {
    window.clearTimeout(reconnectTimer)
  }

  const delay = Math.min(30000, 1000 * 2 ** reconnectAttempt)
  reconnectAttempt += 1
  reconnectTimer = window.setTimeout(connectWebSocket, delay)
}

function connectWebSocket() {
  try {
    socket = new WebSocket(wsUrl)
  } catch (error) {
    console.warn("Realtime sync connection failed:", error)
    scheduleReconnect()
    return
  }

  socket.onopen = () => {
    reconnectAttempt = 0
    flushOutbox()
  }

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(String(event.data)) as Partial<StorageSyncMessage>
      if (
        message.type !== "storage-sync" ||
        typeof message.key !== "string" ||
        message.senderId === senderId
      ) {
        return
      }

      if (!isManagedKey(message.key)) {
        return
      }

      const nextValue = typeof message.value === "string" ? message.value : null
      applyRemoteStorageUpdate(message.key, nextValue)
    } catch (error) {
      console.warn("Failed to parse realtime sync message:", error)
    }
  }

  socket.onclose = () => {
    scheduleReconnect()
  }

  socket.onerror = () => {
    if (socket && socket.readyState !== WebSocket.OPEN) {
      scheduleReconnect()
    }
  }
}

function patchLocalStorage() {
  const globalMarker = "__pesolendStoragePatched"
  const globalAny = window as Window & { [globalMarker]?: boolean }
  if (globalAny[globalMarker]) {
    return
  }

  const originalSetItem = Storage.prototype.setItem
  const originalRemoveItem = Storage.prototype.removeItem
  const originalClear = Storage.prototype.clear

  Storage.prototype.setItem = function setItemPatched(key: string, value: string) {
    originalSetItem.call(this, key, value)
    if (this === localStorage && !suppressBroadcast && isManagedKey(key)) {
      emitStorageUpdate(key)
      broadcastStorageUpdate(key, value)
    }
  }

  Storage.prototype.removeItem = function removeItemPatched(key: string) {
    originalRemoveItem.call(this, key)
    if (this === localStorage && !suppressBroadcast && isManagedKey(key)) {
      emitStorageUpdate(key)
      broadcastStorageUpdate(key, null)
    }
  }

  Storage.prototype.clear = function clearPatched() {
    const keysToBroadcast: string[] = []
    if (this === localStorage && !suppressBroadcast) {
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i)
        if (key && isManagedKey(key)) {
          keysToBroadcast.push(key)
        }
      }
    }

    originalClear.call(this)

    if (this === localStorage && !suppressBroadcast) {
      keysToBroadcast.forEach((key) => {
        emitStorageUpdate(key)
        broadcastStorageUpdate(key, null)
      })
    }
  }

  globalAny[globalMarker] = true
}

export function initRealtimeSync() {
  if (started || typeof window === "undefined") {
    return
  }

  started = true
  patchLocalStorage()
  connectWebSocket()
}
