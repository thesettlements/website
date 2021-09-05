import React, {createContext, useEffect, useState} from 'react'
import {useWeb3React} from '@web3-react/core'
import {defaultProvider} from "constants/providers";
import {SETTLEMENT_CONTRACT_ADDRESS, SETTLEMENT_V2_CONTRACT_ADDRESS} from "constants/addresses";
import {Erc721, Erc721Factory} from "@zoralabs/core/dist/typechain";
import {Contract} from "@ethersproject/contracts";
import SettlementV2 from 'abis/SettlementsV2.json'


const defaultSettlement = Erc721Factory.connect(SETTLEMENT_CONTRACT_ADDRESS, defaultProvider);
const defaultSettlementV2 = new Contract(SettlementV2.address, SettlementV2.abi, defaultProvider)

export interface ContractCtx {
  STL: Erc721
  STLV2: Contract
  isReadOnly: boolean
}

export const ContractContext = createContext<ContractCtx>({
  STL: defaultSettlement,
  STLV2: defaultSettlement,
  isReadOnly: true,
})

export const ContractProvider: React.FC = ({children}) => {
  const {account, library} = useWeb3React()
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false)
  const [STL, setSTLContract] = useState<Erc721>(defaultSettlement)
  const [STLV2, setSTLV2Contract] = useState(defaultSettlementV2)

  useEffect(() => {
    if (!library) {
      return
    }

    const signer = library.getSigner()
    if (account && library) {
      const authorisedSettlements = Erc721Factory.connect(SETTLEMENT_CONTRACT_ADDRESS, signer);
      setSTLContract(authorisedSettlements)
      const authorisedSettlementV2 = new Contract(SETTLEMENT_V2_CONTRACT_ADDRESS, SettlementV2.abi, signer)
      setSTLV2Contract(authorisedSettlementV2);
      setIsReadOnly(false)
    }
  }, [library, account])

  useEffect(() => {
    if (!account && !isReadOnly) {
      setSTLContract(defaultSettlement)
      setSTLV2Contract(defaultSettlementV2)
      setIsReadOnly(true)
    }
  }, [account, isReadOnly])

  return (
    <ContractContext.Provider
      value={{
        STL,
        STLV2,
        isReadOnly,
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}
