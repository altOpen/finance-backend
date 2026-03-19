const db = require("../config/db");

// Get all members
exports.getMembers = (req, res) => {
    db.query("SELECT * FROM members", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};

// Add member
exports.addMember = (req, res) => {
    const { name, phone, address } = req.body;

    db.query(
        "INSERT INTO members (name, phone, address) VALUES (?, ?, ?)",
        [name, phone, address],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Member added" });
        }
    );
};

// Delete member
exports.deleteMember = (req, res) => {
    const id = req.params.id;

    db.query(
        "DELETE FROM members WHERE member_id = ?",
        [id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Deleted" });
        }
    );
};