import React, { useState, useEffect } from 'react';

function ViewTournament() {
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    // Call API to fetch the tournament data and set it to the state
    // You need to implement this part
  }, []);

  return (
    <div>
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