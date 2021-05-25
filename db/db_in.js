const { mypool } = require('./db_conn');

const insertItem = async (req, res) => {
    console.log(req.body);

    const { ad, vahid, miqdar, tarix } = req.body;
    const tarix_tz = tarix + "00:00 +04:00";

    try {
        await mypool.query(`INSERT INTO anbar(mehsul_adi, mehsul_vahidi, mehsul_miqdar, anbar_tarix)
        VALUES ($1, $2, $3, $4);`, [ad, vahid, miqdar, tarix])
        res.status(200).send('Mehsul daxil edildi')
    }
    catch (e) {
        throw new Error(`Error occured while inserting into anbar`)
    }
}

module.exports = {
    insertItem
}