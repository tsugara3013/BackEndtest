const { WebSocketServer } = require('ws');

function setupWebSocket(server) {
    const wss = new WebSocketServer({ server });
    return wss;
}

module.exports = setupWebSocket;