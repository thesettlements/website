import styles from 'styles/MySettlements.module.scss';
import React, {Fragment, useContext, useEffect, useState} from "react";
import {Header} from "components/Header";
import Head from "next/head";
import {ContractContext} from "providerts/ContractProvider";
import {useWeb3React} from "@web3-react/core";
import { Erc721 } from '@zoralabs/core/dist/typechain';
import {Contract} from "@ethersproject/contracts";
import {NFTPreview} from "@zoralabs/nft-components";
import { SETTLEMENT_CONTRACT_ADDRESS } from 'constants/addresses';
import { useRouter } from 'next/router';

function MySettlements() {

  const router = useRouter();
  const {account} = useWeb3React()
  const {STL, STLV2, isReadOnly} = useContext(ContractContext)

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showV1Settlements, setShowV1Settlements] = useState(false);
  const [v1Settlements, setV1Settlements] = useState<number[]>([])
  const [v2Settlements, setV2Settlements] = useState<number[]>([])

  useEffect(() => {
      if (!account) {
          return;
      }
      loadSettlements(account, STL, STLV2).then(({ v1Settlements, v2Settlements}) => {
          setV1Settlements(v1Settlements);
          setV2Settlements(v2Settlements);
          setLoading(false);
      }).catch(() => {
          setLoading(false);
          setError(true);
      });
  }, [account, STL, STLV2, isReadOnly]);

  const toggleShowV1Settlements = () => setShowV1Settlements(!showV1Settlements);
  const navigateToMigratePage = () => router.push('/migrate');

  return (
    <Fragment>
      <Head>
        <title>My Settlements</title>
        <meta name="description" content="All of your settlements"/>
      </Head>
      <Header/>
      <main className={styles.main}>
        <h1>My Settlements</h1>
    
        {loading && <p>loading...</p>}
        {!loading && v2Settlements.length == 0 && <p>no settlements found, <a className={styles.link} href="https://opensea.io/collection/settlements">take me to opensea</a></p>}
        {error && <p>error loading settlements</p>}

        <div className={styles.settlements}>
            {v2Settlements.map((id) => {
                return <NFTPreview useBetaIndexer={true}
                key={id} contract={SETTLEMENT_CONTRACT_ADDRESS} id={id.toString()}/>;
            })}
        </div>

        {v1Settlements.length > 0 && <button onClick={toggleShowV1Settlements} role="button">
            {showV1Settlements ? 
            `Hide V1`
                : 'Show V1 Settlements'}
        </button>}
        
        {showV1Settlements && <div className={styles.settlements}>
             {v1Settlements.map((id) => {
                return <NFTPreview useBetaIndexer={true}
                key={id} contract={SETTLEMENT_CONTRACT_ADDRESS} id={id.toString()}/>;
            })}
        </div>}

        {showV1Settlements && <button onClick={navigateToMigratePage} role="button">
            {'Migrate'}
        </button>}
      </main>
    </Fragment>
  )
}

async function loadSettlements(account: string, STL: Erc721, STLV2: Contract) {
    const v1OwnerSettlements = await loadSettlementsForAccount(account, STL);
    const v2OwnerSettlements = await loadSettlementsForAccount(account, STLV2);

    return {
        v1Settlements: v1OwnerSettlements.map(b => b.toNumber()),
        v2Settlements: v2OwnerSettlements.map(b => b.toNumber())
    }
}

async function loadSettlementsForAccount(account: string, contract: Erc721 | Contract) {
    const ownerTokensByIndexPromises = [];
    const total = (await contract.balanceOf(account)).toNumber();
    for (let i = 0; i < total; i++) {
        ownerTokensByIndexPromises.push(contract.tokenOfOwnerByIndex(account, i));
    }
    return await Promise.all(ownerTokensByIndexPromises);
}

export default MySettlements;
