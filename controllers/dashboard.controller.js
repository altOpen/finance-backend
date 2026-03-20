const db = require("../config/db");

exports.getDashboard = async (req, res) => {
    try {

        // MEMBERS
        const membersRes = await db.query(
            "SELECT COUNT(*)::int AS count FROM members WHERE status='active'"
        );

        // DEPOSITS
        const depositsRes = await db.query(
            "SELECT COALESCE(SUM(amount),0)::int AS total FROM deposits"
        );

        // LOANS
        const loansRes = await db.query(
            "SELECT COALESCE(SUM(principal),0)::int AS total FROM loans"
        );

        // PRINCIPAL PAID
        const paidRes = await db.query(
            "SELECT COALESCE(SUM(principal_paid),0)::int AS total FROM loan_payments"
        );

        let totalMembers = membersRes.rows[0].count;
        let totalDeposits = depositsRes.rows[0].total;
        let totalLoans = loansRes.rows[0].total;
        let totalPaid = paidRes.rows[0].total;

        let outstanding = totalLoans - totalPaid;

        // OVERDUE
        const overdueRes = await db.query(`
            SELECT m.name, l.next_due_date
            FROM loans l
            JOIN members m ON l.member_id = m.member_id
            WHERE l.next_due_date < CURRENT_DATE
        `);

        res.json({
            totalMembers,
            totalDeposits,
            totalLoans,
            outstanding,
            overdue: overdueRes.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};