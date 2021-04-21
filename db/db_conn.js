
const pg = require('pg');

connOptions = {
    host: 'database-1.cd5r1pmmefjf.eu-west-3.rds.amazonaws.com',
    port: 5432,
    user: 'postgres',
    password: 'rokko001',
    database: 'postgres',
}

const mypool = new pg.Pool(connOptions);


mypool.query(`CREATE TABLE anbar(
    mehsul_id BIGINT GENERATED ALWAYS AS IDENTITY,
    mehsul_adi VARCHAR(300) NOT NULL,
    mehsul_vahidi CHAR(3) NOT NULL,
    mehsul_miqdar INT NOT NULL,
    daxilolma_tarixi TIMESTAMPTZ DEFAULT current_timestamp,
    PRIMARY KEY(mehsul_id)
);
`).then(() => console.log('OK')).catch(error => console.log(error))