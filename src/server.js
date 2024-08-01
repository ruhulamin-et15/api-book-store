const app = require("./app");
const { connectDB } = require("./db/connection");
const { serverPort } = require("./secret");

app.listen(serverPort, async () => {
  console.log(`server running at http://localhost:${serverPort}`);
  await connectDB();
});
