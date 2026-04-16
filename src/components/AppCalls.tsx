import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { PassportRegistryClient } from '../contracts/PassportRegistry'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import CryptoJS from 'crypto-js'

interface AppCallsInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
  passportData?: any // ✅ Fix 1: Added '?' to make it optional so Home.tsx doesn't break
}

const AppCalls = ({ openModal, setModalState, passportData }: AppCallsInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  // Initialize Algorand Connection
  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({
    algodConfig,
    indexerConfig: getAlgodConfigFromViteEnvironment(), // Reusing config for LocalNet
  })

  const registerPassportOnChain = async () => {
    if (!activeAddress) {
      enqueueSnackbar('Please connect your wallet first', { variant: 'warning' })
      return
    }

    setLoading(true)

    try {
      // 1. Generate the SHA-256 Hash of the Passport Data
      const jsonString = JSON.stringify(passportData)
      const hashHex = CryptoJS.SHA256(jsonString).toString(CryptoJS.enc.Hex)
      
      // Convert hex string to Uint8Array (which Algorand expects for 'Bytes' type)
      const hashBytes = new Uint8Array(hashHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))

      // 2. Connect to the ALREADY DEPLOYED contract
      const appId = BigInt(import.meta.env.VITE_ALGOD_APP_ID || 0)
      if (appId === 0n) throw new Error("VITE_ALGOD_APP_ID is missing in .env")

      // ✅ Fix 2: Removed the second argument (algorand.client.algod)
      const appClient = new PassportRegistryClient({
        resolveBy: 'id',
        id: appId,
        sender: { addr: activeAddress, signer: transactionSigner },
      })

      // 3. Call the register_passport method on the smart contract
      const response = await appClient.send.registerPassport({
        args: {
          passportId: passportData.passport_id, // ✅ Fix 3: Changed to camelCase
          passportHash: hashBytes,              // ✅ Fix 3: Changed to camelCase
        },
      })

      enqueueSnackbar(`Successfully registered! TxID: ${response.transaction.txID()}`, { variant: 'success' })
      setModalState(false)
    } catch (e: any) {
      enqueueSnackbar(`Error registering passport: ${e.message}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="appcalls_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200/50 backdrop-blur-sm`}>
      <form method="dialog" className="modal-box bg-white shadow-xl">
        <h3 className="font-bold text-xl text-blue-800 mb-4">Register Passport on Algorand</h3>
        <p className="text-gray-600 text-sm mb-4">
          This will generate a SHA-256 hash of your credit passport and store it immutably on the blockchain.
        </p>
        
        {/* Preview of the Hash */}
        <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-500 overflow-hidden mb-6">
          Ready to hash MSME ID: {passportData?.passport_id || "No ID provided"}
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={(e) => { e.preventDefault(); setModalState(false); }}>
            Cancel
          </button>
          <button 
            className="btn bg-blue-600 hover:bg-blue-700 text-white border-none" 
            onClick={(e) => { e.preventDefault(); registerPassportOnChain(); }}
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner" /> : 'Hash & Send to Blockchain'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default AppCalls