const db = require("../config/db");

exports.getDashboard = async (req, res) => {
    try {

        // ================= MEMBERS =================
        let totalMembers = 0;
        try {
            const membersRes = await db.query(
                "SELECT COUNT(*)::int AS count FROM members WHERE status='active'"
            );
            totalMembers = membersRes.rows[0]?.count || 0;
        } catch (e) {
            console.log("Members query error:", e.message);
        }

        // ================= DEPOSITS =================
        let totalDeposits = 0;
        try {
            const depositsRes = await db.query(
                "SELECT COALESCE(SUM(amount),0)::int AS total FROM deposits"
            );
            totalDeposits = depositsRes.rows[0]?.total || 0;
        } catch (e) {
            console.log("Deposits table missing or error");
        }

        // ================= LOANS =================
        let totalLoans = 0;
        try {
            const loansRes = await db.query(
                "SELECT COALESCE(SUM(principal),0)::int AS total FROM loans"
            );
            totalLoans = loansRes.rows[0]?.total || 0;
        } catch (e) {
            console.log("Loans table missing or error");
        }

        // ================= PAID =================
        let totalPaid = 0;
        try {
            const paidRes = await db.query(
                "SELECT COALESCE(SUM(principal_paid),0)::int AS total FROM loan_payments"
            );
            totalPaid = paidRes.rows[0]?.total || 0;
        } catch (e) {
            console.log("Loan payments table missing or error");
        }

        // ================= OUTSTANDING =================
        let outstanding = totalLoans - totalPaid;

        // ================= OVERDUE =================
        let overdue = [];
        try {
            const overdueRes = await db.query(`
                SELECT m.name, l.next_due_date
                FROM loans l
                JOIN members m ON l.member_id = m.member_id
                WHERE l.next_due_date < CURRENT_DATE
            `);
            overdue = overdueRes.rows || [];
        } catch (e) {
            console.log("Overdue query error");
        }

        // ================= RESPONSE =================
        res.json({
            totalMembers,
            totalDeposits,
            totalLoans,
            outstanding,
            overdue
        });

    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).json({
            error: "Dashboard failed",
            details: err.message
        });
    }
};