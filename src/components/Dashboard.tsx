import React, { useState } from 'react';
import { DataIngestion } from './DataIngestion';
import { ScoreGauge } from './ScoreGauge';
import { RiskBadge } from './RiskBadge';
import { PassportPreview } from './PassportPreview';
import { ScoringResult } from '../utils/scoring';

interface BusinessInfo {
  name: string;
  gstin: string;
}

export const Dashboard: React.FC = () => {
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: 'My Business',
    gstin: '29ABCDE1234F1Z5',
  });

  const handleScoreCalculated = (result: ScoringResult) => {
    setScoringResult(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900">
            MSME Credit <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Reputation Passport</span>
          </h1>
          <p className="text-gray-600 mt-2">Transparent, instant credit scoring for small businesses</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Data Ingestion */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📁 Upload Financial Data</h2>
              <DataIngestion onScoreCalculated={handleScoreCalculated} />

              {/* Business Info Form */}
              <div className="mt-6 space-y-4 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">Business Details</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={businessInfo.name}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter business name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={businessInfo.gstin}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, gstin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter GSTIN"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Score Display & Passport */}
          <div className="lg:col-span-2 space-y-8">
            {scoringResult ? (
              <>
                {/* Score Gauge */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Your Credit Score</h2>
                    <RiskBadge score={scoringResult.score} riskLevel={scoringResult.riskLevel} />
                  </div>
                  <ScoreGauge score={scoringResult.score} riskLevel={scoringResult.riskLevel} />
                </div>

                {/* Digital Passport */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">📱 Digital Passport</h2>
                  <PassportPreview
                    businessName={businessInfo.name}
                    gstin={businessInfo.gstin}
                    score={scoringResult.score}
                    riskLevel={scoringResult.riskLevel}
                    breakdown={scoringResult.breakdown}
                  />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                    <p className="text-xs font-semibold text-emerald-700 uppercase">Status</p>
                    <p className="text-2xl font-bold text-emerald-900 mt-1">Ready to Share</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs font-semibold text-blue-700 uppercase">Next Step</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">Register & Verify</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-600 text-lg">Upload your financial data to get started</p>
                <p className="text-gray-500 text-sm mt-2">
                  Your credit score will appear here once processed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
