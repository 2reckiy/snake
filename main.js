const express = require("express");
const path = require("path");

const app = express();

app.use("/app", express.static(path.resolve(__dirname, "app")));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "app", "index.html"));
});

app.listen(process.env.PORT || 5500, () => console.log("Server running..."));
