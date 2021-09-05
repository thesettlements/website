import {useState} from 'react'
import {ContractTransaction} from '@ethersproject/contracts'

export enum WalletCallStatus {
  INITIAL = 'INITIAL',
  PROMPTED = 'PROMPTED',
  CONFIRMING = 'CONFIRMING',
  CONFIRMED = 'CONFIRMED',
  ERRORED = 'ERRORED',
}

export function useContractTransaction(confirmations: number = 1) {
  const [txStatus, setState] = useState<WalletCallStatus>(WalletCallStatus.INITIAL)
  const [txError, setError] = useState<Error | undefined>()

  async function handleTx(promise: Promise<ContractTransaction>) {
    try {
      setState(WalletCallStatus.PROMPTED)
      const tx = await promise
      setState(WalletCallStatus.CONFIRMING)
      await tx.wait(confirmations)
      setState(WalletCallStatus.CONFIRMED)
      return tx
    } catch (e: any) {
      setError(e?.message)
      setState(WalletCallStatus.ERRORED)
      throw e
    }
  }

  const txInProgress =
    txStatus === WalletCallStatus.CONFIRMING || txStatus === WalletCallStatus.PROMPTED

  return { txStatus, txInProgress, txError, handleTx }
}
