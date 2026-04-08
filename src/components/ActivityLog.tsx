import { getActivities } from "../services/storage";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export const ActivityLog: React.FC = () => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-6">
        <Clock size={24} className="text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Recent Activity
        </h2>
      </div>

      {activities.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No activities yet
        </p>
      ) : (
        <div className="space-y-3">
          {activities.slice(0, 5).map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between py-3 border-b dark:border-gray-700 last:border-b-0"
            >
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {activity.action}
              </p>
              <span className="text-xs text-gray-400">
                {formatTime(activity.timestamp)}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
