import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '../../lib/utils';

const Toast = ({ id, type = 'info', message, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    };

    const bgColors = {
        success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={cn(
                "flex items-center w-full max-w-sm p-4 mb-3 text-gray-800 dark:text-gray-100 rounded-xl shadow-lg border backdrop-blur-sm",
                bgColors[type]
            )}
            role="alert"
        >
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <div className="ml-3 text-sm font-medium pr-6">
                {message}
            </div>
            <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/10 inline-flex items-center justify-center h-8 w-8 transition-colors"
                onClick={() => onClose(id)}
                aria-label="Close"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

export default Toast;
