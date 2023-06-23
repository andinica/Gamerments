const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db.js');
const Participant = require('./participant.js');
const Tournament = require('./tournament.js');

const Matchup = sequelize.define('Matchup', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tournamentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tournament,
      key: 'id'
    }
  },
  fPId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Participant,
      key: 'id'
    }
  },
  sPId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Participant,
      key: 'id'
    }
  },
  nextFP: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  nextSP: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  scoreFP: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  scoreSP: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  phase: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Matchup;