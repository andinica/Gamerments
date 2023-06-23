import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CreatedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tournament = location.state?.tournament;

  useEffect(() => {
    if (!tournament) {
      navigate('/');
    }
  }, [tournament, navigate]);

  if (!tournament) {
    return null;
  }

  const { name, id, token } = tournament;

  const handleYes = () => {
    navigate(`/edit/${id}`);
  };

  const handleNo = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <h2>Tournament {name} successfully created!</h2>
      <h3>
        To be able to edit it and add match results you will need to use the
        following token: {token}
      </h3>
      <h3>Do you want to go to the tournament page now?</h3>
      <button className="blueButton" onClick={handleYes}>Yes</button>
      <button className="redButton" onClick={handleNo}>No</button>
    </div>
  );
};

export default CreatedPage;