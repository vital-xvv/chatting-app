const express = require("express");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");

const app = express();
require("dotenv").config();

app.use(express.json());

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(5000, console.log(`Server started on PORT: ${PORT}`.green.bold));
