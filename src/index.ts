import app from "./config/express";
// import "src/config/database";
import { logger } from "src/config/logger";
import { Config } from "src/config/config";

const port = Config.server.port || 4500;

app.listen(port, async () => {
  logger.info(`Server listening on port : ${port}`);
  logger.info(`Server MODE : ${Config.server.mode}`);
});
