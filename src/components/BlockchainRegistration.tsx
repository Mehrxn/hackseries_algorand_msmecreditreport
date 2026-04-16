import React, { useState } from 'react';
import SHA256 from 'crypto-js/sha256';
import { useWallet } from '@txnlab/use-wallet-react';
import { AlgorandClient } from '@algorandfoundation/algokit-utils';
import { ScoringResult } from '../utils/scoring';
import { PassportRegistryClient } from '../contracts/PassportRegistry';

interface BlockchainRegistrationProps {
  businessInfo: { name: string; gstin: string };
  scoringResult: ScoringResult;
  onRegistrationSuccess: (passportId: string, hash: string, txId: string) => void;
}

export const BlockchainRegistration: React.FC<BlockchainRegistrationProps> = ({
  businessInfo,
  scoringResult,
  onRegistrationSuccess,
}) => {
  const { activeAddress, transactionSigner } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [txId, setTxId] = useState<string>('');

  const registerPassport = async () => {
    setIsLoading(true);
    setError('');
    setTxId('');

    try {
      if (!activeAddress) {
        throw new Error('Wallet not connected');
      }

      // Generate passport JSON
      const passportData = {
        passport_id: `MSME-2026-${Math.floor(Math.random() * 100000)}`,
        business_name: businessInfo.name,
        gstin: businessInfo.gstin,
        credit_score: scoringResult.score,
        risk_level: scoringResult.riskLevel,
        monthly_income_avg: 62000, // This would come from form in production
        expense_ratio: 0.61,
        transaction_consistency: scoringResult.breakdown.transactionFrequency / 100,
        gst_compliance_score: scoringResult.breakdown.gstCompliance,
        generated_at: new Date().toISOString(),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      // Generate SHA-256 hash
      const passportJson = JSON.stringify(passportData);
      const hashHex = SHA256(passportJson).toString();

      // Convert hex to Uint8Array for blockchain
      const hashBytes = new Uint8Array(Buffer.from(hashHex, 'hex'));

      // Initialize Algorand client (connect to localnet)
      const algorand = AlgorandClient.fromEnvironment();

      // Get the typed app client
      const client = new PassportRegistryClient({
        algorand,
        defaultSigner: transactionSigner,
      });

      // For now, we'll need to deploy the contract first or get the app ID
      // This is a placeholder - in production you'd have the deployed app ID
      throw new Error('Smart contract not yet deployed. Please deploy the contract first.');

      // Call register_passport method
      // const result = await client.registerPassport({
      //   passport_id: passportData.passport_id,
      //   passport_hash: hashBytes,
      // });

      // setTxId(result.transaction.txID());
      // onRegistrationSuccess(passportData.passport_id, hashHex, result.transaction.txID());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to register passport. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h3 className="text-lg font-bold text-gray-900 mb-6">🔐 Register Passport on Blockchain</h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-semibold">Error:</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {txId && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">✓</span>
            <p className="font-semibold text-emerald-900">Passport Registered Successfully!</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600 uppercase">Transaction ID</p>
            <p className="font-mono text-xs bg-white border border-gray-200 rounded p-2 text-gray-900 break-all">
              {txId}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>What happens next:</strong> Your passport data will be hashed and stored on Algorand blockchain for tamper-proof verification.
          </p>
        </div>

        <button
          onClick={registerPassport}
          disabled={isLoading || !activeAddress}
          className={`w-full px-6 py-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
            isLoading || !activeAddress
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span> Registering...
            </>
          ) : activeAddress ? (
            <>
              <span>🔐</span> Register Passport on Algorand
            </>
          ) : (
            <>
              <span>🔗</span> Connect Wallet First
            </>
          )}
        </button>
      </div>

      {!activeAddress && (
        <p className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg">
          💡 Connect your wallet in the header to register your passport on-chain
        </p>
      )}
    </div>
  );
};

export default BlockchainRegistration;