const express = require('express');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'https://anbar.texnokom.az', // only allow requests from this address
}

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.status(200).send('ROOT PATH ACCESSED');
})
app.get('/branch1', (req, res) => {
    res.status(200).send('BRANCH1 PATH ACCESSED');
})

const APP_PORT = 9999;
app.listen(APP_PORT, () => console.log(`Server started and listening on port ${APP_PORT}`));