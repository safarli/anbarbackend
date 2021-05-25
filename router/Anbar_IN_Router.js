const {Router} = require('express');
const {insertItem} = require('../db/db_in');

const router = Router();

router.post('/mehsul', insertItem);

module.exports = router;