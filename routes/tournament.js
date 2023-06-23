const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController.js');

router.post('/', tournamentController.createTournament);
router.put('/:id', tournamentController.updateTournament);
router.get('/', tournamentController.getAllTournaments);
router.get('/name/:name', tournamentController.getTournamentsByName);
router.get('/:id', tournamentController.getTournament);
router.delete('/deleteAll', tournamentController.deleteAll);

module.exports = router;