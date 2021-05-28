const { mypool } = require('./db_conn.js');

const getAll = async (req, res) => {
    let {role} = req.user
    role = role.replace(/\s+/g, '')

    try {
        if (role !== "A") {
            return res.status(401).json({ msg: "Only admin users can access all items!" })
        }
        const { rows } = await mypool.query(`SELECT * FROM selectall_baku`)
        res.status(200).send(rows);
    }
    catch (e) {
        throw new Error(`Error occured while selecting all records in Baku timezone: ${e.message}`)
    }
}

const getById = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows } = await mypool.query(`SELECT * FROM selectall_baku WHERE id = $1`, [id])
        res.status(200).send(rows)
    }
    catch (e) {
        throw new Error(`Error occured while selecting: ${e.message}`)
    }
}

const getByTimeInterval = async (req, res) => {
    const { startDate, endDate } = req.body;
    console.log(`START DATE: ${startDate}  END DATE: ${endDate}`)

    try {
        const { rows } = await mypool.query(`SELECT * FROM selectall_baku WHERE anbar_tarix BETWEEN $1 AND $2`, [startDate, endDate])
        res.status(200).send(rows);
    }
    catch (e) {
        throw new Error(`Error occured while selecting by time interval: ${e.message}`)
    }
}

module.exports = {
    getAll,
    getById,
    getByTimeInterval,
}