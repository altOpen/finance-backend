const db = require("../config/db");

// GET deposits with member name
exports.getDeposits = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT d.deposit_id, d.amount, d.deposit_date, m.name
            FROM deposits d
            JOIN members m ON d.member_id = m.member_id
            ORDER BY d.deposit_id DESC
        `);

        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err);
    }
};

// ADD deposit
exports.addDeposit = async (req, res) => {
    const { member_id, amount } = req.body;

    try {
        await db.query(
            "INSERT INTO deposits (member_id, amount) VALUES ($1, $2)",
            [member_id, amount]
        );

        res.json({ message: "Deposit added" });

    } catch (err) {
        res.status(500).send(err);
    }
};