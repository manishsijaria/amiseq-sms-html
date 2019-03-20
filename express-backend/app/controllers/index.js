
var express = require('express');
var router = express.Router();

router.use('/clients', require('./clients'));
router.use('/candidates', require('./candidates'));
router.use('/receivesms', require('./receivesms'));
router.use('/users', require('./users'));

module.exports = router;