import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Droplet, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage = () => {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 py-12 bg-gray-50 dark:bg-[#022C22] transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-2xl"
            >
                <Card className="w-full shadow-2xl border border-gray-100 dark:border-teal-900/50 bg-white dark:bg-[#0A1815] overflow-hidden rounded-2xl">
                    <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    <CardHeader className="text-center space-y-4 pt-8">
                        <div className="mx-auto bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full w-fit">
                            <UserPlus className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</CardTitle>
                            <CardDescription className="text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">Join the BloodLink community and start your journey of saving lives.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 pt-4">
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                className="dark:bg-[#152320] dark:border-[#2A453F] dark:focus:border-teal-500"
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="john@example.com"
                                className="dark:bg-[#152320] dark:border-[#2A453F] dark:focus:border-teal-500"
                            />
                            <Input
                                label="Phone Number"
                                type="tel"
                                placeholder="+1 234 567 8900"
                                className="dark:bg-[#152320] dark:border-[#2A453F] dark:focus:border-teal-500"
                            />

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Group</label>
                                <select className="flex h-10 w-full rounded-md border border-gray-300 dark:border-[#2A453F] bg-white dark:bg-[#152320] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all">
                                    <option value="">Select Group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>

                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                className="dark:bg-[#152320] dark:border-[#2A453F] dark:focus:border-teal-500"
                            />
                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="••••••••"
                                className="dark:bg-[#152320] dark:border-[#2A453F] dark:focus:border-teal-500"
                            />

                            <div className="space-y-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-[#2A453F] bg-white dark:bg-[#152320] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                                    placeholder="Enter your full address"
                                />
                            </div>

                            <div className="md:col-span-2 flex items-center space-x-2 bg-gray-50 dark:bg-[#06110E] p-4 rounded-lg border border-gray-100 dark:border-teal-900/30">
                                <input type="checkbox" className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] h-4 w-4" required />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    I agree to the <a href="#" className="text-emerald-600 hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-emerald-600 hover:underline font-medium">Privacy Policy</a>
                                </span>
                            </div>

                            <div className="md:col-span-2">
                                <Button className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20" size="lg">Create Account</Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-gray-100 dark:border-gray-800 py-6 bg-gray-50 dark:bg-[#06110E]">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account? <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 ml-1 hover:underline">Sign in</Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
