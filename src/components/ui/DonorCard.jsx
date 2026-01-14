import { MapPin, Phone, Calendar, Droplet } from 'lucide-react';
import Button from './Button';
import { Card } from './Card';

const DonorCard = ({ donor }) => {
    return (
        <Card
            hoverEffect
            className="rounded-xl overflow-hidden border border-gray-100 dark:border-[#1F3A33] bg-white dark:bg-[#0A0F0D] hover:shadow-lg dark:hover:shadow-emerald-900/20 transition-all duration-300"
        >
            <div className="p-5 flex items-start gap-4">
                {/* Avatar / Badge */}
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-400">
                        {donor.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 border-2 border-white dark:border-[#0A0F0D] flex items-center justify-center">
                        <span className="text-xs font-bold text-red-500">{donor.bloodGroup}</span>
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{donor.name}</h3>

                    <div className="mt-2 space-y-1.5">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{donor.location}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Last Donated: {donor.lastDonated || 'Never'}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                            <Phone className="w-3.5 h-3.5 text-emerald-500" />
                            <span>+1-XXX-XXX-{donor.phone.slice(-4)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-5 pb-5">
                <Button
                    size="sm"
                    className="w-full rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800"
                >
                    Contact Donor
                </Button>
            </div>
        </Card>
    );
};

export default DonorCard;
