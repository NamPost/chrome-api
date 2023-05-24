// Filename: server.js

import express from "express";
import puppeteer from 'puppeteer';
import { privateRoute } from "./lib/middleware.js";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from 'uuid';
import amqp from 'amqplib';
import dotenv from "dotenv";
import database from "./models/index.js"

const app = express();
const RABBITMQ_URL = 'amqp://'+process.env.RABBITMQ_USER+':'+process.env.RABBITMQ_PASS+'@'+process.env.RABBITMQ_HOST+':'+process.env.RABBITMQ_PORT
const QUEUENAME = "chrome_api"
dotenv.config();

app.use(express.static('public'))
app.use(bodyParser.json({ limit: '3mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/screenshot', [privateRoute], async (req, res) => {
    let params = req.body
    params.function = "screenshot"

    // set the default width and height
    if(!params.width){
        params.width = 1920
    }

    if(!params.height){
        params.height = 1080
    }

    // validate input parameters
    if (!params.url && !params.html) {
        return res.json({
            success: false,
            message: "Must provide either a url or html content"
        })
    }

    if (params.output && !['png', 'jpg'].includes(params.output)) {
        return res.json({
            success: false,
            message: "Output must be one of: png, jpg"
        })
    }

    // write the job to the db
    const job = database.jobs.build({
        parameters: JSON.stringify(params)
    });

    await job.save();

    // set the job id
    params.jobId = job.id

    // send to queue
    try{
        let conn = await amqp.connect(RABBITMQ_URL)
        let ch = await conn.createChannel()
        await ch.assertQueue(QUEUENAME, { durable: false })
        
        // Publish job
        await ch.sendToQueue(QUEUENAME, Buffer.from(JSON.stringify(params), 'utf8'))
        await ch.close()
        await conn.close()
    }catch(e){
        return res.json({
            success: true,
            message: e.message
        })
    }

    res.json({
        success: true,
        jobId: job.id
    })
});

app.get('/pdf', [privateRoute], async (req, res) => {
    let params = req.body
    params.function = "pdf"

    // set the default width and height
    if(!params.width){
        params.width = 1920
    }

    if(!params.height){
        params.height = 1080
    }

    // validate input parameters
    if (!params.url && !params.html) {
        return res.json({
            success: false,
            message: "Must provide either a url or html content"
        })
    }

    // write the job to the db
    const job = database.jobs.build({
        parameters: JSON.stringify(params)
    });

    await job.save();

    // set the job id
    params.jobId = job.id

    // send to queue
    try{
        let conn = await amqp.connect(RABBITMQ_URL)
        let ch = await conn.createChannel()
        await ch.assertQueue(QUEUENAME, { durable: false })
        
        // Publish job
        await ch.sendToQueue(QUEUENAME, Buffer.from(JSON.stringify(params), 'utf8'))
        await ch.close()
        await conn.close()
    }catch(e){
        return res.json({
            success: true,
            message: e.message
        })
    }
    
    res.json({
        success: true,
        jobId: job.id
    })
});

app.get('/job/:id', [privateRoute], async (req, res) => {
    const job = await database.jobs.findOne({ 
        where: { id: req.params.id }
    });

    if(!job){
        return res.json({
            success: false,
            jobId: 'Job not found'
        }) 
    }

    res.json({
        success: true,
        job: job
    })
});

app.listen(4300, () => {
    console.log('Listening on port 4300');
});