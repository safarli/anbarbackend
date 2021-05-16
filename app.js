const express = require('express');
const cors = require('cors');
const faker = require('faker');

// Routers
const Entry = require('./router/ENTRY_Router.js');
const Anbar_IN = require('./router/Anbar_IN_Router.js');
const Anbar_OUT = require('./router/Anbar_OUT_Router.js');

const app = express();

const corsOptions = {
    // origin: 'https://anbar.texnokom.az',
    // origin: 'http://localhost:8080', // only allow requests from this address
    // origin: 'http://192.168.0.106:8080',
    // origin: 'http://localhost:8080',
    origin: '*'
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
app.get('/random/:param', (req, res) => {
    const {param} = req.params;

    switch(param){
        case "country": return res.status(200).send(`Country: ${faker.address.country()}`)
        case "name": return res.status(200).send(`Name: ${faker.name.findName()}`)
        case "email": return res.status(200).send(`Email: ${faker.internet.email()}`)
    }

    return res.status(200).send(`Your argument: ${param}`)
})


app.listen(process.env.PORT || 9999, () => console.log('Started'));

module.exports = app;