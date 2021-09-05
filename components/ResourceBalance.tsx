import React, {useMemo} from "react";
import {WATER_TOKEN_ADDRESS} from "constants/addresses";
import useSWR from "swr";
import {BaseErc20Factory} from "@zoralabs/core/dist/typechain";
import {defaultProvider} from "constants/providers";
import {useWeb3React} from "@web3-react/core";
import {formatUnits} from '@ethersproject/units';

const resourceToContract: {
  [key: string]: string
} = {
  water: WATER_TOKEN_ADDRESS
}

export const ResourceBalance: React.FC<{ resource: string }> = ({resource}) => {

  const {account} = useWeb3React()
  const contractAddress = useMemo(() => resourceToContract?.[resource.toLowerCase()], [resource])

  const {
    data
  } = useSWR(['balanceOf', contractAddress, account],
    (_, address, account) => BaseErc20Factory.connect(address, defaultProvider).balanceOf(account)
  )

  console.log(data)

  if (data?.lte('0')) {
    return <div />
  }

  return (
    <h3 style={{listStyle: 'none'}}>{resource}: {data ? formatUnits(data) : 0}</h3>
  )
}
