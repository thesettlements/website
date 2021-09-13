import {NETWORK_CHAIN_ID} from "constants/network";
import SettlementV2Mainnet from "abis/SettlementsV2-mainnet.json";
import SettlementV2Rinkeby from "abis/SettlementsV2-rinkeby.json";
import IslandsRinkeby from "abis/Islands-rinkeby.json";
import ShipsRinkeby from "abis/Ships-rinkeby.json";

export const SettlementV2Abi = NETWORK_CHAIN_ID === 1 ? SettlementV2Mainnet.abi : SettlementV2Rinkeby.abi;
export const IslandsAbi = NETWORK_CHAIN_ID === 4 ? IslandsRinkeby.abi : IslandsRinkeby.abi;
export const ShipsAbi = NETWORK_CHAIN_ID === 4 ? ShipsRinkeby.abi : ShipsRinkeby.abi;
