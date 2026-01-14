import { Quote, Star } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { motion } from 'framer-motion';

const testimonials = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Donor',
        content: "The process was incredibly smooth. I'm proud to contribute to such a noble cause. The app made it so easy to find a nearby drive.",
        image: 'https://i.pravatar.cc/150?img=1',
        rating: 5
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Recipient Cousin',
        content: "When my cousin needed blood urgently, BloodLink connected us with a donor in under 30 minutes. It truly saves lives.",
        image: 'https://i.pravatar.cc/150?img=11',
        rating: 5
    },
    {
        id: 3,
        name: 'Emily Davis',
        role: 'Regular Donor',
        content: "I love the community features. Seeing the impact of my donations keeps me motivated to give regularly.",
        image: 'https://i.pravatar.cc/150?img=5',
        rating: 4
    },
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-orange-50/50 dark:bg-[#062118]">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Voices of Impact</h2>
                    <p className="text-gray-600 dark:text-gray-400">Stories from our heroes and those they've helped.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <Card className="h-full bg-white dark:bg-[#0B1A15] border-none shadow-xl hover:shadow-2xl transition-shadow relative overflow-visible">
                                <div className="absolute -top-6 left-8">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Quote className="w-6 h-6 text-white rotate-180 fill-white" />
                                    </div>
                                </div>
                                <CardContent className="p-8 pt-10">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 italic mb-8 relative z-10 leading-relaxed min-h-[80px]">"{t.content}"</p>

                                    <div className="flex items-center gap-4 mt-auto border-t border-gray-100 dark:border-gray-800 pt-6">
                                        <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100 dark:ring-emerald-900" />
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</h4>
                                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wide">{t.role}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
