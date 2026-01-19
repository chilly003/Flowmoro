// src/lib/db.ts
import mysql from "mysql2/promise";

function isTruthy(v: string | undefined) {
  return v === "1" || v === "true" || v === "TRUE" || v === "yes" || v === "YES";
}

const isProd = process.env.NODE_ENV === "production";
const useSSL = isTruthy(process.env.DB_SSL) || isProd;

const sslOption = useSSL ? { rejectUnauthorized: true } : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? "3306"),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "flowmoro",
  ...(sslOption ? { ssl: sslOption } : {}),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function execute(sql: string, params: any[] = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}

export async function withTransaction<T>(fn: (conn: mysql.PoolConnection) => Promise<T>) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
