const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const memberRoutes = require("./routes/members.routes");
app.use("/api/members", memberRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("API Running");
});

// PORT (Render compatible)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);