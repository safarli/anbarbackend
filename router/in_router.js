const {Router} = require('express');
const {stockIn} = require('../db/db_in');
const authorize = require('../middleware/authorize');

const router = Router();

// router.post('/mehsul', authorize, insertItem);
router.post('/product', stockIn);

module.exports = router;
