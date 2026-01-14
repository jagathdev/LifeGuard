import { UserPlus, Search, Droplet, UserCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
    {
        icon: UserPlus,
        title: 'Register',
        description: 'Sign up in less than 3 minutes.',
    },
    {
        icon: Search,
        title: 'Connect',
        description: 'Find a donor or a patient nearby.',
    },
    {
        icon: Droplet,
        title: 'Donate',
        description: 'Visit the center and donate blood.',
    },
    {
        icon: UserCheck,
        title: 'Save Lives',
        description: 'Your blood helps a patient recover.',
    },
];

const HowItWorks = () => {
    return (
        <section className="py-24 bg-mint-white dark:bg-[#061512]">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Our process is simple, transparent, and designed to connect donors and patients efficiently.
                    </p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 border-t-2 border-dashed border-gray-300 dark:border-teal-900 -z-10"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="relative mb-6">
                                <div className="w-24 h-24 rounded-full bg-white dark:bg-[#022C22] border-4 border-emerald-100 dark:border-teal-900 flex items-center justify-center z-10 shadow-lg group-hover:scale-110 group-hover:border-emerald-500 dark:group-hover:border-teal-500 transition-all duration-300">
                                    <step.icon className="w-10 h-10 text-emerald-600 dark:text-teal-400 group-hover:text-emerald-500 dark:group-hover:text-teal-300 transition-colors" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 dark:bg-teal-600 text-white flex items-center justify-center font-bold text-sm border-2 border-white dark:border-[#022C22]">
                                    {index + 1}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[200px]">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
