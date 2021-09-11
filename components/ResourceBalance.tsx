import React, { useMemo } from "react";
import {
  DIAMOND_TOKEN_ADDRESS,
  FISH_TOKEN_ADDRESS,
  GOLD_TOKEN_ADDRESS,
  GRAIN_TOKEN_ADDRESS,
  GRASS_TOKEN_ADDRESS,
  IRON_TOKEN_ADDRESS,
  OIL_TOKEN_ADDRESS,
  PEARL_TOKEN_ADDRESS,
  SETL_EXP_TOKEN_ADDRESS,
  SILVER_TOKEN_ADDRESS,
  WATER_TOKEN_ADDRESS,
  WOOD_TOKEN_ADDRESS,
  WOOL_TOKEN_ADDRESS,
} from "constants/addresses";
import useSWR from "swr";
import { BaseErc20Factory } from "@zoralabs/core/dist/typechain";
import { defaultProvider } from "constants/providers";
import { useWeb3React } from "@web3-react/core";
import { formatUnits } from "@ethersproject/units";

const resourceToContract: {
  [key: string]: string;
} = {
  water: WATER_TOKEN_ADDRESS,
  gold: GOLD_TOKEN_ADDRESS,
  grain: GRAIN_TOKEN_ADDRESS,
  grass: GRASS_TOKEN_ADDRESS,
  iron: IRON_TOKEN_ADDRESS,
  silver: SILVER_TOKEN_ADDRESS,
  wood: WOOD_TOKEN_ADDRESS,
  wool: WOOL_TOKEN_ADDRESS,
  fish: FISH_TOKEN_ADDRESS,
  pearl: PEARL_TOKEN_ADDRESS,
  oil: OIL_TOKEN_ADDRESS,
  diamond: DIAMOND_TOKEN_ADDRESS,
  setlExp: SETL_EXP_TOKEN_ADDRESS,
};

export const ResourceBalance: React.FC<{ resource: string }> = ({
  resource,
}) => {
  const { account } = useWeb3React();
  const contractAddress = useMemo(
    () => resourceToContract?.[resource.toLowerCase()],
    [resource]
  );

  const { data } = useSWR(
    ["balanceOf", contractAddress, account],
    (_, address, account) =>
      BaseErc20Factory.connect(address, defaultProvider).balanceOf(account)
  );

  if (data?.lte("0")) {
    return <div />;
  }

  return (
    <h3 style={{ listStyle: "none" }}>
      {resource}: {data ? formatUnits(data) : 0}
    </h3>
  );
};
