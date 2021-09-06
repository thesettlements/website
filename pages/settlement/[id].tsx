import Head from "next/head";
import styles from 'styles/Settlement.module.scss';
import React, {Fragment, useCallback, useContext, useMemo} from "react";
import {GetServerSideProps, GetStaticPaths, NextPage} from "next";
import {useRouter} from "next/router";
import {FullComponents, MediaObject, NFTFullPage} from "@zoralabs/nft-components";
import {SETTLEMENT_CONTRACT_ADDRESS, SETTLEMENT_V2_CONTRACT_ADDRESS} from "constants/addresses";
import {contractService, SettlementData} from "services/contracts.service";
import {Header} from "components/Header";
import {ContractContext} from "providerts/ContractProvider";
import {useContractTransaction} from "hooks/useContractTx";
import {useWeb3React} from "@web3-react/core";
import {NETWORK_CHAIN_ID} from "constants/network";
import {buildMigrationPayload} from "utils/migrate";
import useSWR from 'swr'
import {ManageLegacySettlement} from "compositions/ManageLegacySettlement";
import {isAddressMatch} from "utils";
import {ManageV2Settlement} from "compositions/ManageV2Settlement";
import {realms, resources} from "constants/traits";
import {ResourceBalance} from "components/ResourceBalance";

type SettlementProps = {
  id: string;
  description: any;
  image: string;
  data: SettlementData
  legacy: boolean
};

const ViewSettlement: NextPage<SettlementProps> = (
  {
    id,
    description,
    data,
    legacy
  }) => {

  const {isFallback} = useRouter()

  const {account} = useWeb3React()
  const {STL, STLV2, isReadOnly} = useContext(ContractContext)
  const {handleTx, txStatus, txInProgress, txError} = useContractTransaction(1)

  const {
    data: approved,
    mutate: revalidateApproval
  } = useSWR(['isApprovedForAll', account],
    (_, account) => STL.isApprovedForAll(account, SETTLEMENT_V2_CONTRACT_ADDRESS)
  )

  const {
    data: owner,
  } = useSWR(['ownerOf', legacy, id],
    (_, legacy, tokenId) => legacy ? STL.ownerOf(tokenId) : STLV2.ownerOf(tokenId)
  )


  const approveV2 = useCallback(async () => {
    try {
      if (!STL || !STLV2 || isReadOnly) {
        throw new Error('Contract is not authorised')
      }
      const tx = STL.setApprovalForAll(SETTLEMENT_V2_CONTRACT_ADDRESS, true);
      await handleTx(tx);
      await revalidateApproval()
    } catch (e) {
      console.error(e)
    }
  }, [STL, STLV2, handleTx, isReadOnly, revalidateApproval])

  const migrateV2 = useCallback(async () => {
    try {
      if (!STL || !STLV2 || isReadOnly) {
        throw new Error('Contract is not authorised')
      }
      const dto = await buildMigrationPayload(id, STL);
      console.log(STLV2)
      const tx = STLV2.claim(
        id,
        [dto.size,
          dto.spirit,
          dto.age,
          dto.resource,
          dto.morale,
          dto.government,
          dto.turns]
      )
      await handleTx(tx)
    } catch (err) {
      console.log(err)
    }
  }, [STL, STLV2, handleTx, id, isReadOnly])

  const isOwner = useMemo(() => owner && account && isAddressMatch(account, owner), [account, owner])

  const rolls = useMemo(() => {
    const realm = data?.attributes[6].value;
    return 5 - realms.indexOf(realm) || 0
  }, [data])

  if (isFallback || !data) {
    return <p>
      loading...
    </p>
  }


  return (
    <Fragment>
      <Head>
        <title>{data?.name}</title>
        <meta name="description" content={description}/>
      </Head>
      <Header/>
      <main className={styles.main}>
        <h1>{data.name}</h1>
        <NFTFullPage
          useBetaIndexer={true}
          contract={SETTLEMENT_CONTRACT_ADDRESS}
          id={id}
        >
          <div className={styles.media}>
            <MediaObject metadata={{...data, mimeType: 'image/svg+xml'}}/>
          </div>

          {isOwner && (
            <div className={styles.manageContainer}>
              {legacy ?
                <ManageLegacySettlement
                  txInProgress={txInProgress}
                  txStatus={txStatus}
                  approved={!!approved}
                  approve={approveV2}
                  migrate={migrateV2}
                /> :
                <ManageV2Settlement id={id} rolls={rolls}/>
              }
            </div>
          )}
          {account && (
            <div>
              <h3>Your Resource Balances</h3>
              {resources.map(r => <ResourceBalance key={r} resource={r}/>)}
            </div>
          )}
          {NETWORK_CHAIN_ID === 1 && (
            <>
              <FullComponents.AuctionInfo showPerpetual={false}/>
              <FullComponents.MediaInfo/>
            </>
          )}
        </NFTFullPage>
      </main>
    </Fragment>
  );
}

export const getStaticProps: GetServerSideProps<SettlementProps> = async ({params}) => {
  if (!params?.id || Array.isArray(params.id)) {
    return {notFound: true};
  }
  const id = params.id as string;

  try {
    const legacyData = await contractService.fetchTokenData(params.id)
    const data = await contractService.fetchTokenDataV2(params.id)

    if (!data && !legacyData || !legacyData) {
      return {
        notFound: true,
        revalidate: 60
      }
    }

    return {
      props: {
        id,
        name: data?.name || legacyData?.name,
        description: data?.description || legacyData?.description,
        image: data?.image || legacyData?.image,
        data: data || legacyData,
        legacy: !!legacyData
      },
    };
  } catch (e) {
    return {
      notFound: true,
      revalidate: 60 * 5
    }
  }

};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true
  }
}


export default ViewSettlement
