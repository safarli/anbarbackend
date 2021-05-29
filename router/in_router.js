const {Router} = require('express');
const {insertItem} = require('../db/db_in');
const authorize = require('../middleware/authorize');

const router = Router();

router.post('/mehsul', authorize, insertItem);

module.exports = router;
