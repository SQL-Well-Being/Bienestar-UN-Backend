import { getConnection } from "../db.js";

export default async function callProcedure(username, password, procedureName, params = []) {
  let connection;
  try {
    connection = await getConnection(username, password);
    const placeholders = params.map(() => '?').join(', ');
    const query = `CALL ${procedureName}(${placeholders})`;
    const result = await connection.query(query, params);
    return result;
  } catch (e) {
    throw e;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
