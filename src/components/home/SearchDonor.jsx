import { Search, MapPin, Droplet, User, Loader2, Calendar, Phone, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Mock data to show if localStorage is empty
const initialMockDonors = [
    { id: 'mock1', fullName: 'Sarah Jenkins', bloodGroup: 'O+', location: 'New York, USA', phone: '555-0123', lastDonationDate: '2023-01-15' },
    { id: 'mock2', fullName: 'Mike Ross', bloodGroup: 'A-', location: 'London, UK', phone: '555-0199', lastDonationDate: '' },
    { id: 'mock3', fullName: 'Jessica Pearson', bloodGroup: 'AB+', location: 'Mumbai, India', phone: '555-0155', lastDonationDate: '2023-11-20' },
];

const SearchDonor = () => {
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        bloodGroup: '',
        location: '',
        gender: ''
    });
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        setHasSearched(true);

        // Simulate API delay
        setTimeout(() => {
            const storedDonors = JSON.parse(localStorage.getItem('donors') || '[]');
            const allDonors = [...initialMockDonors, ...storedDonors];

            const filtered = allDonors.filter(donor => {
                // 1. Blood Group Filter
                if (filters.bloodGroup && donor.bloodGroup !== filters.bloodGroup) return false;

                // 2. Location Filter (Partial match)
                if (filters.location && !donor.location.toLowerCase().includes(filters.location.toLowerCase()) && !donor.address?.toLowerCase().includes(filters.location.toLowerCase())) return false;

                // 3. Gender Filter
                if (filters.gender && donor.gender !== filters.gender) return false;

                // 4. Eligibility Filter (The "3 months" logic)
                // Logic: Eligible if NO last donation date OR last donation was > 90 days ago
                if (donor.lastDonationDate) {
                    const lastDate = new Date(donor.lastDonationDate);
                    const today = new Date();
                    const diffTime = Math.abs(today - lastDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays <= 90) return false; // Exclude if donated within last 3 months
                }

                return true;
            });

            setResults(filtered);
            setLoading(false);
        }, 1000);
    };

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <section className="py-20 relative z-20 -mt-10 min-h-screen">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="max-w-5xl mx-auto shadow-2xl border-2 border-emerald-100 dark:border-teal-900/50 bg-white dark:bg-[#022C22] overflow-hidden rounded-2xl mb-12">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <h2 className="relative z-10 text-2xl font-bold text-white flex items-center justify-center gap-2">
                                <Search className="w-6 h-6" /> Find a Blood Donor
                            </h2>
                            <p className="relative z-10 text-emerald-50 opacity-90 text-sm mt-2">
                                Search locally for eligible donors available right now.
                            </p>
                        </div>

                        <CardContent className="p-8">
                            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Blood Group */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 pl-1">Blood Group</label>
                                    <div className="relative group">
                                        <Droplet className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <select name="bloodGroup" value={filters.bloodGroup} onChange={handleChange} className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-gray-100 dark:border-teal-900/30 bg-gray-50 dark:bg-[#0A1815] text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-emerald-500 dark:focus:border-teal-500 transition-all cursor-pointer appearance-none">
                                            <option value="">Any Group</option>
                                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 pl-1">Location</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="text"
                                            name="location"
                                            value={filters.location}
                                            onChange={handleChange}
                                            placeholder="City or State"
                                            className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-gray-100 dark:border-teal-900/30 bg-gray-50 dark:bg-[#0A1815] text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-emerald-500 dark:focus:border-teal-500 transition-all placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Gender - Optional but good for mock filter matching */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 pl-1">Gender</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <select name="gender" value={filters.gender} onChange={handleChange} className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-gray-100 dark:border-teal-900/30 bg-gray-50 dark:bg-[#0A1815] text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-emerald-500 dark:focus:border-teal-500 transition-all cursor-pointer appearance-none">
                                            <option value="">Any</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-end">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-11 rounded-xl bg-gray-900 dark:bg-emerald-600 hover:bg-gray-800 dark:hover:bg-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search Eligible Donors'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Results Section */}
                <div className="max-w-6xl mx-auto">
                    {hasSearched && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                Found {results.length} Eligible Donors
                            </h3>

                            {results.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {results.map((donor, idx) => (
                                        <motion.div
                                            key={donor.id || idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <Card className="hover:shadow-xl transition-shadow dark:bg-[#0A1815] border-l-4 border-l-emerald-500">
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className="font-bold text-lg text-gray-900 dark:text-white">{donor.fullName}</h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                                                <MapPin className="w-3 h-3" /> {donor.location || donor.address}
                                                            </p>
                                                        </div>
                                                        <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-black text-xl px-3 py-1 rounded-lg">
                                                            {donor.bloodGroup}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-[#152320] p-2 rounded-md">
                                                        <Calendar className="w-4 h-4 text-emerald-500" />
                                                        <span>Last Donation: {donor.lastDonationDate || 'Never / Long ago'}</span>
                                                    </div>

                                                    <Button variant="outline" className="w-full border-emerald-200 dark:border-teal-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                                                        <Phone className="w-4 h-4 mr-2" /> Contact Donor
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white dark:bg-[#0A1815] rounded-2xl border border-dashed border-gray-300 dark:border-teal-900/50">
                                    <p className="text-gray-500 dark:text-gray-400">No eligible donors found matching your criteria.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SearchDonor;
