import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreatedPage from "./components/CreatedPage.js";
import CreateTournament from './components/CreateTournamentPage.js';
import EditTournament from './components/EditTournamentPage.js';
import ViewTournament from './components/ViewTournamentPage.js';
import Home from './components/Home.js';
import Header from './components/Header.js';
import { TournamentContextProvider } from './components/TournamentContext.js';
import Fixtures from './components/Fixtures.js';
import TournamentTable from './components/TournamentTable.js';


function App() {
  return (
    <TournamentContextProvider>
      <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateTournament />} />
            <Route path="/view" element={<ViewTournament />} />
            <Route path="/created" element={<CreatedPage />} />
            <Route path="/edit/:id" element={<EditTournament />} />
            <Route path="/edit/:id/fixtures" element={<Fixtures />} />
            <Route path="/edit/:id/table" element={<TournamentTable />} />
          </Routes>
        </div>
      </Router>
    </TournamentContextProvider>
  );
}

export default App;