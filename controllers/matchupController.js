const Matchup = require('../models/matchup.js');
const Sequelize = require('sequelize');

exports.createMatchup = async (req, res) => {
  try {
    const matchup = await Matchup.create(req.body);
    res.status(201).json(matchup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMatchup = async (req, res) => {
  try {
    const matchup = await Matchup.findByPk(req.params.id);
    res.status(200).json(matchup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMatchup = async (req, res) => {
  try {
    const { id } = req.params;
    const { fPId, sPId, nextFP, nextSP, scoreFP, scoreSP, phase } = req.body;

    const matchup = await Matchup.findByPk(id);
    if (!matchup) {
      return res.status(404).json({ error: 'Matchup not found' });
    }

    matchup.fPId = fPId;
    matchup.sPId = sPId;
    matchup.nextFP = nextFP;
    matchup.nextSP = nextSP;
    matchup.scoreFP = scoreFP;
    matchup.scoreSP = scoreSP;
    matchup.phase = phase;

    await matchup.save();

    res.status(200).json(matchup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMatchupsByTournament = async (req, res) => {
  try {
    const matchups = await Matchup.findAll({
      where: { tournamentId: req.query.tournamentId }
    });
    res.status(200).json(matchups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMatchupsByTournamentAndStage = async (req, res) => {
  try {
    const matchups = await Matchup.findAll({
      where: {
        tournamentId: req.query.tournamentId,
        phase: {
          [Sequelize.Op.like]: req.query.phase + '%'
        }
      }
    });
    res.status(200).json(matchups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMatchupsByTournamentAndExactStage = async (req, res) => {
  try {
    const matchups = await Matchup.findAll({
      where: {
        tournamentId: req.query.tournamentId,
        phase: req.query.phase
      }
    });
    res.status(200).json(matchups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    await Matchup.destroy({ where: {}, truncate: true })
    res.status(200).json({ message: 'All matchups have been deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNumberOfMatchups = async (req, res) => {
  try {
    const { tournamentId } = req.query;

    const count = await Matchup.count({
      where: {
        tournamentId: tournamentId
      }
    });

    res.status(200).json({ count: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};