import React from 'react';

export const LenderVerification: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>🔍</span> Lender Verification Portal
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🏦</div>
          <p className="text-gray-600 text-lg">Lender Verification Interface Coming Soon</p>
          <p className="text-gray-500 text-sm mt-2">
            This will allow banks to verify MSME passport authenticity by comparing on-chain hashes
          </p>
        </div>
      </section>
    </div>
  );
};

export default LenderVerification;