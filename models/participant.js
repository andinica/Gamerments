const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db.js');
const Tournament = require('./tournament.js');

const Participant = sequelize.define('Participant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tournament_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Tournament, 
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING
  },
  final_position: {
    type: DataTypes.INTEGER
  }
}, {
  // Other model options go here
});

Participant.belongsTo(Tournament, { foreignKey: 'tournament_id' }); // Sets up a foreign key constraint

module.exports = Participant;