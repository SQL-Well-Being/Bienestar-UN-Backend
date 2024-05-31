import { createConnection } from "mysql2/promise";
import { DB_HOST, DB_NAME, DB_PORT } from "./config.js";

export async function getConnection(username, password) {
  try {
    return await createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: username,
      password: password,
      database: DB_NAME,
    });
  } catch (e) {
    throw e;
  }
}