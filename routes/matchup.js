const express = require('express');
const router = express.Router();
const matchupController = require('../controllers/matchupController.js');

router.post('/', matchupController.createMatchup);
router.put('/:id', matchupController.updateMatchup);
router.get('/byTournament', matchupController.getMatchupsByTournament);
router.get('/byTournamentAndStage', matchupController.getMatchupsByTournamentAndStage);
router.get('/byTournamentAndExactStage', matchupController.getMatchupsByTournamentAndExactStage);
router.get('/numberOfMatchups', matchupController.getNumberOfMatchups);
router.get('/:id', matchupController.getMatchup);
router.delete('/deleteAll', matchupController.deleteAll);

module.exports = router;