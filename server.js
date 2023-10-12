import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import winston from "winston";

const app = express();
app.use(cors());
app.use(express.json());

const logger = winston.createLogger({
    level: "Error",

    format: winston.format.combine(
        winston.format.label({ label: "unhandledErrors" }),
        winston.format.json(),
        winston.format.prettyPrint()
    ),
    transports: [new winston.transports.Console(), new winston.transports.File({ filename: "logger/error.log" })]
})


process.on('uncaughtException', (error) => {
    logger.error({ 
        name: error.name, 
        error: error.stack, 
        timestamp: new Date().toLocaleString() 
    })
})
process.on('unhandledRejection', (error) => {
    logger.error({ 
        name: 'unhandledRejection', 
        error, 
        timestamp: Date.now().toLocaleString() 
    })
})


app.get('/', async (req, res) => {
    return res.status(200).json({ status: 'working' })
})

import { BaseRoutes } from "./routes/BaseRoutes.js";
app.use('/v1', BaseRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('*', async (req, res) => {
    return res.status(404).json({ status: 'not found' })
})


//its prune time
// import "./cron/prune.js"; //stop until find fix

const server = http.createServer(app);
const PORT = process.env.PORT || 6000;
import { SocketServer } from "./ws/WebSocket.js";

SocketServer(server);
server.listen(PORT, () => {
    console.log(`App started at http://localhost:${PORT}`)
})
server.on('error', (error) => {
    console.error('Server error:', error);
});
