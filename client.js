import amqp from 'amqplib/callback_api.js';
import dotenv from "dotenv"
import puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import database from "./models/index.js"

dotenv.config();

const RABBITMQ_URL = 'amqp://'+process.env.RABBITMQ_USER+':'+process.env.RABBITMQ_PASS+'@'+process.env.RABBITMQ_HOST+':'+process.env.RABBITMQ_PORT

async function create_screenshot(params){
    let width = params.width || 1920
    let height = params.height || 1080
    let output = "png"

    const job = await database.jobs.findOne({ 
        where: { id: params.jobId }
    });

    // validate input parameters
    if (!params.url && !params.html) {
        if(job){
            await job.update({ 
                success: false,
                complete: true,
                message: "Must provide either a url or html content"
             })
            await job.save()
        }

        return
    }

    if (params.output && !['png', 'jpg'].includes(params.output)) {
        if(job){
            await job.update({ 
                success: false,
                complete: true,
                message: "Output must be one of: png, jpg"
             })
            await job.save()
        }

        return
    }

    // initialise browser
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/google-chrome',
        args: [
            "--no-sandbox",
            "--disable-gpu",
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({
        width: parseInt(width),
        height: parseInt(height)
    });

    // screenshot from url
    if (params.url) {
        await page.goto(params.url);
    }

    // screenshot from html content
    if (params.html) {
        await page.setContent(params.html);
    }

    let filename = uuidv4() + "." + output

    let screenshot_options = {
        fullPage: true,
        type: output,
        path: `./public/` + filename
    }

    if (output == "jpg") {
        screenshot_options.quality = 100
    }

    // capture screenshot
    await page.screenshot(screenshot_options);
    await browser.close();

    if(job){
        await job.update({ 
            success: true,
            complete: true,
            filename: filename
         })
        await job.save()
    }
}

async function create_pdf(params){
    let width = params.width || 1920
    let height = params.height || 1080

    const job = await database.jobs.findOne({ 
        where: { id: params.jobId }
    });

    // validate input parameters
    if (!params.url && !params.html) {
        if(job){
            await job.update({ 
                success: false,
                complete: true,
                message: "Must provide either a url or html content"
             })
            await job.save()
        }

        return
    }

    // initialize browser
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/google-chrome',
        args: [
            "--no-sandbox",
            "--disable-gpu",
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width, height });

    // pdf from url
    if (params.url) {
        await page.goto(params.url);
    }

    // pdf from html content
    if (params.html) {
        await page.setContent(params.html);
    }


    let filename = uuidv4() + ".pdf"

    await page.pdf({
        width,
        height,
        landscape: false,
        path: `./public/` + filename,
    });
    await browser.close();

    if(job){
        await job.update({ 
            success: true,
            complete: true,
            filename: filename
         })
        await job.save()
    }
}


amqp.connect(RABBITMQ_URL, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'chrome_api';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, async function(msg) {
            msg = JSON.parse(msg.content.toString())
            console.log(msg)

            if(msg.function == "screenshot"){
                await create_screenshot(msg)
            }

            if(msg.function == "pdf"){
                await create_pdf(msg)
            }

        },{
            noAck: true
        });
    });
});