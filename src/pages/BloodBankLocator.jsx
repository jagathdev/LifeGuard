import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, Navigation, Droplet, Building2, Clock, Filter, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { fetchStatesAndDistricts, fetchDistrictsForState, fetchBloodBanks } from '../lib/BloodBankService';
import { cn } from '../lib/utils';

const BloodBankLocator = () => {
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [filters, setFilters] = useState({ state: '', district: '' });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiStatus, setApiStatus] = useState('idle'); // idle, loading, success, error
    const [searched, setSearched] = useState(false);

    // Initial Load: Get States from API
    useEffect(() => {
        const loadStates = async () => {
            const data = await fetchStatesAndDistricts();
            setStates(data);
        };
        loadStates();
    }, []);

    // Handle State Change -> Load Districts from API
    useEffect(() => {
        if (filters.state) {
            const loadDistricts = async () => {
                const data = await fetchDistrictsForState(filters.state);
                setDistricts(data);
                setFilters(prev => ({ ...prev, district: '' }));
            };
            loadDistricts();
        } else {
            setDistricts([]);
        }
    }, [filters.state]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!filters.state || !filters.district) return;

        setLoading(true);
        setSearched(true);
        setResults([]);
        setApiStatus('loading');

        try {
            const data = await fetchBloodBanks(filters.state, filters.district);
            setResults(data);
            setApiStatus('success');
        } catch (error) {
            console.error("Search failed:", error);
            setApiStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50';
            case 'Low': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/50';
            case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800/50';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#020A08] pt-20 transition-colors duration-300">
            {/* Hero Section */}
            <div className="bg-[#05110E] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020A08]"></div>

                <div className="container mx-auto px-4 py-20 md:py-28 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                            Live Blood Bank Tracker
                        </h1>
                        <p className="text-emerald-100/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                            Real-time blood stock availability across India. Locate government and private blood banks instantly.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="max-w-5xl mx-auto bg-white dark:bg-[#0A1815] p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3 border border-white/20 dark:border-teal-900/50 backdrop-blur-xl"
                    >
                        {/* State Dropdown */}
                        <div className="flex-1 bg-gray-50 dark:bg-[#152320] rounded-xl px-4 py-3 relative group focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                            <label className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 text-left">State</label>
                            <div className="flex items-center">
                                <Building2 className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 mr-2 transition-colors" />
                                <select
                                    className="w-full bg-transparent font-semibold text-gray-900 dark:text-gray-100 outline-none cursor-pointer appearance-none"
                                    value={filters.state}
                                    onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                                >
                                    <option value="" className="bg-white dark:bg-[#0A1815] text-gray-500">Select State</option>
                                    {states.map(s => <option key={s} value={s} className="bg-white dark:bg-[#0A1815] text-gray-900 dark:text-gray-100">{s}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* District Dropdown */}
                        <div className="flex-1 bg-gray-50 dark:bg-[#152320] rounded-xl px-4 py-3 relative group focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                            <label className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 text-left">District</label>
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 mr-2 transition-colors" />
                                <select
                                    className="w-full bg-transparent font-semibold text-gray-900 dark:text-gray-100 outline-none cursor-pointer appearance-none disabled:opacity-50"
                                    value={filters.district}
                                    onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                                    disabled={!filters.state}
                                >
                                    <option value="" className="bg-white dark:bg-[#0A1815] text-gray-500">Select District</option>
                                    {districts.map(d => <option key={d} value={d} className="bg-white dark:bg-[#0A1815] text-gray-900 dark:text-gray-100">{d}</option>)}
                                </select>
                            </div>
                        </div>

                        <Button
                            onClick={handleSearch}
                            disabled={loading || !filters.state || !filters.district}
                            className="h-auto py-4 md:py-0 px-8 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/30 md:w-auto w-full transition-all active:scale-95"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Find Blood Banks'}
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Results Section */}
            <div className="container mx-auto px-4 py-16">
                {searched && !loading && results.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 max-w-lg mx-auto"
                    >
                        <div className="bg-gray-100 dark:bg-[#0A1815] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200 dark:border-teal-900/50">
                            <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Blood Banks Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                            We couldn't locate any blood banks in <strong>{filters.district}, {filters.state}</strong> at the moment. Try searching for a nearby major city.
                        </p>
                    </motion.div>
                )}

                {results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 text-sm py-1 px-3 rounded-full border border-emerald-200 dark:border-emerald-800">
                                    {results.length} Results
                                </span>
                                in {filters.district}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {results.map((bank, index) => (
                                <motion.div
                                    key={bank.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="overflow-hidden border border-gray-100 dark:border-teal-900/30 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 dark:bg-[#0A1815] shadow-xl hover:shadow-2xl group rounded-2xl">
                                        <div className="flex flex-col lg:flex-row h-full">
                                            {/* Left Info Panel */}
                                            <div className="p-8 lg:w-[35%] bg-gray-50/80 dark:bg-[#06110E] flex flex-col relative">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>

                                                <div className="mb-6">
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                            {bank.type}
                                                        </span>
                                                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
                                                            Verified
                                                        </span>
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                        {bank.name}
                                                    </h3>
                                                </div>

                                                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400 grow">
                                                    <div className="flex items-start gap-3">
                                                        <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                                        <span className="leading-relaxed">{bank.address}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                                                        <span className="font-mono font-medium tracking-wide">{bank.phone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Clock className="w-5 h-5 text-emerald-500 shrink-0" />
                                                        <span className={bank.timing === '24/7' ? 'text-green-600 dark:text-green-400 font-bold' : ''}>
                                                            {bank.timing}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-8 flex gap-3 flex-col sm:flex-row">
                                                    <Button className="flex-1 bg-gray-900 dark:bg-emerald-600 dark:text-white hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-lg">
                                                        <Phone className="w-4 h-4 mr-2" /> Call Now
                                                    </Button>
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${bank.latitude},${bank.longitude}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1"
                                                    >
                                                        <Button variant="outline" className="w-full border-gray-200 dark:border-teal-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-emerald-100">
                                                            <Navigation className="w-4 h-4 mr-2 text-emerald-600" /> Map
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Right Stock Panel */}
                                            <div className="p-8 lg:w-[65%] bg-white dark:bg-[#0A1815]">
                                                <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-teal-900/30 pb-4">
                                                    <h4 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                                                        <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                                            <Droplet className="w-5 h-5 text-red-600 dark:text-red-500 fill-red-600 dark:fill-red-500" />
                                                        </div>
                                                        Real-Time Blood Inventory
                                                    </h4>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full animate-pulse">
                                                        Live Updates
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                    {bank.stock && Object.entries(bank.stock).map(([group, details]) => (
                                                        <div
                                                            key={group}
                                                            className={cn(
                                                                "p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-200 hover:scale-105 hover:shadow-lg",
                                                                getStatusColor(details.status)
                                                            )}
                                                        >
                                                            <div className="text-3xl font-black mb-1 opacity-90">{group}</div>
                                                            <div className="text-sm font-bold mb-1">{details.units} Units</div>
                                                            <div className="text-[10px] uppercase tracking-widest font-bold opacity-75">{details.status}</div>
                                                        </div>
                                                    ))}

                                                    {(!bank.stock) && (
                                                        <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 dark:bg-[#0F1C1A] rounded-xl border border-dashed border-gray-200 dark:border-teal-900/50">
                                                            Stock data currently unavailable
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BloodBankLocator;
