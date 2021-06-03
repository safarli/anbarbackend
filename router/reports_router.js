const { Router } = require('express');
const dbReports = require('../db/db_reports')

const router = Router()

router.get('/products', dbReports.getProducts);
router.get('/anbarlogs', dbReports.getAnbarLogs);
router.post('/bytimeinterval', dbReports.getProductsByTimeInterval)

module.exports = router;