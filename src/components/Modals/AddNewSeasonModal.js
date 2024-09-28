import React from 'react';
import Modal from 'react-modal';

export const AddNewSeasonModal = ({ isSeasonModalOpen, setSeasonModalOpen, newSeason, setNewSeason, handleAddNewSeason, setAllRecords, setEventModalOpen }) => {
  return (
    <Modal isOpen={isSeasonModalOpen} onRequestClose={() => setSeasonModalOpen(false)}>
      <h2>Add New Season</h2>

      <input
        type="text"
        placeholder="Sport"
        value={newSeason.sport}
        onChange={(e) => setNewSeason({ ...newSeason, sport: e.target.value })}
      />

      <input
        type="text"
        placeholder="Day of Week"
        value={newSeason.dayOfWeek}
        onChange={(e) => setNewSeason({ ...newSeason, dayOfWeek: e.target.value })}
      />

      <input
        type="text"
        placeholder="WTNB or Coed"
        value={newSeason.wtnbOrCoed}
        onChange={(e) => setNewSeason({ ...newSeason, wtnbOrCoed: e.target.value })}
      />

      <input
        type="date"
        placeholder="Start Date"
        value={newSeason.startDate}
        onChange={(e) => setNewSeason({ ...newSeason, startDate: e.target.value })}
      />

      <input
        type="number"
        placeholder="Number of Weeks"
        value={newSeason.weeks}
        onChange={(e) => setNewSeason({ ...newSeason, weeks: e.target.value })}
      />

      <label>
        <input
          type="checkbox"
          checked={newSeason.openingParty}
          onChange={(e) => setNewSeason({ ...newSeason, openingParty: e.target.checked })}
        />
        Opening Party
      </label>

      <label>
        <input
          type="checkbox"
          checked={newSeason.closingParty}
          onChange={(e) => setNewSeason({ ...newSeason, closingParty: e.target.checked })}
        />
        Closing Party
      </label>

      <button onClick={() => handleAddNewSeason(newSeason, setAllRecords, setSeasonModalOpen, setEventModalOpen)}>Add Season</button>
      <button onClick={() => setSeasonModalOpen(false)}>Cancel</button>
    </Modal>
  );
};
