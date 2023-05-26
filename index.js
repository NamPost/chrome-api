import express from "express";
import { privateRoute } from "./lib/middleware.js";
import { create_screenshot, create_pdf } from "./lib/app.js"
import bodyParser from "body-parser";
import amqp from 'amqplib';
import dotenv from "dotenv";
import database from "./models/index.js"

const app = express();
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
        res.status(400);
        return res.json({
            success: false,
            message: "Must provide either a url or html content"
        })
    }

    if (params.output && !['png', 'jpg'].includes(params.output)) {
        res.status(400);
        return res.json({
            success: false,
            message: "Output must be one of: png, jpg"
        })
    }

    // send to queue
    if(process.env.RABBITMQ_URL){
        console.log('send to queue')
        // write the job to the db
        const job = database.jobs.build({
            parameters: JSON.stringify(params)
        });

        await job.save();

        // set the job id
        params.jobId = job.id

        try{
            let conn = await amqp.connect(process.env.RABBITMQ_URL)
            let ch = await conn.createChannel()
            await ch.assertQueue(QUEUENAME, { durable: false })
            
            // Publish job
            await ch.sendToQueue(QUEUENAME, Buffer.from(JSON.stringify(params), 'utf8'))
            await ch.close()
            await conn.close()
        }catch(e){
            res.status(500);

            return res.json({
                success: true,
                message: e.message
            })
        }

        return res.json({
            success: true,
            jobId: job.id
        })
    }else{
        let result = await create_screenshot(params)

        if(!result.success){
            res.status(400);
        }
        return res.json(result)
    }
    
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

    // send to queue
    if(process.env.RABBITMQ_URL){
        console.log('send to queue')
        // write the job to the db
        const job = database.jobs.build({
            parameters: JSON.stringify(params)
        });

        await job.save();

        // set the job id
        params.jobId = job.id

        try{
            let conn = await amqp.connect(process.env.RABBITMQ_URL)
            let ch = await conn.createChannel()
            await ch.assertQueue(QUEUENAME, { durable: false })
            
            // Publish job
            await ch.sendToQueue(QUEUENAME, Buffer.from(JSON.stringify(params), 'utf8'))
            await ch.close()
            await conn.close()
        }catch(e){
            res.status(500);

            return res.json({
                success: true,
                message: e.message
            })
        }

        return res.json({
            success: true,
            jobId: job.id
        })
    }else{
        let result = await create_pdf(params)

        if(!result.success){
            res.status(400);
        }
        return res.json(result)
    }
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