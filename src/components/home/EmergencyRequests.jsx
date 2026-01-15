import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, Clock, Phone, Siren, Plus, X, Loader2, Hospital, CheckCircle2, LandPlot, Building2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent } from '../ui/Card';
import { getStates, getDistrictsByState } from '../../lib/DistrictCityService';

const initialRequests = [
    {
        id: 1,
        patientName: 'Suresh Kumar',
        bloodGroup: 'A+',
        hospital: 'Rajiv Gandhi Hospital',
        state: 'Tamil Nadu',
        district: 'Chennai',
        city: 'Chennai Central',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        urgent: true,
        contact: '9360270984'
    },
];

const getTimeAgo = (timestamp) => {
    const now = new Date();
    const posted = new Date(timestamp);
    const diffInSeconds = Math.floor((now - posted) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
};

const EmergencyRequests = () => {
    const [requests, setRequests] = useState(() => {
        const saved = localStorage.getItem('emergencyRequests');
        return saved ? JSON.parse(saved) : initialRequests;
    });

    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loadingStates, setLoadingStates] = useState(true);
    const [loadingDistricts, setLoadingDistricts] = useState(false);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [newRequest, setNewRequest] = useState({
        patientName: '',
        bloodGroup: '',
        hospital: '',
        state: '',
        district: '',
        city: '',
        contact: '',
        urgent: false
    });

    useEffect(() => {
        localStorage.setItem('emergencyRequests', JSON.stringify(requests));
    }, [requests]);

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
        if (newRequest.state) {
            setLoadingDistricts(true);
            const loadDistricts = async () => {
                const data = await getDistrictsByState(newRequest.state);
                setDistricts(data);
                setLoadingDistricts(false);
            };
            loadDistricts();
        } else {
            setDistricts([]);
            setNewRequest(prev => ({ ...prev, district: '' }));
        }
    }, [newRequest.state]);

    // Force re-render every minute to update "Time Ago"
    const [, setTick] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(timer);
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRequest(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate backend call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const request = {
            id: Date.now(),
            ...newRequest,
            timestamp: new Date().toISOString(),
        };

        setRequests([request, ...requests]);
        setIsSubmitting(false);
        setIsFormOpen(false);
        setShowSuccess(true);

        // Reset form
        setNewRequest({
            patientName: '',
            bloodGroup: '',
            hospital: '',
            state: '',
            district: '',
            city: '',
            contact: '',
            urgent: false
        });

        setTimeout(() => setShowSuccess(false), 5000);
    };

    return (
        <section className="py-24 bg-red-50/50 dark:bg-gray-900 transition-colors duration-300 min-h-screen">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full animate-pulse">
                                <Siren className="w-6 h-6 text-red-600 dark:text-red-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Emergency Requests</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 max-w-xl">
                            Urgent blood requirements near you. Responses to these requests can save lives immediately.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 gap-2 px-6 h-11"
                    >
                        <Plus className="w-5 h-5" /> Create Request
                    </Button>
                </div>

                {/* Success Notification */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed bottom-10 right-10 z-[60] bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border border-emerald-500"
                        >
                            <div className="bg-white/20 p-2 rounded-full">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Request Posted!</h4>
                                <p className="text-sm text-emerald-100">Donors notified.</p>
                            </div>
                            <button onClick={() => setShowSuccess(false)} className="ml-4 hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {requests.length > 0 ? (
                            requests.map((req) => (
                                <motion.div
                                    key={req.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className={`h-full border-2 ${req.urgent ? 'border-red-500 dark:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-orange-200 dark:border-orange-900'} bg-white dark:bg-[#0A0F0D] overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
                                        <div className={`p-1 h-2 ${req.urgent ? 'bg-red-500 animate-pulse' : 'bg-orange-400'}`}></div>
                                        <CardContent className="p-6 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Patient Needs</span>
                                                    <span className="text-4xl font-black text-gray-900 dark:text-white">{req.bloodGroup}</span>
                                                </div>
                                                {req.urgent && (
                                                    <span className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide border border-red-200 dark:border-red-800 flex items-center gap-1 animate-pulse">
                                                        <AlertTriangle className="w-3 h-3" /> Urgent
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 flex items-center gap-2">
                                                <Hospital className="w-4 h-4 text-gray-400" /> {req.hospital}
                                            </h3>
                                            {req.patientName && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2">Patient: {req.patientName}</p>}

                                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center gap-2.5 pt-2">
                                                    <LandPlot className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    <span className="truncate">{req.state}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    <span className="truncate">{req.city ? `${req.city}, ${req.district}` : req.district}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    <span>Posted {getTimeAgo(req.timestamp)}</span>
                                                </div>
                                            </div>

                                            <Button className={`w-full gap-2 ${req.urgent ? 'bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20' : 'bg-gray-900 dark:bg-emerald-600 hover:bg-gray-800 dark:hover:bg-emerald-500'} text-white border-0 mt-2`}>
                                                <Phone className="w-4 h-4" /> Call: {req.contact}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400">
                                <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No Emergency Requests</h3>
                                <p>There are currently no active emergency blood requests.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Create Request Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsFormOpen(false)}
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-[#0A1815] w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-gray-200 dark:border-teal-900/50 max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-teal-900/30 flex justify-between items-center bg-gray-50 dark:bg-[#06110E] shrink-0">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Emergency Request</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">We will notify nearby donors immediately.</p>
                                </div>
                                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Input
                                            label="Patient Name"
                                            name="patientName"
                                            placeholder="Full Name"
                                            value={newRequest.patientName}
                                            onChange={handleInputChange}
                                            required
                                            className="dark:bg-[#152320]"
                                        />
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Blood Group</label>
                                            <select
                                                name="bloodGroup"
                                                value={newRequest.bloodGroup}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full h-10 rounded-md border border-gray-300 dark:border-[#2A453F] bg-white dark:bg-[#152320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
                                            >
                                                <option value="">Select Group</option>
                                                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <Input
                                        label="Hospital Name"
                                        name="hospital"
                                        placeholder="Hospital Name & Area"
                                        value={newRequest.hospital}
                                        onChange={handleInputChange}
                                        required
                                        className="dark:bg-[#152320]"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                                            <select
                                                name="state"
                                                value={newRequest.state}
                                                onChange={handleInputChange}
                                                required
                                                disabled={loadingStates}
                                                className="w-full h-10 rounded-md border border-gray-300 dark:border-[#2A453F] bg-white dark:bg-[#152320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-shadow"
                                            >
                                                <option value="">{loadingStates ? 'Loading...' : 'Select State'}</option>
                                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">District</label>
                                            <select
                                                name="district"
                                                value={newRequest.district}
                                                onChange={handleInputChange}
                                                required
                                                disabled={!newRequest.state || loadingDistricts}
                                                className="w-full h-10 rounded-md border border-gray-300 dark:border-[#2A453F] bg-white dark:bg-[#152320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-shadow"
                                            >
                                                <option value="">{loadingDistricts ? 'Loading...' : 'Select District'}</option>
                                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Input
                                            label="City / Area"
                                            name="city"
                                            placeholder="Eg: Anna Nagar"
                                            value={newRequest.city}
                                            onChange={handleInputChange}
                                            required
                                            className="dark:bg-[#152320]"
                                        />
                                        <Input
                                            label="Contact Number"
                                            name="contact"
                                            placeholder="Emergency Contact"
                                            value={newRequest.contact}
                                            onChange={handleInputChange}
                                            required
                                            className="dark:bg-[#152320]"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-3 bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/30">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                name="urgent"
                                                checked={newRequest.urgent}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-sm font-bold text-gray-900 dark:text-white">Mark as Critical / Life Threatening</label>
                                            <p className="text-xs text-red-600 dark:text-red-400">High priority alert will be sent to donors.</p>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base shadow-lg shadow-red-500/20">
                                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Submit Request & Notify Donors'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default EmergencyRequests;
