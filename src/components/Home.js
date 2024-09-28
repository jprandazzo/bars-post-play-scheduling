import React from 'react';

export function Home({ setYear }) {
  const years = [2024, 2025, 2026]; // More years can be added

  return (
    <div>
      <h1>What season are you looking for?</h1>
      {years.map((year) => (
        <button key={year} onClick={() => setYear(year)}>
          {year}
        </button>
      ))}
    </div>
  );
}
