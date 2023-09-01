import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { fileURLToPath } from "url"; 
import { dirname } from "path";


import path from "path"; 


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async(req,res)=>{
    return res.status(200).json({status:'working'})
})

import { BaseRoutes } from "./routes/BaseRoutes.js";
app.use('/v1', BaseRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('*', async(req,res)=>{
    return res.status(404).json({status:'not found'})
})

//its prune time
import "./cron/prune.js";

const server = http.createServer(app);
const PORT = process.env.PORT || 6000;
server.listen(PORT, ()=>{
    console.log(`App started at http://localhost:${PORT}`)
})
server.on('error', (error) => {
    console.error('Server error:', error);
});
