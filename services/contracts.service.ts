import {SETTLEMENT_CONTRACT_ADDRESS} from "constants/addresses";
import {Contract} from '@ethersproject/contracts';
import {defaultProvider} from "constants/providers";
import {decodeTokenURI} from "utils/decoder";
import SettlementV2 from 'abis/SettlementsV2.json'

export interface SettlementData {
  name: string
  description: string;
  size: string
  spirit: string
  age: string
  resource: string
  image: string
  attributes: { trait_type: string, value: string }[]
}


async function fetchTokenData(tokenId: string): Promise<SettlementData | undefined> {
  try {
    const contract = new Contract(SETTLEMENT_CONTRACT_ADDRESS, [
      'function tokenURI(uint256 tokenId) public view returns (string memory)'
    ], defaultProvider)
    const uri = await contract.tokenURI(tokenId)
    return decodeTokenURI(uri)
  } catch (e) {
    console.error(e)
    return
  }

}

async function fetchTokenDataV2(tokenId: string): Promise<SettlementData | undefined> {
  try {
    const contract = new Contract(SettlementV2.address, SettlementV2.abi, defaultProvider)
    const uri = await contract.tokenURI(tokenId)
    return decodeTokenURI(uri)
  } catch (e) {
    console.error(e)
    return
  }

}

export const contractService = {
  fetchTokenData,
  fetchTokenDataV2
}
