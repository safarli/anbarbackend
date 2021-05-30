const { Router } = require('express');
const db_out = require('../db/db_out');
const authorize = require('../middleware/authorize')

const router = Router();

// These routes aren't token checked
router.get('/products', db_out.getProducts);
router.get('/providers', db_out.getProductProviders);
router.get('/producttypes', db_out.getProductTypes);
router.post('/bytimeinterval', db_out.getProductsByTimeInterval);


// These routes are token checked
// router.get('/getproducts', authorize, db_out.getProducts);
// router.get('/getproviders', authorize, db_out.getProductProviders);
// router.get('/getproducttypes', authorize, db_out.getProductTypes);
// router.post('/getbytimeinterval', authorize, db_out.getProductsByTimeInterval);

module.exports = router;