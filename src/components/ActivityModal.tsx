import { motion } from "framer-motion";
import { X, Clock } from "lucide-react";
import { getActivities } from "../services/storage";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose }) => {
  const activities = getActivities();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="card max-w-md w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-gray-800 py-4 -mx-6 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Recent Activity
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            <X size={24} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
          </motion.button>
        </div>

        {activities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Clock size={40} className="mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No activities yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Your activities will appear here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-1">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group"
              >
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-relaxed">
                    {activity.action}
                  </p>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 inline-block">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
                <div className="w-1 h-1 bg-amber-500 rounded-full mt-2 ml-2 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
