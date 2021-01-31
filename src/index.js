"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helmet_1 = __importDefault(require("helmet"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const title = "5beam.zelo.dev";
const server = http_1.default.createServer(app);
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
