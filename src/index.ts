import helmet from "helmet";
import http from "http";
import express from "express";

const app = express()
const title = "5beam.zelo.dev"
const server = http.createServer(app);
const port = process.env.PORT || 3000;

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
app.use(express.static("public")) // serve static files

// app.get("/", (req: any, res: any, next: any) => {
//     res.redirect("/public/api.html")
// })