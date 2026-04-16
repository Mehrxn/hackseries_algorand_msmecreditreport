import React from 'react';
import { ScoringResult } from '../utils/scoring';

interface PassportPreviewProps {
  businessName?: string;
  gstin?: string;
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  breakdown: ScoringResult['breakdown'];
}

export const PassportPreview: React.FC<PassportPreviewProps> = ({
  businessName = 'Sample MSME Business',
  gstin = '29ABCDE1234F1Z5',
  score,
  riskLevel,
  breakdown,
}) => {
  // Generate sample passport JSON
  const passportData = {
    passport_id: `MSME-2026-${Math.floor(Math.random() * 10000)}`,
    business_name: businessName,
    gstin: gstin,
    credit_score: score,
    risk_level: riskLevel,
    generated_at: new Date().toISOString(),
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    scoring_breakdown: breakdown,
    hash_sha256: 'a3f8c1d9e2b74605...',
  };

  return (
    <div className="w-full space-y-4">
      {/* Passport Card Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-90">Passport ID</p>
            <p className="text-2xl font-bold font-mono">{passportData.passport_id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Credit Score</p>
            <p className="text-3xl font-bold">{score}</p>
          </div>
        </div>
      </div>

      {/* Business Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs font-semibold text-gray-600 uppercase">Business Name</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">{businessName}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs font-semibold text-gray-600 uppercase">GSTIN</p>
          <p className="text-lg font-mono text-gray-900 mt-1">{gstin}</p>
        </div>
      </div>

      {/* Scoring Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase mb-4">Scoring Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(breakdown).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-sm font-bold text-gray-900">{value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${value}%`,
                    backgroundColor: value >= 75 ? '#10b981' : value >= 45 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* JSON Preview */}
      <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto max-h-48 overflow-y-auto">
        <pre>{JSON.stringify(passportData, null, 2)}</pre>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
        <div>
          <p className="font-semibold">Generated:</p>
          <p>{new Date(passportData.generated_at).toLocaleString()}</p>
        </div>
        <div>
          <p className="font-semibold">Valid Until:</p>
          <p>{new Date(passportData.valid_until).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PassportPreview;
