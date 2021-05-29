const { Router } = require('express');
const db_out = require('../db/db_out');
const authorize = require('../middleware/authorize')

const router = Router();

router.get('/getall', authorize, db_out.getProducts);
router.get('/getbyid/:id', authorize, db_out.getProductById);
router.get('/getproviders', db_out.getProductProviders);
router.get('/getproducttypes', db_out.getProductTypes);
router.post('/getbytimeinterval', authorize, db_out.getProductsByTimeInterval);

module.exports = router;