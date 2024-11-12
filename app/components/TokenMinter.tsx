import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'
import { TokenStandard } from '../types'

interface TokenMinterProps {
  connection: Connection
}

export default function TokenMinter({ connection }: TokenMinterProps) {
  const { publicKey, signTransaction } = useWallet()
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenDecimals, setTokenDecimals] = useState(9)
  const [tokenSupply, setTokenSupply] = useState(1000000)
  const [tokenStandard, setTokenStandard] = useState<TokenStandard>('Original')

  const mintToken = async () => {
    if (!publicKey || !signTransaction) return

    try {
      const mint = await createMint(
        connection,
        {
          publicKey,
          signTransaction,
        },
        publicKey,
        publicKey,
        tokenDecimals,
        undefined,
        { commitment: 'confirmed' },
        tokenStandard === 'Token2022' ? 'Token2022Program' : 'TokenProgram'
      )

      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        {
          publicKey,
          signTransaction,
        },
        mint,
        publicKey,
        undefined,
        'confirmed',
        tokenStandard === 'Token2022' ? 'Token2022Program' : 'TokenProgram'
      )

      await mintTo(
        connection,
        {
          publicKey,
          signTransaction,
        },
        mint,
        tokenAccount.address,
        publicKey,
        tokenSupply,
        [],
        { commitment: 'confirmed' },
        tokenStandard === 'Token2022' ? 'Token2022Program' : 'TokenProgram'
      )

      alert(`Token minted successfully! Mint address: ${mint.toBase58()}`)
    } catch (error) {
      console.error('Error minting token:', error)
      alert('Error minting token. Check console for details.')
    }
  }

  return (
    <div className="bg-blue-900 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Mint Fungible Token</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Token Name"
          value={tokenName}
          onChange={(e) => setTokenName(e.target.value)}
          className="w-full p-2 rounded bg-blue-800 text-white"
        />
        <input
          type="text"
          placeholder="Token Symbol"
          value={tokenSymbol}
          onChange={(e) => setTokenSymbol(e.target.value)}
          className="w-full p-2 rounded bg-blue-800 text-white"
        />
        <input
          type="number"
          placeholder="Decimals"
          value={tokenDecimals}
          onChange={(e) => setTokenDecimals(Number(e.target.value))}
          className="w-full p-2 rounded bg-blue-800 text-white"
        />
        <input
          type="number"
          placeholder="Initial Supply"
          value={tokenSupply}
          onChange={(e) => setTokenSupply(Number(e.target.value))}
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
        <button
          onClick={mintToken}
          className="w-full p-2 bg-yellow-400 text-blue-900 rounded font-bold hover:bg-yellow-300"
        >
          Mint Token
        </button>
      </div>
    </div>
  )
}