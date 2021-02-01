"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const helmet_1 = __importDefault(require("helmet"));
const https_1 = __importDefault(require("https"));
const express_1 = __importDefault(require("express"));
const privateKey = fs_1.default.readFileSync("/etc/letsencrypt/live/5beam.zelo.dev/privkey.pem");
const certificate = fs_1.default.readFileSync("/etc/letsencrypt/live/5beam.zelo.dev/fullchain.pem");
const app = express_1.default();
const title = "5beam.zelo.dev";
const server = https_1.default.createServer({ key: privateKey, cert: certificate }, app);
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`**\nStarting the server on port ${port}\n**`);
});
app.use(helmet_1.default());
app.use(helmet_1.default.contentSecurityPolicy({
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
}));
app.use(express_1.default.static("public")); // serve static files
// app.get("/", (req: any, res: any, next: any) => {
//     res.redirect("/public/api.html")
// })
