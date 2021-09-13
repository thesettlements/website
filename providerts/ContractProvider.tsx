import React, { createContext, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { defaultProvider } from "constants/providers";
import {
  ISLAND_CONTRACT_ADDRESS,
  SETTLEMENT_CONTRACT_ADDRESS,
  SETTLEMENT_V2_CONTRACT_ADDRESS,
  SHIP_CONTRACT_ADDRESS,
} from "constants/addresses";
import { Erc721, Erc721Factory } from "@zoralabs/core/dist/typechain";
import { Contract } from "@ethersproject/contracts";
import { IslandsAbi, SettlementV2Abi, ShipsAbi } from "constants/abis";

const defaultSettlement = Erc721Factory.connect(
  SETTLEMENT_CONTRACT_ADDRESS,
  defaultProvider
);
const defaultSettlementV2 = new Contract(
  SETTLEMENT_V2_CONTRACT_ADDRESS,
  SettlementV2Abi,
  defaultProvider
);
const defaultIslands = new Contract(
  ISLAND_CONTRACT_ADDRESS,
  IslandsAbi,
  defaultProvider
);
const defaultShips = new Contract(
  SHIP_CONTRACT_ADDRESS,
  ShipsAbi,
  defaultProvider
);

export interface ContractCtx {
  STL: Erc721;
  STLV2: Contract;
  Islands: Contract;
  Ships: Contract;
  isReadOnly: boolean;
}

export const ContractContext = createContext<ContractCtx>({
  STL: defaultSettlement,
  STLV2: defaultSettlement,
  Islands: defaultIslands,
  Ships: defaultShips,
  isReadOnly: true,
});

export const ContractProvider: React.FC = ({ children }) => {
  const { account, library } = useWeb3React();
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const [STL, setSTLContract] = useState<Erc721>(defaultSettlement);
  const [STLV2, setSTLV2Contract] = useState(defaultSettlementV2);
  const [Islands, setIslandsContract] = useState(defaultIslands);
  const [Ships, setShipsContract] = useState(defaultShips);

  useEffect(() => {
    if (!library) {
      return;
    }

    const signer = library.getSigner();
    if (account && library) {
      const authorisedSettlements = Erc721Factory.connect(
        SETTLEMENT_CONTRACT_ADDRESS,
        signer
      );
      setSTLContract(authorisedSettlements);
      const authorisedSettlementV2 = new Contract(
        SETTLEMENT_V2_CONTRACT_ADDRESS,
        SettlementV2Abi,
        signer
      );
      setSTLV2Contract(authorisedSettlementV2);
      const authorisedIslands = new Contract(
        ISLAND_CONTRACT_ADDRESS,
        IslandsAbi,
        signer
      );
      setIslandsContract(authorisedIslands);
      const authorisedShips = new Contract(
        SHIP_CONTRACT_ADDRESS,
        ShipsAbi,
        signer
      );
      setShipsContract(authorisedShips);
      setIsReadOnly(false);
    }
  }, [library, account]);

  useEffect(() => {
    if (!account && !isReadOnly) {
      setSTLContract(defaultSettlement);
      setSTLV2Contract(defaultSettlementV2);
      setIsReadOnly(true);
    }
  }, [account, isReadOnly]);

  return (
    <ContractContext.Provider
      value={{
        STL,
        STLV2,
        Islands,
        Ships,
        isReadOnly,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
