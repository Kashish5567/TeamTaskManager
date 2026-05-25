const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const memberRoutes = require("./routes/memberRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const profileRoutes = require("./routes/profileRoutes");
dotenv.config();

connectDB();

const app = express();


// MIDDLEWARE

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));


// ROUTES

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profile", profileRoutes);
// TEST ROUTE

app.get("/", (req, res) => {
  res.send("API Running...");
});


// PORT

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
