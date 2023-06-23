import React, { useState, useEffect } from 'react';

function SearchBar({ setTournaments }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (query === '') {
      fetch('http://localhost:3000/tournament/')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => setTournaments(data))
        .catch(error => console.error('Error:', error));
    }
  }, [query]);

  const handleSearch = (event) => {
    event.preventDefault();
    fetch(`http://localhost:3000/tournament/name/${query}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setTournaments(data))
      .catch(error => console.error('Error:', error));
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search Tournaments"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className='blueButton' type="submit" disabled={!query}>SEARCH</button>
    </form>
  );
}

export default SearchBar;