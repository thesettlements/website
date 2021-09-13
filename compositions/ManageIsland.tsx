import { useContractTransaction, WalletCallStatus } from "hooks/useContractTx";
import React, { useCallback, useContext } from "react";
import { ContractContext } from "providerts/ContractProvider";

interface ManageIslandProps {
  id: string;
}

export const ManageIsland: React.FC<ManageIslandProps> = ({ id }) => {
  const { Islands, isReadOnly } = useContext(ContractContext);
  const {
    handleTx: handleHarvest,
    txStatus: harvestStatus,
    txInProgress: harvIP,
  } = useContractTransaction(0);

  const harvest = useCallback(async () => {
    try {
      if (!Islands || isReadOnly) {
        throw new Error("Contract is not authorised");
      }
      await handleHarvest(Islands.harvest(id));
    } catch (e) {
      console.error(e);
    }
  }, [Islands, handleHarvest, id, isReadOnly]);

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
        Harvest tax from your citizens in the resource that your island
        specializes in. For example, if you have a Wood island your citizens
        will pay their tax to you in Wood tokens.
      </p>
    </div>
  );
};
