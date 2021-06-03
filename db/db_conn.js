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
        await mypool.query(`DROP VIEW IF EXISTS view_all;`)
        await mypool.query(`DROP VIEW IF EXISTS view_logs_anbar;`)
    } catch (e) {
        e.message = "Error occured in dropViews() -> " + e.message
        throw e
    }
}

const dropTables = async () => {
    try {
        await mypool.query(`DROP TABLE IF EXISTS logs_anbar;`)
        await mypool.query(`DROP TABLE IF EXISTS operations;`)
        await mypool.query(`DROP TABLE IF EXISTS anbar;`)
        await mypool.query(`DROP TABLE IF EXISTS users;`)
        await mypool.query(`DROP TABLE IF EXISTS saticilar;`)
        await mypool.query(`DROP TABLE IF EXISTS mehsul_tipleri;`)
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
        `);
        await mypool.query(`
        create table operations(
	        id INT NOT NULL,
	        name CHAR(2) NOT NULL,
	        PRIMARY KEY(id));
        `);
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
            saxlanma_yeri VARCHAR(60) NOT NULL,
            mehsul_vahidi CHAR(3) NOT NULL,
            mehsul_miqdar INT NOT NULL CHECK(mehsul_miqdar > 0),
            anbar_tarix DATE NOT NULL,
            baza_tarix TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
            PRIMARY KEY(mehsul_id),
            CONSTRAINT unique_product_per_provider UNIQUE(mehsultipi_id, satici_id),
            CONSTRAINT fk_mehsultipi
                FOREIGN KEY(mehsultipi_id) REFERENCES mehsul_tipleri(mehsultipi_id),
            CONSTRAINT fk_satici
                FOREIGN KEY(satici_id) REFERENCES saticilar(satici_id)
            );
        `);

        await mypool.query(`
            create table logs_anbar(
	            id BIGINT GENERATED ALWAYS AS IDENTITY,
	            operation_id INT NOT NULL,
	            mehsul_id UUID NOT NULL,
	            old_miqdar INT NOT NULL,
	            new_miqdar INT NOT NULL,
	            log_time TIMESTAMPTZ NOT NULL DEFAULT now(),
	            PRIMARY KEY(id),
	            CONSTRAINT fk_operation_id FOREIGN KEY(operation_id) REFERENCES operations(id),
	            CONSTRAINT fk_mehsul_id FOREIGN KEY(mehsul_id) REFERENCES anbar(mehsul_id));
        `)

    } catch (e) {
        e.message = "Error occured in createTable() -> " + e.message
        throw e
    }
}
const dropTriggers = async () => {
    try {
        await mypool.query(`DROP TRIGGER IF EXISTS trg_anbar_insert_update on anbar;`);
    }
    catch (e) {
        e.message = "Error occured in dropTriggers() -> " + e.message
        throw e
    }
}

const createTriggers = async () => {
    try {
        await mypool.query(`
            CREATE TRIGGER trg_anbar_insert_update
	        AFTER INSERT OR UPDATE
	        ON anbar
	        FOR EACH ROW
	        EXECUTE PROCEDURE fn_log_anbar();`
        );
    }
    catch (e) {
        e.message = "Error occured in createTriggers() -> " + e.message
        throw e
    }
}

const dropFunctions = async () => {
    try {
        await mypool.query(`DROP FUNCTION IF EXISTS fn_log_anbar;`)
    }
    catch (e) {
        e.message = "Error occured in dropFunctions() -> " + e.message
        throw e
    }
}
const createFunctions = async () => {
    try {
        await mypool.query(`
        CREATE OR REPLACE FUNCTION fn_log_anbar()
	    RETURNS TRIGGER
	    LANGUAGE plpgsql
	    AS
	    $$
	    BEGIN
		IF (TG_OP = 'UPDATE') THEN
			IF(NEW.mehsul_miqdar > OLD.mehsul_miqdar) THEN
				INSERT INTO logs_anbar(operation_id, mehsul_id, old_miqdar, new_miqdar)
				VALUES
				(1, OLD.mehsul_id, OLD.mehsul_miqdar, NEW.mehsul_miqdar);
			ELSIF(NEW.mehsul_miqdar < OLD.mehsul_miqdar) THEN
				INSERT INTO logs_anbar(operation_id, mehsul_id, old_miqdar, new_miqdar)
				VALUES
				(2, OLD.mehsul_id, OLD.mehsul_miqdar, NEW.mehsul_miqdar);
			
			END IF;
			
		ELSIF (TG_OP = 'INSERT') THEN
			INSERT INTO logs_anbar(operation_id, mehsul_id, old_miqdar, new_miqdar)
			VALUES
			(1, NEW.mehsul_id, 0, NEW.mehsul_miqdar);		
		END IF;
	    RETURN NEW;
	    END;
	    $$;
        `)
    }
    catch (e) {
        e.message = "Error occured in createFunctions() -> " + e.message
        throw e
    }
}

const createViews = async () => {
    try {
        await mypool.query(`
            CREATE VIEW view_all
            AS
                SELECT an.mehsul_id, mt.mehsultipi, st.satici_adi, an.saxlanma_yeri, an.mehsul_vahidi, an.mehsul_miqdar, an.anbar_tarix
                FROM anbar an
                INNER JOIN mehsul_tipleri mt
                    ON an.mehsultipi_id = mt.mehsultipi_id
                INNER JOIN saticilar st
                    ON an.satici_id = st.satici_id;
        `);
        await mypool.query(`
            CREATE VIEW view_logs_anbar
            AS
                SELECT l.id, o.name, mt.mehsultipi, l.old_miqdar, l.new_miqdar, l.log_time
                FROM logs_anbar l
                INNER JOIN operations o
                ON l.operation_id = o.id
                INNER JOIN anbar an
                ON l.mehsul_id = an.mehsul_id
                INNER JOIN mehsul_tipleri mt
                ON an.mehsultipi_id = mt.mehsultipi_id;
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
            hashPass('cow44cool')]);

        await mypool.query(`
            insert into operations(id, name)
            values
            (1, 'MD'),
            (2, 'MX');
        `)

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
        ('Xeyal MMC'),
        ('Təyin Olunmayıb');
        `)

        // await mypool.query(`
        // INSERT INTO anbar(mehsultipi_id, satici_id, saxlanma_yeri, mehsul_vahidi, mehsul_miqdar, anbar_tarix)
        // WITH
        //     t1 AS (SELECT mehsultipi_id FROM mehsul_tipleri WHERE mehsultipi = 'CAT6 STP Kabel'),
        //     t2 AS (SELECT satici_id FROM saticilar WHERE satici_adi = 'ABV') 
        // SELECT DISTINCT t1.mehsultipi_id, t2.satici_id, 'otaq-1', 'ED', 135, '2021-05-29'::DATE FROM t1, t2;
        // `);

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
        await dropTriggers();
        await dropFunctions();
        await dropTables();
        await createTables();
        await createViews();
        await createFunctions();
        await createTriggers();
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
