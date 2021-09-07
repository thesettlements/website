import {useContractTransaction, WalletCallStatus} from "hooks/useContractTx";
import React, {useCallback, useContext} from "react";
import {ContractContext} from "providerts/ContractProvider";

interface ManageSettlementProps {
  id: string
  rolls: number
}

export const ManageV2Settlement: React.FC<ManageSettlementProps> = (
  {
    id, rolls,
  }) => {

  const {STLV2, isReadOnly} = useContext(ContractContext)
  const {handleTx: handleRand, txStatus: randTxStatus, txInProgress: randIP } = useContractTransaction(1)
  const {handleTx: handleHarvest, txStatus: harvestStatus, txInProgress: harvIP } = useContractTransaction(1)


  const randomise = useCallback(async () => {
    try {
      if (!STLV2 || isReadOnly) {
        throw new Error('Contract is not authorised')
      }
      await handleRand(STLV2.randomise(id))
    } catch (e) {
      console.error(e)
    }

  }, [STLV2, handleRand, id, isReadOnly])

  const harvest = useCallback(async () => {
    try {
      if (!STLV2 || isReadOnly) {
        throw new Error('Contract is not authorised')
      }
      await handleHarvest(STLV2.harvest(id))
    } catch (e) {
      console.error(e)
    }

  }, [STLV2, handleHarvest, id, isReadOnly])

  return (
    <div>
      <div style={{marginBottom: 40}}>
        <button disabled={randIP} role="button" onClick={randomise}>
          {randTxStatus === WalletCallStatus.ERRORED ? (
            `Try Again`
          ) : randTxStatus === WalletCallStatus.PROMPTED ? (
            'Confirm the transaction in your wallet'
          ) : randTxStatus === WalletCallStatus.CONFIRMING ? (
            'confirming...'
          ) : 'Randomise'}
        </button>
        <button disabled={harvIP} role="button" onClick={harvest}>
          {harvestStatus === WalletCallStatus.ERRORED ? (
            `Try Again`
          ) : harvestStatus === WalletCallStatus.PROMPTED ? (
            'Confirm the transaction in your wallet'
          ) : harvestStatus === WalletCallStatus.CONFIRMING ? (
            'confirming...'
          ) : 'Harvest'}
        </button>
      </div>
      <p style={{margin: '10px 0', maxWidth: '75%'}}>
        You have <b>{rolls}</b> turns left to randomise your settlement
        and be given an entirely new set of traits.
      </p>
      <p style={{margin: '10px 0', maxWidth: '75%'}}>
        Every time you randomise you progress a realm, and once go you leave a realm
        you can never come back.
      </p>
    </div>
  )
}
