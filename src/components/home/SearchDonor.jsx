import { useState, useEffect } from 'react';
import { Search, MapPin, Droplet, User, Loader2, Calendar, Phone, CheckCircle2, AlertCircle, LandPlot } from 'lucide-react';
import Button from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { getStates, getDistrictsByState } from '../../lib/DistrictCityService';
import { cn } from '../../lib/utils';

const SearchDonor = () => {
    const [formData, setFormData] = useState({
        bloodGroup: '',
        state: '',
        district: ''
    });

    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loadingStates, setLoadingStates] = useState(true);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState(null);
    const [errors, setErrors] = useState({});

    // Initial Load: Get States
    useEffect(() => {
        const loadStates = async () => {
            const data = await getStates();
            setStates(data);
            setLoadingStates(false);
        };
        loadStates();
    }, []);

    // Handle State Change -> Load Districts
    useEffect(() => {
        if (formData.state) {
            setLoadingDistricts(true);
            setFormData(prev => ({ ...prev, district: '' })); // Reset district on state change
            const loadDistricts = async () => {
                const data = await getDistrictsByState(formData.state);
                setDistricts(data);
                setLoadingDistricts(false);
            };
            loadDistricts();
        } else {
            setDistricts([]);
            setFormData(prev => ({ ...prev, district: '' }));
        }
    }, [formData.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood Group is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.district) newErrors.district = 'District is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSearching(true);
        setResults(null);

        // Simulate Network Delay & Filtering
        setTimeout(() => {
            const storedDonors = JSON.parse(localStorage.getItem('donors') || '[]');

            // NOTE: We do NOT use mock data anymore if we want to rely on the "Become Donor" flow.
            // However, to ensure the user sees *something* if they haven't registered, we can keep a small fallback list
            // that matches realistic Indian data, or just rely on them creating a donor.
            // Let's add a few fallback-only items for demo if LocalStorage is empty.
            let allDonors = storedDonors;
            if (storedDonors.length === 0) {
                allDonors = [
                    { id: 901, fullName: 'Rahul Sharma', bloodGroup: 'O+', state: 'Delhi', district: 'New Delhi', city: 'Connaught Place', phone: '9876543210' },
                    { id: 902, fullName: 'Priya Patel', bloodGroup: 'B+', state: 'Gujarat', district: 'Ahmedabad', city: 'Maninagar', phone: '9876543211' },
                    // Context-aware mock: if user searches specific state, maybe show a dummy?
                    // Better to just show empty state to encourage registration loop.
                ];
            }

            const matches = allDonors.filter(donor => {
                // 1. Blood Group Match
                if (donor.bloodGroup !== formData.bloodGroup) return false;

                // 2. State Match
                if (donor.state !== formData.state) return false;

                // 3. District Match
                if (donor.district !== formData.district) return false;

                return true;
            });

            setResults(matches);
            setSearching(false);
        }, 1000);
    };

    return (
        <section className="py-24 relative z-20 min-h-screen bg-gray-50/50 dark:bg-[#050A09]">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-bold bg-linear-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-4"
                    >
                        Find a Life Saver
                    </motion.h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Search for eligible donors in your specific area.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="max-w-5xl mx-auto shadow-2xl border border-gray-100 dark:border-teal-900/30 bg-white/80 dark:bg-[#0A1815]/80 backdrop-blur-xl overflow-hidden rounded-3xl">
                        <div className="p-1 h-2 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-500 animate-gradient"></div>

                        <CardContent className="p-8 md:p-10">
                            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                                {/* Blood Group */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Blood Group <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <Droplet className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <select
                                            name="bloodGroup"
                                            value={formData.bloodGroup}
                                            onChange={handleChange}
                                            className={cn(
                                                "w-full h-12 pl-12 pr-4 rounded-xl border-2 bg-gray-50 dark:bg-[#0F1C1A] outline-none transition-all cursor-pointer appearance-none font-medium",
                                                errors.bloodGroup
                                                    ? "border-red-300 focus:border-red-500 text-red-900 dark:text-red-100"
                                                    : "border-gray-100 dark:border-teal-900/30 focus:border-emerald-500 dark:focus:border-teal-500 text-gray-900 dark:text-gray-100"
                                            )}
                                        >
                                            <option value="">Select Group</option>
                                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                        </select>
                                    </div>
                                    {errors.bloodGroup && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.bloodGroup}</p>}
                                </div>

                                {/* State (Indian States) */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">State <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <LandPlot className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            disabled={loadingStates}
                                            className={cn(
                                                "w-full h-12 pl-12 pr-4 rounded-xl border-2 bg-gray-50 dark:bg-[#0F1C1A] outline-none transition-all cursor-pointer appearance-none font-medium disabled:opacity-50",
                                                errors.state
                                                    ? "border-red-300 focus:border-red-500"
                                                    : "border-gray-100 dark:border-teal-900/30 focus:border-emerald-500 dark:focus:border-teal-500 text-gray-900 dark:text-gray-100"
                                            )}
                                        >
                                            <option value="">{loadingStates ? 'Loading...' : 'Select State'}</option>
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    {errors.state && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.state}</p>}
                                </div>

                                {/* District (Dynamic from State) */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">District <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <select
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            disabled={!formData.state || loadingDistricts}
                                            className={cn(
                                                "w-full h-12 pl-12 pr-4 rounded-xl border-2 bg-gray-50 dark:bg-[#0F1C1A] outline-none transition-all cursor-pointer appearance-none font-medium disabled:opacity-50",
                                                errors.district
                                                    ? "border-red-300 focus:border-red-500"
                                                    : "border-gray-100 dark:border-teal-900/30 focus:border-emerald-500 dark:focus:border-teal-500 text-gray-900 dark:text-gray-100"
                                            )}
                                        >
                                            <option value="">{loadingDistricts ? 'Loading...' : 'Select District'}</option>
                                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    {errors.district && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.district}</p>}
                                </div>


                            </form>

                            <div className="mt-10 flex justify-center">
                                <Button
                                    onClick={handleSearch}
                                    disabled={searching}
                                    className="h-14 px-12 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 dark:from-emerald-500 dark:to-teal-500 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all"
                                >
                                    {searching ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Search className="w-5 h-5 mr-2" />}
                                    {searching ? 'Finding Donors...' : 'Search Donors'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Results Section */}
                <div className="max-w-6xl mx-auto mt-16">
                    {results !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-full">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                Found <span className="text-emerald-600 dark:text-emerald-400">{results.length}</span> Eligible Donors
                            </h3>

                            {results.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {results.map((donor, idx) => (
                                        <motion.div
                                            key={donor.id || idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <Card className="h-full hover:shadow-2xl transition-all duration-300 dark:bg-[#0A1815] border border-gray-100 dark:border-teal-900/30 group">
                                                <CardContent className="p-0">
                                                    <div className="p-6">
                                                        <div className="flex justify-between items-start mb-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-lg">
                                                                    {donor.fullName.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">{donor.fullName}</h4>
                                                                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">ID: #{donor.donorId || donor.id}</span>
                                                                </div>
                                                            </div>
                                                            <div className="bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/50">
                                                                <span className="text-red-600 dark:text-red-400 font-black text-xl">{donor.bloodGroup}</span>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3 mb-6">
                                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                                <MapPin className="w-4 h-4 text-emerald-500" />
                                                                <span>{donor.city ? `${donor.city}, ` : ''}{donor.district}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                                <LandPlot className="w-4 h-4 text-emerald-500" />
                                                                <span>{donor.state}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                                <Phone className="w-4 h-4 text-emerald-500" />
                                                                <span>{donor.phone ? `+91 ${donor.phone}` : 'Contact Unavailable'}</span>
                                                            </div>
                                                        </div>

                                                        <Button className="w-full rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-emerald-600 dark:hover:bg-emerald-400 hover:text-white border-none shadow-lg">
                                                            <Phone className="w-4 h-4 mr-2" /> Call Now
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white dark:bg-[#0A1815] rounded-3xl border border-dashed border-gray-300 dark:border-teal-900/50">
                                    <div className="bg-gray-50 dark:bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Donors Found</h4>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                        We couldn't find any eligible donors in {formData.district} matching your criteria. Try expanding your search area or ensure you have registered as a donor.
                                    </p>
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
