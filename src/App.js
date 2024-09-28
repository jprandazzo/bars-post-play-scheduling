import React, { useState } from 'react';
import { MainTable } from './components/MainTable';
import { NavBar } from './components/NavBar';
import { getCurrentSeason } from './utils/getCurrentSeason';
import './App.css'

export const App = () => {
  // const currentYear = new Date().getFullYear();
  // const currentMonth = new Date().getMonth();
  const [currentSchedule, setCurrentSchedule] = useState(getCurrentSeason())

  return (
    <>
    <div className="app-container">
      <NavBar currentSchedule={currentSchedule} setCurrentSchedule={setCurrentSchedule}></NavBar>
      

      <h1>Schedule for season:
        <br/>
        {currentSchedule.season} {currentSchedule.year}
      </h1>

      <MainTable year={currentSchedule.year} season={currentSchedule.season} />

      
    </div>
    </>
  );
};
