const chalk = require("chalk");
const cors = require("cors");
const debug = require("debug")("series:server");
const express = require("express");
const morgan = require("morgan");
const {
  notFoundErrorHandler,
  generalErrorHandler,
} = require("./middlewares/error");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.blueBright(`Server is listening on port number: ${port}`));
      resolve(server);
    });

    server.on("error", (error) => {
      debug(chalk.redBright("There was an error starting the server"));
      if (error.code === "EADDRINUSE") {
        debug(chalk.redBright(`The port ${port} is in use.`));
      }
      reject();
    });

    server.on("close", () => {
      debug(chalk.blueBright("Server disconnected"));
    });
  });

app.use("/users");

app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

module.exports = { app, initializeServer };
