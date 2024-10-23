import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './contexts/AuthContext'; // Import the auth context

import { MainTable } from './components/MainTable/MainTable';
import { NavBar } from './components/NavBar/NavBar';
import { getCurrentSeason } from './utils/seasonUtils/getCurrentSeason';

import './App.css'


export const App = () => {
  const { currentUser, signInWithGoogle, logout } = useAuth(); // Use authentication context
  const [currentSchedule, setCurrentSchedule] = useState(getCurrentSeason())

  return (
    <>
    <div className="app-container">
      <NavBar currentSchedule={currentSchedule} setCurrentSchedule={setCurrentSchedule} />
      

      <h1>Schedule for season:</h1>
            {/* Display current schedule */}
            <h2>{`${currentSchedule.season[0].toUpperCase()}${currentSchedule.season.slice(1)} ${currentSchedule.year}`}</h2>

            {/* Show the main table */}
            <MainTable {...{ currentSchedule, setCurrentSchedule }} />

            {/* Logout button */}
            {currentUser ? (
              <button type="button" onClick={logout} className="btn btn-danger">Logout</button>
            ) : (
              <button type="button" onClick={signInWithGoogle} className="btn btn-primary">Sign in with Google</button>
            )}
    </div>
    </>
  );
};
