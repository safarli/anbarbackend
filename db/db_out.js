const { mypool } = require('./db_conn.js');

const getAll = (req, res) => {
    mypool.query(`SELECT * FROM anbar`)
        .then((result) => {
            const { rows } = result;
            res.status(200).send(rows);
        })
        .catch(e => console.log(e))
}

const getById = (req, res) => {
    const { id } = req.params;
    mypool.query(`SELECT * FROM anbar WHERE mehsul_id = $1`, [id])
        .then((result) => {
            const { rows } = result;
            res.status(200).send(rows);
        })
}

const getByTimeInterval = (req, res) => {
    const startTime = new Date('2021-04-22 19:15+00:00'); // add explicit timezone if you don't want automatically added local zone
    const currentTime = new Date();
    mypool.query(`SELECT * FROM anbar WHERE daxilolma_tarixi BETWEEN $1 AND $2`, [startTime, currentTime])
        .then((result) => res.status(200).send(result.rows))
        .catch(e => console.log(e));
}

module.exports = {
    getAll,
    getById,
    getByTimeInterval,
}