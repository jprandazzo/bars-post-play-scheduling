import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import React from 'react';

import { handleFilterCheckboxClick } from '../../../utils/filterUtils';

export const SportFilter = ({
    uniqueSportDaysOfWeek,
    userFilters,
    setUserFilters,
}) => {
    const sports = ['Bowling', 'Dodgeball', 'Kickball', 'Pickleball'];
    const wtnbOrCoedOptions = ['WTNB', 'Coed'];

    return (
        <th>
            <div className="sport-filter-container">
                <DropdownButton
                    variant="outline-primary"
                    id="dropdown-sport"
                    title="Sport"
                >
                    <div className="sport-filter-menu">
                        {/* SportDayOfWeek column */}
                        <div className="sport-filter-column">
                            {' '}
                            Day Of Week
                            {uniqueSportDaysOfWeek.map((dayOfWeek) => (
                                <Dropdown.Item
                                    key={dayOfWeek}
                                    as="div"
                                    onClick={(e) =>
                                        handleFilterCheckboxClick(
                                            e,
                                            'selectedSportDaysOfWeek',
                                            dayOfWeek,
                                            { setUserFilters }
                                        )
                                    }
                                >
                                    <Form.Check
                                        type="checkbox"
                                        label={dayOfWeek}
                                        checked={(
                                            userFilters.selectedSportDaysOfWeek ||
                                            []
                                        ).includes(dayOfWeek)}
                                    />
                                </Dropdown.Item>
                            ))}
                        </div>

                        {/* Sports column */}
                        <div className="sport-filter-column">
                            {' '}
                            Sport
                            {sports.map((sportName) => (
                                <Dropdown.Item
                                    key={sportName}
                                    as="div"
                                    onClick={(e) =>
                                        handleFilterCheckboxClick(
                                            e,
                                            'selectedSports',
                                            sportName,
                                            { setUserFilters }
                                        )
                                    }
                                >
                                    <Form.Check
                                        type="checkbox"
                                        label={sportName}
                                        checked={(
                                            userFilters.selectedSports || []
                                        ).includes(sportName)}
                                    />
                                </Dropdown.Item>
                            ))}
                        </div>

                        {/* WTNB or Coed column */}
                        <div className="sport-filter-column">
                            {' '}
                            WTNB or Coed
                            {wtnbOrCoedOptions.map((wtnbOrCoedOption) => (
                                <Dropdown.Item
                                    key={wtnbOrCoedOption}
                                    as="div"
                                    onClick={(e) =>
                                        handleFilterCheckboxClick(
                                            e,
                                            'selectedWtnbOrCoed',
                                            wtnbOrCoedOption,
                                            { setUserFilters }
                                        )
                                    }
                                >
                                    <Form.Check
                                        type="checkbox"
                                        label={wtnbOrCoedOption}
                                        checked={(
                                            userFilters.selectedWtnbOrCoed || []
                                        ).includes(wtnbOrCoedOption)}
                                    />
                                </Dropdown.Item>
                            ))}
                        </div>
                    </div>
                </DropdownButton>
            </div>
        </th>
    );
};
