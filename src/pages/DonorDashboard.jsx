import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Droplet, MapPin, Phone, Clock, AlertTriangle, Hospital, User, CheckCircle2, XCircle, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const DonorDashboard = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [matchingRequests, setMatchingRequests] = useState([]);
    const [upcomingReminders, setUpcomingReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showSkipModal, setShowSkipModal] = useState(false);

    useEffect(() => {
        // 1. Get User from 'loggedInDonor'
        const user = JSON.parse(localStorage.getItem('loggedInDonor'));
        if (!user) {
            navigate('/login');
            return;
        }
        setCurrentUser(user);

        // 2. Load Requests
        const loadRequests = () => {
            const allRequests = JSON.parse(localStorage.getItem('emergencyRequests') || '[]');
            const skippedRequests = JSON.parse(localStorage.getItem('donorSkippedRequests') || '[]');
            const mySkippedIds = skippedRequests.filter(s => s.donorId === user.id).map(s => s.requestId);

            // Filter logic: matches blood group exactly AND not skipped
            const filtered = allRequests.filter(req =>
                req.bloodGroup === user.bloodGroup &&
                !mySkippedIds.includes(req.id)
            );

            setMatchingRequests(filtered);
            setLoading(false);
        };

        loadRequests();

        // 4. Load Upcoming Reminders
        const loadReminders = () => {
            const allEvents = JSON.parse(localStorage.getItem('upcomingEvents') || '[]');
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const reminders = allEvents.filter(event => {
                const eventDate = new Date(event.date);
                eventDate.setHours(0, 0, 0, 0);

                // Calculate difference in days
                const diffTime = eventDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // Check distance (District or State match)
                const isNearby =
                    (event.district && user.district && event.district.toLowerCase() === user.district.toLowerCase()) ||
                    (event.state && user.state && event.state.toLowerCase() === user.state.toLowerCase());

                // Condition: 3-10 days away AND nearby
                return diffDays >= 3 && diffDays <= 10 && isNearby;
            });

            setUpcomingReminders(reminders);
            localStorage.setItem('upcomingReminders', JSON.stringify(reminders));
        };

        loadReminders();

        // 3. Real-time Listener (simulated via interval for localStorage polling)
        const interval = setInterval(loadRequests, 3000);

        return () => clearInterval(interval);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('loggedInDonor');
        navigate('/login');
    };

    const handleDonated = (request) => {
        // 1. Remove from Global Requests (Assuming "I Have Donated" means fulfilling it)
        const allRequests = JSON.parse(localStorage.getItem('emergencyRequests') || '[]');
        const updatedRequests = allRequests.filter(r => r.id !== request.id);
        localStorage.setItem('emergencyRequests', JSON.stringify(updatedRequests));

        // 2. Add to History
        const history = JSON.parse(localStorage.getItem('donorHistory') || '[]');
        history.push({
            donorId: currentUser.id,
            requestId: request.id,
            patientName: request.patientName,
            donatedAt: new Date().toISOString()
        });
        localStorage.setItem('donorHistory', JSON.stringify(history));

        // 3. Update Local State immediately
        setMatchingRequests(prev => prev.filter(r => r.id !== request.id));
        setShowSuccessModal(true);
    };

    const handleSkip = (request) => {
        // 1. Add to Skipped
        const skipped = JSON.parse(localStorage.getItem('donorSkippedRequests') || '[]');
        skipped.push({
            donorId: currentUser.id,
            requestId: request.id,
            skippedAt: new Date().toISOString()
        });
        localStorage.setItem('donorSkippedRequests', JSON.stringify(skipped));

        // 2. Update Local State
        setMatchingRequests(prev => prev.filter(r => r.id !== request.id));
        setShowSkipModal(true);
        setTimeout(() => setShowSkipModal(false), 3000);
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
                            Welcome, {currentUser?.name || currentUser?.fullName}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 ml-16">
                            You are a <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">{currentUser?.bloodGroup}</span> Donor in {currentUser?.district}.
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

                    {/* Upcoming Reminders Section */}
                    {upcomingReminders.length > 0 && (
                        <div className="mb-8">
                            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-teal-900/30 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-emerald-600" />
                                    Upcoming Cleared Camps Nearby
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {upcomingReminders.map(event => (
                                        <div key={event.id} className="bg-white dark:bg-[#0A1210] p-4 rounded-xl border border-emerald-100 dark:border-teal-900/30 shadow-sm flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{event.title}</h4>
                                                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full whitespace-nowrap">
                                                    {event.date}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">{event.organization}</p>
                                            <div className="mt-auto flex items-center text-xs text-gray-500 gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {event.city}, {event.district}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

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

                                                <div className="grid grid-cols-2 gap-3 mt-3">
                                                    <Button
                                                        onClick={() => handleDonated(req)}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 text-sm py-2 h-auto"
                                                    >
                                                        I Have Donated
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleSkip(req)}
                                                        variant="outline"
                                                        className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm py-2 h-auto"
                                                    >
                                                        Not Available
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowSuccessModal(false)}
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-[#0A1815] w-full max-w-sm rounded-2xl shadow-2xl relative z-10 p-8 text-center border border-emerald-500/20"
                        >
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank You, Hero!</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                You have successfully completed this donation.
                            </p>
                            <Button onClick={() => setShowSuccessModal(false)} className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30">
                                Close
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Skip Modal (Toast) */}
            <AnimatePresence>
                {showSkipModal && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[70] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-xl flex items-center gap-3"
                    >
                        <XCircle className="w-5 h-5" />
                        <span className="font-medium">Request skipped.</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DonorDashboard;
