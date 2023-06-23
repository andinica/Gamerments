const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db.js');

const Tournament = sequelize.define('Tournament', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  },
  game: {
    type: DataTypes.STRING
  },
  participants: {
    type: DataTypes.INTEGER
  },
  token: {
    type: DataTypes.STRING
  },
  phase: {
    type: DataTypes.STRING
  }
}, {
  // Other model options go here
});

module.exports = Tournament;