import { AnimatedCard } from "./AnimatedComponents";
import { TrendingUp, Zap, DollarSign, CheckCircle } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color,
  delay = 0,
}) => {
  return (
    <AnimatedCard delay={delay} className="relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
            {value}
          </h3>
        </div>
        <div className={`p-4 rounded-lg ${color}`}>{icon}</div>
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">{icon}</div>
    </AnimatedCard>
  );
};

interface SummaryCardsProps {
  totalLoans: number;
  activeLoans: number;
  totalPaid: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalLoans,
  activeLoans,
  totalPaid,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <DashboardCard
        title="Total Loans"
        value={totalLoans}
        icon={<Zap size={32} className="text-blue-600" />}
        color="bg-blue-100 dark:bg-blue-900"
        delay={0}
      />
      <DashboardCard
        title="Active Loans"
        value={activeLoans}
        icon={<TrendingUp size={32} className="text-amber-600" />}
        color="bg-amber-100 dark:bg-amber-900"
        delay={0.1}
      />
      <DashboardCard
        title="Total Paid"
        value={`₱${totalPaid.toLocaleString()}`}
        icon={<DollarSign size={32} className="text-green-600" />}
        color="bg-green-100 dark:bg-green-900"
        delay={0.2}
      />
      <DashboardCard
        title="Approved Loans"
        value={activeLoans}
        icon={<CheckCircle size={32} className="text-purple-600" />}
        color="bg-purple-100 dark:bg-purple-900"
        delay={0.3}
      />
    </div>
  );
};
