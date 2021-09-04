import Head from "next/head";
import styles from 'styles/Settlement.module.css';
import React, {Fragment} from "react";
import {GetServerSideProps, NextPage} from "next";
import {useRouter} from "next/router";
import {FullComponents, MediaObject, NFTFullPage} from "@zoralabs/nft-components";
import {FetchStaticData, MediaFetchAgent, NetworkIDs} from "@zoralabs/nft-hooks";
import {SETTLEMENT_CONTRACT_ADDRESS} from "constants/addresses";
import {NETWORK_CHAIN_ID} from "constants/network";
import {contractService} from "services/contracts.service";

type SettlementProps = {
  id: string;
  description: any;
  image: string;
  initialData: any;
};

const ViewSettlement: NextPage<SettlementProps> = (
  {
    id,
    description,
    image,
    initialData,
  }) => {

  console.log(initialData)

  const {isFallback} = useRouter()

  if (isFallback || !initialData) {
    return <p>
      loading...
    </p>
  }

  return (
    <Fragment>
      <Head>
        <title>{initialData?.name}</title>
      </Head>

      <main className={styles.main}>
        <h1>{initialData.name}</h1>
        <NFTFullPage
          useBetaIndexer={true}
          contract={SETTLEMENT_CONTRACT_ADDRESS}
          id={id}
        >
          <div className={styles.media}>
            <MediaObject metadata={initialData.nft.tokenData.metadata.json}/>
          </div>
          <FullComponents.AuctionInfo showPerpetual={false}/>
          <FullComponents.MediaInfo/>
        </NFTFullPage>
      </main>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async ({params}) => {
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
