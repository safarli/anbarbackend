const { mypool } = require('./db_conn');

const insertItem = async (req, res) => {
    if (!req.body) return res.status(500).json({ msg: "Request body not found!" })
    const { mehsultipi_id, satici_id,nomre, vahid, miqdar, tarix } = req.body;
    console.log(req.body);

    try {
        const {rows} = await mypool.query(`
            INSERT INTO anbar(mehsultipi_id, satici_id, nomre, mehsul_vahidi, mehsul_miqdar, anbar_tarix)
            VALUES
            ($1, $2, $3, $4, $5, $6) RETURNING mehsul_id;`, [mehsultipi_id, satici_id, nomre, vahid, miqdar, tarix]);

        res.status(200).send("Məhsul əlavə olundu İD:" + rows[0].mehsul_id)
    }
    catch (e) {
        console.log(e.message)
        res.status(406).send({message: e.message})
    }
}

module.exports = {
    insertItem
}