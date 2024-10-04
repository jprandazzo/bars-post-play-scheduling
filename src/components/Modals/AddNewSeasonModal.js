import React from 'react';
import Modal from 'react-modal';

export const AddNewSeasonModal = ({ isSeasonModalOpen, setSeasonModalOpen, newSeason = {}, setNewSeason, handleAddNewSeason, setAllEvents, setIsEventModalOpen }) => {
  return (
    <Modal isOpen={isSeasonModalOpen} onRequestClose={() => setSeasonModalOpen(false)}>
      <h2>Add New Season</h2>

      <input
        type="text"
        placeholder="Sport"
        value={newSeason?.sport || ''}  // Fallback to empty string if undefined
        onChange={(e) => setNewSeason({ ...newSeason, sport: e.target.value })}
      />

      <input
        type="text"
        placeholder="Day of Week"
        value={newSeason?.dayOfWeek || ''}  // Fallback to empty string if undefined
        onChange={(e) => setNewSeason({ ...newSeason, dayOfWeek: e.target.value })}
      />

      <input
        type="text"
        placeholder="WTNB or Coed"
        value={newSeason?.wtnbOrCoed || ''}  // Fallback to empty string if undefined
        onChange={(e) => setNewSeason({ ...newSeason, wtnbOrCoed: e.target.value })}
      />

      <input
        type="date"
        placeholder="Start Date"
        value={newSeason?.startDate || ''}  // Fallback to empty string if undefined
        onChange={(e) => setNewSeason({ ...newSeason, startDate: e.target.value })}
      />

      <input
        type="number"
        placeholder="Number of Weeks"
        value={newSeason?.weeks || 0}  // Fallback to 0 if undefined
        onChange={(e) => setNewSeason({ ...newSeason, weeks: e.target.value })}
      />

      <label>
        <input
          type="checkbox"
          checked={newSeason?.openingParty || false}  // Fallback to false if undefined
          onChange={(e) => setNewSeason({ ...newSeason, openingParty: e.target.checked })}
        />
        Opening Party
      </label>

      <label>
        <input
          type="checkbox"
          checked={newSeason?.closingParty || false}  // Fallback to false if undefined
          onChange={(e) => setNewSeason({ ...newSeason, closingParty: e.target.checked })}
        />
        Closing Party
      </label>

      <button type ="button" onClick={() => handleAddNewSeason(newSeason, setAllEvents, setSeasonModalOpen, setIsEventModalOpen)}>Add Season</button>
      <button type="button" onClick={() => setSeasonModalOpen(false)}>Cancel</button>
    </Modal>
  );
};
