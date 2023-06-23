const express = require('express');
const router = express.Router();

const participantController = require('../controllers/participantController.js');

router.post('/', participantController.createParticipant);
router.post('/batch', participantController.getParticipantsByIds);
router.put('/:id', participantController.updateParticipant);
router.get('/byTournamentAndPosition', participantController.getParticipantsByTournamentAndPosition);
router.get('/byTournament/:tournamentId', participantController.getParticipantsByTournament);
router.get('/:id', participantController.getParticipant);
router.get('/', participantController.getAllParticipants);



module.exports = router;