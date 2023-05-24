import amqp from 'amqplib/callback_api.js';
import dotenv from "dotenv"
import { create_pdf, create_screenshot } from "./lib/app.js"
dotenv.config();


amqp.connect(process.env.RABBITMQ_URL, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'chrome_api';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, async function (msg) {
            msg = JSON.parse(msg.content.toString())
            console.log(msg)

            if (msg.function == "screenshot") {
                await create_screenshot(msg)
            }

            if (msg.function == "pdf") {
                await create_pdf(msg)
            }

        }, {
            noAck: true
        });
    });
});
