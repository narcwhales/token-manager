import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/js'

interface CollectionManagerProps {
  connection: Connection
}

export default function CollectionManager({ connection }: CollectionManagerProps) {
  const { publicKey, signTransaction } = useWallet()
  const [collectionName, setCollectionName] = useState('')
  const [collectionSymbol, setCollectionSymbol] = useState('')
  const [collectionDescription, setCollectionDescription] = useState('')
  const [collectionImage, setCollectionImage] = useState<File | null>(null)

  const createCollection = async () => {
    if (!publicKey || !signTransaction || !collectionImage) return

    try {
      const metaplex = Metaplex.make(connection)
        .use(keypairIdentity({
          publicKey,
          signTransaction,
        }))
        .use(bundlrStorage())

      const { uri } = await metaplex.nfts().uploadMetadata({
        name: collectionName,
        symbol: collectionSymbol,
        description: collectionDescription,
        image: collectionImage,
      })

      const { nft: collectionNft } = await metaplex.nfts().create({
        uri,
        name: collectionName,
        symbol: collectionSymbol,
        sellerFeeBasisPoints: 0,
        isCollection: true,
      })

      alert(`Collection created successfully! Collection address: ${collectionNft.address.toBase58()}`)
    } catch (error) {
      console.error('Error creating collection:', error)
      alert('Error creating collection. Check console for details.')
    }
  }

  return (
    <div className="bg-blue-900 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Manage Collections</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Collection Name"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          className="w-full p-2 rounded bg-blue-800 text-white"
        />
        <input
          type="text"
          placeholder="Collection Symbol"
          value={collectionSymbol}
          onChange={(e) => setCollectionSymbol(e.target.value)}
          className="w-full p-2 rounded bg-blue-800 text-white"
        />
        <textarea
          placeholder="Collection Description"
          value={collectionDescription}
          onChange={(e) => setCollectionDescription(e.target.value)}
          className="w-full p-2 rounded bg-blue-800 text-white"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCollectionImage(e.target.files?.[0] || null)}
          className="w-full p-2 rounded bg-blue-800 text-white"
        />
        <button
          onClick={createCollection}
          className="w-full p-2 bg-yellow-400 text-blue-900 rounded font-bold hover:bg-yellow-300"
        >
          Create Collection
        </button>
      </div>
    </div>
  )
}