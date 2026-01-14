import { Droplet, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-[#022C22] border-t border-gray-100 dark:border-teal-900/50 pt-16 pb-8 transition-colors duration-300">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* About Column */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                                <Droplet className="h-6 w-6 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                                BloodLink
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-emerald-100/70 text-sm leading-relaxed">
                            Connecting donors with those in need. Every drop counts, every life matters. Join our mission to create a world where no one waits for blood.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-gray-100 dark:bg-emerald-900/20 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-gray-600 dark:text-emerald-300 hover:text-emerald-600 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-100 dark:bg-emerald-900/20 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-gray-600 dark:text-emerald-300 hover:text-emerald-600 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-100 dark:bg-emerald-900/20 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-gray-600 dark:text-emerald-300 hover:text-emerald-600 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-100 dark:bg-emerald-900/20 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-gray-600 dark:text-emerald-300 hover:text-emerald-600 transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-emerald-50 mb-6 text-lg">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-emerald-100/70">
                            <li><a href="/" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>Home</a></li>
                            <li><a href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>About Us</a></li>
                            <li><a href="/search" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>Find Donor</a></li>
                            <li><a href="/register" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>Donate Now</a></li>
                            <li><a href="/emergency" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>Emergency Requests</a></li>
                        </ul>
                    </div>

                    {/* Donor Resources - New Column */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-emerald-50 mb-6 text-lg">Donor Resources</h3>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-emerald-100/70">
                            <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">Eligibility Requirements</a></li>
                            <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">Donation Process</a></li>
                            <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">Health Benefits</a></li>
                            <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">Common FAQs</a></li>
                            <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">Volunteer with Us</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-emerald-50 mb-6 text-lg">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-600 dark:text-emerald-100/70">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                                <span>123 Life Street, Medical District,<br />New York, NY 10001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-emerald-500 shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-emerald-500 shrink-0" />
                                <span>support@bloodlink.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-gray-100 dark:border-teal-900/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-emerald-100/50">
                    <p>© {new Date().getFullYear()} BloodLink. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-300">Privacy Policy</a>
                        <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-300">Terms of Service</a>
                        <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-300">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
