import fs from "fs";
import mariadb from "mariadb";
import chalk from "chalk";
import Redis from "ioredis";
const levelpacksToBeAdded: Partial<PostLevelPack> & LevelPack[] = []

setInterval(() => {
    levelpacksToBeAdded.forEach(async (levelpack: Partial<PostLevelPack> & LevelPack) => {
        let conn;
        try {
            conn = await pool.getConnection();
            return await conn.query("INSERT INTO `5beam` (name, author, description, date, data, version) value (?, ?, ?, ?, ?, ?)",
                [levelpack.name, levelpack.author, levelpack.description, levelpack.date, levelpack.data, levelpack.version]);
        } finally {
            if (conn) conn.release();
        }
    })
    levelpacksToBeAdded.length = 0;
}, 1000 * 60) // 1 minutes

const cred = fs.readFileSync("dbcred.txt").toString("utf8").split("\n")
export const pool = mariadb.createPool({
    host: cred[0].trim(),
    port: Number(cred[1].trim()),
    user: cred[2].trim(),
    password: cred[3].trim(),
    database: cred[4].trim()
});
console.log(chalk.greenBright("Connected to MYSQL Database!"))

async function setupRedis() {
    const redis = new Redis()
    console.log(chalk.blueBright("Connected to Redis Database!"))
    const allLevels = await DBgetAllLevels() as any as LevelPack[];
    const allLevelData = await DBgetAllLevelData() as any;
    console.log(allLevelData[0])
    for (let i = 0; i < allLevels.length; i++) {
        setLevelpack(allLevels[i])
        redis.set("levelpackdata:" + allLevels[i].ID, JSON.stringify(allLevelData[i]))
    }
    return redis;
}
const redis = setupRedis();

async function setLevelpack(levelpack: LevelPack) {
    return (await redis).zadd("levelpacks", levelpack.ID, JSON.stringify(levelpack))
}

function unserializeLevelPack(level: string): LevelPack {
    return JSON.parse(level)
}

async function DBgetAllLevels() {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query("SELECT `ID`, `name`, `author`, `description`, `date`, `version` FROM `5beam`");
    } finally {
        if (conn) conn.release();
    }
}

async function DBgetAllLevelData() {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query("SELECT `data` FROM `5beam`");
    } finally {
        if (conn) conn.release();
    }
}

export async function getLevel(id: number): Promise<string[]> {
    return (await redis).zrange("levelpacks", id, id)
}

export async function getLevelData(id: string): Promise<string | null> {
    return (await redis).get("levelpackdata:" + id)
}

export async function getPage(number: number, pagesize = 8): Promise<string[]> {
    // console.log(number * pagesize, (number + 1) * (pagesize))
    return (await redis).zrange("levelpacks", number * pagesize, (number + 1) * pagesize)
}

export async function postLevelData(levelpack: PostLevelPack): Promise<string | number> {
    const lastLevelPack = await (await redis).zrevrange("levelpacks", 0, 0)
    const levelpackNew: LevelPack = {
        ID: unserializeLevelPack(lastLevelPack[0]).ID,
        name: levelpack.name,
        author: levelpack.author,
        description: levelpack.description,
        date: Date.now(),
        version: levelpack.struct_version
    }
    const levelpackNewData: Partial<PostLevelPack> & LevelPack = levelpackNew;
    levelpackNewData.data = levelpack.data;
    levelpacksToBeAdded.push(levelpackNewData)
    return setLevelpack(levelpackNew)
}