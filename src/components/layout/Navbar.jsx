import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Menu, X, Sun, Moon, Droplet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Find Donor', path: '/search' },
        { name: 'Become Donor', path: '/register' },
        { name: 'Emergency Requests', path: '/emergency' },
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
                        <Link to="/login">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                            >
                                Login
                            </Button>
                        </Link>
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
                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start text-emerald-800 dark:text-emerald-200">
                                        Login
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;