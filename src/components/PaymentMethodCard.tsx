import { motion } from 'framer-motion';
import { CreditCard, TrendingDown, TrendingUp } from 'lucide-react';
import { PaymentMethod } from '../services/storage';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected?: boolean;
  onClick?: () => void;
  onManageClick?: () => void;
}

const iconMap: Record<string, JSX.Element> = {
  'GCash': <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">G</div>,
  'Bank Transfer': <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold">B</div>,
  'PayPal': <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">P</div>,
  'Other': <CreditCard className="w-8 h-8 text-gray-500" />,
};

export const PaymentMethodCard = ({
  method,
  isSelected = false,
  onClick,
  onManageClick,
}: PaymentMethodCardProps) => {
  const formatBalance = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const isLowBalance = method.available_balance < 100000;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`card cursor-pointer transition-all ${
        isSelected 
          ? 'border-2 border-red-500 ring-2 ring-red-200 dark:ring-red-900' 
          : 'hover:border-red-300'
      }`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {iconMap[method.type] || iconMap['Other']}
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {method.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {method.status === 'Active' ? '✓ Active' : '● Inactive'}
              </p>
            </div>
          </div>
        </div>

        {/* Balance Display */}
        <div className="space-y-1">
          <p className="text-xs text-gray-600 dark:text-gray-400">Available Balance</p>
          <p className={`text-2xl font-bold ${
            isLowBalance 
              ? 'text-orange-600 dark:text-orange-400' 
              : 'text-gray-800 dark:text-white'
          }`}>
            {formatBalance(method.available_balance)}
          </p>
        </div>

        {/* Low Balance Warning */}
        {isLowBalance && (
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded text-xs text-orange-700 dark:text-orange-300 flex items-center gap-2">
            <TrendingDown size={14} />
            <span>Balance is running low</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Created</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {new Date(method.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Status</p>
            <p className={`text-sm font-semibold ${
              method.status === 'Active'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {method.status}
            </p>
          </div>
        </div>

        {/* Manage Button */}
        {onManageClick && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onManageClick();
            }}
            className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium transition-colors text-sm"
          >
            Manage Balance & Transactions
          </motion.button>
        )}

        {/* Select Button */}
        {onClick && !onManageClick && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-2 rounded font-medium transition-colors text-sm ${
              isSelected
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white'
            }`}
          >
            {isSelected ? 'Selected' : 'Select'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
