import Button from '../ui/Button';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <section className="py-24 bg-mint-white dark:bg-[#022C22]">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Illustration Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-emerald-100 dark:bg-emerald-900/20 rounded-[2rem] -rotate-2"></div>
                        <img
                            src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop"
                            alt="Team BloodLink"
                            className="relative rounded-[2rem] shadow-2xl object-cover h-[500px] w-full"
                        />
                        <div className="absolute bottom-8 right-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">5+</p>
                            <p className="text-gray-600 dark:text-gray-300 font-medium">Years of saving lives together.</p>
                        </div>
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-6">
                            Who We Are
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 dark:text-emerald-50 mb-6 leading-tight">
                            Bridging the gap between donors and patients.
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-emerald-100/70 mb-8 leading-relaxed">
                            BloodLink is more than just a platform; it's a movement. We are a non-profit dedicated to erasing the shortage of blood in our communities by using technology to connect willing donors with those in critical need.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {['24/7 Availability', 'Verified Donors', 'Real-time Connection'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link to="/about">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30">
                                Learn More About Us
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
