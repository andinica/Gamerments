import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Updated this line
import './CreateTournament.css';  // Assuming you keep your CSS in CreateTournament.css

function CreateTournament() {
  const [name, setName] = useState('');
  const [gameSearch, setGameSearch] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [participants, setParticipants] = useState('');
  const [games, setGames] = useState([]);
  const [validGameSelected, setValidGameSelected] = useState(false);
  const navigate = useNavigate();  // Updated this line

  const handleSubmit = async (event) => {
    event.preventDefault();

    const participantNames = participants.split(/[ ,/;]+/).filter(participant => participant.trim() !== '');
    const numParticipants = participantNames.length;

    if (!validGameSelected) {
      alert("Please select a valid game from the dropdown.");
      return;
    }

    if (!isPowerOfTwo(numParticipants)) {
      alert("Number of participants should be a power of 2, greater than 1");
      return;
    }

    try {
      // Step 1: Create tournament
      const tournamentResponse = await axios.post('http://localhost:3000/tournament', {
        name: name,
        game: selectedGame.name,
        participants: participants.split(/[ ,/;]+/).filter(participant => participant.trim() !== '').length,
        phase: "created"
      });
      const tournamentId = tournamentResponse.data.tournamentId;
      const token = tournamentResponse.data.token;

      // Step 2: Create participants
      const participantNames = participants.split(/[ ,/;]+/).filter(participant => participant.trim() !== '');
      const createParticipantRequests = participantNames.map(name =>
        axios.post('http://localhost:3000/participant', {
          tournamentId: tournamentId,
          name: name.trim()
        })
      );

      await Promise.all(createParticipantRequests);

      // Clear the form after successful submission
      setName('');
      setGameSearch('');
      setSelectedGame(null);
      setParticipants('');
      setValidGameSelected(false);

      // Do something with the tournamentId and token if needed
      console.log('Tournament created successfully:', tournamentId);
      console.log('Token:', token);
      localStorage.setItem(`tournament-${tournamentId}-token`, token);
      navigate('/created', { state: { tournament: { name, id: tournamentId, token } } });  // Updated this line
    } catch (err) {
      console.error(err);
    }
  };


  const handleGameSearch = async (e) => {
    const gameName = e.target.value;
    setGameSearch(gameName);
    setValidGameSelected(false); // Set to false when the input changes
    if (gameName.length > 2) {
      try {
        const response = await axios.get(`http://localhost:3000/searchGames?name=${gameName}`);
        setGames(response.data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setGames([]);
    }
  };

  const selectGame = (selectedGame) => {
    setSelectedGame(selectedGame);
    setGameSearch(selectedGame.name);
    setGames([]);
    setValidGameSelected(true); // Set to true when a game is selected
  }

  const isPowerOfTwo = (x) => {
    return (Math.log2(x) % 1 === 0 && x > 1);
  }

  return (
    <div className='container-create-tournament'>
      <h2>Here to create a new tournament?</h2>
      <h2>Please fill out the details below!</h2>
      <h2>You'll get help if we don't accept your input :)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
          </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required minLength="3" />
        </div>
        <div>

          <label>
            Game:
          </label>

          <input type="text" value={gameSearch} onChange={handleGameSearch} required />


          <div className="dropdown">
            {games.map((game, index) => (
              <div key={index} className="dropdown-item" onClick={() => selectGame(game)}>
                <img src={game.cover} alt={game.name} />
                <span>{game.name}</span>
              </div>
            ))}
          </div>
        </div>


        <div>

          <label>
            Participants:
          </label>

          <input type="text" value={participants} onChange={(e) => setParticipants(e.target.value)} required pattern="^([a-zA-Z0-9]+[,/;]\s*)+[a-zA-Z0-9]+$" />
        </div>

        <span className='warning-participants'>{isPowerOfTwo(participants.split(/[,/]\s*/).length) ? '' : "In this version of the app, the number of accepted participants should be a power of 2, greater than 1. Please introduce your participants' names, separated by , or /"}</span>

        <button className='blueButton' type="submit">SUBMIT</button>

      </form>
    </div>
  );
}

export default CreateTournament;