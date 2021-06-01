const { Router } = require('express');
const dbReports = require('../db/db_reports')

const router = Router()

router.get('/products', dbReports.getProducts);
router.post('/bytimeinterval', dbReports.getProductsByTimeInterval)

module.exports = router;