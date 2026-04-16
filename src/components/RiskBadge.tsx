import React from 'react';

interface RiskBadgeProps {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  score: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ riskLevel, score }) => {
  const badgeConfig = {
    LOW: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      badge: 'bg-emerald-500',
      icon: '✓',
    },
    MEDIUM: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      badge: 'bg-amber-500',
      icon: '⚠',
    },
    HIGH: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      badge: 'bg-red-500',
      icon: '!',
    },
  };

  const config = badgeConfig[riskLevel];

  return (
    <div className={`inline-block rounded-full px-4 py-2 ${config.bg}`}>
      <div className="flex items-center gap-2">
        <div className={`flex items-center justify-center w-6 h-6 rounded-full ${config.badge} text-white text-sm font-bold`}>
          {config.icon}
        </div>
        <div>
          <p className={`text-sm font-bold ${config.text}`}>{riskLevel} Risk</p>
          <p className={`text-xs ${config.text} opacity-75`}>Score: {score}</p>
        </div>
      </div>
    </div>
  );
};

export default RiskBadge;
