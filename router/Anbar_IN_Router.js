const {Router} = require('express');

const router = Router();

router.post('/mehsul', (req, res) => {
    console.log(req.body);
    res.status(200).send('Reception OK!');
})

module.exports = router;