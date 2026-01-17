import { useState, useEffect } from 'react';
import { Search, MapPin, Droplet, User, Loader2, Calendar, Phone, CheckCircle2, AlertCircle, LandPlot, Plus, X } from 'lucide-react';
import Button from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { getStates, getDistrictsByState } from '../../lib/DistrictCityService';
import { cn } from '../../lib/utils';
import { externalDonors } from '../../data/externalDonors';
import { useToast } from '../../context/ToastContext';

const SearchDonor = () => {
    const { addToast } = useToast();

    // --- Search Form State ---
    const [formData, setFormData] = useState({
        bloodGroup: '',
        state: '',
        district: '',
        city: '' // Added City
    });

    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loadingStates, setLoadingStates] = useState(true);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState(null);
    const [errors, setErrors] = useState({});

    // --- Add Donor Form State ---
    const [showAddDonor, setShowAddDonor] = useState(false);
    const [newDonor, setNewDonor] = useState({
        fullName: '',
        phone: '',
        bloodGroup: '',
        state: '',
        district: '',
        city: ''
    });
    const [newDonorDistricts, setNewDonorDistricts] = useState([]);

    // --- Initial Load ---
    useEffect(() => {
        const loadStates = async () => {
            const data = await getStates();
            if (data) setStates(data);
            setLoadingStates(false);
        };
        loadStates();
    }, []);

    // --- Handle Search Form Changes ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Load districts if state changes
        if (name === 'state') {
            if (value) {
                setLoadingDistricts(true);
                setFormData(prev => ({ ...prev, district: '' }));
                getDistrictsByState(value).then(data => {
                    setDistricts(data || []);
                    setLoadingDistricts(false);
                });
            } else {
                setDistricts([]);
                setFormData(prev => ({ ...prev, district: '' }));
            }
        }

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // --- Handle Add Donor Form Changes ---
    const handleNewDonorChange = (e) => {
        const { name, value } = e.target;
        setNewDonor(prev => ({ ...prev, [name]: value }));

        if (name === 'state') {
            if (value) {
                getDistrictsByState(value).then(data => setNewDonorDistricts(data || []));
            } else {
                setNewDonorDistricts([]);
            }
        }
    };

    const validateSearch = () => {
        const newErrors = {};
        if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood Group is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.district) newErrors.district = 'District is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!validateSearch()) return;

        setSearching(true);
        setResults(null);

        setTimeout(() => {
            // 1. Fetch Local Donors
            const localDonors = JSON.parse(localStorage.getItem('donors') || '[]');

            // 2. Fetch External Donors (Simulated API)
            // In a real app, this would be await fetch('/api/donors')
            const apiDonors = externalDonors;

            // 3. Merge & Deduplicate (by phone number)
            const allDonors = [...localDonors, ...apiDonors];
            const uniqueDonors = Array.from(new Map(allDonors.map(item => [item.phone, item])).values());

            // 4. Filter
            const matches = uniqueDonors.filter(donor => {
                // Blood Group Match
                if (donor.bloodGroup !== formData.bloodGroup) return false;

                // State Match (Case insensitive check strictly speaking, but dropdowns are uniform)
                if (donor.state !== formData.state) return false;

                // District Match
                if (donor.district !== formData.district) return false;

                // City Match (Optional - Case insensitive partial match)
                if (formData.city && donor.city) {
                    if (!donor.city.toLowerCase().includes(formData.city.toLowerCase())) {
                        return false;
                    }
                }

                return true;
            });

            setResults(matches);
            setSearching(false);
        }, 800);
    };

    const handleAddDonorSubmit = (e) => {
        e.preventDefault();
        // Basic Validation
        if (!newDonor.fullName || !newDonor.phone || !newDonor.bloodGroup || !newDonor.state || !newDonor.district) {
            addToast('Please fill all required fields to add a donor.', 'error');
            return;
        }

        // Save to LocalStorage
        const storedDonors = JSON.parse(localStorage.getItem('donors') || '[]');
        const newId = `local_${Date.now()}`;
        const donorToAdd = { ...newDonor, id: newId };

        storedDonors.push(donorToAdd);
        localStorage.setItem('donors', JSON.stringify(storedDonors));

        // Reset & Notify
        addToast('Donor added successfully! You can now search for them.', 'success');
        setNewDonor({ fullName: '', phone: '', bloodGroup: '', state: '', district: '', city: '' });
        setShowAddDonor(false);

        // Optional: If current search criteria matches new donor, refresh results?
        // User asked to "Instantly update UI" -> Re-trigger search if criteria matches
        if (results &&
            newDonor.bloodGroup === formData.bloodGroup &&
            newDonor.state === formData.state &&
            newDonor.district === formData.district) {
            setResults(prev => [...prev, donorToAdd]);
        }
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

                {/* Search Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="max-w-5xl mx-auto shadow-2xl border border-gray-100 dark:border-teal-900/30 bg-white/80 dark:bg-[#0A1815]/80 backdrop-blur-xl overflow-hidden rounded-3xl z-30 relative">
                        <div className="p-1 h-2 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-500 animate-gradient"></div>

                        <CardContent className="p-8 md:p-10">
                            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

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
                                                errors.bloodGroup ? "border-red-300 focus:border-red-500" : "border-gray-100 dark:border-teal-900/30 focus:border-emerald-500"
                                            )}
                                        >
                                            <option value="">Select Group</option>
                                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                        </select>
                                    </div>
                                    {errors.bloodGroup && <p className="text-xs text-red-500 ml-1">{errors.bloodGroup}</p>}
                                </div>

                                {/* State */}
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
                                                errors.state ? "border-red-300 focus:border-red-500" : "border-gray-100 dark:border-teal-900/30 focus:border-emerald-500"
                                            )}
                                        >
                                            <option value="">{loadingStates ? 'Loading...' : 'Select State'}</option>
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    {errors.state && <p className="text-xs text-red-500 ml-1">{errors.state}</p>}
                                </div>

                                {/* District */}
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
                                                errors.district ? "border-red-300 focus:border-red-500" : "border-gray-100 dark:border-teal-900/30 focus:border-emerald-500"
                                            )}
                                        >
                                            <option value="">{loadingDistricts ? 'Loading...' : 'Select District'}</option>
                                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    {errors.district && <p className="text-xs text-red-500 ml-1">{errors.district}</p>}
                                </div>

                                {/* City (Optional) */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">City <span className="text-xs text-gray-400 font-normal">(Optional)</span></label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Enter City / Area"
                                            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-gray-100 dark:border-teal-900/30 bg-gray-50 dark:bg-[#0F1C1A] outline-none focus:border-emerald-500 transition-all font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Search Button - Spans full width on mobile, 4 columns on large */}
                                <div className="lg:col-span-4 flex justify-center mt-4">
                                    <Button
                                        onClick={handleSearch}
                                        disabled={searching}
                                        className="h-14 px-12 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 dark:from-emerald-500 dark:to-teal-500 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all"
                                    >
                                        {searching ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Search className="w-5 h-5 mr-2" />}
                                        {searching ? 'Finding Donors...' : 'Search Donors'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Add Donor Toggle */}
                    <div className="text-center mt-6">
                        <button
                            onClick={() => setShowAddDonor(!showAddDonor)}
                            className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center justify-center gap-2 mx-auto text-sm"
                        >
                            {showAddDonor ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {showAddDonor ? 'Cancel Adding Donor' : 'Not finding anyone? Add a donor manually'}
                        </button>
                    </div>

                    {/* Add Donor Form (Collapsible) */}
                    <AnimatePresence>
                        {showAddDonor && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden max-w-2xl mx-auto mt-4"
                            >
                                <Card className="border border-gray-100 dark:border-teal-900/30 bg-white/50 dark:bg-[#0A1815]/50 backdrop-blur-md rounded-2xl">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New Donor</h3>
                                        <form onSubmit={handleAddDonorSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input required name="fullName" value={newDonor.fullName} onChange={handleNewDonorChange} placeholder="Full Name" className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0F1C1A]" />
                                                <input required name="phone" value={newDonor.phone} onChange={handleNewDonorChange} placeholder="Phone Number" className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0F1C1A]" />
                                                <select required name="bloodGroup" value={newDonor.bloodGroup} onChange={handleNewDonorChange} className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0F1C1A]">
                                                    <option value="">Select Blood Group</option>
                                                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                                </select>
                                                <select required name="state" value={newDonor.state} onChange={handleNewDonorChange} className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0F1C1A]">
                                                    <option value="">Select State</option>
                                                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                <select required name="district" value={newDonor.district} onChange={handleNewDonorChange} disabled={!newDonor.state} className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0F1C1A]">
                                                    <option value="">Select District</option>
                                                    {newDonorDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                                <input name="city" value={newDonor.city} onChange={handleNewDonorChange} placeholder="City / Area" className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0F1C1A]" />
                                            </div>
                                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Add Donor</Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
                                    {results.map((donor, idx) => {
                                        const donorName = donor.fullName || donor.name || 'Donor';
                                        return (
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
                                                                        {donorName.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">{donorName}</h4>
                                                                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">ID: #{donor.id}</span>
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
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white dark:bg-[#0A1815] rounded-3xl border border-dashed border-gray-300 dark:border-teal-900/50">
                                    <div className="bg-gray-50 dark:bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Donors Found</h4>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                        We couldn't find any eligible donors in {formData.district} matching your criteria. Try expanding your search area or add a donor manually.
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
