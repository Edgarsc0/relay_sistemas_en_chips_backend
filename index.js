const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const PING_INTERVAL_MS = 30000;

const wss = new WebSocket.Server({ port: PORT });

console.log(`Relay WebSocket iniciado en puerto ${PORT}...`);

wss.on('connection', (ws) => {
    console.log('Cliente conectado.');
    ws.isAlive = true;

    ws.on('pong', () => { ws.isAlive = true; });

    ws.on('message', (data) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        });
    });

    ws.on('close', () => console.log('Cliente desconectado.'));
});

// Mantiene conexiones vivas y limpia zombies
const heartbeat = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
            console.log('Cliente zombie terminado.');
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
}, PING_INTERVAL_MS);

wss.on('close', () => clearInterval(heartbeat));
