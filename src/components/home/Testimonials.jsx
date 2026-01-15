import React, { useState, useEffect } from 'react';
import { Quote, Star, User, Filter, Plus, Send, X, MessageSquare, Heart, Globe, Calendar } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

// Initial seed data if localStorage is empty
const initialTestimonials = [
    {
        id: "SEED_1",
        name: 'Sarah Johnson',
        role: 'Donor',
        feedbackFor: 'Experience',
        content: "The process was incredibly smooth. I'm proud to contribute to such a noble cause. The app made it so easy.",
        rating: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
        id: "SEED_2",
        name: 'Michael Chen',
        role: 'Relative',
        feedbackFor: 'Donor',
        content: "When my cousin needed blood urgently, BloodLink connected us with a donor in under 30 minutes. It truly saves lives.",
        rating: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
        id: "SEED_3",
        name: 'Emily Davis',
        role: 'Donor',
        feedbackFor: 'Website',
        content: "I love the community features. Seeing the impact of my donations keeps me motivated to give regularly.",
        rating: 4,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    },
];

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState('Newest');
    const [visibleCount, setVisibleCount] = useState(6);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        role: 'Donor',
        feedbackFor: 'Website',
        message: '',
        rating: 5
    });

    useEffect(() => {
        const stored = localStorage.getItem('testimonials');
        if (stored) {
            setTestimonials(JSON.parse(stored));
        } else {
            setTestimonials(initialTestimonials);
            localStorage.setItem('testimonials', JSON.stringify(initialTestimonials));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.message) return;

        const newTestimonial = {
            id: Date.now().toString(),
            name: formData.name,
            role: formData.role,
            feedbackFor: formData.feedbackFor,
            content: formData.message,
            rating: Number(formData.rating),
            createdAt: new Date().toISOString(),
        };

        const updatedTestimonials = [newTestimonial, ...testimonials];
        setTestimonials(updatedTestimonials);
        localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));

        // Reset form
        setFormData({
            name: '',
            role: 'Donor',
            feedbackFor: 'Website',
            message: '',
            rating: 5
        });
        setIsFormOpen(false);

        // Optional: Show success message/toast here
        alert("Thank you for your feedback!");
    };

    const filteredTestimonials = testimonials.filter(t => {
        if (filter === 'All') return true;
        if (filter === 'Donor Reviews') return t.feedbackFor === 'Donor';
        if (filter === 'Website Reviews') return t.feedbackFor === 'Website';
        if (filter === 'Receiver Reviews' || filter === 'Experience') return t.feedbackFor === 'Experience' || t.feedbackFor === 'Receiver'; // Handling both just in case
        return true;
    }).sort((a, b) => {
        if (sort === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'Receiver': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
            case 'Relative': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'Donor': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <section className="py-24 bg-orange-50/50 dark:bg-[#062118] min-h-screen">
            <div className="container mx-auto px-4 md:px-6">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        Voices of Impact
                    </motion.h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Real stories from our community of heroes and those they've helped. Your feedback shapes our mission.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8"
                    >
                        <Button
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className="gap-2 shadow-lg shadow-emerald-500/20"
                        >
                            {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {isFormOpen ? 'Cancel' : 'Share Your Story'}
                        </Button>
                    </motion.div>
                </div>

                {/* Submission Form */}
                <AnimatePresence>
                    {isFormOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-16 overflow-hidden"
                        >
                            <Card className="max-w-2xl mx-auto bg-white dark:bg-[#0B1A15] border border-gray-100 dark:border-gray-800 shadow-xl">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-emerald-500" />
                                        Submit Testimonial
                                    </h3>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="Full Name"
                                                name="name"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    I am a...
                                                </label>
                                                <select
                                                    name="role"
                                                    value={formData.role}
                                                    onChange={handleInputChange}
                                                    className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                >
                                                    <option value="Donor">Donor</option>
                                                    <option value="Receiver">Receiver</option>
                                                    <option value="Relative">Receiver's Relative</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Feedback About
                                                </label>
                                                <select
                                                    name="feedbackFor"
                                                    value={formData.feedbackFor}
                                                    onChange={handleInputChange}
                                                    className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                >
                                                    <option value="Website">Website Experience</option>
                                                    <option value="Donor">A Specific Donor</option>
                                                    <option value="Experience">Overall Experience</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Rating
                                                </label>
                                                <div className="flex gap-2 items-center h-10">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            type="button"
                                                            key={star}
                                                            onClick={() => setFormData({ ...formData, rating: star })}
                                                            className="focus:outline-none transition-transform hover:scale-110"
                                                        >
                                                            <Star
                                                                className={`w-6 h-6 ${star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Message
                                            </label>
                                            <textarea
                                                name="message"
                                                rows="4"
                                                placeholder="Share your experience..."
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <Button type="submit" className="gap-2">
                                                <Send className="w-4 h-4" /> Submit Feedback
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filters and Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {['All', 'Donor Reviews', 'Website Reviews', 'Receiver Reviews'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Testimonials Grid */}
                {filteredTestimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredTestimonials.slice(0, visibleCount).map((t, index) => (
                                <motion.div
                                    key={t.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="h-full bg-white dark:bg-[#0B1A15] border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        <CardContent className="p-6 md:p-8 flex flex-col h-full">
                                            {/* Card Header */}
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                                                        {t.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{t.name}</h4>
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRoleBadgeColor(t.role)}`}>
                                                            {t.role}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="flex gap-0.5 mb-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {formatTimeAgo(t.createdAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="relative mb-6 flex-grow">
                                                <Quote className="absolute -top-1 -left-1 w-6 h-6 text-emerald-100 dark:text-emerald-900/50 rotate-180 -z-0" />
                                                <p className="text-gray-600 dark:text-gray-300 italic relative z-10 text-sm leading-relaxed">
                                                    "{t.content}"
                                                </p>
                                            </div>

                                            {/* Footer Tag */}
                                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1.5">
                                                    {t.feedbackFor === 'Donor' && <Heart className="w-3.5 h-3.5 text-red-400" />}
                                                    {t.feedbackFor === 'Website' && <Globe className="w-3.5 h-3.5 text-blue-400" />}
                                                    {t.feedbackFor === 'Experience' && <User className="w-3.5 h-3.5 text-purple-400" />}
                                                    Review for: <span className="font-semibold text-gray-700 dark:text-gray-200">{t.feedbackFor}</span>
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageSquare className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Reviews Yet</h3>
                        <p className="text-gray-500">Be the first to share your experience!</p>
                    </motion.div>
                )}

                {/* Show More Button */}
                {visibleCount < filteredTestimonials.length && (
                    <div className="text-center mt-12">
                        <Button
                            variant="outline"
                            onClick={() => setVisibleCount(prev => prev + 3)}
                            className="bg-white dark:bg-transparent"
                        >
                            Show More Reviews
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Testimonials;
