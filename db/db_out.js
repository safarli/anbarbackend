const { mypool } = require('./db_conn.js');

const getAll = async (req, res) => {
    try {
        const { rows } = await mypool.query(`SELECT * FROM selectall_baku`)
        res.status(200).send(rows);
    }
    catch (e) {
        throw new Error(`Error occured while selecting all records in Baku timezone ${e}`)
    }
}

const getById = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows } = await mypool.query(`SELECT * FROM selectall_baku WHERE id = $1`, [id])
        res.status(200).send(rows)
    }
    catch (e) {
        throw new Error(`Error occured while selecting: ${e}`)
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
        throw new Error(`Error occured while selecting by time interval ${e}`)
    }

}

module.exports = {
    getAll,
    getById,
    getByTimeInterval,
}