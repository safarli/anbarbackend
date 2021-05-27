const { Router } = require('express');
const bcryptjs = require('bcryptjs')
const validinfo = require('../middleware/validinfo')
const jwtGenerator = require('../utils/jwtGenerator')
const { mypool } = require('../db/db_conn')

const router = Router();

router.post('/register', validinfo, async (req, res) => {
    const { email, name, password } = req.body

    try {
        const user = await mypool.query(`SELECT * FROM users WHERE user_email = $1`, [email])
        if (user.rows.length > 0) {
            return res.status(401).json({ msg: "User already exist!" })
        }

        const salt = await bcryptjs.genSalt(10)
        const bcryptPassword = await bcryptjs.hash(password, salt);

        let newUser = await mypool.query(`INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *`, [name, email, bcryptPassword])
        const jwtToken = jwtGenerator(newUser.rows[0].user_id)

        return res.json({ jwtToken })
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Server error")
    }

})

router.post('/login', validinfo, async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await mypool.query(`SELECT * FROM users WHERE user_email = $1`, [email])
        if (!user.rows.length) {
            return res.status(401).json("Invalid credential")
        }

        const validPassword = await bcryptjs.compare(password, user.rows[0].user_password);

        if (!validPassword) {
            return res.status(401).json("Invalid credential")
        }
        const jwtToken = jwtGenerator(user.rows[0].user_id)
        return res.json({ jwtToken })
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Server error")
    }

})

router.post('/signout', async (req, res) => {

})

module.exports = router;