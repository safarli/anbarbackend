const { Router } = require('express');
const db_out = require('../db/db_out');
const authorize = require('../middleware/authorize')

const router = Router();

router.get('/getall', authorize, db_out.getAll);
router.get('/getbyid/:id', authorize, db_out.getById);
router.post('/getbytimeinterval', authorize, db_out.getByTimeInterval);

module.exports = router;