import app from "./app.js";
import { PORT } from "./config.js";

function main() {
  try {
    app.listen(PORT);
    console.log(`Listening on port: ${PORT}`);
  } catch (e) {
    console.error(e);
  }
}

main();
