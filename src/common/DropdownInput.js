import React, { } from 'react';
import { FormControl, Dropdown } from 'react-bootstrap';

export const DropdownInput = ({
  id,
  label,
  value,
  options,
  onChange,
  showDropdown,
  setShowDropdown,
  highlightedIndex,
  setHighlightedIndex,
  placeholder = '',
  maxWidth = '20em',
}) => {

  const handleKeyChangeInput = (e) => {
    if (e.key === 'ArrowDown') {
        if (!showDropdown) {
            setShowDropdown(true);
            onChange('');
            setHighlightedIndex(0);
        } else {
            setHighlightedIndex((prevIndex) =>
            prevIndex < options.length - 1 ? prevIndex + 1 : 0
            );
        }
    } else if (e.key === 'ArrowUp') {
        if (!showDropdown) {
            setShowDropdown(true);
            onChange('');
            setHighlightedIndex(0);
          } else {
            setHighlightedIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : options.length - 1
          )
        };
    } else if (e.key === 'Enter' && highlightedIndex !== -1) {
        onChange(options[highlightedIndex]);
        setShowDropdown(false);
    }
  };

  return (
    <div className="form-row">
      <label htmlFor={id}>{label}</label>
      <div>
        <FormControl
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyChangeInput}
          style={{ maxWidth }}
        />
        {showDropdown && options.length > 0 && (
          <Dropdown.Menu show className="dropdown-menu">
            {options.map((option, index) => (
              <Dropdown.Item
                key={option}
                onClick={() => {
                  onChange(option);
                  setShowDropdown(false);
                }}
                style={index === highlightedIndex ? { backgroundColor: "#89B8FC", color: "white" } : {}}
              >
                {option}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        )}
      </div>
    </div>
  );
};