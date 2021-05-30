const { mypool } = require('./db_conn');

const insertItem = async (req, res) => {
    const { mehsultipi_id, satici_id, vahid, miqdar, tarix } = req.body;
    console.log(req.body);
    res.status(200).json({msg: "OK"})
}

module.exports = {
    insertItem
}