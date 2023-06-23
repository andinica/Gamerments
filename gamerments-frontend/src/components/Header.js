import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TournamentContext from './TournamentContext.js';
import CreateTournamentButton from './CreateTournamentButton.js';


function Header() {
  const { tournament, isLoading } = useContext(TournamentContext);
  const location = useLocation();  // useLocation hook to get the current location
  
  const isEditTournamentPage = location.pathname.startsWith("/edit");

  // Null check for the tournament object
  const tournamentId = tournament ? tournament.id : null;
  
  if (isLoading) {
    return <header style={{ backgroundColor: 'black', height: '100px' }}></header>;
  }

  return (
    <header>
      <Link to="/">
        <img 
          src="/logoV3.png" 
          alt="Home button" 
        />
      </Link>

      
      {isEditTournamentPage && tournamentId && tournament?.phase !== "created" && (
          <>
          <Link to={`/edit/${tournamentId}`}>Tournament Home</Link>
          <Link to={`/edit/${tournamentId}/fixtures`}>Fixtures</Link>
          <Link to={`/edit/${tournamentId}/table`}>Tournament Table</Link>
          </>
      )}

      <CreateTournamentButton />

    </header>
  );
}

export default Header;