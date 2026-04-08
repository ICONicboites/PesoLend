import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Plus, Activity, User } from "lucide-react";
import { motion } from "framer-motion";
import { ProfileModal } from "./ProfileModal";

interface NavItem {
  icon: any;
  label: string;
  path?: string;
  action?: "profile";
}

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems: NavItem[] = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: Plus, label: "Apply", path: "/loans" },
    { icon: Activity, label: "Activity", path: "/transactions" },
    { icon: User, label: "Profile", action: "profile" },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.action === "profile") {
      setIsProfileOpen(true);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-around h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path && location.pathname === item.path;
            return (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavClick(item)}
                className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition-colors ${
                  isActive
                    ? "text-amber-500"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                }`}
              >
                <Icon size={24} />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};
