import React, { useState } from 'react';
import { MainTable } from './components/MainTable/MainTable';
import { NavBar } from './components/NavBar/NavBar';
import { getCurrentSeason } from './utils/seasonUtils/getCurrentSeason';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

export const App = () => {
  const [currentSchedule, setCurrentSchedule] = useState(getCurrentSeason())

  return (
    <>
    <div className="app-container">
      <NavBar currentSchedule={currentSchedule} setCurrentSchedule={setCurrentSchedule} />
      

      <h1>Schedule for season:
        <br/>
        {currentSchedule.season[0].toUpperCase()+currentSchedule.season.slice(1)} {currentSchedule.year}
      </h1>

      <MainTable currentSchedule={currentSchedule} />

      
    </div>
    </>
  );
};
