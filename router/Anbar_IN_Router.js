const {Router} = require('express');
const {daxiletMehsul} = require('../db/db_in');

const router = Router();

router.post('/mehsul', daxiletMehsul);

module.exports = router;