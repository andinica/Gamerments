import React, { useState, useEffect } from 'react';
import "./Home.css";


function ViewTournament() {
  const [tournament, setTournament] = useState(null);

  return (
    <div className='container'>
      {tournament ? (
        <div>
          <h2>{tournament.name}</h2>
          {/* Display more tournament details */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ViewTournament;