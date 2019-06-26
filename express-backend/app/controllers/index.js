
var express = require('express');
var router = express.Router();

router.use('/api/receivesms', require('./receivesms'));

router.use('/api/users', require('./users'));
router.use('/api/userTypes', require('./userTypes'));

router.use('/api/contactTypes', require('./contactTypes'))
router.use('/api/contacts', require('./contacts'))

module.exports = router;