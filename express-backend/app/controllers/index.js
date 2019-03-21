
var express = require('express');
var router = express.Router();

router.use('/clients', require('./clients'));
router.use('/candidates', require('./candidates'));
router.use('/receivesms', require('./receivesms'));
router.use('/users', require('./users'));
router.use('/contactTypes', require('./contactTypes'))
router.use('/contacts', require('./contacts'))

module.exports = router;