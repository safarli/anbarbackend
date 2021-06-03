const {mypool} = require('./db_conn');

exports.getAnbarLogs = async (req, res) => {
    try {
        const {rows} = await mypool.query(`SELECT * FROM view_logs_anbar;`)
        res.status(200).json(rows);
    } 
    catch(e){
        res.status(500).json({error: e.message})
        throw e.message;
    }
}

exports.getProducts = async (req, res) => {
    const { user } = req

    // if (!user) { 
    //     return res.status(401).json({ msg: "No user data found in token!" })
    // }
    // else if (!isStandartUser(user.role)) {
    //     return res.status(401).json({ msg: "Standard users can access"})
    // }

    try {
        const { rows } = await mypool.query(`SELECT * FROM view_all`)
        res.status(200).json(rows);
    }
    catch (e) {
        res.status(500).json({error: e.message })
        throw e.message;
    }
}

exports.getProductsByTimeInterval = async (req, res) => {
    const { startDate, endDate } = req.body;
    console.log(`START DATE: ${startDate}  END DATE: ${endDate}`)

    try {
        const { rows } = await mypool.query(`SELECT * FROM selectall_baku WHERE anbar_tarix BETWEEN $1 AND $2`, [startDate, endDate])
        res.status(200).send(rows);
    }
    catch (e) {
        res.status(500).json({ "error": e.message })
        throw e.message;
    }
}