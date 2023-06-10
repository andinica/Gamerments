const Tournament = require('../models/tournament.js');
const crypto = require('crypto');

exports.createTournament = async (req, res) => {
    const { name, game, participants } = req.body;
    const token = crypto.randomBytes(5).toString('hex');
    console.log("Body: \n" + req.body.toString());

    try {
        const newTournament = await Tournament.create({ name, game, participants, token });
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
}