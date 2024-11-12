'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Connection, clusterApiUrl } from '@solana/web3.js'
import { TokenStandard, MetaplexProgram } from './types'
import TokenMinter from './components/TokenMinter'
import NFTMinter from './components/NFTMinter'
import CollectionManager from './components/CollectionManager'
import TokenOperations from './components/TokenOperations'

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

export default function Home() {
  const { publicKey } = useWallet()
  const [activeTab, setActiveTab] = useState('fungible')

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-blue-900 to-red-900 text-white font-inter relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative">
        <header className="backdrop-blur-md bg-blue-900/30 border-b border-white/10 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold font-space-grotesk">Solana Token Manager</h1>
            <WalletMultiButton className="!bg-white/10 hover:!bg-white/20 backdrop-blur-lg transition-all" />
          </div>
        </header>

        <main className="container mx-auto mt-8 p-4">
          {publicKey ? (
            <div className="space-y-8">
              <div className="flex flex-wrap gap-4">
                <button
                  className={`px-6 py-3 rounded-lg font-space-grotesk transition-all backdrop-blur-md
                    ${activeTab === 'fungible' 
                      ? 'bg-yellow-400/20 text-yellow-400 border-2 border-yellow-400/50' 
                      : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'}`}
                  onClick={() => setActiveTab('fungible')}
                >
                  Fungible Tokens
                </button>
                <button
                  className={`px-6 py-3 rounded-lg font-space-grotesk transition-all backdrop-blur-md
                    ${activeTab === 'nft' 
                      ? 'bg-yellow-400/20 text-yellow-400 border-2 border-yellow-400/50' 
                      : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'}`}
                  onClick={() => setActiveTab('nft')}
                >
                  NFTs
                </button>
                <button
                  className={`px-6 py-3 rounded-lg font-space-grotesk transition-all backdrop-blur-md
                    ${activeTab === 'collection' 
                      ? 'bg-yellow-400/20 text-yellow-400 border-2 border-yellow-400/50' 
                      : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'}`}
                  onClick={() => setActiveTab('collection')}
                >
                  Collections
                </button>
                <button
                  className={`px-6 py-3 rounded-lg font-space-grotesk transition-all backdrop-blur-md
                    ${activeTab === 'operations' 
                      ? 'bg-yellow-400/20 text-yellow-400 border-2 border-yellow-400/50' 
                      : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'}`}
                  onClick={() => setActiveTab('operations')}
                >
                  Token Operations
                </button>
              </div>

              <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                {activeTab === 'fungible' && <TokenMinter connection={connection} />}
                {activeTab === 'nft' && <NFTMinter connection={connection} />}
                {activeTab === 'collection' && <CollectionManager connection={connection} />}
                {activeTab === 'operations' && <TokenOperations connection={connection} />}
              </div>
            </div>
          ) : (
            <div className="text-center backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-space-grotesk mb-4">Welcome to Solana Token Manager</h2>
              <p className="mb-6 text-white/80">Connect your wallet to start creating and managing tokens</p>
              <WalletMultiButton className="!bg-white/10 hover:!bg-white/20 backdrop-blur-lg transition-all" />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}