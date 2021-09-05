import {NETWORK_CHAIN_ID} from "constants/network";
import SettlementV2 from 'abis/SettlementsV2.json'

export const SETTLEMENT_CONTRACT_ADDRESS = NETWORK_CHAIN_ID === 1 ? '0xdEcC60000ba66700a009b8F9F7D82676B5cfA88A' : '0x71482da8ec9aca79b699c37fd1f7eac5833221b5';
export const SETTLEMENT_V2_CONTRACT_ADDRESS = SettlementV2.address;

export const WATER_TOKEN_ADDRESS = '0x8cc626ecf242d5e2bccb9d09f99254fd0ca60771'
export const GOLD_TOKEN_ADDRESS = '0xf5483A123b1336767d8f897189f31a0a755ACe43';
export const GRAIN_TOKEN_ADDRESS = '0xd84e3D50524ee72Ed6EFEC63E419fb9E339B0a6C';
export const GRASS_TOKEN_ADDRESS = '0x959331CC7A29ADac453656fc85Bf4B03FE318c3F';
export const IRON_TOKEN_ADDRESS = '0xcCe083d09F5B8b7a842C21aC644D6682b60fb9B8';
export const SILVER_TOKEN_ADDRESS = '0x2537d6c41CC5026E847b2BaB531B06E3993E703C';
export const WOOD_TOKEN_ADDRESS = '0x510D2CCc07974830D405306acF93811Db6D2bC31';
export const WOOL_TOKEN_ADDRESS = '0x60b733932B6f62843aacB745297EFa9bB38053D7';
