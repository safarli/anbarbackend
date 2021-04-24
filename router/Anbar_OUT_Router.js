const { Router } = require('express');
const db_out = require('../db/db_out.js');

const router = Router();

router.get('/getall', db_out.getAll);
router.get('/getbyid/:id', db_out.getById);
router.get('/getbytimeinterval', db_out.getByTimeInterval);

module.exports = router;