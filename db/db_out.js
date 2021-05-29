const { mypool } = require('./db_conn');
const { isAdminUser, isStandartUser, isGuestUser } = require('../utils/roleChecker')

const roleMessages = {
    admin: "Only admin users can accesss",
    standard: "Only standard users can access",
    guest: "You are not allowed here as a guest user"
}

exports.getProductTypes = async (req, res) => {
    // let { role } = req.user
    // if (isStandartUser(role)) {
    //     return res.status(401).json({ msg: roleMessages.standard })
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
    // const { role } = req.user
    // if (isAdminUser(role)) {
    //     return res.status(401).json({ msg: roleMessages.admin })
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
    const { role } = req.user
    if (isStandartUser(role)) {
        return res.status(401).json({ msg: "Only standard users can access all items!" })
    }
    try {
        const { rows } = await mypool.query(`SELECT * FROM anbar`)
        res.status(200).json(rows);
    }
    catch (e) {
        res.status(500).json({ "error": e.message })
        throw e.message;
    }
}

exports.getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows } = await mypool.query(`SELECT * FROM anbar WHERE id = $1`, [id])
        res.status(200).json(rows)
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