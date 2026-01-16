// Service to fetch Indian States and Districts from CDN
// Source: https://github.com/sab99r/Indian-States-And-Districts

const API_URL = 'https://cdn.jsdelivr.net/gh/sab99r/Indian-States-And-Districts@master/states-and-districts.json';

let cachedData = null;

const fetchData = async () => {
    if (cachedData) return cachedData;
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        cachedData = data;
        return data; // Expected structure: { states: [ { state: "Name", districts: [...] }, ... ] }
    } catch (error) {
        console.error("Failed to fetch location data:", error);
        return null; // Return null to indicate failure
    }
};

export const getStates = async () => {
    const data = await fetchData();
    if (!data || !data.states) return null; // Return null on failure
    return data.states.map(s => s.state).sort();
};

export const getDistrictsByState = async (stateName) => {
    if (!stateName) return [];
    const data = await fetchData();
    if (!data || !data.states) return null; // Return null on failure

    const stateObj = data.states.find(s => s.state === stateName);
    return stateObj ? stateObj.districts.sort() : [];
};
