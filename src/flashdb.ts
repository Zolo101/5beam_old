import { pool } from "./database";

export async function flashGetAllLevels(): Promise<string> {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query("SELECT `ID`, `name`, `author`, `levelversion` FROM `5beam_flash`");
    } finally {
        if (conn) conn.release();
    }
}


export async function flashGetLevel(id: string): Promise<string> {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query("SELECT `ID`, `name`, `author`, `levelversion` FROM `5beam_flash` WHERE ID = ?", [id]);
    } finally {
        if (conn) conn.release();
    }
}

export async function flashGetLevelData(id: string): Promise<string> {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query("SELECT Data FROM `5beam_flash` WHERE ID = ?", [id]);
    } finally {
        if (conn) conn.release();
    }
}

export async function flashPostLevelData(level: any): Promise<string> {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query("INSERT INTO `5beam_flash` (ID, name, author, data, version) value (?, ?, ?, ?, ?)",
            [null, level.name, "Guest", [JSON.stringify(level.data)], level.version]);
    } finally {
        if (conn) conn.release();
    }
}