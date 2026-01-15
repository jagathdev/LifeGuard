// Blood Bank Service with API Integration and Fallback
// APIs:
// 1. States/Districts: https://cdn.jsdelivr.net/npm/india-state-district-json@1.0.0/india_state_district.json
// 2. Blood Banks: https://bloodbankdata.s3.ap-south-1.amazonaws.com/blood_banks.json
// 3. Blood Stock: https://bloodbankdata.s3.ap-south-1.amazonaws.com/blood_stock.json

const API_STATES = 'https://cdn.jsdelivr.net/npm/india-state-district-json@1.0.0/india_state_district.json';
const API_BANKS = 'https://bloodbankdata.s3.ap-south-1.amazonaws.com/blood_banks.json';
const API_STOCK = 'https://bloodbankdata.s3.ap-south-1.amazonaws.com/blood_stock.json';

// --- MOCK DATA FALLBACK (Used if APIs fail) ---
const MOCK_BLOOD_BANKS = {
    'Tamil Nadu': {
        'Chennai': [
            {
                id: 1,
                name: 'Rajiv Gandhi Government General Hospital',
                type: 'Government',
                address: 'Poonamallee High Road, Park Town, Chennai',
                phone: '044-25305000',
                latitude: 13.0827,
                longitude: 80.2707,
                timing: '24/7',
                stock: {
                    'A+': { units: 15, status: 'Available' },
                    'A-': { units: 2, status: 'Low' },
                    'B+': { units: 28, status: 'Available' },
                    'B-': { units: 5, status: 'Low' },
                    'O+': { units: 45, status: 'Available' },
                    'O-': { units: 0, status: 'Critical' },
                    'AB+': { units: 12, status: 'Available' },
                    'AB-': { units: 1, status: 'Critical' },
                }
            },
            {
                id: 2,
                name: 'Apollo Hospitals Blood Centre',
                type: 'Private',
                address: 'Greams Lane, 21, Greams Rd, Thousand Lights, Chennai',
                phone: '044-28290200',
                latitude: 13.0405,
                longitude: 80.2505,
                timing: '24/7',
                stock: {
                    'A+': { units: 35, status: 'Available' },
                    'A-': { units: 8, status: 'Available' },
                    'B+': { units: 42, status: 'Available' },
                    'B-': { units: 12, status: 'Available' },
                    'O+': { units: 50, status: 'Available' },
                    'O-': { units: 4, status: 'Low' },
                    'AB+': { units: 20, status: 'Available' },
                    'AB-': { units: 3, status: 'Low' },
                }
            },
            {
                id: 3,
                name: 'Rotary Central TTK Voluntary Blood Bank',
                type: 'Charitable',
                address: 'VHS Campus, Taramani, Chennai',
                phone: '044-22542031',
                latitude: 12.9866,
                longitude: 80.2427,
                timing: '9:00 AM - 6:00 PM',
                stock: {
                    'A+': { units: 5, status: 'Low' },
                    'A-': { units: 0, status: 'Critical' },
                    'B+': { units: 12, status: 'Available' },
                    'B-': { units: 2, status: 'Low' },
                    'O+': { units: 15, status: 'Available' },
                    'O-': { units: 1, status: 'Critical' },
                    'AB+': { units: 8, status: 'Available' },
                    'AB-': { units: 0, status: 'Critical' },
                }
            }
        ],
        'Coimbatore': [
            {
                id: 4,
                name: 'Coimbatore Medical College Hospital',
                type: 'Government',
                address: 'Trichy Road, Coimbatore',
                phone: '0422-2301393',
                latitude: 10.9980,
                longitude: 76.9660,
                timing: '24/7',
                stock: {
                    'A+': { units: 22, status: 'Available' },
                    'B+': { units: 18, status: 'Available' },
                    'O+': { units: 30, status: 'Available' },
                    'O-': { units: 3, status: 'Low' },
                }
            }
        ]
    },
    'Maharashtra': {
        'Mumbai': [
            {
                id: 5,
                name: 'KEM Hospital Blood Bank',
                type: 'Government',
                address: 'Acharya Donde Marg, Parel, Mumbai',
                phone: '022-24107000',
                latitude: 19.0028,
                longitude: 72.8415,
                timing: '24/7',
                stock: {
                    'A+': { units: 50, status: 'Available' },
                    'O+': { units: 65, status: 'Available' },
                    'AB+': { units: 15, status: 'Available' },
                    'B-': { units: 2, status: 'Critical' },
                }
            },
            {
                id: 6,
                name: 'Lilavati Hospital Blood Centre',
                type: 'Private',
                address: 'Bandra West, Mumbai',
                phone: '022-26751000',
                latitude: 19.0514,
                longitude: 72.8277,
                timing: '24/7',
                stock: {
                    'A+': { units: 25, status: 'Available' },
                    'B+': { units: 30, status: 'Available' },
                    'O-': { units: 8, status: 'Available' },
                }
            }
        ]
    },
    'Karnataka': {
        'Bangalore': [
            {
                id: 7,
                name: 'Rashtrotthana Blood Bank',
                type: 'Charitable',
                address: 'Kempe Gowda Nagar, Bangalore',
                phone: '080-26612730',
                latitude: 12.9560,
                longitude: 77.5740,
                timing: '24/7',
                stock: {
                    'O+': { units: 100, status: 'Available' },
                    'A+': { units: 80, status: 'Available' },
                    'B+': { units: 85, status: 'Available' },
                }
            }
        ]
    },
    'Delhi': {
        'New Delhi': [
            {
                id: 8,
                name: 'AIIMS Blood Bank',
                type: 'Government',
                address: 'Ansari Nagar, New Delhi',
                phone: '011-26594400',
                latitude: 28.5672,
                longitude: 77.2100,
                timing: '24/7',
                stock: {
                    'A+': { units: 45, status: 'Available' },
                    'AB+': { units: 20, status: 'Available' },
                    'O-': { units: 12, status: 'Available' },
                }
            }
        ]
    }
};

export const fetchStatesAndDistricts = async () => {
    try {
        const response = await fetch(API_STATES);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        // API format is typically { "StateName": ["District1", "District2"], ... }
        // Adapt if necessary
        return Object.keys(data).sort();
    } catch (error) {
        console.warn('Using Local Data for States (API failed)', error);
        // Fallback to locally stored keys from mock + basic others
        return Object.keys(MOCK_BLOOD_BANKS).sort();
    }
};

export const fetchDistrictsForState = async (state) => {
    try {
        const response = await fetch(API_STATES);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        return data[state] ? data[state].sort() : [];
    } catch (error) {
        console.warn('Using Local Data for Districts (API failed)', error);
        return MOCK_BLOOD_BANKS[state] ? Object.keys(MOCK_BLOOD_BANKS[state]) : [];
    }
};

export const fetchBloodBanks = async (state, district) => {
    // 1. Try Fetching Real Data
    try {
        const [banksRes, stockRes] = await Promise.all([
            fetch(API_BANKS),
            fetch(API_STOCK)
        ]);

        if (!banksRes.ok || !stockRes.ok) throw new Error('Blood Bank API Error');

        const banks = await banksRes.json();
        const stocks = await stockRes.json();

        // 2. Filter & Merge
        // Assuming banks have 'state', 'district', 'id' and stock has 'bank_id' or matches by name
        const filteredBanks = banks.filter(bank =>
            bank.state.toLowerCase() === state.toLowerCase() &&
            bank.district.toLowerCase() === district.toLowerCase()
        );

        return filteredBanks.map(bank => {
            const stockInfo = stocks.find(s => s.bank_id === bank.id) || {};
            // Determine status color based on stock
            const formatStock = (units) => {
                if (units > 10) return { units, status: 'Available' };
                if (units > 0) return { units, status: 'Low' };
                return { units: 0, status: 'Critical' };
            };

            return {
                id: bank.id,
                name: bank.name,
                type: bank.type || 'Hospital',
                address: bank.address,
                phone: bank.phone,
                latitude: bank.latitude,
                longitude: bank.longitude,
                timing: bank.timing || '24/7',
                stock: {
                    'A+': formatStock(stockInfo.A_pos || 0),
                    'A-': formatStock(stockInfo.A_neg || 0),
                    'B+': formatStock(stockInfo.B_pos || 0),
                    'B-': formatStock(stockInfo.B_neg || 0),
                    'O+': formatStock(stockInfo.O_pos || 0),
                    'O-': formatStock(stockInfo.O_neg || 0),
                    'AB+': formatStock(stockInfo.AB_pos || 0),
                    'AB-': formatStock(stockInfo.AB_neg || 0),
                }
            };
        });

    } catch (error) {
        console.warn('Using Mock Data for Blood Banks (API failed or unavailable)', error);

        // 3. Fallback to Mock Data
        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 800));

        if (MOCK_BLOOD_BANKS[state] && MOCK_BLOOD_BANKS[state][district]) {
            return MOCK_BLOOD_BANKS[state][district];
        }
        return [];
    }
};
