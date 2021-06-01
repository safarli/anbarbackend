const { mypool } = require('./db_conn');
const { isAdminUser, isStandartUser, isGuestUser } = require('../utils/roleChecker')

const roleMessages = {
    admin: "Only admin users can accesss",
    standard: "Only standard users can access",
    guest: "You are not allowed here as a guest user"
}

exports.stockOut = async (req, res) => {   // Anbar Mexaric
    const {mehsul_id, miqdar} = req.body;

    try{
        const {rows} = await mypool.query(`UPDATE anbar SET mehsul_miqdar = mehsul_miqdar - $1 WHERE mehsul_id = $2 RETURNING *;`, [miqdar, mehsul_id])
        console.log(rows);
        res.status(200).send(rows[0])
    }
    catch(e){
        console.log(e)
        res.status(406).send(e)
    }
}