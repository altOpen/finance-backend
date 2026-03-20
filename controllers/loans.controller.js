const db = require("../config/db");

// EMI CALCULATION
function calculateEMI(P, r, n) {
    r = r / 100 / 12;
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// ADD LOAN
exports.addLoan = async (req, res) => {
    const { member_id, principal, interest_rate, tenure } = req.body;

    let emi = calculateEMI(principal, interest_rate, tenure);

    let nextDue = new Date();
    nextDue.setMonth(nextDue.getMonth() + 1);

    await db.query(`
        INSERT INTO loans 
        (member_id, principal, interest_rate, tenure, emi, next_due_date)
        VALUES ($1,$2,$3,$4,$5,$6)
    `, [member_id, principal, interest_rate, tenure, emi, nextDue]);

    res.json({ message: "Loan created", emi });
};

// GET DETAILS
exports.getLoanDetails = async (req, res) => {
    const id = req.params.id;

    const loan = await db.query("SELECT * FROM loans WHERE loan_id=$1", [id]);

    const payments = await db.query(`
        SELECT * FROM loan_payments 
        WHERE loan_id=$1 
        ORDER BY payment_date ASC
    `, [id]);

    res.json({
        loan: loan.rows[0],
        payments: payments.rows
    });
};

// ADD PAYMENT (CORRECT LOGIC)
exports.addPayment = async (req, res) => {
    const { loan_id, amount, type, payment_date } = req.body;

    try {
        const loanRes = await db.query("SELECT * FROM loans WHERE loan_id=$1", [loan_id]);
        const loan = loanRes.rows[0];

        const paidRes = await db.query(`
            SELECT COALESCE(SUM(principal_paid),0) as paid 
            FROM loan_payments WHERE loan_id=$1
        `, [loan_id]);

        let principalPaid = Number(paidRes.rows[0].paid);
        let balance = loan.principal - principalPaid;

        let monthlyRate = loan.interest_rate / 100 / 12;
        let interest = balance * monthlyRate;

        let interestPaid = 0;
        let principalPaidNow = 0;

        // 🔥 PROPER LOGIC
        if (type === "interest") {
            interestPaid = amount;
        }

        else if (type === "principal") {
            principalPaidNow = amount;
        }

        else if (type === "emi") {
            interestPaid = interest;
            principalPaidNow = amount - interest;
        }

        else if (type === "foreclose") {
            principalPaidNow = balance;
            interestPaid = 0;
        }

        await db.query(`
            INSERT INTO loan_payments 
            (loan_id, amount, interest_paid, principal_paid, payment_type, payment_date)
            VALUES ($1,$2,$3,$4,$5,$6)
        `, [loan_id, amount, interestPaid, principalPaidNow, type, payment_date]);

        res.json({ message: "Payment saved" });

    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};