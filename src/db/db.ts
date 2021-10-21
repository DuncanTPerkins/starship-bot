import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';

const MC_CREATION_SQL = `CREATE TABLE IF NOT EXISTS MUSIC_CHANNEL (channel_id BIGINT PRIMARY KEY)`;

export async function getDb(): Promise<Database> {
    return await open({
        filename: 'database.db',
        driver: sqlite3.Database
    });
}

export async function initDb(): Promise<any> {
    const db = await getDb();
    try {
        await db.exec(MC_CREATION_SQL);
        console.log('Initializing/loading db');
    } catch (e: any) {
        console.error(e);
        db.close();
    }
    db.close();
}
