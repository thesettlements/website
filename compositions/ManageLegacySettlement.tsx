import React from "react";
import {WalletCallStatus} from "hooks/useContractTx";

interface ManageSettlementProps {
  approved: boolean
  txInProgress: boolean
  txStatus: WalletCallStatus
  approve: () => Promise<void>
  migrate: () => Promise<void>
}

export const ManageLegacySettlement: React.FC<ManageSettlementProps> = (
  {
    txStatus,
    approved,
    approve,
    migrate,
    txInProgress
  }) => {
  return approved ?
    <button onClick={migrate} disabled={txInProgress} role="button">
      {txStatus === WalletCallStatus.ERRORED ? (
        `Try Again`
      ) : txStatus === WalletCallStatus.PROMPTED ? (
        'Confirm the transaction in your wallet'
      ) : txStatus === WalletCallStatus.CONFIRMING ? (
        <span>confirming</span>
      ) : 'Migrate your Settlement'}
    </button> :
    <button onClick={approve} disabled={txInProgress} role="button">
      {txStatus === WalletCallStatus.ERRORED ? (
        `Try Again`
      ) : txStatus === WalletCallStatus.PROMPTED ? (
        'Confirm the transaction in your wallet'
      ) : txStatus === WalletCallStatus.CONFIRMING ? (
        <span>confirming</span>
      ) : 'Approve your Settlement'}
    </button>
}
