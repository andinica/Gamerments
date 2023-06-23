import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './Searchbar.js';
import CreateTournamentButton from './CreateTournamentButton.js';
import "./Home.css";

function Home() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/tournament/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setTournaments(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className='container'>
      <h1>Welcome!</h1>
      <SearchBar setTournaments={setTournaments} />
      <div className="tournamentList">
        {tournaments.length ? (
          tournaments.map((tournament) => (
            <div key={tournament.id}>
              <h2><Link to={`/edit/${tournament.id}`}>{tournament.name}</Link></h2>
            </div>
          ))
        ) : (
          <p style={{ fontStyle: "italic", fontSize: "20px" }}>There are no tournaments with this name...</p>
        )}
      </div>
    </div>
  );
}

export default Home;