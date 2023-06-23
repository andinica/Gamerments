import React from 'react';
import { useNavigate } from 'react-router-dom';

function CreateTournamentButton() {
  let navigate = useNavigate();

  const handleCreate = () => {
    navigate("/create");
  };

  return (
    <button onClick={handleCreate}>
      CREATE NEW TOURNAMENT
    </button>
  );
}

export default CreateTournamentButton;