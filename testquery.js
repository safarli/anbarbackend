const pg = require('pg');

// const types = pg.types;
// types.setTypeParser(1114, function(stringValue) {
// return stringValue;
// });

connOptions = {
    host: 'database-1.cd5r1pmmefjf.eu-west-3.rds.amazonaws.com',
    port: 5432,
    user: 'postgres',
    password: 'rokko001',
    database: 'postgres',
}

const pool = new pg.Pool(connOptions);
 
pool.query("SELECT * FROM selectall_istanbul;")
    .then( result => console.log(result.rows))