import Head from "next/head";
import styles from "styles/Settlement.module.scss";
import React, { Fragment, useCallback, useContext, useMemo } from "react";
import { GetServerSideProps, GetStaticPaths, NextPage } from "next";
import { useRouter } from "next/router";
import { MediaObject, NFTFullPage } from "@zoralabs/nft-components";
import {
  ISLAND_CONTRACT_ADDRESS,
  SETTLEMENT_CONTRACT_ADDRESS,
  SETTLEMENT_V2_CONTRACT_ADDRESS,
  SHIP_CONTRACT_ADDRESS,
} from "constants/addresses";
import { contractService, SettlementData } from "services/contracts.service";
import { Header } from "components/Header";
import { ContractContext } from "providerts/ContractProvider";
import { useContractTransaction } from "hooks/useContractTx";
import { useWeb3React } from "@web3-react/core";
import { buildMigrationPayload } from "utils/migrate";
import useSWR from "swr";
import { ManageLegacySettlement } from "compositions/ManageLegacySettlement";
import { isAddressMatch } from "utils";
import { ManageV2Settlement } from "compositions/ManageV2Settlement";
import { realms, resources } from "constants/traits";
import { ResourceBalance } from "components/ResourceBalance";
import { ManageIsland } from "compositions/ManageIsland";
import { ManageShip } from "compositions/ManageShip";

type Props = {
  id: string;
  description: any;
  image: string;
  data: SettlementData;
};

const ViewShip: NextPage<Props> = ({ id, description, data }) => {
  const { isFallback } = useRouter();
  const { account } = useWeb3React();
  const { Ships } = useContext(ContractContext);

  const { data: owner } = useSWR(["ownerOf", id], (_, tokenId) =>
    Ships.ownerOf(tokenId)
  );

  const isOwner = useMemo(
    () => owner && account && isAddressMatch(account, owner),
    [account, owner]
  );

  if (isFallback || !data) {
    return <p>loading...</p>;
  }

  return (
    <Fragment>
      <Head>
        <title>{data?.name}</title>
        <meta name="description" content={description} />
      </Head>
      <Header />
      <main className={styles.main}>
        <h1>{data.name}</h1>
        <NFTFullPage
          useBetaIndexer={true}
          contract={SHIP_CONTRACT_ADDRESS}
          id={id}
        >
          <div className={styles.media}>
            <MediaObject metadata={{ ...data, mimeType: "image/svg+xml" }} />
          </div>

          {isOwner && (
            <div className={styles.manageContainer}>
              <ManageShip id={id} />
            </div>
          )}

          {account && (
            <div>
              <h3>Your Resource Balances</h3>
              {resources.map((r) => (
                <ResourceBalance key={r} resource={r} />
              ))}
            </div>
          )}
        </NFTFullPage>
      </main>
    </Fragment>
  );
};

export const getStaticProps: GetServerSideProps<Props> = async ({ params }) => {
  if (!params?.id || Array.isArray(params.id)) {
    return { notFound: true };
  }

  const id = params.id as string;

  try {
    const data = await contractService.fetchTokenData(
      params.id,
      SHIP_CONTRACT_ADDRESS
    );

    if (!data) {
      return {
        notFound: true,
        revalidate: 60,
      };
    }

    return {
      props: {
        id,
        name: data?.name,
        description: data?.description,
        image: data?.image,
        data: data,
      },
      revalidate: 60,
    };
  } catch (e) {
    return {
      notFound: true,
      revalidate: 60 * 5,
    };
  }
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default ViewShip;
