const db = require("../config/db");

// EMI CALCULATION
function calculateEMI(P, r, n) {
    r = r / 100 / 12;
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// CREATE LOAN
exports.addLoan = async (req, res) => {
    const { member_id, principal, interest_rate, tenure } = req.body;

    let emi = calculateEMI(principal, interest_rate, tenure);

    let nextDue = new Date();
    nextDue.setMonth(nextDue.getMonth() + 1);

    await db.query(
        `INSERT INTO loans 
        (member_id, principal, interest_rate, tenure, emi, next_due_date)
        VALUES ($1,$2,$3,$4,$5,$6)`,
        [member_id, principal, interest_rate, tenure, emi, nextDue]
    );

    res.json({ message: "Loan created", emi });
};

// GET LOAN DETAILS
exports.getLoanDetails = async (req, res) => {
    const id = req.params.id;

    const loan = await db.query("SELECT * FROM loans WHERE loan_id=$1", [id]);

    const payments = await db.query(
        "SELECT * FROM loan_payments WHERE loan_id=$1 ORDER BY payment_date DESC",
        [id]
    );

    res.json({
        loan: loan.rows[0],
        payments: payments.rows
    });
};

// ADD PAYMENT (PRO LOGIC)
exports.addPayment = async (req, res) => {
    const { loan_id, amount, type } = req.body;

    const loanRes = await db.query("SELECT * FROM loans WHERE loan_id=$1", [loan_id]);
    const loan = loanRes.rows[0];

    const paidRes = await db.query(
        "SELECT SUM(principal_paid) as paid FROM loan_payments WHERE loan_id=$1",
        [loan_id]
    );

    let principalPaid = paidRes.rows[0].paid || 0;
    let balance = loan.principal - principalPaid;

    let monthlyRate = loan.interest_rate / 100 / 12;
    let interest = balance * monthlyRate;

    let principal = 0;

    // PAYMENT TYPE LOGIC
    if (type === "emi") {
        principal = loan.emi - interest;
    } 
    else if (type === "interest") {
        principal = 0;
    } 
    else if (type === "principal") {
        principal = amount;
        interest = 0;
    } 
    else if (type === "foreclose") {
        principal = balance;
        interest = 0;
    }

    await db.query(
        `INSERT INTO loan_payments 
        (loan_id, amount, interest_paid, principal_paid, payment_type)
        VALUES ($1,$2,$3,$4,$5)`,
        [loan_id, amount, interest, principal, type]
    );

    // UPDATE NEXT DUE DATE
    let nextDue = new Date(loan.next_due_date);
    nextDue.setMonth(nextDue.getMonth() + 1);

    await db.query(
        "UPDATE loans SET next_due_date=$1 WHERE loan_id=$2",
        [nextDue, loan_id]
    );

    res.json({ message: "Payment recorded" });
};