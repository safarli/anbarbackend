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
        INSERT INTO anbar(mehsul_adi, mehsul_vahidi, mehsul_miqdar, anbar_tarix)
        VALUES 
        ('USB Type-C Kabel 1.5M', 'ED', 215, '2021-02-14 14:36+04:00'),
        ('LED Lampa 30W', 'ED', 62, '2021-02-19 19:51+04:00'),
        ('CAT6 STP Kabel', 'MET', 816, '2021-03-11 15:17+04:00'),
        ('Monitor 24inch', 'ED', 149, '2021-04-16 23:39+00:00'),
        ('Mouse Wireless Logitech', 'ED', 217, '2021-04-22 18:44+03:00'),
        ('SATA Cable', 'ED', 113, '2021-04-22 18:44+03:00'),
        ('Hikvision NVR', 'ED', 566, '2021-04-22 18:44+03:00'),
        ('Rele 12V', 'ED', 419, '2021-04-22 18:44+03:00')
        ;`)
}

// create & init table with data
mypool.query(`
    DROP VIEW IF EXISTS selectall_baku;
    DROP VIEW IF EXISTS selectall_istanbul;
    DROP TABLE IF EXISTS anbar;
    CREATE TABLE anbar(
        mehsul_id BIGINT GENERATED ALWAYS AS IDENTITY,
        mehsul_adi VARCHAR(300) NOT NULL,
        mehsul_vahidi CHAR(3) NOT NULL,
        mehsul_miqdar INT NOT NULL,
        anbar_tarix TIMESTAMPTZ NOT NULL,
        baza_tarix TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
        PRIMARY KEY(mehsul_id)
        );`
)
    .then(() => {
        mypool.query(`
        CREATE VIEW selectall_baku AS
            SELECT mehsul_id AS id, mehsul_adi AS ad, mehsul_vahidi AS vahid, mehsul_miqdar AS miqdar, 
            (anbar_tarix::timestamptz AT TIME ZONE 'Asia/Baku')::text AS anbar_tarix,
            (baza_tarix::timestamptz AT TIME ZONE 'Asia/Baku')::text AS baza_tarix
            FROM anbar;

        CREATE VIEW selectall_istanbul AS
            SELECT mehsul_id as id, mehsul_adi as ad, mehsul_vahidi as vahid, mehsul_miqdar as miqdar, 
            (anbar_tarix::timestamptz AT TIME ZONE 'Asia/Istanbul')::text AS anbar_tarix,
            (baza_tarix::timestamptz AT TIME ZONE 'Asia/Istanbul')::text AS baza_tarix
            FROM anbar;`
            )
    })
    .then(populateTable)
    .catch(error => console.log(error))

module.exports = {
    mypool,
}

