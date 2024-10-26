import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentSeason } from '../../utils/seasonUtils/getCurrentSeason';
import { useAuth } from '../../../contexts/AuthContext';

import './NavBar.css';

export const NavBar = ({ currentSchedule, setCurrentSchedule }) => {
    const { currentUser, signInWithGoogle, logout } = useAuth();
    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);
    const [fadeClass, setFadeClass] = useState('fade-in');
    const [showSeasons, setShowSeasons] = useState(false);
    const navigate = useNavigate(); // Add navigate from react-router

    const resetApp = () => {
        setCurrentSchedule(getCurrentSeason());
        const { year, season } = getCurrentSeason();
        navigate(`/season/${year}/${season.toLowerCase()}`);
    };

    const handleSeasonChange = (direction) => {
        const seasonOrder = ['winter', 'spring', 'summer', 'fall'];
        const currentSeasonIndex = seasonOrder.indexOf(currentSchedule.season);
        let newYear = currentSchedule.year;
        let newSeason = currentSchedule.season.toLowerCase();

        if (direction === 'prev') {
            if (currentSeasonIndex === 0) {
                newYear = currentSchedule.year - 1;
                newSeason = 'fall';
            } else {
                newSeason = seasonOrder[currentSeasonIndex - 1];
            }
        } else if (direction === 'next') {
            if (currentSeasonIndex === 3) {
                newYear = currentSchedule.year + 1;
                newSeason = 'winter';
            } else {
                newSeason = seasonOrder[currentSeasonIndex + 1];
            }
        }

        setCurrentSchedule({ year: newYear, season: newSeason });
        navigate(`/season/${newYear}/${newSeason.toLowerCase()}`);
    };

    const handleYearClick = (year) => {
        setSelectedYear(year);
        setFadeClass('fade-out');
        setTimeout(() => {
            setFadeClass('fade-in');
            setShowSeasons(true);
        }, 100);
    };

    const handleSeasonClick = (season) => {
        if (selectedYear) {
            setCurrentSchedule({ year: selectedYear, season });
            setPopupVisible(false);
            setShowSeasons(false);
            navigate(`/season/${selectedYear}/${season.toLowerCase()}`);
        }
    };

    return (
        <>
            <div className="nav-bar">
                <div className="home-btn-wrapper">
                    <button
                        type="button"
                        className="home-btn"
                        onClick={resetApp}
                    >
                        Home
                        <br />
                        <small className="home-btn-desc-text">
                            (navigate back to current season)
                        </small>
                    </button>
                </div>

                <div className="season-nav-wrapper">
                    <div className="season-nav">
                        <button
                            type="button"
                            onClick={() => handleSeasonChange('prev')}
                        >
                            Previous Season
                        </button>
                        <button
                            type="button"
                            onClick={() => setPopupVisible(true)}
                        >
                            Select Season
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSeasonChange('next')}
                        >
                            Next Season
                        </button>
                    </div>
                </div>

                <div className="logout-btn-wrapper">
                    {currentUser ? (
                        <button
                            type="button"
                            onClick={logout}
                            className="logout-btn btn-danger"
                        >
                            Log out
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={signInWithGoogle}
                            className="btn btn-primary"
                        >
                            Sign in with Google
                        </button>
                    )}
                </div>
            </div>

            {popupVisible && (
                <div
                    className="popup-page-container"
                    onClick={(e) =>
                        e.target.className === 'popup-page-container' &&
                        setPopupVisible(false)
                    }
                >
                    <div className="popup">
                        <button
                            className="close-btn"
                            onClick={() => setPopupVisible(false)}
                        >
                            X
                        </button>
                        <div className="years-row">
                            {Array.from(
                                { length: 5 },
                                (_, i) => new Date().getFullYear() - 2 + i
                            ).map((y) => (
                                <button
                                    type="button"
                                    className="schedule-popup-buttons"
                                    key={y}
                                    onClick={() => handleYearClick(y)}
                                >
                                    {y}
                                </button>
                            ))}
                        </div>

                        {showSeasons && (
                            <div className={`seasons-row ${fadeClass}`}>
                                {['Winter', 'Spring', 'Summer', 'Fall'].map(
                                    (s) => (
                                        <button
                                            type="button"
                                            key={s}
                                            onClick={() => handleSeasonClick(s)}
                                        >
                                            {s}
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
