const Participant = require('../models/participant.js');

exports.createParticipant = async (req, res) => {
    try {
        const participant = await Participant.create(req.body);
        res.status(201).json(participant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createParticipants = async (req, res) => {
    try {
        const participantNames = req.body.names.split(",");
        const participants = await Promise.all(participantNames.map(async name => {
            return await Participant.create({ tournament_id: req.body.tournamentId, name: name.trim() });
        }));
        res.status(201).json({ participants: participants });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getParticipant = async (req, res) => {
    try {
        const participant = await Participant.findByPk(req.params.id);
        res.status(200).json(participant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getParticipant = async (req, res) => {
    try {
        const participant = await Participant.findByPk(req.params.id);
        res.status(200).json(participant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}