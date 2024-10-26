import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';

import { MainTable } from './components/MainTable/MainTable';
import { NavBar } from './components/NavBar/NavBar';
import { getCurrentSeason } from './utils/seasonUtils/getCurrentSeason';

import './App.css';

export const App = () => {
    const [currentSchedule, setCurrentSchedule] = useState(getCurrentSeason());

    return (
        <>
            <NavBar
                currentSchedule={currentSchedule}
                setCurrentSchedule={setCurrentSchedule}
            />
            <div className="app-container">
                {/* Display the current season */}
                <h1>Schedule for season:</h1>
                <h2>{`${currentSchedule.season[0].toUpperCase()}${currentSchedule.season.slice(1)} ${currentSchedule.year}`}</h2>

                {/* Define your routes */}
                <Routes>
                    {/* Home route */}
                    <Route
                        path="/"
                        element={
                            <MainTable
                                {...{ currentSchedule, setCurrentSchedule }}
                            />
                        }
                    />

                    {/* Dynamic route for specific season */}
                    <Route
                        path="/season/:year/:season"
                        element={
                            <MainTable
                                {...{ currentSchedule, setCurrentSchedule }}
                            />
                        }
                    />
                </Routes>
            </div>
        </>
    );
};
