import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Droplet, MapPin, Phone, Clock, AlertTriangle, Hospital, User } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const DonorDashboard = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [matchingRequests, setMatchingRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Get User
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            navigate('/login');
            return;
        }
        setCurrentUser(user);

        // 2. Initial Load of Requests
        const loadRequests = () => {
            const allRequests = JSON.parse(localStorage.getItem('emergencyRequests') || '[]');
            // Filter logic: matches blood group exactly
            const filtered = allRequests.filter(req => req.bloodGroup === user.bloodGroup);
            setMatchingRequests(filtered);
            setLoading(false);
        };

        loadRequests();

        // 3. Real-time Listener (simulated via interval for localStorage polling)
        // Since localStorage events only trigger across tabs, we'll use a polling interval for single-tab testing user feedback.
        const interval = setInterval(loadRequests, 3000);

        return () => clearInterval(interval);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#020A08] text-emerald-600">Loading...</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-[#020A08] transition-colors duration-300">
            <div className="container mx-auto max-w-6xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <span className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            </span>
                            Welcome, {currentUser?.fullName}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 ml-16">
                            You are a <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">{currentUser?.bloodGroup}</span> Donor.
                        </p>
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20">
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                </div>

                {/* Dashboard Content */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Matching Emergency Requests</h2>
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
                            {matchingRequests.length} Live
                        </span>
                    </div>

                    {matchingRequests.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-[#0A1210] rounded-3xl border border-gray-100 dark:border-teal-900/30 shadow-sm">
                            <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Droplet className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Emergency Requests</h3>
                            <p className="text-gray-500 dark:text-gray-400">Currently there are no patients matching your blood group.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {matchingRequests.map((req) => (
                                    <motion.div
                                        key={req.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className={`h-full border-2 ${req.urgent ? 'border-red-500 dark:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-gray-200 dark:border-teal-900/30'} bg-white dark:bg-[#0A1210] overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
                                            <div className={`p-1 h-2 ${req.urgent ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
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
                                                {req.patientName && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Patient: {req.patientName}</p>}

                                                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-6 mt-auto">
                                                    <div className="flex items-center gap-2.5">
                                                        <MapPin className="w-4 h-4 text-emerald-500 shrink-0" /> {req.location}
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <Clock className="w-4 h-4 text-emerald-500 shrink-0" /> Posted {req.time}
                                                    </div>
                                                </div>

                                                <Button className={`w-full gap-2 ${req.urgent ? 'bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20' : 'bg-emerald-600 hover:bg-emerald-700'} text-white border-0 mt-2`}>
                                                    <Phone className="w-4 h-4" /> Call: {req.contact}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonorDashboard;
