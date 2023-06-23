const Tournament = require('../models/tournament.js');
const crypto = require('crypto');
const { Op } = require('sequelize');


exports.createTournament = async (req, res) => {
    const { name, game, participants, phase } = req.body;
    const token = crypto.randomBytes(5).toString('hex');
    console.log("Body: \n" + req.body.toString());

    try {
        const newTournament = await Tournament.create({ name, game, participants, phase, token });
        res.status(201).json({ message: 'Tournament created successfully', tournamentId: newTournament.id, token: token });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTournament = async (req, res) => {
    try {
        const tournament = await Tournament.findByPk(req.params.id);
        res.status(200).json(tournament);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTournament = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, game, participants, token, phase } = req.body;
  
      const tournament = await Tournament.findByPk(id);
      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' });
      }
  
      tournament.name = name;
      tournament.game = game;
      tournament.participants = participants;
      tournament.token = token;
      tournament.phase = phase;
  
      await tournament.save();
  
      res.status(200).json(tournament);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.getAllTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.findAll();
        res.status(200).json(tournaments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getTournamentsByName = async (req, res) => {
    try {
        const tournaments = await Tournament.findAll({
            where: { name: { [Op.like]: '%' + req.params.name + '%' } }
        });
        res.status(200).json(tournaments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  };

  exports.deleteAll = async (req, res) => {
    try {
      await Tournament.destroy({ where: {}, truncate: true })
      res.status(200).json({ message: 'All tournaments have been deleted.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };