import React, {createContext, useEffect, useState} from 'react'
import {useWeb3React} from '@web3-react/core'
import {defaultProvider} from "constants/providers";
import {Contract, ContractTransaction} from "@ethersproject/contracts";
import {SETTLEMENT_CONTRACT_ADDRESS} from "constants/addresses";

const interfaces = [
  'function tokenURI(uint256 tokenId) public view returns (string memory)',
  'function randomise(uint256 tokenId)'
]

const defaultSettlement = new Contract(SETTLEMENT_CONTRACT_ADDRESS, interfaces, defaultProvider) as any as SettlementContract

export interface SettlementContract {
  tokenURI: (tokenId: string) => Promise<string>
  randomise: (tokenId: string) => Promise<ContractTransaction>
}

export interface ContractCtx {
  STL: SettlementContract
  isReadOnly: boolean
}

export const ContractContext = createContext<ContractCtx>({
  // TODO  generate types from hardhat
  STL: defaultSettlement as any as SettlementContract,
  isReadOnly: true,
})

export const ContractProvider: React.FC = ({children}) => {
  const {account, library} = useWeb3React()
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false)
  const [STL, setSTLContract] = useState<SettlementContract>(defaultSettlement as any as SettlementContract)

  useEffect(() => {
    if (!library) {
      return
    }

    const signer = library.getSigner()
    if (account && library) {
      const authorisedSettlements = new Contract(SETTLEMENT_CONTRACT_ADDRESS, interfaces, signer) as any as SettlementContract
      setSTLContract(authorisedSettlements)
      setIsReadOnly(false)
    }
  }, [library, account])

  useEffect(() => {
    if (!account && !isReadOnly) {
      setSTLContract(defaultSettlement)
      setIsReadOnly(true)
    }
  }, [account, isReadOnly])

  return (
    <ContractContext.Provider
      value={{
        STL,
        isReadOnly,
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}
