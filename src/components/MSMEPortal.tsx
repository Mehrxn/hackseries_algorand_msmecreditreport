import React, { useState } from 'react';
import { DataIngestion } from './DataIngestion';
import { ScoreGauge } from './ScoreGauge';
import { RiskBadge } from './RiskBadge';
import { PassportPreview } from './PassportPreview';
import { BlockchainRegistration } from './BlockchainRegistration';
import { ScoringResult } from '../utils/scoring';

interface BusinessInfo {
  name: string;
  gstin: string;
}

interface RegisteredPassport {
  id: string;
  hash: string;
  txId: string;
}

export const MSMEPortal: React.FC = () => {
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: 'My Business',
    gstin: '29ABCDE1234F1Z5',
  });
  const [registeredPassport, setRegisteredPassport] = useState<RegisteredPassport | null>(null);

  const handleScoreCalculated = (result: ScoringResult) => {
    setScoringResult(result);
  };

  const handleRegistrationSuccess = (passportId: string, hash: string, txId: string) => {
    setRegisteredPassport({ id: passportId, hash, txId });
  };

  return (
    <div className="space-y-8">
      {/* Step 1: Data Ingestion */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>📊</span> Step 1: Upload Financial Data
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Data Ingestion */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📁 Upload Data</h3>
              <DataIngestion onScoreCalculated={handleScoreCalculated} />

              {/* Business Info Form */}
              <div className="mt-6 space-y-4 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700">Business Details</h4>
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

          {/* Right: Score Display */}
          <div className="lg:col-span-2">
            {scoringResult ? (
              <div className="bg-white rounded-xl shadow-md border border-slate-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Your Credit Score</h3>
                  <RiskBadge score={scoringResult.score} riskLevel={scoringResult.riskLevel} />
                </div>
                <ScoreGauge score={scoringResult.score} riskLevel={scoringResult.riskLevel} />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-slate-100 p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-600 text-lg">Upload your financial data to get started</p>
                <p className="text-gray-500 text-sm mt-2">
                  Your credit score will appear here once processed
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Step 2: Digital Passport & Blockchain */}
      {scoringResult && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>⛓️</span> Step 2: Register on Algorand
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Digital Passport */}
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">📱 Digital Passport</h3>
              <PassportPreview
                businessName={businessInfo.name}
                gstin={businessInfo.gstin}
                score={scoringResult.score}
                riskLevel={scoringResult.riskLevel}
                breakdown={scoringResult.breakdown}
              />
            </div>

            {/* Blockchain Registration */}
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">🔐 Register Passport</h3>
              <BlockchainRegistration
                businessInfo={businessInfo}
                scoringResult={scoringResult}
                onRegistrationSuccess={handleRegistrationSuccess}
              />
            </div>
          </div>
        </section>
      )}

      {/* Status Cards */}
      {scoringResult && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">✓ Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-emerald-700 uppercase">Status</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">Ready to Share</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-blue-700 uppercase">Credit Score</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{scoringResult.score}</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-indigo-700 uppercase">Risk Level</p>
              <p className="text-sm font-semibold text-indigo-900 mt-1">
                {scoringResult.riskLevel}
              </p>
            </div>
            <div className={`border rounded-lg p-4 ${registeredPassport ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <p className={`text-xs font-semibold uppercase ${registeredPassport ? 'text-emerald-700' : 'text-amber-700'}`}>Blockchain</p>
              <p className={`text-2xl font-bold mt-1 ${registeredPassport ? 'text-emerald-900' : 'text-amber-900'}`}>
                {registeredPassport ? '✅ Registered' : '⏳ Pending'}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MSMEPortal;