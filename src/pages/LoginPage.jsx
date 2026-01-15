import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Droplet, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // 1. Explicit Empty Field Validation
        if (!credentials.identifier.trim() || !credentials.password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const donors = JSON.parse(localStorage.getItem('donors') || '[]');
        const { identifier, password } = credentials;

        const user = donors.find(d =>
            (d.email === identifier || d.phone === identifier) && d.password === password
        );

        if (user) {
            localStorage.setItem('loggedInDonor', JSON.stringify(user));
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/donor-dashboard');
            }, 1500);
        } else {
            const userExists = donors.some(d => d.email === identifier || d.phone === identifier);

            if (userExists) {
                setError('Invalid login details');
            } else {
                setError('Account not found. Please register as a donor.');
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-gray-50 dark:bg-[#022C22] transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="w-full shadow-2xl border border-gray-100 dark:border-teal-900/50 bg-white dark:bg-[#0A1815] overflow-hidden rounded-2xl">
                    <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    <CardHeader className="text-center space-y-4 pt-8">
                        <motion.div
                            initial={{ rotate: -180, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="mx-auto bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full w-fit"
                        >
                            <Droplet className="w-8 h-8 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
                        </motion.div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</CardTitle>
                            <CardDescription className="text-gray-500 dark:text-gray-400 mt-1">Sign in to manage your donations</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4 pb-8 px-8">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2"
                                    >
                                        <AlertCircle className="w-4 h-4" /> {error}
                                    </motion.div>
                                )}
                                {showSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg text-sm flex items-center gap-2 font-medium"
                                    >
                                        <Loader2 className="w-4 h-4 animate-spin" /> Login successful. Welcome back!
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Input
                                label="Email or Mobile Number"
                                name="identifier"
                                placeholder="john@example.com or 9876543210"
                                value={credentials.identifier}
                                onChange={handleChange}
                                required
                                className="h-11 dark:bg-[#152320] dark:border-[#2A453F] dark:focus:border-teal-500 dark:focus:ring-teal-500/20"
                            />
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                className="h-11 dark:bg-[#152320] dark:border-[#2A453F] dark:focus:border-teal-500 dark:focus:ring-teal-500/20"
                            />

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                    <span className="text-gray-600 dark:text-gray-400 group-hover:text-emerald-500 transition-colors">Remember me</span>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading || showSuccess}
                                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30"
                                size="lg"
                            >
                                {isLoading || showSuccess ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-gray-100 dark:border-gray-800 py-6 bg-gray-50 dark:bg-[#06110E]">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account? <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 ml-1">Sign up</Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default LoginPage;
