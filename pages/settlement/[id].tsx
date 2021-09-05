import Head from "next/head";
import styles from 'styles/Settlement.module.scss';
import React, {Fragment, useCallback, useContext, useMemo} from "react";
import {GetServerSideProps, NextPage} from "next";
import {useRouter} from "next/router";
import {FullComponents, MediaObject, NFTFullPage} from "@zoralabs/nft-components";
import {FetchStaticData, MediaFetchAgent, NetworkIDs} from "@zoralabs/nft-hooks";
import {SETTLEMENT_CONTRACT_ADDRESS} from "constants/addresses";
import {contractService} from "services/contracts.service";
import {Header} from "components/Header";
import {ContractContext} from "providerts/ContractProvider";
import {useContractTransaction, WalletCallStatus} from "hooks/useContractTx";
import {useWeb3React} from "@web3-react/core";
import {isAddressMatch} from "utils";
import {NETWORK_CHAIN_ID} from "constants/network";
import {realms} from "constants/traits";

type SettlementProps = {
  id: string;
  description: any;
  image: string;
  initialData: any
};

const ViewSettlement: NextPage<SettlementProps> = (
  {
    id,
    description,
    image,
    initialData,
  }) => {

  const {isFallback} = useRouter()
  const {account} = useWeb3React()
  const {STL, isReadOnly} = useContext(ContractContext)
  const {handleTx, txStatus, txInProgress, txError} = useContractTransaction(1)

  const randomise = useCallback(async () => {
    if (!STL || isReadOnly) {
      throw new Error('Contract is not authorised')
    }
    await handleTx(STL.randomise(id))
  }, [STL, handleTx, id, isReadOnly])


  const rolls = useMemo(() => {
    const realm = initialData.nft.tokenData.metadata.json.attributes[6].value;
    return 5 - realms.indexOf(realm) || 0
  }, [initialData.nft.tokenData.metadata.json.attributes])


  if (isFallback || !initialData) {
    return <p>
      loading...
    </p>
  }

  return (
    <Fragment>
      <Head>
        <title>{initialData?.name}</title>
        <meta name="description" content={description}/>
      </Head>
      <Header/>
      <main className={styles.main}>
        <h1>{initialData.name}</h1>
        <NFTFullPage
          useBetaIndexer={true}
          contract={SETTLEMENT_CONTRACT_ADDRESS}
          id={id}
        >
          <div className={styles.media}>
            <MediaObject metadata={{...initialData.nft.tokenData.metadata.json, image}}/>
          </div>
          {account && isAddressMatch(account, initialData.nft.tokenData?.owner) && (
            <>
              <button disabled={txInProgress} onClick={randomise}>
                {txStatus === WalletCallStatus.ERRORED ? (
                  `Try Again`
                ) : txStatus === WalletCallStatus.PROMPTED ? (
                  'Confirm the transaction in your wallet'
                ) : txStatus === WalletCallStatus.CONFIRMING ? (
                  <span>confirming</span>
                ) : 'Randomise'}
              </button>
              <p style={{margin: '20px 0'}}>
                You have <b>{rolls}</b> turns left to randomise your settlement
                and be given an entirely new set of trails. Every time you
                randomise you progress a realm, and once go you leave a realm
                you can never come back.
              </p>
              <h5 className={styles.error}>
                {txError}
              </h5>
            </>
          )}
          <FullComponents.AuctionInfo showPerpetual={false}/>
          <FullComponents.MediaInfo/>
        </NFTFullPage>
      </main>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps<SettlementProps> = async ({params}) => {
  if (!params?.id || Array.isArray(params.id)) {
    return {notFound: true};
  }
  const id = params.id as string;
  const contract = SETTLEMENT_CONTRACT_ADDRESS

  const fetchAgent = new MediaFetchAgent(NETWORK_CHAIN_ID as unknown as NetworkIDs);
  const data = await FetchStaticData.fetchZoraIndexerItem(fetchAgent, {
    tokenId: id,
    collectionAddress: contract,
  });

  if (!data) {
    return {
      notFound: true,
      revalidate: 60 * 5
    }
  }

  const {image} = await contractService.fetchTokenData(params.id)
  const tokenInfo = FetchStaticData.getIndexerServerTokenInfo(data);

  return {
    props: {
      id,
      name: tokenInfo.metadata?.name || null,
      description: tokenInfo.metadata?.description || null,
      image: image || tokenInfo.metadata.image || null,
      initialData: data,
    },
  };
};


export default ViewSettlement
