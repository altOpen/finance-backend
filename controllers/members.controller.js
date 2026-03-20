const db = require("../config/db");

// GET MEMBERS
exports.getMembers = async (req, res) => {
    try {
        let status = req.query.status || 'active';

        const result = await db.query(
            "SELECT * FROM members WHERE status=$1 ORDER BY member_id DESC",
            [status]
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

// ADD MEMBER
exports.addMember = async (req, res) => {
    const { name, phone, address } = req.body;

    try {
        await db.query(
            "INSERT INTO members (name, phone, address, status) VALUES ($1,$2,$3,'active')",
            [name, phone, address]
        );

        res.json({ message: "Member added" });

    } catch (err) {
        res.status(500).send(err);
    }
};

// UPDATE MEMBER
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

// SOFT DELETE (DEACTIVATE)
exports.deactivateMember = async (req, res) => {
    const id = req.params.id;

    try {
        await db.query(
            "UPDATE members SET status='inactive' WHERE member_id=$1",
            [id]
        );

        res.json({ message: "Member inactive" });

    } catch (err) {
        res.status(500).send(err);
    }
};