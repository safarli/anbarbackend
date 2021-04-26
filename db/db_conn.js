
const pg = require('pg');

connOptions = {
    host: 'database-1.cd5r1pmmefjf.eu-west-3.rds.amazonaws.com',
    port: 5432,
    user: 'postgres',
    password: 'rokko001',
    database: 'postgres',
}

const mypool = new pg.Pool(connOptions);

const populateTable = () => {
    mypool.query(`
        INSERT INTO anbar(mehsul_adi, mehsul_vahidi, mehsul_miqdar, daxilolma_tarixi)
        VALUES 
        ('USB Type-C Kabel 1.5M', 'ED', 215, default),
        ('LED Lampa 30W', 'ED', 62, default),
        ('CAT6 STP Kabel', 'MET', 816, default),
        ('Monitor 24inch', 'ED', 149, default),
        ('Mouse Wireless Logitech', 'ED', 217, '2021-04-22 18:44')
        ;`)
}

// create & init table with data
mypool.query(`
    DROP VIEW IF EXISTS selectall_baku_time;
    DROP TABLE IF EXISTS anbar;
    CREATE TABLE anbar(
        mehsul_id BIGINT GENERATED ALWAYS AS IDENTITY,
        mehsul_adi VARCHAR(300) NOT NULL,
        mehsul_vahidi CHAR(3) NOT NULL,
        mehsul_miqdar INT NOT NULL,
        daxilolma_tarixi TIMESTAMPTZ DEFAULT current_timestamp,
        PRIMARY KEY(mehsul_id));`
)
    .then(() => {
        mypool.query(`
        CREATE VIEW selectall_baku_time AS
            SELECT mehsul_id, mehsul_adi, mehsul_miqdar,
            daxilolma_tarixi AT TIME ZONE 'Asia/Baku' AS daxilolma_tarixi
            FROM anbar;
    `)
    })
    .then(populateTable)
    .catch(error => console.log(error))

module.exports = {
    mypool,
}

