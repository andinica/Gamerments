import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Bracket } from 'react-tournament-bracket';
import './TournamentTable.css'; // Import the CSS file for styling


const TournamentTable = () => {
  const { id } = useParams();
  const [rootGame, setRootGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchups();
  }, [id]);

  const fetchMatchups = () => {
    axios
      .get(`http://localhost:3000/matchup/byTournament?tournamentId=${id}`)
      .then(response => {
        const matchups = response.data;
        fetchParticipants(matchups);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  const fetchParticipants = matchups => {
    const participantIds = [...new Set(matchups.map(matchup => [matchup.fPId, matchup.sPId]).flat())];

    axios
      .post('http://localhost:3000/participant/batch', { ids: participantIds })
      .then(response => {
        const participants = response.data.reduce((map, participant) => {
          map[participant.id] = participant.name;
          return map;
        }, {});

        const games = constructGames(matchups, participants);
        setRootGame(games.find(game => game.name === 'F')); // find the game with phase 'F'
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  const constructGames = (matchups, participants) => {
    const games = matchups
      .filter(matchup => matchup.phase !== 'F-3rd')
      .map(matchup => ({
        id: matchup.id.toString(),
        name: matchup.phase,
        scheduled: Number(new Date()),
        sides: {
          home: {
            team: {
              id: matchup.fPId ? matchup.fPId.toString() : null,
              name: getParticipantName(matchup.fPId, participants) || matchup.nextFP,
            },
            score: {
              score: matchup.scoreFP,
            },
            seed: {
              rank: 1,
              sourceGame: matchup.nextFP ? { name: matchup.nextFP } : null,
            },
          },
          visitor: {
            team: {
              id: matchup.sPId ? matchup.sPId.toString() : null,
              name: getParticipantName(matchup.sPId, participants) || matchup.nextSP,
            },
            score: {
              score: matchup.scoreSP,
            },
            seed: {
              rank: 1,
              sourceGame: matchup.nextSP ? { name: matchup.nextSP } : null,
            },
          },
        },
      }));

    // link the games based on nextFP and nextSP
    games.forEach(game => {
      if (game.sides.home.seed.sourceGame) {
        game.sides.home.seed.sourceGame = games.find(g => g.name === game.sides.home.seed.sourceGame.name);
      }
      if (game.sides.visitor.seed.sourceGame) {
        game.sides.visitor.seed.sourceGame = games.find(g => g.name === game.sides.visitor.seed.sourceGame.name);
      }
    });

    return games;
  };

  const getParticipantName = (participantId, participants) => {
    return participantId ? participants[participantId] : null;
  };

  return (
    <div className="tournament-table">
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : rootGame ? (
        <Bracket game={rootGame} />
      ) : null}
    </div>
  );
      };
export default TournamentTable;