import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, Clock, Phone, Siren, Plus, X, Loader2, Hospital, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent } from '../ui/Card';

const initialRequests = [
    { id: 1, bloodGroup: 'AB-', hospital: 'City General Hospital', location: 'New York, USA', time: '2 hours ago', urgent: true, contact: '555-0123' },
    { id: 2, bloodGroup: 'O+', hospital: 'Saint Mary Clinic', location: 'London, UK', time: '5 hours ago', urgent: false, contact: '555-0199' },
    { id: 3, bloodGroup: 'B-', hospital: 'Apollo Hospital', location: 'Mumbai, India', time: '1 hour ago', urgent: true, contact: '555-0155' },
    { id: 4, bloodGroup: 'A+', hospital: 'Kindred Medical Center', location: 'Los Angeles, USA', time: '30 mins ago', urgent: true, contact: '555-8821' },
    { id: 5, bloodGroup: 'O-', hospital: 'Global Health Institute', location: 'Berlin, Germany', time: '1 day ago', urgent: false, contact: '555-0042' },
];

const EmergencyRequests = () => {
    const [requests, setRequests] = useState(() => {
        const saved = localStorage.getItem('emergencyRequests');
        return saved ? JSON.parse(saved) : initialRequests;
    });

    useEffect(() => {
        localStorage.setItem('emergencyRequests', JSON.stringify(requests));
    }, [requests]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [newRequest, setNewRequest] = useState({
        patientName: '',
        bloodGroup: '',
        hospital: '',
        location: '',
        contact: '',
        urgent: false
    });

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

        // Simulate backend call and alert triggering
        const simulatedDelay = new Promise(resolve => setTimeout(resolve, 2000));

        await simulatedDelay;

        const request = {
            id: requests.length + 1,
            ...newRequest,
            time: 'Just now',
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
            location: '',
            contact: '',
            urgent: false
        });

        // Hide success message after 5 seconds
        setTimeout(() => setShowSuccess(false), 5000);
    };

    return (
        <section className="py-24 bg-red-50/50 dark:bg-gray-900 transition-colors duration-300">
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
                        {requests.map((req, index) => (
                            <motion.div
                                key={req.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
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

                                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-6 mt-auto pt-4">
                                            <div className="flex items-center gap-2.5">
                                                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" /> {req.location}
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <Clock className="w-4 h-4 text-emerald-500 shrink-0" /> Posted {req.time}
                                            </div>
                                        </div>

                                        <Button className={`w-full gap-2 ${req.urgent ? 'bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20' : 'bg-gray-900 dark:bg-emerald-600 hover:bg-gray-800 dark:hover:bg-emerald-500'} text-white border-0 mt-2`}>
                                            <Phone className="w-4 h-4" /> Call: {req.contact}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
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
                            className="bg-white dark:bg-[#0A1815] w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-gray-200 dark:border-teal-900/50"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-teal-900/30 flex justify-between items-center bg-gray-50 dark:bg-[#06110E]">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Emergency Request</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">We will notify nearby donors immediately.</p>
                                </div>
                                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <Input label="Patient Name" name="patientName" placeholder="Full Name" value={newRequest.patientName} onChange={handleInputChange} required className="dark:bg-[#152320]" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Blood Group</label>
                                        <select name="bloodGroup" value={newRequest.bloodGroup} onChange={handleInputChange} required className="w-full h-10 rounded-md border border-gray-300 dark:border-[#2A453F] bg-white dark:bg-[#152320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500">
                                            <option value="">Select</option>
                                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                        </select>
                                    </div>
                                    <Input label="Contact Number" name="contact" placeholder="Urgent Contact" value={newRequest.contact} onChange={handleInputChange} required className="dark:bg-[#152320]" />
                                </div>
                                <Input label="Hospital Name" name="hospital" placeholder="Where is the patient?" value={newRequest.hospital} onChange={handleInputChange} required className="dark:bg-[#152320]" />
                                <Input label="Location / City" name="location" placeholder="City, Area" value={newRequest.location} onChange={handleInputChange} required className="dark:bg-[#152320]" />

                                <div className="flex items-center space-x-3 bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/30">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" name="urgent" checked={newRequest.urgent} onChange={handleInputChange} className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">Mark as Critical / Life Threatening</label>
                                        <p className="text-xs text-red-600 dark:text-red-400">This will trigger high-priority alerts.</p>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base shadow-lg shadow-red-500/20">
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Submit Request & Notify Donors'}
                                    </Button>
                                    <p className="text-center text-xs text-gray-400 mt-3">Notifications are sent within 30 seconds of verification.</p>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default EmergencyRequests;
