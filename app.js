const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Routers
const Entry = require('./router/ENTRY_Router.js');
const Anbar_IN = require('./router/Anbar_IN_Router.js');
const Anbar_OUT = require('./router/Anbar_OUT_Router.js');

const app = express();

const corsOptions = {
    origin: 'https://anbar.texnokom.az',
    origin: 'http://localhost:8080', // only allow requests from this address
}

app.use(cors(corsOptions))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// ROUTERS START
app.use('/entry', Entry);
app.use('/anbarin', Anbar_IN);
app.use('/anbarout', Anbar_OUT);
// ROUTERS END

app.get('/', (req, res) => {
    res.status(200).send('ROOT PATH ACCESSED');
})


const APP_PORT = 9999;
app.listen(APP_PORT, () => console.log(`Server started and listening on port ${APP_PORT}`));