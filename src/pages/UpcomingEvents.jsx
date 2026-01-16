import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, MapPin, Filter } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EventCard from '../components/events/EventCard';
import EventForm from '../components/events/EventForm';
import { motion, AnimatePresence } from 'framer-motion';

const UpcomingEvents = () => {
    const [events, setEvents] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filter, setFilter] = useState('all'); // all, nearby
    const [sortBy, setSortBy] = useState('recent'); // recent, nearest

    useEffect(() => {
        // 1. Get User
        const user = JSON.parse(localStorage.getItem('loggedInDonor'));
        setCurrentUser(user);

        // 2. Load & Clean Events
        loadAndCleanEvents();

        // 3. Auto-refresh interval (for testing deletion without refresh)
        const interval = setInterval(loadAndCleanEvents, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const loadAndCleanEvents = () => {
        const storedEvents = JSON.parse(localStorage.getItem('upcomingEvents') || '[]');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter out expired events
        const validEvents = storedEvents.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= today;
        });

        // Update localStorage if expired events were removed
        if (validEvents.length !== storedEvents.length) {
            localStorage.setItem('upcomingEvents', JSON.stringify(validEvents));
        }

        setEvents(validEvents);
    };

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        loadAndCleanEvents();
    };

    // Filter & Sort Logic
    const getProcessedEvents = () => {
        let processed = [...events];

        // Filter: Nearby (Only if user is logged in & has location)
        if (filter === 'nearby' && currentUser?.district) {
            processed = processed.filter(e =>
                e.district.toLowerCase() === currentUser.district.toLowerCase() ||
                e.state.toLowerCase() === currentUser.state.toLowerCase()
            );
        }

        // Sort
        processed.sort((a, b) => {
            if (sortBy === 'recent') {
                return new Date(a.date) - new Date(b.date); // Closest date first
            }
            // For simplicity, 'nearest' sort is just pushing district matches to top
            if (sortBy === 'nearest' && currentUser?.district) {
                const aMatch = a.district.toLowerCase() === currentUser.district.toLowerCase();
                const bMatch = b.district.toLowerCase() === currentUser.district.toLowerCase();
                return bMatch - aMatch;
            }
            return 0;
        });

        return processed;
    };

    const displayedEvents = getProcessedEvents();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-[#020A08] transition-colors duration-300">
            <div className="container mx-auto max-w-7xl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Upcoming Donation Camps
                        </h1>
                        <p className="text-gray-600 dark:text-emerald-100/70 max-w-2xl">
                            Join these events to save lives. Find blood donation camps happening near you or organize one for your community.
                        </p>
                    </div>

                    {currentUser ? (
                        <Button onClick={() => setShowCreateModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Organize Camp
                        </Button>
                    ) : (
                        <div className="text-sm text-gray-500 dark:text-emerald-100/50 bg-gray-100 dark:bg-emerald-900/20 px-4 py-2 rounded-lg border border-gray-200 dark:border-teal-900/30">
                            Log in as a donor to organize events.
                        </div>
                    )}
                </div>

                {/* Filters & Controls */}
                <div className="bg-white dark:bg-[#0A1210] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-teal-900/30 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="w-full md:w-64 pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-emerald-900/10 border border-gray-200 dark:border-teal-900/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div className="flex bg-gray-100 dark:bg-emerald-900/20 p-1 rounded-xl">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-white dark:bg-emerald-600 shadow-sm text-emerald-700 dark:text-white' : 'text-gray-600 dark:text-emerald-100/60 hover:text-emerald-600'}`}
                            >
                                All Events
                            </button>
                            {currentUser && (
                                <button
                                    onClick={() => setFilter('nearby')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'nearby' ? 'bg-white dark:bg-emerald-600 shadow-sm text-emerald-700 dark:text-white' : 'text-gray-600 dark:text-emerald-100/60 hover:text-emerald-600'}`}
                                >
                                    Nearby
                                </button>
                            )}
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-emerald-900/20 border-none text-sm font-medium text-gray-700 dark:text-emerald-100/80 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                        >
                            <option value="recent">Sort by Date</option>
                            <option value="nearest">Sort by Distance</option>
                        </select>
                    </div>
                </div>

                {/* Event Grid */}
                {displayedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {displayedEvents.map(event => (
                                <motion.div
                                    key={event.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <EventCard event={event} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-[#0A1210] rounded-3xl border border-gray-100 dark:border-teal-900/30">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Upcoming Events</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            {filter === 'nearby'
                                ? "There are no events scheduled near your location yet."
                                : "No donation camps are scheduled at the moment. Be the first to organize one!"}
                        </p>
                        {currentUser && filter !== 'nearby' && (
                            <Button onClick={() => setShowCreateModal(true)} className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white">
                                Create Event
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Organize Blood Donation Camp"
            >
                <EventForm
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateSuccess}
                />
            </Modal>
        </div>
    );
};

export default UpcomingEvents;
