const db = require("../config/db");

// EMI CALCULATION
function calculateEMI(P, r, n) {
    r = r / 100 / 12;
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// GET loans
exports.getLoans = async (req, res) => {
    const result = await db.query(`
        SELECT l.*, m.name
        FROM loans l
        JOIN members m ON l.member_id = m.member_id
    `);
    res.json(result.rows);
};

// ADD loan (with tenure)
exports.addLoan = async (req, res) => {
    const { member_id, principal, interest_rate, tenure } = req.body;

    await db.query(
        "INSERT INTO loans (member_id, principal, interest_rate, tenure) VALUES ($1,$2,$3,$4)",
        [member_id, principal, interest_rate, tenure]
    );

    res.json({ message: "Loan created" });
};

// GET details
exports.getLoanDetails = async (req, res) => {
    const id = req.params.id;

    const loan = await db.query("SELECT * FROM loans WHERE loan_id=$1", [id]);

    const payments = await db.query(
        "SELECT * FROM loan_payments WHERE loan_id=$1",
        [id]
    );

    res.json({
        loan: loan.rows[0],
        payments: payments.rows
    });
};

// AUTO INTEREST + PAYMENT
exports.addPayment = async (req, res) => {
    const { loan_id, amount } = req.body;

    try {
        const loanRes = await db.query(
            "SELECT * FROM loans WHERE loan_id=$1",
            [loan_id]
        );

        const loan = loanRes.rows[0];

        const paidRes = await db.query(
            "SELECT SUM(principal_paid) as paid FROM loan_payments WHERE loan_id=$1",
            [loan_id]
        );

        let principalPaid = paidRes.rows[0].paid || 0;
        let balance = loan.principal - principalPaid;

        let monthlyRate = loan.interest_rate / 100 / 12;
        let interest = balance * monthlyRate;

        let principal = amount - interest;
        if (principal < 0) principal = 0;

        await db.query(
            "INSERT INTO loan_payments (loan_id, amount, interest_paid, principal_paid) VALUES ($1,$2,$3,$4)",
            [loan_id, amount, interest, principal]
        );

        res.json({ message: "Payment added" });

    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

// EMI INFO
exports.getEMI = async (req, res) => {
    const id = req.params.id;

    const loan = await db.query("SELECT * FROM loans WHERE loan_id=$1", [id]);

    const l = loan.rows[0];

    let emi = calculateEMI(l.principal, l.interest_rate, l.tenure);

    res.json({ emi: emi.toFixed(2) });
};

// FORECLOSURE
exports.forecloseLoan = async (req, res) => {
    const id = req.params.id;

    const loan = await db.query("SELECT * FROM loans WHERE loan_id=$1", [id]);

    const paid = await db.query(
        "SELECT SUM(principal_paid) as paid FROM loan_payments WHERE loan_id=$1",
        [id]
    );

    let balance = loan.rows[0].principal - (paid.rows[0].paid || 0);

    await db.query(
        "INSERT INTO loan_payments (loan_id, amount, interest_paid, principal_paid) VALUES ($1,$2,0,$2)",
        [id, balance]
    );

    res.json({ message: "Loan closed", balance });
};