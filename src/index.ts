import fs from "fs";
import http from "http";
import express from "express";
import ratelimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import chalk from "chalk";
import initDatabase, { getAllLevels, getLevel, getLevelData, postLevelData, /* getLevel, getLevelData, postLevelData */} from "./database";
import makeAPIResponse from "./response";

const app = express()
const title = "5beam.zelo.dev"
const port = 3000;
const server = http.createServer(app);

const exampleLevel = JSON.parse(fs.readFileSync("src/examplelevel.json").toString());

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

const allRateLimit = ratelimit({
    windowMs: 1000 * 60 * 10, // 10 minutes
    max: 20,                  // 20 requests
    message: JSON.stringify({status: "ratelimit", data: "You are being ratelimited!"})
})

const otherRateLimit = ratelimit({
    windowMs: 1000 * 60 * 10, // 10 minutes
    max: 1000,                // 1000 requests
    message: JSON.stringify({status: "ratelimit", data: "You are being ratelimited!"})
})

app.use("/api/", otherRateLimit);
app.use("/api/all", allRateLimit);

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

app.post("/api/upload", async (req, res, next) => {
    console.log(req);
    try {
        const response = await postLevelData(req.body)
        console.log(chalk.greenBright(`LEVEL UPLOAD: ${req.body.name}`))
        res.send(await makeAPIResponse("success", response))
    } catch (error) {
        console.error(chalk.redBright(`ERROR: /api/upload: ${error}`))
        res.send(await makeAPIResponse("fail", ""))
    }
})

app.get("/api/upload", async (req, res, next) => {
    res.send(await makeAPIResponse("fail", "You probably meant to use POST."))
})

