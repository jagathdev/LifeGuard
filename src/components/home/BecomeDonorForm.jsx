import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Check, X, Shield, Calendar, CheckCircle2, MapPin, Droplet, Building2, LandPlot } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getStates, getDistrictsByState } from '../../lib/DistrictCityService';

// Custom Floating Label Input Component
const FloatingInput = ({ label, icon: Icon, error, className, ...props }) => {
    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <input
                    {...props}
                    placeholder=" "
                    className={`peer w-full h-14 pl-12 pr-4 rounded-xl border-2 bg-transparent transition-all outline-none 
                        ${error
                            ? 'border-red-500 text-red-900 dark:text-red-100 focus:border-red-500'
                            : 'border-gray-200 dark:border-teal-900/50 text-gray-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-500'
                        }
                        placeholder-transparent
                    `}
                />
                <label className={`absolute left-12 top-[18px] text-gray-500 dark:text-gray-400 text-base transition-all duration-200 pointer-events-none
                    peer-placeholder-shown:text-base peer-placeholder-shown:top-[18px]
                    peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:dark:bg-[#0A1210] peer-focus:px-2 peer-focus:text-emerald-600
                    peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:dark:bg-[#0A1210] peer-[:not(:placeholder-shown)]:px-2
                    ${error ? 'text-red-500 peer-focus:text-red-500' : ''}
                `}>
                    {label}
                </label>
                {Icon && (
                    <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200
                        ${error ? 'text-red-500' : 'text-gray-400 peer-focus:text-emerald-600'}
                    `} />
                )}
            </div>
            {error && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{error}</p>}
        </div>
    );
};

const BecomeDonorForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        bloodGroup: '',
        lastDonationDate: '',
        state: '',
        district: '',
        city: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });

    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loadingStates, setLoadingStates] = useState(true);
    const [loadingDistricts, setLoadingDistricts] = useState(false);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showLegalModal, setShowLegalModal] = useState(false);
    const [donorId, setDonorId] = useState('');

    // Load States on Mount
    useEffect(() => {
        const loadStates = async () => {
            const data = await getStates();
            setStates(data);
            setLoadingStates(false);
        };
        loadStates();
    }, []);

    // Load Districts when State changes
    useEffect(() => {
        if (formData.state) {
            setLoadingDistricts(true);
            const loadDistricts = async () => {
                const data = await getDistrictsByState(formData.state);
                setDistricts(data);
                setLoadingDistricts(false);
            };
            loadDistricts();
        } else {
            setDistricts([]);
        }
    }, [formData.state]);

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid Email Address";
        if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";
        if (!formData.bloodGroup) newErrors.bloodGroup = "Select a Blood Group";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.district) newErrors.district = "District is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (formData.password.length < 6) newErrors.password = "Min 6 characters required";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        // Date is optional, but if provided, check logic
        if (formData.lastDonationDate) {
            if (new Date(formData.lastDonationDate) > new Date()) {
                newErrors.lastDonationDate = "Date cannot be in the future";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            window.alert("Please fix the errors in the form.");
            return;
        }

        setIsSubmitting(true);

        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate Donor ID
        const generatedId = `DNR-${Math.floor(1000 + Math.random() * 9000)}`;
        setDonorId(generatedId);

        // Save Data excluding passwords and terms
        const { password, confirmPassword, agreeToTerms, ...donorData } = formData;
        const existingDonors = JSON.parse(localStorage.getItem('donors') || '[]');
        const newDonor = {
            id: Date.now(),
            donorId: generatedId,
            ...donorData,
            registeredAt: new Date().toISOString()
        };
        localStorage.setItem('donors', JSON.stringify([...existingDonors, newDonor]));

        setIsSubmitting(false);
        setShowSuccess(true);
    };

    return (
        <div className="min-h-screen pt-28 pb-20 flex justify-center items-center px-4 bg-gray-50 dark:bg-[#020A08] transition-colors duration-300">
            <div className="w-full max-w-4xl bg-white dark:bg-[#0A1210] rounded-3xl shadow-2xl border border-gray-100 dark:border-teal-900/30 overflow-hidden relative">

                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="p-8 md:p-12 relative z-10">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Become a Donor</h1>
                        <p className="text-gray-500 dark:text-gray-400">Join our community of heroes and save lives.</p>
                    </div>


                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FloatingInput name="fullName" label="Full Name" icon={User} value={formData.fullName} onChange={handleChange} error={errors.fullName} />
                            <FloatingInput name="email" label="Email Address" icon={Mail} value={formData.email} onChange={handleChange} error={errors.email} />
                        </div>

                        {/* Phone & Blood Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FloatingInput name="phone" label="Phone Number" icon={Phone} value={formData.phone} onChange={handleChange} error={errors.phone} />

                            {/* Custom Select for Blood Group */}
                            <div className="relative">
                                <div className="relative">
                                    <select
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleChange}
                                        className={`peer w-full h-14 pl-12 pr-4 rounded-xl border-2 bg-transparent transition-all outline-none appearance-none cursor-pointer
                                            ${errors.bloodGroup
                                                ? 'border-red-500 text-red-900 dark:text-red-100'
                                                : 'border-gray-200 dark:border-teal-900/50 text-gray-900 dark:text-white focus:border-emerald-500'
                                            }
                                        `}
                                    >
                                        <option value="" disabled hidden></option>
                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg} className="text-black">{bg}</option>)}
                                    </select>
                                    <label className="absolute left-12 top-[18px] text-gray-500 dark:text-gray-400 text-base transition-all duration-200 pointer-events-none
                                        peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:dark:bg-[#0A1210] peer-focus:px-2 peer-focus:text-emerald-600
                                        peer-[:not([value=''])]:-top-2.5 peer-[:not([value=''])]::text-xs peer-[:not([value=''])]::bg-white peer-[:not([value=''])]::dark:bg-[#0A1210] peer-[:not([value=''])]::px-2
                                    ">
                                        Blood Group
                                    </label>
                                    <Droplet className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.bloodGroup ? 'text-red-500' : 'text-gray-400 peer-focus:text-emerald-600'}`} />
                                </div>
                                {errors.bloodGroup && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.bloodGroup}</p>}
                            </div>
                        </div>

                        {/* State & District */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* State Dropdown */}
                            <div className="relative">
                                <div className="relative">
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setFormData(prev => ({ ...prev, district: '' })); // Reset district on state change
                                        }}
                                        disabled={loadingStates}
                                        className={`peer w-full h-14 pl-12 pr-4 rounded-xl border-2 bg-transparent transition-all outline-none appearance-none cursor-pointer disabled:opacity-50
                                            ${errors.state
                                                ? 'border-red-500 text-red-900 dark:text-red-100'
                                                : 'border-gray-200 dark:border-teal-900/50 text-gray-900 dark:text-white focus:border-emerald-500'
                                            }
                                        `}
                                    >
                                        <option value="" disabled hidden></option>
                                        {states.map(state => <option key={state} value={state} className="text-black">{state}</option>)}
                                    </select>
                                    <label className="absolute left-12 top-[18px] text-gray-500 dark:text-gray-400 text-base transition-all duration-200 pointer-events-none
                                        peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:dark:bg-[#0A1210] peer-focus:px-2 peer-focus:text-emerald-600
                                        peer-[:not([value=''])]:-top-2.5 peer-[:not([value=''])]::text-xs peer-[:not([value=''])]::bg-white peer-[:not([value=''])]::dark:bg-[#0A1210] peer-[:not([value=''])]::px-2
                                    ">
                                        {loadingStates ? 'Loading States...' : 'State'}
                                    </label>
                                    <LandPlot className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.state ? 'text-red-500' : 'text-gray-400 peer-focus:text-emerald-600'}`} />
                                </div>
                                {errors.state && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.state}</p>}
                            </div>

                            {/* District Dropdown */}
                            <div className="relative">
                                <div className="relative">
                                    <select
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        disabled={!formData.state || loadingDistricts}
                                        className={`peer w-full h-14 pl-12 pr-4 rounded-xl border-2 bg-transparent transition-all outline-none appearance-none cursor-pointer disabled:opacity-50
                                            ${errors.district
                                                ? 'border-red-500 text-red-900 dark:text-red-100'
                                                : 'border-gray-200 dark:border-teal-900/50 text-gray-900 dark:text-white focus:border-emerald-500'
                                            }
                                        `}
                                    >
                                        <option value="" disabled hidden></option>
                                        {districts.map(dist => <option key={dist} value={dist} className="text-black">{dist}</option>)}
                                    </select>
                                    <label className="absolute left-12 top-[18px] text-gray-500 dark:text-gray-400 text-base transition-all duration-200 pointer-events-none
                                        peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:dark:bg-[#0A1210] peer-focus:px-2 peer-focus:text-emerald-600
                                        peer-[:not([value=''])]:-top-2.5 peer-[:not([value=''])]::text-xs peer-[:not([value=''])]::bg-white peer-[:not([value=''])]::dark:bg-[#0A1210] peer-[:not([value=''])]::px-2
                                    ">
                                        {loadingDistricts ? 'Loading...' : 'District'}
                                    </label>
                                    <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.district ? 'text-red-500' : 'text-gray-400 peer-focus:text-emerald-600'}`} />
                                </div>
                                {errors.district && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.district}</p>}
                            </div>
                        </div>

                        {/* City & Last Donation Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FloatingInput name="city" label="City" icon={Building2} value={formData.city} onChange={handleChange} error={errors.city} />

                            <div className="relative">
                                <input
                                    type="date"
                                    name="lastDonationDate"
                                    value={formData.lastDonationDate}
                                    onChange={handleChange}
                                    className="peer w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-200 dark:border-teal-900/50 bg-transparent text-gray-900 dark:text-white focus:border-emerald-500 outline-none transition-all placeholder-transparent"
                                />
                                <label className="absolute left-12 -top-2.5 text-xs bg-white dark:bg-[#0A1210] px-2 text-emerald-600">
                                    Last Donation Date (Optional)
                                </label>
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-emerald-600" />
                                {errors.lastDonationDate && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.lastDonationDate}</p>}
                            </div>
                        </div>

                        {/* Passwords */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FloatingInput name="password" type="password" label="Password" icon={Lock} value={formData.password} onChange={handleChange} error={errors.password} />
                            <FloatingInput name="confirmPassword" type="password" label="Confirm Password" icon={Lock} value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
                        </div>

                        {/* Terms & Submit */}
                        <div className="pt-4 space-y-6">
                            <div className="flex items-start gap-3 group">
                                <div className="relative flex items-center pt-0.5">
                                    <input
                                        type="checkbox"
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 dark:border-teal-800 bg-transparent transition-all checked:border-emerald-500 checked:bg-emerald-500"
                                    />
                                    <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                                </div>
                                <label className="text-sm text-gray-600 dark:text-gray-400 select-none">
                                    I agree to the <button type="button" onClick={() => setShowLegalModal(true)} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Terms of Service</button> and <button type="button" onClick={() => setShowLegalModal(true)} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Privacy Policy</button>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={!formData.agreeToTerms || isSubmitting}
                                className={`w-full h-14 rounded-xl font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all duration-300 flex items-center justify-center gap-2
                                    ${!formData.agreeToTerms || isSubmitting
                                        ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transform hover:-translate-y-1'
                                    }
                                `}
                            >
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Create Account <CheckCircle2 className="w-5 h-5" /></>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
                        Already have an account? <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Sign In</Link>
                    </div>
                </div>
            </div>

            {/* Terms Modal - Same as before */}
            <AnimatePresence>
                {showLegalModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowLegalModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-[#0A1815] w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-teal-900/30 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Shield className="w-6 h-6 text-emerald-600" /> Legal Information
                                </h3>
                                <button onClick={() => setShowLegalModal(false)}><X className="w-6 h-6 text-gray-400 hover:text-gray-600" /></button>
                            </div>
                            <div className="p-8 overflow-y-auto text-gray-600 dark:text-gray-300 space-y-6">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">1. Terms of Service</h4>
                                    <p className="text-sm leading-relaxed">By registering, you agree to provide accurate medical history...</p>
                                </div>
                                <div className="h-px bg-gray-100 dark:bg-teal-900/30" />
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">2. Privacy Policy</h4>
                                    <p className="text-sm leading-relaxed">Your data is secured and shared only when you accept a donation request...</p>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-100 dark:border-teal-900/30 bg-gray-50 dark:bg-[#020A08] flex justify-end">
                                <button
                                    onClick={() => setShowLegalModal(false)}
                                    className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Success Modal */}
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="bg-white dark:bg-[#0A1815] w-full max-w-md rounded-3xl p-8 text-center shadow-2xl border border-emerald-500/20"
                        >
                            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Registration Successful!</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Welcome to the family. Your unique Donor ID is:</p>

                            <div className="bg-gray-100 dark:bg-[#020A08] p-4 rounded-xl mb-8 border border-dashed border-gray-300 dark:border-teal-900/50">
                                <span className="text-2xl font-mono font-bold text-emerald-600 tracking-wider select-all">{donorId}</span>
                            </div>

                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/30 transition-all"
                            >
                                Continue to Login
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BecomeDonorForm;