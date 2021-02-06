import fs from "fs";
import mariadb from "mariadb";
import chalk from "chalk";

const cred = fs.readFileSync("dbcred.txt").toString("utf8").split("\n")
export const pool = mariadb.createPool({
    host: cred[0].trim(),
    port: Number(cred[1].trim()),
    user: cred[2].trim(),
    password: cred[3].trim(),
    database: cred[4].trim()
});
console.log(chalk.greenBright("Connected to MYSQL Database!"))

function initDatabase(): void {
    // enter init code here
}

export async function getAllLevels(): Promise<string> {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query("SELECT `ID`, `name`, `author`, `date`, `version` FROM `5beam`");
    } finally {
        if (conn) conn.release();
    }
}


export async function getLevel(id: string): Promise<string> {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query("SELECT `ID`, `name`, `author`, `date`, `version` FROM `5beam` WHERE ID = ?", [id]);
    } finally {
        if (conn) conn.release();
    }
}

export async function getLevelData(id: string): Promise<string> {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query("SELECT Data FROM `5beam` WHERE ID = ?", [id]);
    } finally {
        if (conn) conn.release();
    }
}

export async function postLevelData(level: any): Promise<string> {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query("INSERT INTO `5beam` (ID, name, author, date, data, version) value (?, ?, ?, ?, ?, ?)",
            [null, level.name, "Guest", Date.now(), [JSON.stringify(level.data)], level.version]);
    } finally {
        if (conn) conn.release();
    }
}

export default initDatabase;