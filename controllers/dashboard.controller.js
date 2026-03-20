const db = require("../config/db");

exports.getDashboard = async (req, res) => {
    try {

        // MEMBERS
        const membersRes = await db.query(
            "SELECT COUNT(*)::int AS count FROM members WHERE status='active'"
        );

        let totalMembers = membersRes.rows[0].count;

        let totalDeposits = 0;
        let totalLoans = 0;
        let totalPaid = 0;

        // SAFE QUERIES (avoid crash if table missing)

        try {
            const depositsRes = await db.query(
                "SELECT COALESCE(SUM(amount),0)::int AS total FROM deposits"
            );
            totalDeposits = depositsRes.rows[0].total;
        } catch {}

        try {
            const loansRes = await db.query(
                "SELECT COALESCE(SUM(principal),0)::int AS total FROM loans"
            );
            totalLoans = loansRes.rows[0].total;
        } catch {}

        try {
            const paidRes = await db.query(
                "SELECT COALESCE(SUM(principal_paid),0)::int AS total FROM loan_payments"
            );
            totalPaid = paidRes.rows[0].total;
        } catch {}

        let outstanding = totalLoans - totalPaid;

        // OVERDUE SAFE
        let overdue = [];
        try {
            const overdueRes = await db.query(`
                SELECT m.name, l.next_due_date
                FROM loans l
                JOIN members m ON l.member_id = m.member_id
                WHERE l.next_due_date < CURRENT_DATE
            `);
            overdue = overdueRes.rows;
        } catch {}

        res.json({
            totalMembers,
            totalDeposits,
            totalLoans,
            outstanding,
            overdue
        });

    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).json({ error: "Dashboard failed" });
    }
};