import React from 'react';

export function Seasons({ year, setSeason }) {
  const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];

  return (
    <div>
      <h2>{`Select a season for ${year}`}</h2>
      {seasons.map((season) => (
        <button key={season} onClick={() => setSeason(season)}>
          {season}
        </button>
      ))}
    </div>
  );
}
