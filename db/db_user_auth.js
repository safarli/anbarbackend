const {mypool} = require('./db_conn');

const user_id = 4;

mypool.query(`SELECT * FROM users WHERE user_id = $1`, [user_id])
    .then( (result) => {} )
    .catch( e => console.log(e) )