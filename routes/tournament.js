const express = require('express');
const router = express.Router();

const tournamentController = require('../controllers/tournamentController.js');

router.post('/', tournamentController.createTournament);
router.get('/:id', tournamentController.getTournament);

module.exports = router;