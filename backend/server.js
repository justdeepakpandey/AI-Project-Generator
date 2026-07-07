require("dotenv").config();
require("./config/db");

const express = require("express");
const cors = require("cors");

const projectRoutes = require("./routes/projectRoutes");
const saveRoutes = require("./routes/saveRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRoutes);
app.use("/api/save", saveRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});