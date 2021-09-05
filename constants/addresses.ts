import {NETWORK_CHAIN_ID} from "constants/network";
import SettlementV2 from 'abis/SettlementsV2.json'

export const SETTLEMENT_CONTRACT_ADDRESS = NETWORK_CHAIN_ID === 1 ? '0xdEcC60000ba66700a009b8F9F7D82676B5cfA88A' : '0x71482Da8ec9ACa79b699c37fD1F7eAC5833221b5';
export const SETTLEMENT_V2_CONTRACT_ADDRESS = SettlementV2.address;

export const WATER_TOKEN_ADDRESS = '0x8cc626ecf242d5e2bccb9d09f99254fd0ca60771'
