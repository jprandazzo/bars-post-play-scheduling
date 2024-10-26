export const eventLocations = {
    hkLocations: ['Dickens', 'Hardware', 'Boxers HK', 'Vers', 'Vice Versa'],
    wvLocations: ['Henrietta Hudson', 'Stonewall'],
    chelseaLocations: ['Gym Bar', 'Rebar', 'Barracuda', 'Boxers Chelsea'],
};

const eventLocationsMap = {
    'boxers hk': '#', // Add actual href link here
    hardware: '#',
    dickens: '#',
    vers: '#',
    'vice versa': '#',
    'henrietta hudson': '#',
    stonewall: '#',
    'gym bar': '#',
    rebar: '#',
    barracuda: '#',
    'boxers chelsea': '#',
};

export const getLocationLink = (location) => {
    const lowerCaseLocation = location.toLowerCase();

    if (eventLocationsMap[lowerCaseLocation]) {
        const href = eventLocationsMap[lowerCaseLocation];
        return `<a href="${href}" target="_blank">${location}</a>`;
    }

    return location;
};
