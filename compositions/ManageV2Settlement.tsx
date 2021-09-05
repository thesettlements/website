import {WalletCallStatus} from "hooks/useContractTx";
import React from "react";

interface ManageSettlementProps {
  txInProgress: boolean
  txStatus: WalletCallStatus
  rolls: number
  randomise: () => Promise<void>
}

export const ManageV2Settlement: React.FC<ManageSettlementProps> = (
  {
    txStatus,
    txInProgress,
    rolls,
    randomise,
  }) => {

  return (
    <div>
      <div style={{marginBottom: 40}}>
        <button disabled={txInProgress} role="button" onClick={randomise}>
          {txStatus === WalletCallStatus.ERRORED ? (
            `Try Again`
          ) : txStatus === WalletCallStatus.PROMPTED ? (
            'Confirm the transaction in your wallet'
          ) : txStatus === WalletCallStatus.CONFIRMING ? (
            'confirming...'
          ) : 'Randomise'}
        </button>
      </div>
      <p style={{margin: '10px 0', maxWidth: '75%'}}>
        You have <b>{rolls}</b> turns left to randomise your settlement
        and be given an entirely new set of trails.
      </p>
      <p style={{margin: '10px 0', maxWidth: '75%'}}>
        Every time you randomise you progress a realm, and once go you leave a realm
        you can never come back.
      </p>
    </div>
  )
}
