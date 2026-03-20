const db = require("../config/db");

exports.getDashboard = async (req, res) => {

    const members = await db.query("SELECT COUNT(*) FROM members");
    const deposits = await db.query("SELECT SUM(amount) FROM deposits");
    const loans = await db.query("SELECT SUM(principal) FROM loans");
    const paid = await db.query("SELECT SUM(principal_paid) FROM loan_payments");

    let totalLoans = loans.rows[0].sum || 0;
    let totalPaid = paid.rows[0].sum || 0;

    let outstanding = totalLoans - totalPaid;

    // OVERDUE LOANS
    const overdue = await db.query(`
        SELECT m.name, l.next_due_date
        FROM loans l
        JOIN members m ON l.member_id = m.member_id
        WHERE l.next_due_date < CURRENT_DATE
    `);

    res.json({
        totalMembers: members.rows[0].count,
        totalDeposits: deposits.rows[0].sum || 0,
        totalLoans,
        outstanding,
        overdue: overdue.rows
    });
};