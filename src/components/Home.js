//not used because i'm using a simple html button - consider removing
import React from 'react';

export function Home({ setYear }) {
    const years = [2024, 2025, 2026];

    return (
        <div>
            <h1>What season are you looking for?</h1>
            {years.map((year) => (
                <button type="button" key={year} onClick={() => setYear(year)}>
                    {year}
                </button>
            ))}
        </div>
    );
}
