import database from "./models/index.js"
import crypto from "crypto";


var token = crypto.randomBytes(20).toString('hex');


const key = database.apiKeys.build({
    key: token
});

await key.save();
console.log("apiKey: ", token);

