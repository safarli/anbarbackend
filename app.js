const express = require('express');
const cors = require('cors');
const { prepareDb } = require('./db/db_conn')

// Routers
const Entry = require('./router/ENTRY_Router.js');
const Anbar_IN = require('./router/Anbar_IN_Router.js');
const Anbar_OUT = require('./router/Anbar_OUT_Router.js');

const app = express();

const corsOptions = {
    origin: '*'
}

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// ROUTERS START
app.use('/entry', Entry);
app.use('/anbarin', Anbar_IN);
app.use('/anbarout', Anbar_OUT);
// ROUTERS END

app.get('/', (req, res) => {
    res.status(200).send('ROOT PATH ACCESSED');
})

async function main() {
    try {
        let dbPrepareResult = await prepareDb();
        console.log(dbPrepareResult)
        app.listen(process.env.PORT || 9999, () => console.log('Started'));
    }
    catch (e) {
        console.log(e)
        process.exit();
    }
}
main();

module.exports = app;