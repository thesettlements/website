import React, { useCallback, useContext } from "react";
import { useContractTransaction, WalletCallStatus } from "hooks/useContractTx";
import { ContractContext } from "providerts/ContractProvider";

interface ManageSettlementProps {
  id: string;
  approved: boolean;
  txInProgress: boolean;
  txStatus: WalletCallStatus;
  approve: () => Promise<void>;
  migrate: () => Promise<void>;
}

export const ManageLegacySettlement: React.FC<ManageSettlementProps> = ({
  id,
  txStatus,
  approved,
  approve,
  migrate,
  txInProgress,
}) => {
  const { STLV2, isReadOnly } = useContext(ContractContext);
  const {
    handleTx: handleCheapTx,
    txStatus: cheapTxStatus,
    txInProgress: cheapIp,
  } = useContractTransaction(1);

  const migrateV2Cheap = useCallback(async () => {
    try {
      if (!STLV2 || isReadOnly) {
        throw new Error("Contract is not authorised");
      }
      const tx = STLV2.claimAndReroll(id);
      await handleCheapTx(tx);
    } catch (err) {
      console.error(err);
    }
  }, [STLV2, handleCheapTx, id, isReadOnly]);

  return (
    <div>
      {!approved ? (
        <button onClick={approve} disabled={txInProgress} role="button">
          {txStatus === WalletCallStatus.ERRORED ? (
            `Try Again`
          ) : txStatus === WalletCallStatus.PROMPTED ? (
            "Confirm the transaction in your wallet"
          ) : txStatus === WalletCallStatus.CONFIRMING ? (
            <span>confirming</span>
          ) : (
            "Approve your Settlement"
          )}
        </button>
      ) : (
        <div style={{ marginBottom: 20 }}>
          {!cheapIp && (
            <button onClick={migrate} disabled={txInProgress} role="button">
              {txStatus === WalletCallStatus.ERRORED ? (
                `Try Again`
              ) : txStatus === WalletCallStatus.PROMPTED ? (
                "Confirm the transaction in your wallet"
              ) : txStatus === WalletCallStatus.CONFIRMING ? (
                <span>confirming</span>
              ) : (
                "Migrate"
              )}
            </button>
          )}
          {!txInProgress && (
            <button
              onClick={migrateV2Cheap}
              disabled={txInProgress}
              role="button"
              style={{ marginBottom: 20 }}
            >
              {cheapTxStatus === WalletCallStatus.ERRORED ? (
                `Try Again`
              ) : cheapTxStatus === WalletCallStatus.PROMPTED ? (
                "Confirm the transaction in your wallet"
              ) : cheapTxStatus === WalletCallStatus.CONFIRMING ? (
                <span>confirming</span>
              ) : (
                "Migrate & Reroll"
              )}
            </button>
          )}
          <p style={{ margin: "10px 0 20px 0", maxWidth: "75%" }}>
            You have two options to migrate your settlement with the standard{" "}
            {'"Migrate"'} functions upgrading your existing settlement to V2.
            This will keep your existing v1 attributes and port them over to v2.
            Approx gas cost: 730k.
          </p>
          <p style={{ margin: "10px 0", maxWidth: "75%" }}>
            Choosing the {'"Migrate & Reroll"'} option is 40% cheaper in gas
            costs and will reroll your settlement into the {'"Shadow"'} realm
            and give you new attributes. Approx gas cost: 400k.
          </p>
        </div>
      )}
    </div>
  );
};
