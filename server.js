const express = require("express");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES IMPORT =================
const memberRoutes = require("./routes/members.routes");
const authRoutes = require("./routes/auth.routes");
const depositRoutes = require("./routes/deposits.routes");
const loanRoutes = require("./routes/loans.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

// ================= ROUTES USE =================
app.use("/api/members", memberRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
    res.send("API Running");
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.get("/test-dashboard", (req, res) => {
    res.send("Dashboard route file loaded");
});
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});