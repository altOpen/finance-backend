const db = require("../config/db");

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query(
            "SELECT * FROM users WHERE username=$1 AND password=$2",
            [username, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = result.rows[0];

        res.json({
            message: "Login success",
            user: {
                user_id: user.user_id,
                username: user.username,
                role: user.role,
                member_id: user.member_id
            }
        });

    } catch (err) {
        res.status(500).send(err);
    }
};