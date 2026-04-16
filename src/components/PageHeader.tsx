import React from 'react';
import { useWallet } from '@txnlab/use-wallet-react';

export const PageHeader: React.FC = () => {
  const { activeAddress, wallets } = useWallet();

  const handleConnect = async () => {
    // Get the first available wallet (for simplicity)
    if (wallets && wallets.length > 0) {
      await wallets[0].connect();
    }
  };

  const handleDisconnect = async () => {
    if (wallets) {
      for (const wallet of wallets) {
        if (wallet.isActive) {
          await wallet.disconnect();
        }
      }
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              MSME Credit <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Reputation Passport</span>
            </h1>
            <p className="text-gray-600 mt-2">Transparent, instant credit scoring for small businesses</p>
          </div>
          <div>
            {activeAddress ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Wallet Connected</p>
                  <p className="text-lg font-semibold text-gray-900">{formatAddress(activeAddress)}</p>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-medium text-sm transition"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/20 transition"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
