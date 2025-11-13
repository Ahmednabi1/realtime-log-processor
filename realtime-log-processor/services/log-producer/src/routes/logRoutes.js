const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');


router.post('/log', logController.postLog);

module.exports = router;