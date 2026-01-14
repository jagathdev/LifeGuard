import { Card, CardContent, CardTitle } from '../ui/Card';
import { HeartPulse, ShieldCheck, Clock, CheckCircle, Smile, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
    {
        icon: HeartPulse,
        title: 'Save 3 Lives',
        description: 'A single pint can save up to three lives. Discover the power of your contribution.',
        color: 'from-pink-500 to-rose-500'
    },
    {
        icon: ShieldCheck,
        title: 'Health Check',
        description: 'Get a free mini-physical. We check your pulse, blood pressure, and iron levels.',
        color: 'from-emerald-500 to-teal-500'
    },
    {
        icon: Clock,
        title: 'Fast Process',
        description: 'The donation process is quick and easy, taking less than an hour of your time.',
        color: 'from-blue-500 to-indigo-500'
    },
    {
        icon: Activity,
        title: 'Burn Calories',
        description: 'You burn approximately 650 calories per donation of one pint of blood.',
        color: 'from-orange-500 to-amber-500'
    },
    {
        icon: CheckCircle,
        title: 'Heart Health',
        description: 'Regular donation may lower the risk of heart disease and heart attacks.',
        color: 'from-red-500 to-red-600'
    },
    {
        icon: Smile,
        title: 'Joy of Giving',
        description: 'Experience the pure joy and satisfaction of knowing you saved a life.',
        color: 'from-purple-500 to-violet-500'
    },
];

const WhyDonate = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-24 bg-gray-50 dark:bg-[#05110E]">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider text-sm uppercase">Benefits</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Why Should You Donate?</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Donating blood isn't just good for the recipient—it's great for you too. Here are some key benefits.
                    </p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {benefits.map((benefit, index) => (
                        <motion.div variants={item} key={index}>
                            <Card
                                hoverEffect
                                className="h-full p-8 border border-gray-100 dark:border-teal-900/30 bg-white dark:bg-[#022C22] shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_0_20px_rgba(20,184,166,0.1)] transition-all duration-300 group"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <benefit.icon className="w-7 h-7" />
                                </div>
                                <CardTitle className="mb-3 text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-teal-400 transition-colors">
                                    {benefit.title}
                                </CardTitle>
                                <CardContent className="p-0">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default WhyDonate;
