import { useState } from 'react';
import { Droplet, Facebook, Instagram, Mail, Phone, MapPin, Linkedin, Link } from 'lucide-react';
import Modal from '../ui/Modal';

const FOOTER_CONTENT = {
    eligibility: {
        title: "Eligibility Requirements",
        content: (
            <div className="space-y-4">
                <p>To ensure the safety of both donors and recipients, all blood donors must meet specific eligibility criteria. These guidelines help maintain a safe blood supply.</p>

                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mt-4">Basic Requirements</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Age:</strong> You must be between 18 and 65 years old. (16-17 year olds may donate with parental consent in some regions).</li>
                    <li><strong>Weight:</strong> You must weigh at least 50 kg (110 lbs).</li>
                    <li><strong>Health:</strong> You must be in generally good health and feeling well on the day of donation.</li>
                </ul>

                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mt-4">Deferral Criteria</h3>
                <p>You may need to wait to donate if you have:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Traveled to certain countries with malaria risk in the last year.</li>
                    <li>Received a tattoo or body piercing in the last 3 to 12 months (depending on state regulations).</li>
                    <li>Had a cold, flu, or infection in the past week.</li>
                    <li>Undergone major surgery recently.</li>
                </ul>
            </div>
        )
    },
    process: {
        title: "Donation Process",
        content: (
            <div className="space-y-4">
                <p>Donating blood is simple, safe, and typically takes less than an hour from arrival to departure. Here is what you can expect:</p>

                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mt-4">1. Registration</h3>
                <p>Upon arrival, you will complete a brief registration form. You will need to bring a valid ID (driver's license, donor card, etc.). We will verify your name, address, and date of birth.</p>

                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mt-4">2. Health History & Mini-Physical</h3>
                <p>You will answer confidential questions about your health and travel history. We will check your temperature, pulse, blood pressure, and hemoglobin levels to ensure it is safe for you to donate.</p>

                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mt-4">3. The Donation</h3>
                <p>The actual blood donation takes about 8-10 minutes. You will sit comfortably while a pint of blood is drawn. New, sterile equipment is used for every donor.</p>

                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mt-4">4. Refreshments & Recovery</h3>
                <p>After donating, you will rest for 10-15 minutes and enjoy some snacks and a drink to help your body recover. Then you can resume your normal activities!</p>
            </div>
        )
    },
    benefits: {
        title: "Health Benefits of Donating",
        content: (
            <div className="space-y-4">
                <p>While the primary benefit of blood donation is saving lives, regular donors also experience personal health benefits.</p>

                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Free Health Screening:</strong> Every time you donate, you get a mini-physical that checks your pulse, blood pressure, body temperature, and hemoglobin levels.</li>
                    <li><strong>Heart Health:</strong> Regular blood donation may help lower iron stores in the body, potentially reducing the risk of heart disease and heart attacks.</li>
                    <li><strong>Calorie Burn:</strong> The body works to replenish blood volume after donation, which can burn approximately 650 calories per donation.</li>
                    <li><strong>Psychological Well-being:</strong> The knowledge that you are helping others and saving lives can significantly boost your mood and sense of purpose.</li>
                </ul>

                <p className="italic text-sm text-gray-500 mt-4">Note: Blood donation is not a substitute for medical care, but it offers valuable insights into your health.</p>
            </div>
        )
    },
    faqs: {
        title: "Common FAQs",
        content: (
            <div className="space-y-6">
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Does it hurt?</h4>
                    <p>You may feel a slight pinch when the needle goes in, but most donors report that it is painless during the actual donation process.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">How long does it take?</h4>
                    <p>The entire process takes about 45-60 minutes, but the actual blood draw only takes 8-10 minutes.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">How often can I donate?</h4>
                    <p>You can donate whole blood every 56 days (8 weeks). Platelet donation can be done more frequently, up to every 7 days.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Is it safe?</h4>
                    <p>Yes. A new, sterile needle is used for each donor and then discarded. You cannot contract any disease from donating blood.</p>
                </div>
            </div>
        )
    },
    volunteer: {
        title: "Volunteer with Us",
        content: (
            <div className="space-y-4">
                <p>Join our community of lifesavers! We are always looking for passionate volunteers to help us in our mission.</p>

                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mt-4">Volunteer Roles</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Blood Drive Coordinator:</strong> Organize and host blood drives in your community, school, or workplace.</li>
                    <li><strong>Donor Ambassador:</strong> Welcome donors at blood drives, manage the canteen area, and ensure donors have a great experience.</li>
                    <li><strong>Transportation Specialist:</strong> Help transport blood products to hospitals (valid license required).</li>
                    <li><strong>Office Support:</strong> Assist with administrative tasks, phone calls, and donor scheduling.</li>
                </ul>

                <p className="mt-4">Ready to start? Contact us at <strong>volunteer@lifeguard.com</strong> for more information.</p>
            </div>
        )
    },
    privacy: {
        title: "Privacy Policy",
        content: (
            <div className="space-y-4 text-sm">
                <p>At LifeGuard, we are committed to protecting your privacy and ensuring the security of your personal information.</p>

                <h3 className="font-semibold text-gray-900 dark:text-white mt-4">Information We Collect</h3>
                <p>We collect personal information such as your name, contact details, health history, and donation records to process your donation securely and safely.</p>

                <h3 className="font-semibold text-gray-900 dark:text-white mt-4">How We Use Your Data</h3>
                <p>Your data is used solely for donor eligibility verification, communication regarding your appointments, and maintaining a safe blood supply. We specifically do not sell or trade your personal information.</p>

                <h3 className="font-semibold text-gray-900 dark:text-white mt-4">Security</h3>
                <p>We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure.</p>
            </div>
        )
    },
    terms: {
        title: "Terms of Service",
        content: (
            <div className="space-y-4 text-sm">
                <p>By using the LifeGuard website and services, you agree to the following terms:</p>

                <ul className="list-decimal pl-5 space-y-2">
                    <li>You agree to provide accurate and truthful information during registration and screening.</li>
                    <li>You acknowledge that blood donation is a voluntary act.</li>
                    <li>You agree to behave respectfully towards staff and other donors at our facilities.</li>
                    <li>LifeGuard reserves the right to defer donors based on medical eligibility criteria.</li>
                    <li>Website content is for informational purposes only and is not a substitute for professional medical advice.</li>
                </ul>
            </div>
        )
    },
    cookie: {
        title: "Cookie Policy",
        content: (
            <div className="space-y-4 text-sm">
                <p>Our website uses cookies to enhance your browsing experience.</p>

                <h3 className="font-semibold text-gray-900 dark:text-white mt-4">What are Cookies?</h3>
                <p>Cookies are small text files stored on your device that help us remember your preferences and analyze site traffic.</p>

                <h3 className="font-semibold text-gray-900 dark:text-white mt-4">Types of Cookies We Use</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Essential Cookies:</strong> Necessary for the website to function (e.g., login sessions).</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site.</li>
                </ul>

                <p className="mt-2">You can manage your cookie preferences through your browser settings.</p>
            </div>
        )
    }
};

const Footer = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (key) => {
        setActiveModal(key);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    const FooterLink = ({ label, modalKey }) => (
        <li>
            <button
                onClick={() => openModal(modalKey)}
                className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors text-left"
            >
                {label}
            </button>
        </li>
    );

    return (
        <>
            <footer className="bg-white dark:bg-deep-midnight border-t border-gray-100 dark:border-teal-900/50 pt-16 pb-8 transition-colors duration-300">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* About Column */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2">
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                                    <Droplet className="h-6 w-6 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
                                </div>
                                <span className="text-2xl font-bold bg-linear-to-r from-emerald-700 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                                    LifeGuard
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-emerald-100/70 text-sm leading-relaxed">
                                Connecting donors with those in need. Every drop counts, every life matters. Join our mission to create a world where no one waits for blood.
                            </p>
                            <div className="flex space-x-4">
                                <a href="https://www.facebook.com/blooddonorsinChennai/" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-emerald-900/20 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-gray-600 dark:text-emerald-300 hover:text-emerald-600 transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </a>

                                <a href="https://www.instagram.com/bloodconnectorg/?hl=en" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-emerald-900/20 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-gray-600 dark:text-emerald-300 hover:text-emerald-600 transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a href="https://www.linkedin.com/in/jagathdevloper/" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-emerald-900/20 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-gray-600 dark:text-emerald-300 hover:text-emerald-600 transition-colors">
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

                        {/* Donor Resources */}
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-emerald-50 mb-6 text-lg">Donor Resources</h3>
                            <ul className="space-y-3 text-sm text-gray-600 dark:text-emerald-100/70">
                                <FooterLink label="Eligibility Requirements" modalKey="eligibility" />
                                <FooterLink label="Donation Process" modalKey="process" />
                                <FooterLink label="Health Benefits" modalKey="benefits" />
                                <FooterLink label="Common FAQs" modalKey="faqs" />
                                <FooterLink label="Volunteer with Us" modalKey="volunteer" />
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-emerald-50 mb-6 text-lg">Contact Us</h3>
                            <ul className="space-y-4 text-sm text-gray-600 dark:text-emerald-100/70">
                                <li className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                                    <span>123 Life Street, Chennai - 600083 <br />Tamil Nadu,India</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>+91 9360270984</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>support@lifeguard.com</span>
                                </li>
                            </ul>
                        </div>

                    </div>

                    <div className="border-t border-gray-100 dark:border-teal-900/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-emerald-100/50">
                        <p>© {new Date().getFullYear()} LifeGuard. All rights reserved.</p>
                        <ul className="flex gap-6">
                            <li><button onClick={() => openModal('privacy')} className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">Privacy Policy</button></li>
                            <li><button onClick={() => openModal('terms')} className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">Terms of Service</button></li>
                            <li><button onClick={() => openModal('cookie')} className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">Cookie Policy</button></li>
                        </ul>
                    </div>
                </div>
            </footer >

            {/* Reusable Modal Component */}
            < Modal
                isOpen={!!activeModal
                }
                onClose={closeModal}
                title={activeModal ? FOOTER_CONTENT[activeModal].title : ''}
            >
                {activeModal && FOOTER_CONTENT[activeModal].content}
            </Modal >
        </>
    );
};

export default Footer;
