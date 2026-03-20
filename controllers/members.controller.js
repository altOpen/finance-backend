const db = require("../config/db");

// GET
exports.getMembers = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM members ORDER BY member_id DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err);
    }
};

// ADD
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

// UPDATE
exports.updateMember = async (req, res) => {
    const id = req.params.id;
    const { name, phone, address } = req.body;

    try {
        await db.query(
            "UPDATE members SET name=$1, phone=$2, address=$3 WHERE member_id=$4",
            [name, phone, address, id]
        );

        res.json({ message: "Updated" });

    } catch (err) {
        res.status(500).send(err);
    }
};

// DELETE
exports.deleteMember = async (req, res) => {
    const id = req.params.id;

    try {
        await db.query(
            "DELETE FROM members WHERE member_id=$1",
            [id]
        );

        res.json({ message: "Deleted" });

    } catch (err) {
        res.status(500).send(err);
    }
};

exports.updateMember = async (req, res) => {
    const id = req.params.id;
    const { name, phone, address } = req.body;

    try {
        await db.query(
            "UPDATE members SET name=$1, phone=$2, address=$3 WHERE member_id=$4",
            [name, phone, address, id]
        );

        res.json({ message: "Member updated" });
    } catch (err) {
        res.status(500).send(err);
    }
};