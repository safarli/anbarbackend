const { mypool } = require('./db_conn');

mypool.query(`INSERT INTO anbar(mehsul_adi, mehsul_vahid, mehsul_miqdar)`)