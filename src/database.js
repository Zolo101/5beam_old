"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mysql_1 = __importDefault(require("mysql"));
const chalk_1 = __importDefault(require("chalk"));
const cred = fs_1.default.readFileSync("dbcred.txt").toString("utf8").split("\n");
let table;
function initDatabase() {
    table = mysql_1.default.createConnection({
        host: cred[0].trim(),
        port: Number(cred[1].trim()),
        user: cred[2].trim(),
        password: cred[3].trim()
    });
    table.connect((err) => {
        if (err)
            throw err;
        console.log(chalk_1.default.greenBright("Connected to MYSQL Database!"));
    });
}
exports.default = initDatabase;
