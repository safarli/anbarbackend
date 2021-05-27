const pg = require('pg');

connOptions = {
    host: 'db-wavevo.cs4fvunkgxjn.us-east-1.rds.amazonaws.com',
    port: 5432,
    user: 'postgres',
    password: '!Doke99a3!',
    database: 'anbar_db'
}

const mypool = new pg.Pool(connOptions)

const dropViews = async () => {
    try {
        await mypool.query(`
            DROP VIEW IF EXISTS selectall_baku;
            DROP VIEW IF EXISTS selectall_istanbul;
        `)
    } catch (e) {
        e.message = "Error occured in dropViews() -> " + e.message
        throw e
    }
}

const dropTables = async () => {
    try {
        await mypool.query(`DROP TABLE IF EXISTS anbar;`)
        await mypool.query(`DROP TABLE IF EXISTS users;`)
    }
    catch (e) {
        e.message = "Error occured in dropTables() -> " + e.message
        throw e
    }
}

const createTables = async () => {
    try {
        await mypool.query(`
        CREATE TABLE anbar(
            mehsul_id BIGINT GENERATED ALWAYS AS IDENTITY,
            mehsul_adi VARCHAR(300) NOT NULL,
            mehsul_vahidi CHAR(3) NOT NULL,
            mehsul_miqdar INT NOT NULL,
            anbar_tarix TIMESTAMPTZ NOT NULL,
            baza_tarix TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
            PRIMARY KEY(mehsul_id)
            );
        `)
        await mypool.query(`
        CREATE TABLE users(
            user_id BIGINT GENERATED ALWAYS AS IDENTITY,
            user_name VARCHAR(255) NOT NULL,
            user_email VARCHAR(255) NOT NULL,
            user_password VARCHAR(255) NOT NULL,
            PRIMARY KEY (user_id),
            UNIQUE (user_email)
            );
        `)
    } catch (e) {
        e.message = "Error occured in createTable() -> " + e.message
        throw e
    }
}

const createViews = async () => {
    try {
        await mypool.query(`
        CREATE VIEW selectall_baku AS
            SELECT mehsul_id AS id, mehsul_adi AS ad, mehsul_vahidi AS vahid, mehsul_miqdar AS miqdar, 
            (anbar_tarix::timestamptz AT TIME ZONE 'Asia/Baku')::text AS anbar_tarix,
            (baza_tarix::timestamptz AT TIME ZONE 'Asia/Baku')::text AS baza_tarix
            FROM anbar;

        CREATE VIEW selectall_istanbul AS
            SELECT mehsul_id as id, mehsul_adi as ad, mehsul_vahidi as vahid, mehsul_miqdar as miqdar, 
            (anbar_tarix::timestamptz AT TIME ZONE 'Asia/Istanbul')::text AS anbar_tarix,
            (baza_tarix::timestamptz AT TIME ZONE 'Asia/Istanbul')::text AS baza_tarix
            FROM anbar;
        `)
    } catch (e) {
        e.message = "Error occured in createViews() -> " + e.message
        throw e;
    }
}

const populateTables = async () => {
    try {
        await mypool.query(`
        INSERT INTO anbar(mehsul_adi, mehsul_vahidi, mehsul_miqdar, anbar_tarix)
        VALUES 
        ('USB Type-C Kabel 1.5M', 'ED', 215, '2021-02-14 14:36+04:00'),
        ('LED Lampa 30W', 'ED', 62, '2021-02-19 19:51+04:00'),
        ('CAT6 STP Kabel', 'MET', 816, '2021-03-11 15:17+04:00'),
        ('Monitor 24inch', 'ED', 149, '2021-04-16 23:39+00:00'),
        ('Mouse Wireless Logitech', 'ED', 217, '2021-04-22 18:44+03:00'),
        ('SATA Cable', 'ED', 113, '2021-04-22 18:44+03:00'),
        ('Hikvision NVR', 'ED', 566, '2021-04-22 18:44+03:00'),
        ('Rele 12V', 'ED', 419, '2021-04-22 18:44+03:00'),
        ('Silikon 500g', 'ED', 225, '2021-04-22 18:44+03:00'),
        ('Zajim Balaca', 'ED', 176, '2021-04-22 18:44+03:00'),
        ('Uqolnik', 'ED', 441, '2021-04-22 18:44+03:00'),
        ('SC-SC Patch Cord', 'ED', 319, '2021-04-22 18:44+03:00'),
        ('Mikrotik RB2011UAS', 'ED', 886, '2021-04-22 18:44+03:00'),
        ('TP-Link Wifi Router', 'ED', 170, '2021-04-22 18:44+03:00'),
        ('Cisco Switch 24 Port', 'ED', 802, '2021-04-22 18:44+03:00'),
        ('Hytera PNC 370', 'ED', 228, '2021-04-22 18:44+03:00'),
        ('USB Flash 16Gb', 'ED', 105, '2021-04-22 18:44+03:00'),
        ('TP-Link 4port Mbit Switch', 'ED', 939, '2021-04-22 18:44+03:00'),
        ('Fluke Digital Multimeter', 'ED', 300, '2021-04-22 18:44+03:00'),
        ('Arduino Board AVR328p Switch 24 Port', 'ED', 581, '2021-04-22 18:44+03:00'),
        ('LED 5mm Blue', 'ED', 866, '2021-04-22 18:44+03:00'),
        ('RAM GSKILL 16gb(8x2) 2400MHz', 'ED', 369, '2021-04-22 18:44+03:00'),
        ('Yealink T19 E2', 'ED', 112, '2021-05-26 17:10+03:00'),
        ('Mexaniki Klaviatura RGB', 'ED', 334, '2021-05-27 11:16+03:00'),
        ('JBL Headphone Wireless', 'ED', 49, '2021-05-27T23:35Z');
        `)
    }
    catch (e) {
        e.message = "Error occured in populateTable() -> " + e.message
        throw e;
    }
}

const prepareDb = async () => {
    try {
        await dropViews();
        await dropTables();
        await createTables();
        await createViews();
        await populateTables();
    }
    catch (e) {
        throw new Error(`Database preparation failed -> ${e.message}`)
    }

    return "Database is prepared successfully"
}

module.exports = {
    mypool,
    prepareDb
}
