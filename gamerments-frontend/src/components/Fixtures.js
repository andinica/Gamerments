import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TournamentContext from './TournamentContext.js';
import "./Home.css";

function FixturesPage() {
  const { id } = useParams();
  const [matchups, setMatchups] = useState([]);
  const [participantNames, setParticipantNames] = useState({});
  const [winnersFetched, setWinnersFetched] = useState(false); // New state to track winners data fetching
  const { setTournament, tournament } = useContext(TournamentContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tournamentResponse = await axios.get(`http://localhost:3000/tournament/${id}`);
        if (tournamentResponse.data) {
          setTournament(tournamentResponse.data);

          const response = await axios.get(`http://localhost:3000/matchup/byTournamentAndStage`, {
            params: {
              tournamentId: id,
              phase: tournamentResponse.data.phase,
            },
          });
          setMatchups(response.data);

          const participantIds = [...new Set(response.data.map(matchup => [matchup.fPId, matchup.sPId]).flat())];
          fetchParticipantNames(participantIds);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id, setTournament]);

  const handleScoreChange = (matchupId, scoreFP, scoreSP) => {
    if (scoreFP < 0 || scoreSP < 0) return;

    const newMatchups = matchups.map(matchup => {
      if (matchup.id === matchupId) {
        return { ...matchup, scoreFP, scoreSP };
      }
      return matchup;
    });
    setMatchups(newMatchups);
  };

  const validateScores = () => {
    for (let matchup of matchups) {
      if (typeof matchup.scoreFP !== 'number' || typeof matchup.scoreSP !== 'number' || matchup.scoreFP === matchup.scoreSP) {
        return false;
      }
    }
    return true;
  };

  const saveScores = async () => {
    if (!validateScores()) return;

    for (let matchup of matchups) {
      if (matchup.scoreFP < 0 || matchup.scoreSP < 0) {
        continue;
      }
      await axios.put(`http://localhost:3000/matchup/${matchup.id}`, {
        ...matchup,
        scoreFP: matchup.scoreFP,
        scoreSP: matchup.scoreSP,
      });
    }
  };

  const fetchParticipantNames = async (ids) => {
    try {
      const response = await axios.post(`http://localhost:3000/participant/batch`, {
        ids: ids,
      });

      const names = {};
      response.data.forEach(participant => {
        names[participant.final_position] = participant.name;
      });

      setParticipantNames(names);
      setWinnersFetched(true); // Set the winners fetched state to true
    } catch (err) {
      console.error(err);
    }
  };

  const finishTournament = async () => {
    try {
      const validScores = validateScores();
      if (validScores) {
        await saveScores();
        const finalMatchup = matchups.find(matchup => matchup.phase === 'F');
        const thirdPlaceMatchup = matchups.find(matchup => matchup.phase === 'F-3rd');

        const winnerId = finalMatchup.scoreFP > finalMatchup.scoreSP ? finalMatchup.fPId : finalMatchup.sPId;
        const secondId = finalMatchup.scoreFP > finalMatchup.scoreSP ? finalMatchup.sPId : finalMatchup.fPId;
        const thirdId = thirdPlaceMatchup && thirdPlaceMatchup.scoreFP > thirdPlaceMatchup.scoreSP ? thirdPlaceMatchup.fPId : thirdPlaceMatchup && thirdPlaceMatchup.sPId;

        // Update final positions of participants
        await axios.put(`http://localhost:3000/participant/${winnerId}`, {
          final_position: 1,
        });
        await axios.put(`http://localhost:3000/participant/${secondId}`, {
          final_position: 2,
        });
        if (thirdId) {
          await axios.put(`http://localhost:3000/participant/${thirdId}`, {
            final_position: 3,
          });
        }

        const tournamentResponse = await axios.put(`http://localhost:3000/tournament/${id}`, {
          phase: 'finished',
        });

        setTournament({ ...tournament, phase: 'finished' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const advanceToNextPhase = async () => {
    const validScores = validateScores();
    if (validScores) {
      await saveScores();
      const winners = matchups.reduce((winnersMap, matchup) => {
        const winnerId = matchup.scoreFP > matchup.scoreSP ? matchup.fPId : matchup.sPId;
        winnersMap[matchup.phase] = winnerId;
        return winnersMap;
      }, {});

      console.log(winners);
      let nextPhase;
      switch (tournament.phase) {
        case 'RO128':
          nextPhase = 'RO64';
          break;
        case 'RO64':
          nextPhase = 'RO32';
          break;
        case 'RO32':
          nextPhase = 'RO16';
          break;
        case 'RO16':
          nextPhase = 'QF';
          break;
        case 'QF':
          nextPhase = 'SF';
          break;
        case 'SF':
          nextPhase = 'F';
          break;
        default:
          return;
      }

      if (nextPhase === 'F') {
        let sfLosers = matchups.map((matchup) => {
          return matchup.scoreFP < matchup.scoreSP ? matchup.fPId : matchup.sPId;
        });

        let finalPhaseMatchup = await axios.get('http://localhost:3000/matchup/byTournamentAndStage', {
          params: { tournamentId: id, phase: 'F' },
        });
        await axios.put(`http://localhost:3000/matchup/${finalPhaseMatchup.data[0].id}`, {
          fPId: winners[0],
          sPId: winners[1],
        });

        let thirdPhaseMatchup = await axios.get('http://localhost:3000/matchup/byTournamentAndStage', {
          params: { tournamentId: id, phase: 'F-3rd' },
        });
        await axios.put(`http://localhost:3000/matchup/${thirdPhaseMatchup.data[0].id}`, {
          fPId: sfLosers[0],
          sPId: sfLosers[1],
        });
      } const nextPhaseMatchups = await axios.get('http://localhost:3000/matchup/byTournamentAndStage', {
        params: { tournamentId: id, phase: nextPhase },
      });

      // Update each matchup with the winners of the previous phase
      for (let matchup of nextPhaseMatchups.data) {
        const nextFPWinnerId = winners[matchup.nextFP];
        const nextSPWinnerId = winners[matchup.nextSP];

        await axios.put(`http://localhost:3000/matchup/${matchup.id}`, {
          fPId: nextFPWinnerId,
          sPId: nextSPWinnerId,
        });
      }

      // Update the tournament phase for other phases
      await axios.put(`http://localhost:3000/tournament/${id}`, {
        phase: nextPhase,
      });

      setTournament({ ...tournament, phase: nextPhase });

      const response = await axios.get(`http://localhost:3000/matchup/byTournamentAndStage`, {
        params: {
          tournamentId: id,
          phase: nextPhase,
        },
      });

      // Update the matchups state
      setMatchups(response.data);

      // Fetch the participant names for the new matchups
      const participantIds = [...new Set(response.data.map(matchup => [matchup.fPId, matchup.sPId]).flat())];
      fetchParticipantNames(participantIds);
    }
  };

  useEffect(() => {
    const fetchParticipantNames = async () => {
      try {
        if (tournament && tournament.phase === 'finished') {
          const response1st = await axios.get(`http://localhost:3000/participant/byTournamentAndPosition`, {
            params: {
              tournamentId: id,
              final_position: 1,
            },
          });
          const response2nd = await axios.get(`http://localhost:3000/participant/byTournamentAndPosition`, {
            params: {
              tournamentId: id,
              final_position: 2,
            },
          });
          const response3rd = await axios.get(`http://localhost:3000/participant/byTournamentAndPosition`, {
            params: {
              tournamentId: id,
              final_position: 3,
            },
          });

          const names = {
            1: response1st.data[0].name,
            2: response2nd.data[0].name,
            3: response3rd.data[0]?.name,
          };

          setParticipantNames(names);
        }

        const participantIds = [...new Set(matchups.map(matchup => [matchup.fPId, matchup.sPId]).flat())];
        const response = await axios.post(`http://localhost:3000/participant/batch`, {
          ids: participantIds,
        });

        const names = {};
        response.data.forEach(participant => {
          names[participant.id] = participant.name;
        });

        setParticipantNames(prevNames => ({ ...prevNames, ...names }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchParticipantNames();
  }, [tournament, matchups, id]);

  return (
    <div className='container'>
      {tournament ? (
        tournament.phase === 'finished' ? (
          <div>
            <h2>Tournament finished!</h2>
            {winnersFetched && ( // Render winners' names only when they are fetched
              <>
                <p>1st place: {participantNames[1]}</p>
                <p>2nd place: {participantNames[2]}</p>
                {participantNames[3] && (
                  <p>3rd place: {participantNames[3]}</p>
                )}
              </>
            )}
          </div>
        ) : (
          <div>
            <h2>Fixtures</h2>
            {matchups.map((matchup) => (
              <div key={matchup.id}>
                <p>{matchup.phase}: </p>
                <p >{participantNames[matchup.fPId]}</p>
                <input
                  type="number"
                  value={matchup.scoreFP}
                  onChange={(e) => handleScoreChange(matchup.id, Number(e.target.value), matchup.scoreSP)}
                />
                <p>vs</p>
                <input
                  type="number"
                  value={matchup.scoreSP}
                  onChange={(e) => handleScoreChange(matchup.id, matchup.scoreFP, Number(e.target.value))}
                />
                <p>{participantNames[matchup.sPId]}</p>
              </div>
            ))}
            <button className='blueButton' onClick={saveScores} disabled={!validateScores()}>
              SAVE SCORES
            </button>
            {validateScores() && (
              <button className='blueButton' onClick={tournament.phase === 'F' ? finishTournament : advanceToNextPhase}>
                {tournament.phase === 'F' ? 'FINISH TOURNAMENT' : 'ADVANCE TO NEXT PHASE'}
              </button>
            )}
          </div>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default FixturesPage;