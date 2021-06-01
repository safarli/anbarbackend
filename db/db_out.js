const { mypool } = require('./db_conn');
const { isAdminUser, isStandartUser, isGuestUser } = require('../utils/roleChecker')

const roleMessages = {
    admin: "Only admin users can accesss",
    standard: "Only standard users can access",
    guest: "You are not allowed here as a guest user"
}

exports.stockOut = async (req, res) => {   // Anbar Mexaric

}

exports.getProductTypes = async (req, res) => {
    const {user} = req

    // if(!user) {  // Always check if the value is truthy before accessing its properties. Never try to access property of undefined object. It will throw error
    //     return res.status(401).json({msg: "No user data found in token"})
    // }
    // else if(!isAdminUser(user.role)){
    //     return res.status(401).json({msg: "Admin users can access"})
    // }

    try {
        const { rows } = await mypool.query(`SELECT * FROM mehsul_tipleri`)
        return res.status(200).json(rows);
    }
    catch (e) {
        res.status(500).json({ "error": e.message })
        throw e.message;
    }

}

exports.getProductProviders = async (req, res) => {
    const {user} = req

    // if(!user){
    //     res.status(401).json({msg: "No user data found in token"})
    // }
    // else if (!isAdminUser(user.role)){
    //     res.status(401).json({msg: "Admin users can access"})
    // }
    
    try {
        const { rows } = await mypool.query(`SELECT * FROM saticilar`)
        return res.status(200).json(rows)
    }
    catch (e) {
        res.status(500).json({ "error": e.message })
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
        res.status(500).json({ "error": e.message })
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