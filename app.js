const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000
const sequelize = require('./db/db.js');
const cors = require('cors');


const CLIENT_ID = "or1bhys10q7icjmzko1zmv1u7ensid";
const CLIENT_SECRET = "tuf0l5r3w807qcgya7yerz32ucr8vj";

const tournamentRoutes = require('./routes/tournament.js');
const participantRoutes = require('./routes/participant.js');
const matchupRoutes = require('./routes/matchup.js');

app.use(express.json());
app.use(cors());
app.use('/tournament', tournamentRoutes);
app.use('/participant', participantRoutes);
app.use('/matchup', matchupRoutes);

// sequelize.sync({ force: true }) // This is to ensure that the database is in sync with the models you've defined. In production, this is not commonly used.
//     .then(() => {
        app.listen(3000, () => console.log('Server is running on port 3000'));
    // })
    // .catch(err => console.log(err));

const getAccessToken = async () => {
  const URL = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
  try {
    const response = await axios.post(URL);
    return response.data.access_token;
  } catch (error) {
    throw new Error(error);
  }
};

const getHeaders = async () => {
  const accessToken = await getAccessToken();
  return {
    'Client-ID': CLIENT_ID,
    'Authorization': `Bearer ${accessToken}`,
  }
};

const searchGamesByName = async (name) => {
  const headers = await getHeaders();
  try {
    const response = await axios({
      url: 'https://api.igdb.com/v4/games',
      method: 'POST',
      headers: headers,
      data: `fields name,cover.url; search "${name}";`,
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

app.get('/searchgames', async (req, res, next) => {
  const gameName = req.query.name;
  if (!gameName) {
    return next(new Error('Game name is required.'));
  }

  try {
    const games = await searchGamesByName(gameName);
    if (!games || games.length === 0) {
      return next(new Error('Game not found.'));
    }

    const results = games.map(game => {
      return {
        name: game.name,
        cover: game.cover ? game.cover.url : null
      };
    });
    res.json(results);
  } catch (error) {
    next(error);
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: err.message });
});




// app for creating game tournaments
// using IGDB API
//  - create a game tournament
//  - add players to the tournament
//  - add scores to the tournament
//  - get the winner of the tournament
//  - get the scores of the tournament
//  - get the players of the tournament
//  - get the game of the tournament
//  - get the tournament
