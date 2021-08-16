import fs from "fs";
import fetch from "node-fetch";
import http from "http";
import express from "express";
import ratelimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import chalk from "chalk";
import { getLevel, getLevelData, getPage, postLevelData, /* getLevel, getLevelData, postLevelData */} from "./database";
import makeAPIResponse from "./response";

const app = express()
const title = "5beam.zelo.dev"
const port = 3000;
const server = http.createServer(app);

app.set("trust proxy", 1);

const exampleLevel = JSON.parse(fs.readFileSync("src/examplelevel.json").toString());
const webhookURL = fs.readFileSync("webhook.txt").toString();

server.listen(port, () => {
    console.log(`**\nStarting the server on port ${port}\n**`)
})

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [
            "'self'",
            "https://5beam.zelo.dev/"
        ],
        styleSrc: [
            "'self'"
        ],
        scriptSrc: [
            "'self'"
        ]
    }
}))
app.use(cors())

app.use(express.static("public")) // serve static files
app.use(express.json())

const uploadRateLimit = ratelimit({
    windowMs: 1000 * 60,     // 1 minute
    max: 5,                  // 5 requests
    message: JSON.stringify({status: "ratelimit", data: "You are being ratelimited!"})
})

const otherRateLimit = ratelimit({
    windowMs: 1000 * 60 * 10, // 10 minutes
    max: 1000,                // 1000 requests
    message: JSON.stringify({status: "ratelimit", data: "You are being ratelimited!"})
})

app.use("/api/", otherRateLimit);
app.use("/api/upload", uploadRateLimit);

app.get("/api/level/:id", async (req, res, next) => {
    try {
        const response = await getLevel(Number(req.params.id))
        res.send(await makeAPIResponse("success", response[0]))
    } catch (error) {
        console.error(chalk.redBright(`ERROR: /api/level/:id: ${error}`))
        res.send(await makeAPIResponse("fail", ""))
    }
})

app.get("/api/level/get/:id", async (req, res, next) => {
    try {
        const response = await getLevelData(req.params.id)
        if (response === null) throw "Levelpack data could not be found"

        res.send(await makeAPIResponse("success", response))
    } catch (error) {
        console.error(chalk.redBright(`ERROR: /api/level/get/:id: ${error}`))
        res.send(await makeAPIResponse("fail", ""))
    }
})
app.get("/api/level/page/:number", async (req, res, next) => {
    try {
        const response = await getPage(Number(req.params.number))
        res.send(await makeAPIResponse("success", JSON.stringify(response)))
    } catch (error) {
        console.error(chalk.redBright(`ERROR: /api/level/page/:number: ${error}`))
        res.send(await makeAPIResponse("fail", ""))
    }
})


app.post("/api/upload", async (req, res, next) => {
    try {
        await postLevelData(req.body)
        sendWebhookMessage(req.body);
        console.log(chalk.greenBright(`LEVEL UPLOAD: ${req.body.name}`))
        res.status(201).send(await makeAPIResponse("success", "Uploaded!"))
    } catch (error) {
        console.error(chalk.redBright(`ERROR: /api/upload: ${error}`))
        res.status(400).send(await makeAPIResponse("fail", ""))
    }
})

async function sendWebhookMessage(levelfile: any) {
    return await fetch(webhookURL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            content: "New level!",
            embeds: [{
                title: `"${levelfile.name}" By ${levelfile.author}`,
                description: levelfile.description,
                color: 8049944,
                timestamp: new Date().toISOString()
            }]
        }),
    });
}
