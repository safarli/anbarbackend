const { mypool } = require('./db_conn.js');

const getAll = (req, res) => {
    mypool.query(`SELECT * FROM selectall_baku`)
        .then((result) => {
            const { rows } = result;
            res.status(200).send(rows);
        })
        .catch(e => console.log(e))
}

const getById = (req, res) => {
    const { id } = req.params;
    mypool.query(`SELECT * FROM selectall_baku WHERE mehsul_id = $1`, [id])
        .then((result) => {
            const { rows } = result;
            res.status(200).send(rows);
        })
}

const getByTimeInterval = (req, res) => {
    const {startDate, endDate} = req.body;
    console.log(`START DATE: ${startDate}  END DATE: ${endDate}`)

    mypool.query(`SELECT * FROM selectall_baku WHERE anbar_tarix BETWEEN $1 AND $2`, [startDate, endDate])
        .then((result) => res.status(200).send(result.rows))
        .catch(e => console.log(e));
}

module.exports = {
    getAll,
    getById,
    getByTimeInterval,
}