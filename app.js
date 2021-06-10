const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { prepareDb } = require('./db/db_conn')
const redis = require('redis');

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

// Routes
app.get('/', (req, res) => {
    res.status(200).send('ROOT PATH ACCESSED');
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