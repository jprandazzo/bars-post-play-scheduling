import React, { useState } from "react";

import { getCurrentSeason } from "../../utils/seasonUtils/getCurrentSeason";

import './NavBar.css'

export const NavBar = ({ currentSchedule, setCurrentSchedule }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null); // Track selected year
  const [fadeClass, setFadeClass] = useState('fade-in'); // Control fade class
  const [showSeasons, setShowSeasons] = useState(false); // Track if seasons should be shown

  const resetApp = () => {
    setCurrentSchedule(getCurrentSeason());
  };
  // console.log('nav bar loaded')
  const handleSeasonChange = (direction) => {
    const seasonOrder = ['winter', 'spring', 'summer', 'fall'];
    const currentSeasonIndex = seasonOrder.indexOf(currentSchedule.season);
    // console.log(direction)
    // console.log(currentSeasonIndex)
    if (direction === 'prev') {
      if (currentSeasonIndex === 0) {
        setCurrentSchedule({ year: currentSchedule.year - 1, season: 'fall' });
      } else {
        setCurrentSchedule({ year: currentSchedule.year, season: seasonOrder[currentSeasonIndex - 1] });
      }
      // console.log(currentSchedule)
    } else if (direction === 'next') {
      if (currentSeasonIndex === 3) {
        setCurrentSchedule({ year: currentSchedule.year + 1, season: 'winter' });
      } else {
        setCurrentSchedule({ year: currentSchedule.year, season: seasonOrder[currentSeasonIndex + 1] });
      }
    }
  };
  
  

  const handlePopupClick = (e) => {
    if (e.target.className === 'popup-page-container') {
      setPopupVisible(false);
      setShowSeasons(false); // Hide seasons when the popup is closed
    }
  };

  const handleYearClick = (year) => {
    setSelectedYear(year); // Store selected year
    setFadeClass('fade-out'); // Trigger fade-out animation
    

    // After fade-out, show seasons and trigger fade-in
    setTimeout(() => {
      setFadeClass('fade-in');
      setShowSeasons(true);
    }, 100); // Adjust delay to match CSS transition
  };

  const handleSeasonClick = (season) => {
    if (selectedYear) {
      setCurrentSchedule({ year: selectedYear, season }); // Set year and season
      setPopupVisible(false); // Close the popup after selecting the season
      setShowSeasons(false); // Reset showSeasons for future interactions
    }
  };

  return (
    <>
      <div className="nav-bar">
        <div className='home-btn-wrapper'>
          <button type="button" className="home-btn" onClick={resetApp}>Home<br/>
          <small className="home-btn-desc-text">(navigate back to current season)</small></button>
        </div>
        
        <div className="season-nav-wrapper">
          <div className="season-nav">
            <button type="button" onClick={() => handleSeasonChange('prev')}>Previous Season</button>
            <button type="button" onClick={() => {
                setPopupVisible(true);
                setShowSeasons(false);
              }}
            >
              Select Season
            </button>
            <button type="button" onClick={() => handleSeasonChange('next')}>Next Season</button>
          </div>
        </div>
      </div>

      {popupVisible && (
        <div className="popup-page-container" onClick={handlePopupClick}>
          <div className="popup">
            <button className="close-btn" onClick={() => setPopupVisible(false)}>X</button>
            <div className="years-row">
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
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

            {/* Show seasons only when a year is selected */}
            {showSeasons && (
              <div className={`seasons-row ${fadeClass}`}>
                {['Winter', 'Spring', 'Summer', 'Fall'].map(s => (
                  <button type="button" key={s} onClick={() => handleSeasonClick(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
