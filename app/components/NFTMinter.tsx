import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { TokenStandard, MetaplexProgram } from '../types'
import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/js'

interface NFTMinterProps {
  connection: Connection
}

export default function NFTMinter({ connection }: NFTMinterProps) {
  const { publicKey, signTransaction } = useWallet()
  const [nftName, setNftName] = useState('')
  const [nftSymbol, setNftSymbol] = useState('')
  const [nftDescription, setNftDescription] = useState('')
  const [nftImage, setNftImage] = useState<File | null>(null)
  const [tokenStandard, setTokenStandard] = useState<TokenStandard>('Original')
  const [metaplexProgram, setMetaplexProgram] = useState<MetaplexProgram>('TokenMetadata')

  const mintNFT = async () => {
    if (!publicKey || !signTransaction || !nftImage) return

    try {
      const metaplex = Metaplex.make(connection)
        .use(keypairIdentity({
          publicKey,
          signTransaction,
        }))
        .use(bundlrStorage())

      const { uri } = await metaplex.nfts().uploadMetadata({
        name: nftName,
        symbol: nftSymbol,
        description: nftDescription,
        image: nftImage,
      })

      const { nft } = await metaplex.nfts().create({
        uri,
        name: nftName,
        sellerFeeBasisPoints: 500, // 5%
        tokenStandard: tokenStandard === 'Token2022' ? 2 : 0,
        tokenProgram: tokenStandard === 'Token2022' ? 'splToken2022' : 'splToken',
      })

      alert(`NFT minted successfully! Mint address: ${nft.address.toBase58()}`)
    } catch (error) {
      console.error('Error minting NFT:', error)
      alert('Error minting NFT. Check console for details.')
    }
  }

  return (
    <div className="bg-blue-900 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Mint NFT</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="NFT Name"
          value={nftName}
          onChange={(e) => setNftName(e.target.value)}
          className="w-full p-2 rounded bg-blue-800 text-white"
        />
        <input
          type="text"
          placeholder="NFT Symbol"
          value={nftSymbol}
          onChange={(e) => setNftSymbol(e.target.value)}
          className="w-full p-2 rounded bg-blue-800 text-white"
        />
        <textarea
          placeholder="NFT Description"
          value={nftDescription}
          onChange={(e) => setNftDescription(e.target.value)}
          className="w-full p-2 rounded bg-blue-800 text-white"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNftImage(e.target.files?.[0] || null)}
          className="w-full p-2 rounded bg-blue-800 text-white"
        />
        <select
          value={tokenStandard}
          onChange={(e) => setTokenStandard(e.target.value as TokenStandard)}
          className="w-full p-2 rounded bg-blue-800 text-white"
        >
          <option value="Original">Original Token Standard</option>
          <option value="Token2022">Token-2022 Standard</option>
        </select>
        <select
          value={metaplexProgram}
          onChange={(e) => setMetaplexProgram(e.target.value as MetaplexProgram)}
          className="w-full p-2 rounded bg-blue-800 text-white"
        >
          <option value="TokenMetadata">Token Metadata</option>
          <option value="Core">Core</option>
          <option value="Bubblegum">Bubblegum</option>
        </select>
        <button
          onClick={mintNFT}
          className="w-full p-2 bg-yellow-400 text-blue-900 rounded font-bold hover:bg-yellow-300"
        >
          Mint NFT
        </button>
      </div>
    </div>
  )
}