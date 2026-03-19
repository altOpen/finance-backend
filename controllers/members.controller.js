const db = require("../config/db");

// Get all members
exports.getMembers = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM members");
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Add member
exports.addMember = async (req, res) => {
    const { name, phone, address } = req.body;

    try {
        await db.query(
            "INSERT INTO members (name, phone, address) VALUES ($1, $2, $3)",
            [name, phone, address]
        );
        res.json({ message: "Member added" });
    } catch (err) {
        res.status(500).send(err);
    }
};

// Delete member
exports.deleteMember = async (req, res) => {
    const id = req.params.id;

    try {
        await db.query(
            "DELETE FROM members WHERE member_id = $1",
            [id]
        );
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).send(err);
    }
};