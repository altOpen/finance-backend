const db = require("../config/db");

exports.getDashboard = async (req, res) => {
    try {
        // Total Members
        const members = await db.query("SELECT COUNT(*) FROM members");

        // Total Deposits
        const deposits = await db.query("SELECT SUM(amount) FROM deposits");

        // Total Loans
        const loans = await db.query("SELECT SUM(principal) FROM loans");

        // Total Principal Paid
        const paid = await db.query("SELECT SUM(principal_paid) FROM loan_payments");

        let totalLoans = loans.rows[0].sum || 0;
        let totalPaid = paid.rows[0].sum || 0;

        let outstanding = totalLoans - totalPaid;

        res.json({
            totalMembers: members.rows[0].count,
            totalDeposits: deposits.rows[0].sum || 0,
            totalLoans,
            outstanding
        });

    } catch (err) {
        res.status(500).send(err);
    }
};