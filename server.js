/* eslint-disable @typescript-eslint/no-require-imports -- Plesk loads this startup file directly as CommonJS. */
const { createServer } = require("node:http");

process.env.NODE_ENV = process.env.NODE_ENV || "production";

const next = require("next");

const requestedPort = Number.parseInt(process.env.PORT || "3000", 10);
const port = Number.isNaN(requestedPort) ? 3000 : requestedPort;
const hostname = process.env.APP_HOST || "0.0.0.0";
const dev = process.env.NODE_ENV === "development";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer(async (request, response) => {
      try {
        await handle(request, response);
      } catch (error) {
        console.error("Errore durante la richiesta:", error);

        if (!response.headersSent) {
          response.statusCode = 500;
          response.setHeader("Content-Type", "text/plain; charset=utf-8");
        }

        response.end("Errore interno del server");
      }
    });

    server.once("error", (error) => {
      console.error("Impossibile avviare Queen Tour:", error);
      process.exit(1);
    });

    server.listen(port, hostname, () => {
      console.log(
        `Queen Tour avviato su http://${hostname}:${port} in modalità ${process.env.NODE_ENV}`,
      );
    });
  })
  .catch((error) => {
    console.error("Errore durante la preparazione di Next.js:", error);
    process.exit(1);
  });
