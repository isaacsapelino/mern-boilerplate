const express = require('express');
const router = express.Router();
const user = require('../controllers/users.controller');

router.get('/:id', user.getUser);
router.post('/', user.createUser);

module.exports = router;