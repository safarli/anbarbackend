const { Router } = require('express');
const db_out = require('../db/db_out');
const authorize = require('../middleware/authorize')

const router = Router();

router.get('/getproducts', db_out.getProducts);
router.get('/getproviders', db_out.getProductProviders);
router.get('/getproducttypes', db_out.getProductTypes);
router.post('/getbytimeinterval', db_out.getProductsByTimeInterval);


// Authorization protected
// router.get('/getproducts', authorize, db_out.getProducts);
// router.get('/getproviders', authorize, db_out.getProductProviders);
// router.get('/getproducttypes', authorize, db_out.getProductTypes);
// router.post('/getbytimeinterval', authorize, db_out.getProductsByTimeInterval);

module.exports = router;