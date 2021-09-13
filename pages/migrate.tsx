import { useContractTransaction, WalletCallStatus } from "hooks/useContractTx";
import styles from "styles/Migrate.module.scss";
import React, { Fragment, useCallback, useContext, useState } from "react";
import { Header } from "components/Header";
import Head from "next/head";
import { ContractContext } from "providerts/ContractProvider";
import { buildMigrationPayload } from "utils/migrate";
import { SETTLEMENT_V2_CONTRACT_ADDRESS } from "constants/addresses";
import useSWR from "swr";
import { useWeb3React } from "@web3-react/core";

function Migrate() {
  const [tokenIds, setTokenIds] = useState([""]);
  const { account } = useWeb3React();
  const { STL, STLV2, isReadOnly } = useContext(ContractContext);
  const {
    handleTx,
    txStatus: harvestStatus,
    txInProgress: harvIP,
    txError,
  } = useContractTransaction();

  const onAddAnother = useCallback(
    () => setTokenIds([...tokenIds, ""]),
    [tokenIds]
  );

  const onChange = useCallback(
    (event) => {
      const index = parseInt(event.target.id);
      const newTokenIds = [...tokenIds];
      newTokenIds[index] = event.target.value;
      setTokenIds(newTokenIds);
    },
    [tokenIds]
  );

  const { data: approved, mutate: revalidateApproval } = useSWR(
    ["isApprovedForAll", account],
    (_, account) =>
      STL.isApprovedForAll(account, SETTLEMENT_V2_CONTRACT_ADDRESS)
  );

  const onMigrate = useCallback(async () => {
    try {
      if (!STL || !STLV2 || isReadOnly) {
        throw new Error("Contract is not authorised");
      }
      const filteredTokenIds = tokenIds.filter((id) => !!id);
      const attributePromises = filteredTokenIds.map((id) =>
        buildMigrationPayload(id, STL)
      );
      if (attributePromises.length === 0) {
        return;
      }
      const attributes = await Promise.all(attributePromises);
      const tx = STLV2.multiClaim([...filteredTokenIds], [...attributes]);
      await handleTx(tx);
    } catch (err) {
      console.error(err);
    }
  }, [STL, STLV2, handleTx, isReadOnly, tokenIds]);

  const approveV2 = useCallback(async () => {
    try {
      if (!STL || !STLV2 || isReadOnly) {
        throw new Error("Contract is not authorised");
      }
      const tx = STL.setApprovalForAll(SETTLEMENT_V2_CONTRACT_ADDRESS, true);
      await handleTx(tx);
      await revalidateApproval();
    } catch (e) {
      console.error(e);
    }
  }, [STL, STLV2, handleTx, isReadOnly, revalidateApproval]);

  if (!approved) {
    return (
      <Fragment>
        <Head>
          <title>Migrate</title>
          <meta name="description" content="Migrate your Settlements" />
        </Head>
        <Header />
        <main className={styles.main}>
          <h1>Migrate</h1>
          <p>
            Before you can migrate {"you'll"} need to approve the new V2
            Contract
          </p>
          <button onClick={approveV2} disabled={harvIP} role="button">
            {harvestStatus === WalletCallStatus.ERRORED ? (
              `Try Again`
            ) : harvestStatus === WalletCallStatus.PROMPTED ? (
              "Confirm the transaction in your wallet"
            ) : harvestStatus === WalletCallStatus.CONFIRMING ? (
              <span>confirming</span>
            ) : (
              "Approve your Settlements"
            )}
          </button>
        </main>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Head>
        <title>Migrate</title>
        <meta name="description" content="Migrate your Settlements" />
      </Head>
      <Header />
      <main className={styles.main}>
        <h1>Migrate</h1>
        <div className={styles.migrate}>
          {tokenIds.map((_, index) => (
            <input
              className={styles.input}
              id={index.toString()}
              key={index}
              placeholder={"Token ID"}
              onChange={onChange}
            />
          ))}
          <div>
            <button
              className={styles.button}
              style={{ marginRight: 20 }}
              role="button"
              onClick={onAddAnother}
            >
              Add another
            </button>
            <button className={styles.button} role="button" onClick={onMigrate}>
              {harvestStatus === WalletCallStatus.ERRORED
                ? `Try Again`
                : harvestStatus === WalletCallStatus.PROMPTED
                ? "Confirm the transaction in your wallet"
                : harvestStatus === WalletCallStatus.CONFIRMING
                ? "confirming..."
                : tokenIds.length > 1
                ? `Migrate ${tokenIds.length} Settlements`
                : "Migrate"}
            </button>
          </div>
          {txError && <p style={{ color: "red" }}> {txError?.message}</p>}
        </div>
      </main>
    </Fragment>
  );
}

export default Migrate;
