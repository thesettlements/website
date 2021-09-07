import {useContractTransaction, WalletCallStatus} from "hooks/useContractTx";
import {useRouter} from "next/router";
import styles from 'styles/Settlement.module.scss';
import React, {Fragment, useState, useContext, useCallback} from "react";
import {Header} from "components/Header";
import Head from "next/head";
import {ContractContext} from "providerts/ContractProvider";
import {buildMigrationPayload} from "utils/migrate";


function Upgrade() {

  const {isFallback} = useRouter()
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

  const onUpgrade = useCallback(async () => {
    try {
      if (!STL || !STLV2 || isReadOnly) {
        throw new Error('Contract is not authorised')
      }
      const attributePromises =  tokenIds.filter((id) => !!id).map((id) => buildMigrationPayload(id, STL));
      if (attributePromises.length == 0) {
        return;
      }
      const attributes = await Promise.all(attributePromises);
      const tx = STLV2.multiClaim([...tokenIds], [...attributes]);
      await handleTx(tx)
    } catch (err) {
      console.error(err)
    }
  }, [STL, STLV2, handleTx, isReadOnly, tokenIds])


  if (isFallback) {
    return <p>
      loading...
    </p>
  }


  return (
    <Fragment>
    <Head>
      <title>Upgrade</title>
      <meta name="description" content={"Upgrade your Settlements"}/>
    </Head>
    <Header/>
    <main className={styles.main}>
      <h1>Upgrade</h1>
      <div>
        {tokenIds.map((_, index) => (
          <>
            <input style={{marginBottom: 20}} id={index.toString()} key={index} placeholder={'Token ID'} onChange={onChange}/><br></br>
          </>
        ))}
        <div>
          <button style={{marginRight: 20}} role="button" onClick={onAddAnother}>
            {'Add another'}
          </button>
          <button role="button" onClick={onUpgrade}>
          {harvestStatus === WalletCallStatus.ERRORED ? (
            `Try Again`
          ) : harvestStatus === WalletCallStatus.PROMPTED ? (
            'Confirm the transaction in your wallet'
          ) : harvestStatus === WalletCallStatus.CONFIRMING ? (
            'confirming...'
          ) : 'Upgrade'}
          </button>
        </div>
      </div>
    </main>
  </Fragment>)
}
  
export default Upgrade;