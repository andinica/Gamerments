import React from 'react';

const TournamentContext = React.createContext();

export const TournamentContextProvider = ({ children }) => {
  const [tournament, setTournament] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const value = {
    tournament,
    setTournament,
    isLoading,
    setIsLoading,
  };

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
};

export default TournamentContext;