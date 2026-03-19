const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "finance_app"
});

db.connect(err => {
    if (err) {
        console.error("DB Connection Failed:", err);
    } else {
        console.log("Database Connected");
    }
});

module.exports = db;