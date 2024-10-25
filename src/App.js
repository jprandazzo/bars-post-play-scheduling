import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { MainTable } from './components/MainTable/MainTable';
import { NavBar } from './components/NavBar/NavBar';
import { getCurrentSeason } from './utils/seasonUtils/getCurrentSeason';

import './App.css'


export const App = () => {
  const [currentSchedule, setCurrentSchedule] = useState(getCurrentSeason())

  return (
    <>
    <div className="app-container">
      <NavBar currentSchedule={currentSchedule} setCurrentSchedule={setCurrentSchedule} />
      

      <h1>Schedule for season:</h1>
            <h2>{`${currentSchedule.season[0].toUpperCase()}${currentSchedule.season.slice(1)} ${currentSchedule.year}`}</h2>

            <MainTable {...{ currentSchedule, setCurrentSchedule }} />
    </div>
    </>
  );
};
