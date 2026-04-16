import React, { useState } from 'react';
import { SupportedWallet, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { SnackbarProvider } from 'notistack'
import { MSMEPortal } from './components/MSMEPortal';
import { LenderVerification } from './components/LenderVerification';
import { getAlgodConfigFromViteEnvironment, getKmdConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

let supportedWallets: SupportedWallet[]
if (import.meta.env.VITE_ALGOD_NETWORK === 'localnet') {
  const kmdConfig = getKmdConfigFromViteEnvironment()
  supportedWallets = [
    {
      id: WalletId.KMD,
      options: {
        baseServer: kmdConfig.server,
        token: String(kmdConfig.token),
        port: String(kmdConfig.port),
      },
    },
  ]
} else {
  supportedWallets = [
    { id: WalletId.DEFLY },
    { id: WalletId.PERA },
    { id: WalletId.EXODUS },
    // If you are interested in WalletConnect v2 provider
    // refer to https://github.com/TxnLab/use-wallet for detailed integration instructions
  ]
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'msme' | 'lender'>('msme');
  const algodConfig = getAlgodConfigFromViteEnvironment()

  const walletManager = new WalletManager({
    wallets: supportedWallets,
    defaultNetwork: algodConfig.network,
    networks: {
      [algodConfig.network]: {
        algod: {
          baseServer: algodConfig.server,
          port: algodConfig.port,
          token: String(algodConfig.token),
        },
      },
    },
    options: {
      resetNetwork: true,
    },
  })

  return (
    <SnackbarProvider maxSnack={3}>
      <WalletProvider manager={walletManager}>
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

          {/* Navigation Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('msme')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'msme'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🏢 MSME Portal
                </button>
                <button
                  onClick={() => setActiveTab('lender')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'lender'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🏦 Lender Verification
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            {activeTab === 'msme' ? <MSMEPortal /> : <LenderVerification />}
          </div>
        </div>
      </WalletProvider>
    </SnackbarProvider>
  )
}
