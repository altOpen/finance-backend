const db = require("../config/db");

// GET all loans
exports.getLoans = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT l.*, m.name
            FROM loans l
            JOIN members m ON l.member_id = m.member_id
            ORDER BY l.loan_id DESC
        `);

        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err);
    }
};

// ADD loan
exports.addLoan = async (req, res) => {
    const { member_id, principal, interest_rate } = req.body;

    try {
        await db.query(
            "INSERT INTO loans (member_id, principal, interest_rate) VALUES ($1,$2,$3)",
            [member_id, principal, interest_rate]
        );

        res.json({ message: "Loan created" });

    } catch (err) {
        res.status(500).send(err);
    }
};

// GET loan details + payments
exports.getLoanDetails = async (req, res) => {
    const loan_id = req.params.id;

    try {
        const loan = await db.query("SELECT * FROM loans WHERE loan_id=$1", [loan_id]);

        const payments = await db.query(
            "SELECT * FROM loan_payments WHERE loan_id=$1 ORDER BY payment_date DESC",
            [loan_id]
        );

        res.json({
            loan: loan.rows[0],
            payments: payments.rows
        });

    } catch (err) {
        res.status(500).send(err);
    }
};

// ADD payment
exports.addPayment = async (req, res) => {
    const { loan_id, amount, interest_paid, principal_paid } = req.body;

    try {
        await db.query(
            "INSERT INTO loan_payments (loan_id, amount, interest_paid, principal_paid) VALUES ($1,$2,$3,$4)",
            [loan_id, amount, interest_paid, principal_paid]
        );

        res.json({ message: "Payment added" });

    } catch (err) {
        res.status(500).send(err);
    }
};