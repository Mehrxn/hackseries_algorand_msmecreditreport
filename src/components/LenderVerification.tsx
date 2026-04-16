import React, { useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import CryptoJS from 'crypto-js';
import { AlgorandClient } from '@algorandfoundation/algokit-utils';
import { PassportRegistryClient } from '../contracts/PassportRegistry';
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs';

export const LenderVerification: React.FC = () => {
  const { activeAddress, transactionSigner } = useWallet();
  const [passportId, setPassportId] = useState('');
  const [passportJson, setPassportJson] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState<'idle' | 'verified' | 'tampered' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [localHash, setLocalHash] = useState<string>('');
  const [onChainHash, setOnChainHash] = useState<string>('');

  const arraysEqual = (a: Uint8Array, b: Uint8Array) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  const normalizeJson = (rawJson: string) => {
    const parsed = JSON.parse(rawJson.trim());
    return JSON.stringify(parsed);
  };

  const hashJson = (data: string) => {
    const hashHex = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
    setLocalHash(hashHex);
    return new Uint8Array(hashHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
  };

  const handleVerify = async () => {
    setResultStatus('idle');
    setMessage('');
    setOnChainHash('');
    setLocalHash('');

    if (!activeAddress) {
      setResultStatus('error');
      setMessage('Please connect your wallet before verifying passports.');
      return;
    }

    if (!passportId.trim() || !passportJson.trim()) {
      setResultStatus('error');
      setMessage('Passport ID and JSON data are both required.');
      return;
    }

    setIsLoading(true);

    try {
      const normalized = normalizeJson(passportJson);
      const localHashBytes = hashJson(normalized);

      const appIdRaw = import.meta.env.VITE_ALGOD_APP_ID;
      const appId = appIdRaw ? BigInt(appIdRaw) : 0n;
      if (appId === 0n) {
        throw new Error('VITE_ALGOD_APP_ID is not configured in your environment.');
      }

      const algodConfig = getAlgodConfigFromViteEnvironment();
      const algorand = AlgorandClient.fromConfig({
        algodConfig,
        indexerConfig: algodConfig,
      });

      const appClient = new PassportRegistryClient(
        {
          resolveBy: 'id',
          id: appId,
          sender: { addr: activeAddress, signer: transactionSigner },
        },
        algorand.client.algod,
      );

      const response = await appClient.send.verifyPassport({
        args: { passport_id: passportId.trim() },
      });

      const storedHash = response.return as Uint8Array | undefined;
      if (!storedHash || storedHash.length === 0) {
        setResultStatus('tampered');
        setMessage('Passport was not found on-chain or the stored hash is missing.');
        return;
      }

      const storedHashHex = Array.from(storedHash)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
      setOnChainHash(storedHashHex);

      const verified = arraysEqual(storedHash, localHashBytes);
      if (verified) {
        setResultStatus('verified');
        setMessage('VERIFIED: Data is Authentic & Tamper-Proof');
      } else {
        setResultStatus('tampered');
        setMessage('TAMPERED: Data is Invalid or Altered');
      }
    } catch (err: any) {
      setResultStatus('error');
      setMessage(err?.message ?? 'Verification failed. Please check your input and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>🔍</span> Lender Verification Portal
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Passport ID</label>
                <input
                  type="text"
                  value={passportId}
                  onChange={(event) => setPassportId(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter passport ID provided by MSME"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Passport JSON Data</label>
                <textarea
                  value={passportJson}
                  onChange={(event) => setPassportJson(event.target.value)}
                  rows={14}
                  className="w-full resize-none rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder='Paste the complete passport JSON here, exactly as provided by the MSME.'
                />
              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-65"
              >
                {isLoading ? 'Verifying...' : 'Verify Authenticity'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 h-full">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Verification Status</h3>
                  <p className="text-sm text-gray-500">Compare on-chain hash with pasted passport data.</p>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-600">
                  {activeAddress ? 'Wallet Connected' : 'Wallet Required'}
                </div>
              </div>

              {resultStatus !== 'idle' ? (
                <div
                  className={`rounded-3xl border p-6 text-center shadow-sm ${
                    resultStatus === 'verified'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : resultStatus === 'tampered'
                      ? 'border-rose-200 bg-rose-50 text-rose-900'
                      : 'border-amber-200 bg-amber-50 text-amber-900'
                  }`}
                >
                  <p className="text-xl font-bold tracking-tight uppercase">{message}</p>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-slate-500">
                  <p className="text-sm">Enter the passport ID and JSON, then click Verify to validate the data on-chain.</p>
                </div>
              )}

              {(localHash || onChainHash) && (
                <div className="mt-6 rounded-3xl bg-slate-950/95 p-5 text-sm text-slate-100">
                  <div className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">Hash comparison</div>
                  {localHash && (
                    <div className="mb-3">
                      <p className="text-xs text-slate-400">Local hash</p>
                      <p className="font-mono break-all text-[0.82rem] text-slate-100">{localHash}</p>
                    </div>
                  )}
                  {onChainHash && (
                    <div>
                      <p className="text-xs text-slate-400">On-chain hash</p>
                      <p className="font-mono break-all text-[0.82rem] text-slate-100">{onChainHash}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LenderVerification;