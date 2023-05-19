// Filename: server.js

import express from "express";
import puppeteer from 'puppeteer';
import { privateRoute } from "./lib/middleware.js";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from 'uuid';

const app = express();

app.use(express.static('public'))
app.use(bodyParser.json({ limit: '3mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/screenshot', [privateRoute], async (req, res) => {
    let params = req.body
    let width = params.width || 1920
    let height = params.height || 1080
    let output = "png"

    // validate input parameters
    if (!params.url && !params.html) {
        return res.json({
            success: false,
            messae: "Must provide either a url or html content"
        })
    }

    if (params.output && !['png', 'jpg'].includes(params.output)) {
        return res.json({
            success: false,
            messae: "Output must be one of: png, jpg"
        })
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
        await page.setContent('<h1>Hello, world!</h1>');
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

    res.json({
        success: true,
        filename: filename
    })
});

app.get('/pdf', [privateRoute], async (req, res) => {
    let params = req.body
    let width = params.width || 1920
    let height = params.height || 1080

    // validate input parameters
    if (!params.url && !params.html) {
        return res.json({
            success: false,
            messae: "Must provide either a url or html content"
        })
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
        await page.setContent('<h1>Hello, world!</h1>');
    }


    let filename = uuidv4() + ".pdf"

    await page.pdf({
        width,
        height,
        landscape: false,
        path: `./public/` + filename,
    });
    await browser.close();

    res.json({
        success: true,
        filename: filename
    })
});

app.listen(4300, () => {
    console.log('Listening on port 4300');
});