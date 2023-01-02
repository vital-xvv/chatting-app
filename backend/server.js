const express = require("express");

const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 5000;
app.listen(5000, console.log(`Server started on PORT: ${PORT}`));

app.get("/", (req, res) => {
  res.send("API works");
});
