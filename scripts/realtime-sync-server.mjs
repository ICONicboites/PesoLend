import { WebSocketServer } from 'ws'

const port = Number(process.env.REALTIME_SYNC_PORT || 8787)
const wss = new WebSocketServer({ port })

wss.on('connection', (socket) => {
  socket.on('message', (raw) => {
    const payload = raw.toString()

    // Broadcast storage updates to every other connected browser session.
    for (const client of wss.clients) {
      if (client !== socket && client.readyState === 1) {
        client.send(payload)
      }
    }
  })
})

console.log(`Realtime sync server listening on ws://localhost:${port}`)
