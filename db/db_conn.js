const pg = require('pg');
const hashPass = require('../utils/hashPassword');

connOptions = {
    host: 'db-wavevo.cs4fvunkgxjn.us-east-1.rds.amazonaws.com',
    port: 5432,
    user: 'postgres',
    password: '!Doke99a3!',
    database: 'anbar_db'
}

const mypool = new pg.Pool(connOptions)

const createExtensions = async () => {
    try {
        await mypool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
    }
    catch (e) {
        e.message = "Error occured in createExtensions() -> " + e.message;
        throw e;
    }
}

const dropViews = async () => {
    try {
        await mypool.query(`
            DROP VIEW IF EXISTS view_all;
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
        await mypool.query(`DROP TABLE IF EXISTS saticilar`)
        await mypool.query(`DROP TABLE IF EXISTS mehsul_tipleri`)
    }
    catch (e) {
        e.message = "Error occured in dropTables() -> " + e.message
        throw e
    }
}

const createTables = async () => {
    try {
        await mypool.query(`
        CREATE TABLE users(
            user_id uuid DEFAULT uuid_generate_v4(),
            user_name VARCHAR(255) NOT NULL,
            user_email VARCHAR(255) NOT NULL,
            user_password VARCHAR(255) NOT NULL,
            user_role CHAR(1) NOT NULL,
            PRIMARY KEY (user_id),
            UNIQUE (user_email));
        `)
        await mypool.query(`
        CREATE TABLE saticilar(
            satici_id uuid DEFAULT uuid_generate_v4(),
            satici_adi VARCHAR(255) NOT NULL,
            PRIMARY KEY(satici_id),
            UNIQUE(satici_adi));
        `)
        await mypool.query(`
        CREATE TABLE mehsul_tipleri(
            mehsultipi_id uuid DEFAULT uuid_generate_v4(),
            mehsultipi VARCHAR(255) NOT NULL,
            PRIMARY KEY(mehsultipi_id),
            UNIQUE(mehsultipi));
        `)
        await mypool.query(`
        CREATE TABLE anbar(
            mehsul_id uuid DEFAULT uuid_generate_v4(),
            mehsultipi_id uuid NOT NULL,
            satici_id uuid NOT NULL,
            nomre INT NOT NULL,
            mehsul_vahidi CHAR(3) NOT NULL,
            mehsul_miqdar INT NOT NULL,
            anbar_tarix DATE NOT NULL,
            baza_tarix TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
            PRIMARY KEY(mehsul_id),
            CONSTRAINT unique_product_per_provider UNIQUE(mehsultipi_id, satici_id),
            CONSTRAINT fk_mehsultipi
                FOREIGN KEY(mehsultipi_id) REFERENCES mehsul_tipleri(mehsultipi_id),
            CONSTRAINT fk_satici
                FOREIGN KEY(satici_id) REFERENCES saticilar(satici_id)
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
            CREATE VIEW view_all
            AS
                SELECT mt.mehsultipi, st.satici_adi,an.nomre, an.mehsul_vahidi, an.mehsul_miqdar, an.anbar_tarix
                FROM anbar an
                INNER JOIN mehsul_tipleri mt
                    ON an.mehsultipi_id = mt.mehsultipi_id
                INNER JOIN saticilar st
                    ON an.satici_id = st.satici_id;
        `)
    } catch (e) {
        e.message = "Error occured in createViews() -> " + e.message
        throw e;
    }
}

const populateTables = async () => {
    try {
        await mypool.query(`
        INSERT INTO users(user_name, user_email, user_password, user_role)
        VALUES 
            ('David Clarke', 'daclarke@gmail.com', $1, 'A'),
            ('Paul Timber', 'paultim701@outlook.com', $2, 'S'),
            ('Matt Williams', 'willimatt3@hotmail.com', $3, 'G');
        `, [
            hashPass('apple123'),
            hashPass('timoo909'),
            hashPass('cow44cool')])

        await mypool.query(`
        INSERT INTO mehsul_tipleri(mehsultipi)
        VALUES
        ('USB Type-C Kabel 1.5M'),
        ('Yealink SIP Telefon T19 E2'),
        ('Elektrik Karobkasi 30mmX45mm'),
        ('Rele 12V'),
        ('Rele 24V'),
        ('TV 50inch'),
        ('Wifi Router TP-Link'),
        ('LED Lampa 30W'),
        ('CAT6 STP Kabel'),
        ('Monitor 24inch'),
        ('Mouse Wireless Logitech');
        `)

        await mypool.query(`
        INSERT INTO saticilar(satici_adi)
        VALUES
        ('Orbita MMC'),
        ('Amper MMC'),
        ('Araznet MMC'),
        ('Premier Computers'),
        ('ABV'),
        ('Iman-N MMC'),
        ('Metak'),
        ('Dahua'),
        ('Hikvision'),
        ('Xeyal MMC');
        `)

        await mypool.query(`
        INSERT INTO anbar(mehsultipi_id, satici_id,nomre, mehsul_vahidi, mehsul_miqdar, anbar_tarix)
        WITH
            t1 AS (SELECT mehsultipi_id FROM mehsul_tipleri WHERE mehsultipi = 'CAT6 STP Kabel'),
            t2 AS (SELECT satici_id FROM saticilar WHERE satici_adi = 'ABV') 
        SELECT DISTINCT t1.mehsultipi_id, t2.satici_id, 194, 'ED', 135, '2021-05-29'::DATE FROM t1, t2;
        `);

    }
    catch (e) {
        e.message = "Error occured in populateTable() -> " + e.message
        throw e;
    }
}

const prepareDb = async () => {
    try {
        await createExtensions();
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
