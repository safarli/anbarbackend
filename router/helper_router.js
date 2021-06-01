const { Router } = require('express');
const dbHelpers = require('../db/db_helpers')

const router = Router();

router.get('/providers', dbHelpers.getProductProviders);
router.get('/producttypes', dbHelpers.getProductTypes);
router.post('/producttypes', dbHelpers.addProductType);

module.exports = router;