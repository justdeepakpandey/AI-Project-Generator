require("dotenv").config();
require("./config/db");

const express = require("express");
const cors = require("cors");

const projectRoutes = require("./routes/projectRoutes");
const saveRoutes = require("./routes/saveRoutes");
const getProjectsRoutes = require("./routes/getProjectsRoutes");
const deleteProjectRoutes = require("./routes/deleteProjectRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRoutes);
app.use("/api/save", saveRoutes);
app.use("/api/projects/all", getProjectsRoutes);
app.use("/api/projects/delete", deleteProjectRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});