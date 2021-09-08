import {useContractTransaction, WalletCallStatus} from "hooks/useContractTx";
import {useRouter} from "next/router";
import styles from 'styles/Migrate.module.scss';
import React, {Fragment, useState, useContext, useCallback} from "react";
import {Header} from "components/Header";
import Head from "next/head";
import {ContractContext} from "providerts/ContractProvider";
import {buildMigrationPayload} from "utils/migrate";

function Migrate() {

  const [tokenIds, setTokenIds] = useState(['']);
  
  const {STL, STLV2, isReadOnly} = useContext(ContractContext)
  const {handleTx, txStatus: harvestStatus, txInProgress: harvIP } = useContractTransaction(1)

  const onAddAnother = useCallback(() => setTokenIds([...tokenIds, '']), [tokenIds]);

  const onChange = useCallback((event) => {
    const index = parseInt(event.target.id);
    const newTokenIds = [...tokenIds];
    newTokenIds[index] = event.target.value;
    setTokenIds(newTokenIds);
  }, [tokenIds]);

  const onMigrate = useCallback(async () => {
    try {
      if (!STL || !STLV2 || isReadOnly) {
        throw new Error('Contract is not authorised')
      }
      const filteredTokenIds = tokenIds.filter((id) => !!id);
      const attributePromises =  filteredTokenIds.map((id) => buildMigrationPayload(id, STL));
      if (attributePromises.length == 0) {
        return;
      }
      const attributes = await Promise.all(attributePromises);
      const tx = STLV2.multiClaim([...filteredTokenIds], [...attributes]);
      await handleTx(tx)
    } catch (err) {
      console.error(err)
    }
  }, [STL, STLV2, handleTx, isReadOnly, tokenIds])

  return (
    <Fragment>
    <Head>
      <title>Migrate</title>
      <meta name="description" content="Migrate your Settlements"/>
    </Head>
    <Header/>
    <main className={styles.main}>
      <h1>Migrate</h1>
      <div className={styles.migrate}>
        {tokenIds.map((_, index) => 
            <input className={styles.input} id={index.toString()} key={index} placeholder={'Token ID'} onChange={onChange}/>
        )}
        <div>
          <button className={styles.button} style={{marginRight: 20}} role="button" onClick={onAddAnother}>
            Add another
          </button>
          <button className={styles.button} role="button" onClick={onMigrate}>
          {harvestStatus === WalletCallStatus.ERRORED ? (
            `Try Again`
          ) : harvestStatus === WalletCallStatus.PROMPTED ? (
            'Confirm the transaction in your wallet'
          ) : harvestStatus === WalletCallStatus.CONFIRMING ? (
            'confirming...'
          ) : (tokenIds.length > 1 ? `Migrate ${tokenIds.length} Settlements` : 'Migrate')}
          </button>
        </div>
      </div>
    </main>
  </Fragment>)
}
  
export default Migrate;