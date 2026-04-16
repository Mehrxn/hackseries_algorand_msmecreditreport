import React from 'react';

interface ScoreGaugeProps {
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, riskLevel }) => {
  // Determine colors based on risk level
  const colorMap = {
    LOW: { gauge: '#10b981', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    MEDIUM: {
      gauge: '#f59e0b',
      text: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    HIGH: { gauge: '#ef4444', text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  };

  const colors = colorMap[riskLevel];

  // Calculate rotation: 0 score = -135deg, 100 score = 135deg (270deg total range)
  const rotation = (score / 100) * 270 - 135;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Circular Gauge Container */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Background circle */}
        <svg className="absolute w-full h-full" viewBox="0 0 200 200">
          {/* Gray background arc */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
            strokeDasharray="471"
            strokeDashoffset="0"
            opacity="0.3"
            style={{
              transform: 'rotate(-135deg)',
              transformOrigin: '100px 100px',
            }}
          />

          {/* Colored progress arc */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={colors.gauge}
            strokeWidth="12"
            strokeDasharray={`${(score / 100) * 471} 471`}
            opacity="1"
            style={{
              transform: 'rotate(-135deg)',
              transformOrigin: '100px 100px',
              transition: 'stroke-dasharray 0.5s ease',
            }}
          />
        </svg>

        {/* Center content */}
        <div className="flex flex-col items-center justify-center z-10">
          <span className={`text-5xl font-bold ${colors.text}`}>{score}</span>
          <span className="text-gray-500 text-sm mt-1">out of 100</span>
        </div>

        {/* Needle indicator */}
        <div
          className="absolute w-1.5 h-24 bg-gradient-to-b from-gray-800 to-gray-600 rounded-full"
          style={{
            bottom: '50%',
            left: '50%',
            transformOrigin: 'center bottom',
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            transition: 'transform 0.5s ease',
          }}
        />
      </div>

      {/* Score label and range */}
      <div className={`mt-8 px-6 py-3 rounded-lg border ${colors.bg} ${colors.border}`}>
        <p className={`text-center font-semibold ${colors.text}`}>
          {riskLevel === 'LOW' && 'Excellent Credit Profile'}
          {riskLevel === 'MEDIUM' && 'Moderate Credit Profile'}
          {riskLevel === 'HIGH' && 'High Risk Profile'}
        </p>
        <p className="text-xs text-gray-600 text-center mt-1">
          {riskLevel === 'LOW' && '75-100: Strong candidate for loans'}
          {riskLevel === 'MEDIUM' && '45-74: Conditional approval possible'}
          {riskLevel === 'HIGH' && '0-44: Requires detailed review'}
        </p>
      </div>

      {/* Score range indicator */}
      <div className="w-full mt-8 px-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
        <div className="w-full h-2 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full" />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span className="font-semibold text-red-600">High Risk</span>
          <span className="font-semibold text-amber-600">Medium</span>
          <span className="font-semibold text-emerald-600">Low Risk</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
