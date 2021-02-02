import fs from "fs";
import mysql from "mysql";
import chalk from "chalk";
const cred = fs.readFileSync("dbcred.txt").toString("utf8").split("\n")
let table;

function initDatabase(): void {
    table = mysql.createConnection({
        host: cred[0].trim(),
        port: Number(cred[1].trim()),
        user: cred[2].trim(),
        password: cred[3].trim()
    })

    table.connect((err) => {
        if (err) throw err;
        console.log(chalk.greenBright("Connected to MYSQL Database!"))
    })
}

export default initDatabase;