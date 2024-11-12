import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { getOrCreateAssociatedTokenAccount, transfer, burn, closeAccount } from '@solana/spl-token'

interface TokenOperationsProps {
  connection: Connection
}

export default function TokenOperations({ connection }: TokenOperationsProps) {
  const { publicKey, signTransaction } = useWallet()
  const [tokenMint, setTokenMint] = useState('')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  const transferToken = async () => {
    if (!publicKey || !signTransaction) return

    try {
      const mintPublicKey = new PublicKey(tokenMint)
      const recipientPublicKey = new PublicKey(recipient)

      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        {
          publicKey,
          signTransaction,
        },
        mintPublicKey,
        publicKey
      )

      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        {
          publicKey,
          signTransaction,
        },
        mintPublicKey,
        recipientPublicKey
      )

      await transfer(
        connection,
        {
          publicKey,
          signTransaction,
        },
        fromTokenAccount.address,
        toTokenAccount.address,
        publicKey,
        BigInt(amount)
      )

      alert('Token transfer successful!')
    } catch (error) {
      console.error('Error transferring token:', error)
      alert('Error transferring token. Check console for details.')
    }
  }

  const burnToken = async () => {
    if (!publicKey || !signTransaction) return

    try {
      const mintPublicKey = new PublicKey(tokenMint)

      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        {
          publicKey,
          signTransaction,
        },
        mintPublicKey,
        publicKey
      )

      await burn(
        connection,
        {
          publicKey,
          signTransaction,
        },
        tokenAccount.address,
        mintPublicKey,
        publicKey,
        BigInt(amount)
      )

      alert('Token burn successful!')
    } catch (error) {
      console.error('Error burning token:', error)
      alert('Error burning token. Check console for details.')
    }
  }

  const closeTokenAccount = async () => {
    if (!publicKey || !signTransaction) return

    try {
      const mintPublicKey = new PublicKey(tokenMint)

      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        {
          publicKey,
          signTransaction,
        },
        mintPublicKey,
        publicKey
      )

      await closeAccount(
        connection,
        {
          publicKey,
          signTransaction,
        },
        tokenAccount.address,
        publicKey,
        publicKey
      )

      alert('Token account closed successfully!')
    } catch (error) {
      console.error('Error closing token account:', error)
      alert('Error closing token account. Check console for details.')
    }
  }

  return (
    <div className="bg-blue-900 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Token Operations</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Token Mint Address"
          value={tokenMint}
          onChange={(e) => setTokenMint(e.target.value)}
          className="w-full p-2 rounded bg-blue-800 text-white"
        />
        <input
          type="text"
          placeholder="Recipient Address (for transfer)"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-2 rounded bg-blue-800 text-white"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 rounded bg-blue-800 text-white"
        />
        <div className="flex space-x-4">
          <button
            onClick={transferToken}
            className="flex-1 p-2 bg-yellow-400 text-blue-900 rounded font-bold hover:bg-yellow-300"
          >
            Transfer
          </button>
          <button
            onClick={burnToken}
            className="flex-1 p-2 bg-yellow-400 text-blue-900 rounded font-bold hover:bg-yellow-300"
          >
            Burn
          </button>
          <button
            onClick={closeTokenAccount}
            className="flex-1 p-2 bg-yellow-400 text-blue-900 rounded font-bold hover:bg-yellow-300"
          >
            Close Account
          </button>
        </div>
      </div>
    </div>
  )
}