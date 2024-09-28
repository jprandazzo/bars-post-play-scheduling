import React, { useState } from 'react';
import { Home } from './components/Home';
import { Seasons } from './components/Seasons';
import { MainTable } from './components/MainTable';

export const App = () => {
  const [year, setYear] = useState(null);
  const [season, setSeason] = useState(null);

  const resetApp = () => {
    setYear(null);
    setSeason(null);
  };

  return (
    <div>
      {year === null ? (
        <Home setYear={setYear} />
      ) : season === null ? (
        <Seasons year={year} setSeason={setSeason} />
      ) : (
        <MainTable year={year} season={season} resetApp={resetApp} />
      )}
    </div>
  );
};

export default App;
