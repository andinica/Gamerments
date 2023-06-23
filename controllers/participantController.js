const Participant = require('../models/participant.js');
const { Op } = require("sequelize"); // import the Op object from sequelize


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
            return await Participant.create({ tournamentId: req.body.tournamentId, name: name.trim() });
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

exports.getParticipantsByIds = async (req, res) => {
    try {
        const participantIds = req.body.ids;
        const participants = await Participant.findAll({
            where: { id: { [Op.in]: participantIds } }
        });
        res.status(200).json(participants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getParticipantsByTournament = async (req, res) => {
    try {
        const participants = await Participant.findAll({
            where: { tournamentId: req.params.tournamentId }
        });
        res.status(200).json(participants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllParticipants = async (req, res) => {
    try {
        const participants = await Participant.findAll();
        res.status(200).json(participants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getParticipantsByTournamentAndPosition = async (req, res) => {
    try {
      const participants = await Participant.findAll({
        where: {
          tournamentId: req.query.tournamentId,
          final_position: req.query.final_position
        }
      });
      res.status(200).json(participants);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


exports.updateParticipant = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, final_position } = req.body;
  
      const participant = await Participant.findByPk(id);
      if (!participant) {
        return res.status(404).json({ error: 'Participant not found' });
      }
  
      participant.name = name;
      participant.final_position = final_position;
  
      await participant.save();
  
      res.status(200).json(participant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
