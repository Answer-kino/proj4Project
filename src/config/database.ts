import { Config } from "src/config/config";
import { logger } from "src/config/logger";
import mysql from "mysql2/promise";

const pool: any = {};

(async () => {
  try {
    for (const db of Config.db) {
      pool[db.name] = mysql.createPool({
        host: db.host,
        port: db.port,
        user: db.user,
        password: db.password,
        database: db.database,
        connectionLimit: db.connectionLimit
      });

      const conn = await pool[db.name].getConnection();
      const rows = await conn.query("SELECT VERSION() As version");
      logger.info(`MySQL Connection : Version = ${rows[0][0].version}`);
      conn.release();
    }
  } catch (error: any) {
    logger.error(`[${error.code}] ${error.sqlMessage} \nerrno : ${error.errno} \nsqlState : ${error.sqlState}`);
    process.exit(1);
  }
})();

export default pool;
