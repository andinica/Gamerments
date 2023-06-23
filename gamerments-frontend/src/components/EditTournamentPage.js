import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shuffle, chunk } from 'lodash';
import axios from 'axios';
import TournamentContext from './TournamentContext.js';
import "./Home.css";


function EditTournamentPage() {
  const { id } = useParams();
  const [participants, setParticipants] = useState([]);
  const [inputToken, setInputToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { tournament, setTournament } = useContext(TournamentContext);

  useEffect(() => {
    setIsLoading(true);
    const getTournamentDetails = async () => {
      try {
        const tournamentRes = await axios.get(`http://localhost:3000/tournament/${id}`);
        setTournament(tournamentRes.data);
        const participantsRes = await axios.get(`http://localhost:3000/participant/byTournament/${id}`);
        setParticipants(participantsRes.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    getTournamentDetails();
  }, [id]);

  const checkToken = () => {
    if (inputToken === tournament.token) {
      localStorage.setItem(`tournament-${id}-token`, inputToken);
      navigate(`/edit/${id}`);
    } else {
      alert('Invalid token');
    }
  };

  const generateFixtures = async (previousPhase = null) => {
    let lastPhaseGenerated;
    let res;
    res = await axios.get(`http://localhost:3000/participant/byTournament/${id}`);
    const participantsNumber = res.data.length;

    if (previousPhase === null) {
      if (participantsNumber === 2) {
        lastPhaseGenerated = "F";
      } else if (participantsNumber === 4) {
        lastPhaseGenerated = "SF";
      } else if (participantsNumber === 8) {
        lastPhaseGenerated = "QF";
      } else if (participantsNumber === 16) {
        lastPhaseGenerated = "RO16";
      } else if (participantsNumber === 32) {
        lastPhaseGenerated = "RO32";
      } else if (participantsNumber === 64) {
        lastPhaseGenerated = "RO64";
      } else if (participantsNumber === 128) {
        lastPhaseGenerated = "RO128";
      } else {
        alert('Invalid number of participants!');
        return;
      }
      setTournament({ ...tournament, phase: 'matchupsGenerated' });
      axios.put(`http://localhost:3000/tournament/${id}`, {
        phase: lastPhaseGenerated,
      })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });

      if (participantsNumber === 2) {
        // Directly generate the final matchup for two participants
        await axios.post('http://localhost:3000/matchup', {
          tournamentId: id,
          fPId: res.data[0].id,
          sPId: res.data[1].id,
          phase: 'F',
        });
        return; // no need to proceed to further steps for only two participants
      }
    } else {
      let phase;
      switch (true) {
        case previousPhase.lastIndexOf("-") !== -1:
          phase = previousPhase.slice(0, previousPhase.lastIndexOf("-"));
          break;
        default:
          phase = previousPhase;
      }

      res = await axios.get(`http://localhost:3000/matchup/byTournamentAndStage`, {
        params: {
          tournamentId: id,
          phase,
        },
      });

      if (phase.startsWith("RO16")) {
        lastPhaseGenerated = "QF";
      } else if (phase.startsWith("RO")) {
        lastPhaseGenerated = "RO" + (phase.substring(2) / 2);
      } else if (phase.startsWith("QF")) {
        lastPhaseGenerated = "SF";
      } else if (phase.startsWith("SF")) {
        lastPhaseGenerated = "F";
      } else {
        return;  // we generated the final, no need to go further
      }
    }

    let shuffledMatchups = shuffle(res.data);
    let matchups = chunk(shuffledMatchups, 2);

    for (let i = 0; i < matchups.length; i++) {
      const matchup = matchups[i];
      let data;
      if (previousPhase === null) {
        data = {
          tournamentId: id,
          fPId: matchup[0].id,
          sPId: matchup[1].id,
          phase: lastPhaseGenerated + "-" + (i + 1),
        };
      } else {
        if (lastPhaseGenerated === "F") {  // For the final matchup, only one predecessor exists
          data = {
            tournamentId: id,
            nextFP: "SF-1",
            nextSP: "SF-2",
            phase: lastPhaseGenerated,
          };
        } else {  // For other matchups, two predecessors exist
          data = {
            tournamentId: id,
            nextFP: matchup[0].phase,
            nextSP: matchup[1].phase,
            phase: lastPhaseGenerated + "-" + (i + 1),
          };
        }
      }
      await axios.post('http://localhost:3000/matchup', data);
      if (i === matchups.length - 1 && lastPhaseGenerated === "F" && participantsNumber > 2) {
        let data = {
          tournamentId: id,
          phase: 'F-3rd',
        };
        await axios.post('http://localhost:3000/matchup', data); // we should also have a match for the 3rd placed team (between SF losers)
        alert('Fixtures generated successfully!');
      }
      setIsLoading(false);
    }

    if (lastPhaseGenerated !== "F") {
      generateFixtures(lastPhaseGenerated + "-1");  // recursive call to keep generating the next phases
    }
  };

  if (!tournament) {
    return <div>Loading...</div>;
  }

  const storedToken = localStorage.getItem(`tournament-${id}-token`);
  if (storedToken !== tournament.token) {
    return (
      <div className='container'>
        <label>
          Token:
          <input type="text" value={inputToken} onChange={(e) => setInputToken(e.target.value)} />
        </label>
        <button className='blueButton' onClick={checkToken}>Submit</button>
      </div>
    );
  }


  return (
    <div className='container' >
      <div style={{ marginTop: "15px" }}>
        {isLoading ? (
          <div>Generating fixtures...</div>
        ) : (
          tournament.phase === "created" && <button className='blueButton' onClick={() => { setIsLoading(true); generateFixtures(); }}>GENERATE FIXTURES</button>
        )}
        <h1>Tournament name: {tournament.name}</h1>
        <h2>Tournament game: {tournament.game}</h2>
        <h2>Tournament phase: {tournament.phase}</h2>
      </div>
      <div className="tournamentList">
        <h2>Participants:</h2>
        {participants.map((participant) => (
          <div key={participant.id}>
            <h2>{participant.name}</h2>
          </div>
        ))}
      </div>
    </div>

  );
}

export default EditTournamentPage;