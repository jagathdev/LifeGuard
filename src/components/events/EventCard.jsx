import React from 'react';
import { MapPin, Calendar, Clock, User, QrCode } from 'lucide-react';

const EventCard = ({ event }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    // Calculate days remaining
    const timeDiff = eventDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Determine badge color
    const isUrgent = daysRemaining <= 3 && daysRemaining >= 0;

    // Generate QR Code URL
    const qrData = JSON.stringify({
        id: event.id,
        title: event.title,
        org: event.organization,
        date: event.date,
        loc: `${event.city}, ${event.district}`
    });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

    return (
        <div className="bg-white dark:bg-[#0A1210] rounded-2xl shadow-sm border border-gray-100 dark:border-teal-900/30 overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            <div className="relative h-32 bg-emerald-100 dark:bg-emerald-900/20 overflow-hidden">
                <div className="absolute inset-0 pattern-grid-lg opacity-10"></div>

                {/* Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${isUrgent
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 animate-pulse'
                    : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                    }`}>
                    {daysRemaining === 0 ? 'Today' : `${daysRemaining} Days Left`}
                </div>

                {/* QR Code Overlay (Hover) */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-10 p-4">
                    <img src={qrCodeUrl} alt="Event QR" className="w-24 h-24 rounded-lg bg-white p-1" />
                    <p className="text-white text-xs mt-2 absolute bottom-2 font-medium">Scan to Register</p>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 line-clamp-1">{event.organization}</h3>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">{event.title}</h2>

                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                    <div className="flex items-start gap-2.5">
                        <Calendar className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{event.day}, {event.date}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{event.time}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{event.city}, {event.district}, {event.state}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-teal-900/30 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span className="max-w-[120px] truncate">By {event.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium uppercase tracking-wide">
                        <QrCode className="w-3 h-3" />
                        Hover for QR
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
