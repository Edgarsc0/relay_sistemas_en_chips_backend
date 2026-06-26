const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log(`Relay WebSocket iniciado en puerto ${PORT}...`);

wss.on('connection', (ws) => {
    console.log('Cliente conectado.');

    ws.on('message', (data) => {
        // Broadcast a todos los clientes conectados (bridge + browsers)
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        });
    });

    ws.on('close', () => console.log('Cliente desconectado.'));
});
