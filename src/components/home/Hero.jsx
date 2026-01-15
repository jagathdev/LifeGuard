import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { motion } from 'framer-motion';
import { Search, Heart } from 'lucide-react';
import bloodDonate from '../../assets/images/bloodDonate.png';

const Hero = () => {
    return (
        <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-[var(--color-bg-dark)] dark:via-[#022C22] dark:to-teal-900/40">
            {/* Floating Shapes */}
            <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{ y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 backdrop-blur-sm mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                                Saving Lives Every Day
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
                            Donate <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">Blood</span>,<br />
                            Save <span className="text-red-500">Lives</span>.
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Your donation is the lifeline for someone in need. Join our community of heroes and create a ripple of hope.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/search">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                                >
                                    <Search className="w-5 h-5" /> Find A Donor
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto gap-2 border-2 border-emerald-600 text-emerald-700 dark:text-emerald-300 dark:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                >
                                    <Heart className="w-5 h-5" /> Become Donor
                                </Button>
                            </Link>
                        </div>


                    </motion.div>

                    {/* Right Column: Illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 w-full aspect-square max-w-lg mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200 to-teal-200 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-[2rem] rotate-3 transform transition-transform hover:rotate-2 duration-500"></div>
                            <img
                                src={bloodDonate}
                                alt="Blood Donation Illustration"
                                className="relative w-full h-full object-cover rounded-[2rem] shadow-2xl shadow-emerald-900/20 dark:shadow-black/50"
                            />

                            {/* Floating Card Element */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl flex items-center gap-4 max-w-xs"
                            >
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">Urgent Request</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">O+ Blood needed in NYC</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
