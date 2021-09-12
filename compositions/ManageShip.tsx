import { useContractTransaction, WalletCallStatus } from "hooks/useContractTx";
import React, { useCallback, useContext } from "react";
import { ContractContext } from "providerts/ContractProvider";

interface Props {
  id: string;
}

export const ManageShip: React.FC<Props> = ({ id }) => {
  const { Ships, isReadOnly } = useContext(ContractContext);
  const {
    handleTx: handleHarvest,
    txStatus: harvestStatus,
    txInProgress: harvIP,
  } = useContractTransaction();

  const harvest = useCallback(async () => {
    try {
      if (!Ships || isReadOnly) {
        throw new Error("Contract is not authorised");
      }

      await handleHarvest(Ships.harvest(id));
    } catch (e) {
      console.error(e);
    }
  }, [Ships, handleHarvest, id, isReadOnly]);

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <button disabled={harvIP} role="button" onClick={harvest}>
          {harvestStatus === WalletCallStatus.ERRORED
            ? `Try Again`
            : harvestStatus === WalletCallStatus.PROMPTED
            ? "Confirm the transaction in your wallet"
            : harvestStatus === WalletCallStatus.CONFIRMING
            ? "confirming..."
            : "Harvest"}
        </button>
      </div>
      <p style={{ margin: "10px 0", maxWidth: "75%" }}>
        Collect different resources by sailing to different Islands on your
        trading route and ocassionaly discover $SETL tokens on your expeditions.
      </p>
    </div>
  );
};
