const { Router } = require('express');
const {stockOut} = require('../db/db_out');
const authorize = require('../middleware/authorize')

const router = Router();

// This route isn't token checked
router.get('/product', stockOut);

// router.get('/product', authorize, db_out.getProducts);

module.exports = router;