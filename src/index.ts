import fs from "fs";
import http from "http";
import https from "https";
import express from "express";
import ratelimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import chalk from "chalk";
import initDatabase, { getAllLevels, getLevel, getLevelData, postLevelData, /* getLevel, getLevelData, postLevelData */} from "./database";
import makeAPIResponse from "./response";

const app = express()
const title = "5beam.zelo.dev"
const port = process.env.PORT || 3000;
let server: http.Server | https.Server

const exampleLevel = JSON.parse(fs.readFileSync("src/examplelevel.json").toString());

if (port === "443") { // https
    const privateKey = fs.readFileSync("/etc/letsencrypt/live/5beam.zelo.dev/privkey.pem");
    const certificate = fs.readFileSync("/etc/letsencrypt/live/5beam.zelo.dev/fullchain.pem");
    server = https.createServer({key: privateKey, cert: certificate}, app);
} else { // debug mode (http)
    server = http.createServer(app);
}

server.listen(port, () => {
    console.log(`**\nStarting the server on port ${port}\n**`)
})

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [
            "'self'"
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

const allRateLimit = ratelimit({
    windowMs: 1000 * 60, // 1 minutes
    max: 20,                  // 10 requests
    message: JSON.stringify({status: "ratelimit", data: "You are being ratelimited!"})
})

const otherRateLimit = ratelimit({
    windowMs: 1000 * 60, // 1 minute
    max: 50,             // 50 requests
    message: JSON.stringify({status: "ratelimit", data: "You are being ratelimited!"})
})

app.use("/api/", otherRateLimit);
app.use("/api/all", allRateLimit);
app.use("/api/flash/", otherRateLimit);
app.use("/api/flash/all", allRateLimit);

initDatabase()

app.get("/api/all", async (req, res, next) => {
    try {
        const response = await getAllLevels()
        res.send(await makeAPIResponse("success", response))
    } catch (error) {
        console.error(chalk.redBright(`ERROR: /api/all: ${error}`))
        res.send(await makeAPIResponse("fail", ""))
    }
})

app.get("/api/level/:id", async (req, res, next) => {
    try {
        const response = await getLevel(req.params.id)
        res.send(await makeAPIResponse("success", response))
    } catch (error) {
        console.error(chalk.redBright(`ERROR: /api/level/:id: ${error}`))
        res.send(await makeAPIResponse("fail", ""))
    }
})

app.get("/api/level/get/:id", async (req, res, next) => {
    try {
        const response = await getLevelData(req.params.id)
        res.send(await makeAPIResponse("success", response))
    } catch (error) {
        console.error(chalk.redBright(`ERROR: /api/level/get/:id: ${error}`))
        res.send(await makeAPIResponse("fail", ""))
    }
})

app.get("/api/upload", async (req, res, next) => {
    try {
        const response = await postLevelData(exampleLevel)
        console.log(chalk.greenBright(`LEVEL UPLOAD: ${exampleLevel.name}`))
        res.send(await makeAPIResponse("success", response))
    } catch (error) {
        console.error(chalk.redBright(`ERROR: /api/upload: ${error}`))
        res.send(await makeAPIResponse("fail", ""))
    }
})

// 5BEAM FLASH API

app.get("/api/flash/all", async (req, res, next) => {
    try {
        const response = await getAllLevels()
        res.send(await makeAPIResponse("success", response))
    } catch (error) {
        console.error(chalk.redBright(`ERROR: /api/flash/all: ${error}`))
        res.send(await makeAPIResponse("fail", ""))
    }
})

app.get("/api/flash/level/:id", async (req, res, next) => {
    try {
        const response = await getLevel(req.params.id)
        res.send(await makeAPIResponse("success", response))
    } catch (error) {
        console.error(chalk.redBright(`ERROR: /api/flash/level/:id: ${error}`))
        res.send(await makeAPIResponse("fail", ""))
    }
})

app.get("/api/flash/level/get/:id", async (req, res, next) => {
    try {
        const response = await getLevelData(req.params.id)
        res.send(await makeAPIResponse("success", response))
    } catch (error) {
        console.error(chalk.redBright(`ERROR: /api/flash/level/get/:id: ${error}`))
        res.send(await makeAPIResponse("fail", ""))
    }
})

app.get("/api/flash/upload", async (req, res, next) => {
    try {
        const response = await postLevelData(exampleLevel)
        console.log(chalk.greenBright(`LEVEL UPLOAD: ${exampleLevel.name}`))
        res.send(await makeAPIResponse("success", response))
    } catch (error) {
        console.error(chalk.redBright(`ERROR: /api/flash/upload: ${error}`))
        res.send(await makeAPIResponse("fail", ""))
    }
})
