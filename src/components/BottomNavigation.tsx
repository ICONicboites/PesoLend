import { useNavigate, useLocation } from "react-router-dom";
import { Home, Plus, Activity, User } from "lucide-react";
import { motion } from "framer-motion";

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: Plus, label: "Apply", path: "/loans" },
    { icon: Activity, label: "Activity", path: "/transactions" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-40">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-around h-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition-colors ${
                isActive ? "text-orange-500" : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
