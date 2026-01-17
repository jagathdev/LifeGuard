import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Calendar, MapPin, Droplet, Hospital, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const MyDonations = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Get User
        const user = JSON.parse(localStorage.getItem('loggedInDonor'));
        if (!user) {
            navigate('/login');
            return;
        }
        setCurrentUser(user);

        // 2. Load History
        const loadHistory = () => {
            const allHistory = JSON.parse(localStorage.getItem('donorHistory') || '[]');
            // Filter for current user
            const myHistory = allHistory.filter(h => h.donorId === user.id);
            // Sort by date descending (newest first)
            myHistory.sort((a, b) => new Date(b.donatedAt) - new Date(a.donatedAt));
            setHistory(myHistory);
            setLoading(false);
        };

        loadHistory();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('loggedInDonor');
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
                                <Droplet className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            </span>
                            My Donation History
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 ml-16">
                            Thank you for being a hero! Here is a record of your life-saving contributions.
                        </p>
                    </div>
                </div>

                {/* Donation Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Card className="bg-linear-to-br from-emerald-500 to-teal-600 border-none text-white">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-emerald-100 font-medium mb-1">Total Donations</p>
                                <h3 className="text-4xl font-bold">{history.length}</h3>
                            </div>
                            <div className="p-3 bg-white/20 rounded-full">
                                <Droplet className="w-8 h-8 text-white" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-[#0A1210] border-emerald-100 dark:border-teal-900/30">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Last Donation</p>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {history.length > 0
                                        ? new Date(history[0].donatedAt).toLocaleDateString()
                                        : 'N/A'}
                                </h3>
                            </div>
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-[#0A1210] border-emerald-100 dark:border-teal-900/30">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Impact</p>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    ~ {history.length * 3} Lives Saved
                                </h3>
                            </div>
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <User className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* History List */}
                <div className="space-y-6">
                    {history.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-[#0A1210] rounded-3xl border border-gray-100 dark:border-teal-900/30 shadow-sm">
                            <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Donations Yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">
                                You haven't made any donations yet. Check the dashboard for emergency requests!
                            </p>
                            <Button
                                onClick={() => navigate('/donor-dashboard')}
                                className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            <AnimatePresence>
                                {history.map((record, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="bg-white dark:bg-[#0A1210] border border-gray-100 dark:border-teal-900/30 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                                    {/* Left: Date & ID */}
                                                    <div className="flex items-start md:items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                                            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                                                Donation Completed
                                                            </h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {new Date(record.donatedAt).toLocaleDateString(undefined, {
                                                                    weekday: 'long',
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Middle: Details */}
                                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 md:px-8">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                            <User className="w-4 h-4 text-emerald-500" />
                                                            <span className="font-medium">Patient:</span> {record.patientName || 'Unknown'}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                            <Hospital className="w-4 h-4 text-emerald-500" />
                                                            <span className="font-medium">Hospital:</span> {record.hospital || 'N/A'}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                            <MapPin className="w-4 h-4 text-emerald-500" />
                                                            <span className="font-medium">Location:</span> {record.location || 'N/A'}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                            <Droplet className="w-4 h-4 text-red-500" />
                                                            <span className="font-medium">Blood Group:</span> {record.bloodGroup || 'N/A'}
                                                        </div>
                                                    </div>

                                                    {/* Right: Status */}
                                                    <div className="shrink-0 text-right">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                                            Success
                                                        </span>
                                                    </div>

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
        </div>
    );
};

export default MyDonations;
