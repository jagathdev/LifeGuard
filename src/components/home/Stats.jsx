import { Users, Heart, Activity, Droplet } from 'lucide-react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const StatCard = ({ label, value, icon: Icon, colorClass, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const springValue = useSpring(0, { stiffness: 50, damping: 20, duration: 2000 });
    const displayValue = useTransform(springValue, (latest) => Math.floor(latest).toLocaleString());

    useEffect(() => {
        if (isInView) {
            // Remove non-numeric chars for animation
            const numericValue = parseInt(value.toString().replace(/,/g, '').replace('+', ''));
            springValue.set(numericValue);
        }
    }, [isInView, value, springValue]);

    return (
        <div ref={ref} className="bg-white dark:bg-[#0A1815] p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-teal-900/40 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
            {/* Background Glow */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${colorClass} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>

            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gray-50 dark:bg-[#022C22] text-transparent bg-clip-text bg-gradient-to-br ${colorClass}`}>
                    <Icon className={`w-8 h-8 stroke-current text-[var(--color-primary)] dark:text-teal-400`} />
                </div>
                <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></span>
                    <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${colorClass} animate-pulse`}></span>
                </div>
            </div>

            <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
                <motion.span>{displayValue}</motion.span><span>+</span>
            </h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        </div>
    )
}

const Stats = () => {
    const stats = [
        { label: 'Total Donors', value: '12500', icon: Users, colorClass: 'from-blue-400 to-blue-600' },
        { label: 'Lives Saved', value: '25000', icon: Heart, colorClass: 'from-red-400 to-red-600' },
        { label: 'Blood Units', value: '18400', icon: Droplet, colorClass: 'from-emerald-400 to-emerald-600' },
        { label: 'Active Requests', value: '142', icon: Activity, colorClass: 'from-orange-400 to-orange-600' },
    ];

    return (
        <section className="py-20 relative bg-emerald-50/50 dark:bg-black/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-12 text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Impact in Numbers</h2>
                    <p className="text-gray-600 dark:text-gray-400">Every number represents a life touched, a hope restored, and a community strengthened.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            {...stat}
                            delay={index * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
