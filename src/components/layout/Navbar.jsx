import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Menu, X, Sun, Moon, Droplet, User, LogOut, ChevronDown, LayoutDashboard, Calendar } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { addToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const profileRef = useRef(null);

    // Get logged-in donor
    const loggedInDonor = JSON.parse(localStorage.getItem('loggedInDonor'));

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('loggedInDonor');
        setIsProfileOpen(false);
        setIsOpen(false);
        addToast('You have been logged out successfully.', 'success');
        navigate('/');
    };

    // Helper to close menus on navigation
    const closeMenus = () => {
        setIsOpen(false);
        setIsProfileOpen(false);
    };

    const navLinks = loggedInDonor ? [
        { name: 'Home', path: '/' },
        { name: 'Find Donor', path: '/search' },
        { name: 'Emergency Requests', path: '/emergency' },
        { name: 'Upcoming Events', path: '/events' },
        { name: 'Donor Dashboard', path: '/donor-dashboard' },
        { name: 'About', path: '/about' },
    ] : [
        { name: 'Home', path: '/' },
        { name: 'Find Donor', path: '/search' },
        { name: 'Become a Donor', path: '/register' },
        { name: 'Emergency Requests', path: '/emergency' },
        { name: 'Upcoming Events', path: '/events' },
        { name: 'About', path: '/about' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 md:px-6 py-3",
                scrolled
                    ? "bg-mint-white/90 dark:bg-deep-midnight/90 backdrop-blur-md shadow-md py-2"
                    : "bg-transparent py-4"
            )}
        >
            <div className={cn(
                "container mx-auto rounded-2xl px-4 transition-all duration-300",
                scrolled ? "" : "bg-mint-white/80 dark:bg-deep-midnight/80 backdrop-blur-sm shadow-sm p-2"
            )}>
                <div className="flex items-center justify-between h-12">
                    {/* Left: Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="bg-white dark:bg-emerald-900/30 p-1.5 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                            <Droplet className="h-5 w-5 text-emerald-500 fill-emerald-500" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-emerald-900 dark:text-emerald-50">
                            LifeGuard
                        </span>
                    </Link>

                    {/* Center: Navigation */}
                    <div className="hidden md:flex items-center justify-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={closeMenus}
                                className={cn(
                                    "text-sm font-medium transition-all duration-200 hover:text-emerald-600 dark:hover:text-emerald-400 relative",
                                    isActive(link.path)
                                        ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                                        : "text-gray-600 dark:text-gray-300"
                                )}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Actions */}
                    <div className="hidden md:flex items-center space-x-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                            ) : (
                                <Moon className="h-5 w-5 text-emerald-700" />
                            )}
                        </button>

                        {loggedInDonor ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                                >
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                                        {loggedInDonor.fullName}
                                    </span>
                                    <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform", isProfileOpen && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
                                        >
                                            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border-b border-gray-100 dark:border-gray-800">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                    {loggedInDonor.fullName}
                                                </p>
                                                <div className="flex items-center mt-1 space-x-2">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                                        {loggedInDonor.bloodGroup}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Donor ID: {loggedInDonor.id}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-2">
                                                <Link
                                                    to="/donor-dashboard"
                                                    onClick={closeMenus}
                                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                                >
                                                    <LayoutDashboard className="w-4 h-4" />
                                                    <span className="text-sm">Dashboard</span>
                                                </Link>
                                                <Link
                                                    to="/my-donations"
                                                    onClick={closeMenus}
                                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                                >
                                                    <Droplet className="w-4 h-4" />
                                                    <span className="text-sm">My Donations</span>
                                                </Link>
                                                <Link
                                                    to="/events"
                                                    onClick={closeMenus}
                                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                                >
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-sm">Upcoming Events</span>
                                                </Link>

                                                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span className="text-sm">Logout</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                                >
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5 text-yellow-400" />
                            ) : (
                                <Moon className="h-5 w-5 text-gray-600" />
                            )}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-md"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden mt-2 mx-4 rounded-xl overflow-hidden bg-mint-white dark:bg-deep-midnight shadow-lg border border-emerald-100 dark:border-emerald-900/50"
                    >
                        <div className="flex flex-col space-y-2 p-4">
                            {loggedInDonor && (
                                <div className="p-3 mb-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center space-x-3 border border-emerald-100 dark:border-emerald-800/50">
                                    <div className="h-10 w-10 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-200">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                            {loggedInDonor.fullName}
                                        </p>
                                        <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">
                                            {loggedInDonor.bloodGroup}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive(link.path)
                                            ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800">
                                {loggedInDonor ? (
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                ) : (
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start text-emerald-800 dark:text-emerald-200">
                                            Login
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
