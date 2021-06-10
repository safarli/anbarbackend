const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { prepareDb } = require('./db/db_conn')
const redis = require('redis');

const client = redis.createClient({ host: 'test-redis.gp30xf.0001.use1.cache.amazonaws.com', port: '6379' })
client.setex('salam', 3600, 'Hello form Redis!')

// Routers
const userAuth = require('./router/userAuth');
const inRouter = require('./router/in_router');
const outRouter = require('./router/out_router');
const helperRouter = require('./router/helper_router')
const reportsRouter = require('./router/reports_router')

const app = express();

const corsOptions = {
    origin: '*'
}

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// ROUTERS START
app.use('/userauth', userAuth);
app.use('/anbarin', inRouter);
app.use('/anbarout', outRouter);
app.use('/helpers', helperRouter)
app.use('/reports', reportsRouter)
// ROUTERS END

app.get('/', (req, res) => {
    res.status(200).send('ROOT PATH ACCESSED');
})

app.get('/testredis', (req, res) => {
    client.get('salam', (err, reply) => {
        if (err) throw err;
        res.status(200).send(reply)
    })
})

async function main() {
    try {
        if (process.env.INITIAL_DB === "true") {
            let result = await prepareDb();
            console.log(result)
        }
        app.listen(process.env.PORT || 9999, () => console.log('Started'));
    }
    catch (e) {
        console.log(e)
        process.exit();
    }
}
main();

module.exports = app;