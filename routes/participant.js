const express = require('express');
const router = express.Router();

const participantController = require('../controllers/participantController.js');

router.post('/', participantController.createParticipant);
router.get('/:id', participantController.getParticipant);

module.exports = router;