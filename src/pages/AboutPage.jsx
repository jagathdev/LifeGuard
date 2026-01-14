import { motion } from 'framer-motion';
import {
    Heart, ShieldCheck, Clock, CheckCircle, Target, Users, Globe, Lock, Activity, Eye, Zap, ArrowRight
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="bg-white dark:bg-[#022C22] min-h-screen">
            {/* 1. Hero / Who We Are */}
            <section className="relative py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-[#022C22] dark:to-[#053D32] opacity-50 z-0"></div>
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide mb-6 inline-block">
                                Who We Are
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                Bridging the gap between <span className="text-emerald-600 dark:text-emerald-400">donors</span> and <span className="text-emerald-600 dark:text-emerald-400">patients</span>.
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                                BloodLink is more than a platform; it's a movement using technology to connect donors with patients in critical need. We are dedicated to ensuring that no call for help goes unanswered.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Clock, title: "24/7 Availability", desc: "Always on, because emergencies don't wait." },
                            { icon: ShieldCheck, title: "Verified Donors", desc: "Trusted community of health-checked heroes." },
                            { icon: Zap, title: "Real-time Connection", desc: "Instant alerts to donors nearby." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-[#0A1815] p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-teal-900/30 text-center hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. Mission & Vision */}
            <section className="py-20 bg-gray-50 dark:bg-[#06130F]">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <Target className="w-12 h-12 mb-6 text-emerald-200" />
                            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                            <p className="text-emerald-50 text-lg leading-relaxed opacity-90">
                                "No life should be lost due to lack of timely blood."
                            </p>
                            <p className="mt-4 text-sm text-emerald-100 opacity-70">
                                We strive to build a network where accessibility matches urgency.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white dark:bg-[#0A1815] border border-gray-200 dark:border-teal-900/50 rounded-3xl p-10 relative overflow-hidden shadow-xl"
                        >
                            <Eye className="w-12 h-12 mb-6 text-emerald-600 dark:text-emerald-400" />
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                "A future with instant, reliable donor access for everyone, everywhere."
                            </p>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                Creating a world where the search for blood is the least of a patient's worries.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. How It Works */}
            <section className="py-24">
                <div className="container mx-auto max-w-6xl px-4 text-center">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
                        <p className="text-gray-600 dark:text-gray-400">Simplifying the lifecycle of a donation.</p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center relative">
                        {/* Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-teal-900/30 -z-10 -translate-y-1/2"></div>

                        {[
                            { step: "01", title: "Donor Registration", desc: "Sign up & verify details" },
                            { step: "02", title: "Patient Search", desc: "Find matches nearby" },
                            { step: "03", title: "Instant Contact", desc: "Connect directly" },
                            { step: "04", title: "Life Saved", desc: "Donation completes" }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center bg-white dark:bg-[#022C22] p-4 z-10 w-full md:w-auto">
                                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-lg shadow-emerald-200 dark:shadow-none">
                                    {step.step}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Why Needed & Impact */}
            <section className="py-24 bg-mint-white dark:bg-[#05110E]">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Why It's Needed</h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Blood Shortages", desc: "Hospitals often face critical shortages during emergencies." },
                                    { title: "Rare Blood Groups", desc: "Finding rare groups like AB- or O- can be impossible without a network." },
                                    { title: "Lack of Information", desc: "Fragmented data prevents timely donations." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-white dark:bg-[#0A1815] shadow-sm border border-gray-100 dark:border-teal-900/30">
                                        <div className="mt-1"><Activity className="w-6 h-6 text-red-500" /></div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Our Impact</h2>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { label: "Donors Registered", val: "12,000+" },
                                    { label: "Lives Saved", val: "25,000+" },
                                    { label: "Requests Connected", val: "8,500+" },
                                    { label: "Cities Covered", val: "120+" }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-emerald-600 dark:bg-teal-800 p-6 rounded-2xl text-white text-center shadow-lg">
                                        <p className="text-3xl font-bold mb-1">{stat.val}</p>
                                        <p className="text-emerald-100 text-sm font-medium uppercase">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Core Values */}
            <section className="py-24 text-center">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-12">
                        <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm">Our Principles</span>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Core Values</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Heart, title: "Humanity", desc: "Compassion drives every action we take." },
                            { icon: Eye, title: "Transparency", desc: "Open, honest, and clear in all operations." },
                            { icon: ShieldCheck, title: "Responsibility", desc: "We take ownership of our community role." },
                            { icon: Users, title: "Community", desc: "Together, we are stronger." }
                        ].map((val, i) => (
                            <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-all dark:bg-[#0A1815]">
                                <CardContent className="p-8">
                                    <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                                        <val.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{val.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{val.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Safety & CTA */}
            <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
                    <div className="mb-10 flex flex-col items-center">
                        <div className="bg-emerald-500/20 p-3 rounded-full mb-4">
                            <Lock className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Safety & Privacy Promise</h2>
                        <p className="text-gray-300 max-w-2xl">
                            We adhere to strict data privacy policies. Your personal information is encrypted and shared only when you explicitly agree to connect with a patient.
                        </p>
                    </div>

                    <div className="pt-8 border-t border-gray-800">
                        <h2 className="text-4xl font-bold mb-6">Ready to make a difference?</h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white border-none text-lg px-8 h-14">
                                    Join Our Mission <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/search">
                                <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-lg px-8 h-14">
                                    Find Donors
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AboutPage;
