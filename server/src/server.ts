import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as os from 'os';
import * as common from 'common/lib';

const app = express();

// Initialize a simple http server
const server = http.createServer(app);

// Initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
    id: string;
}

let nextClientId: number = 0;

/**
 * Create a message
 * @param {string} contentType
 * @param {Object} content
 * @returns {string}
 */
function createMessage(contentType: string, content: Object): string {
    return JSON.stringify(new common.Message(contentType, content));
}

/**
 * Generate os stats
 * @returns {Object}
 */
function generateStats() : Object {

    const cpus = os.cpus();

    // Calculate CPU usage %
    let cpuData: any = {};
    cpus.forEach((cpu: any) => {
       let tot = 0;
       for(const type in cpu.times) {
           tot += cpu.times[type];
       }
       for(const type in cpu.times) {
           if(type === 'nice' || type === 'irq') continue;
           cpuData[type] = Math.round(100 * cpu.times[type] / tot);
       }
    });

    return {
        mem: os.totalmem() - os.freemem(),
        cpus: cpuData
    };
}

/**
 * Connection created
 */
wss.on('connection', (ws: WebSocket) => {

    const extWs = ws as ExtWebSocket;

    extWs.isAlive = true;
    extWs.id = (nextClientId++).toString();

    /**
     * Keep alive connection
     */
    ws.on('pong', () => {
        extWs.isAlive = true;
    });

    /**
     * On message handler
     */
    ws.on('message', (msg: string) => {

        // Parse message
        try {

        }
        catch (e) {

        }

    });

    // Send a welcome message
    ws.send(createMessage('info', 'Connected!'));

    /**
     * Error handler
     */
    ws.on('error', (err) => {
        console.warn(`Client disconnected - reason: ${err}`);
    });
});

/**
 * Check client presence
 */
setInterval(() => {
    wss.clients.forEach((ws: WebSocket) => {

        const extWs = ws as ExtWebSocket;

        if (!extWs.isAlive) return ws.terminate();

        extWs.isAlive = false;
        ws.ping(null, undefined);
    });
}, 10000);

/**
 * Feed clients with real-time data
 */
setInterval(() => {
    wss.clients.forEach((ws: WebSocket) => {

        const latestData = generateStats();

        ws.send(
            createMessage(
                'data',
                latestData
            ));

    });
}, 1000);

server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});