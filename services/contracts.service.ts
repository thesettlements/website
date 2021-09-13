import {SETTLEMENT_CONTRACT_ADDRESS, SETTLEMENT_V2_CONTRACT_ADDRESS} from "constants/addresses";
import {Contract} from '@ethersproject/contracts';
import {defaultProvider} from "constants/providers";
import {decodeTokenURI} from "utils/decoder";
import {SettlementV2Abi} from "constants/abis";

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


async function fetchTokenData(tokenId: string, contractAddress: string): Promise<SettlementData | undefined> {
  try {
    const contract = new Contract(contractAddress, [
      'function tokenURI(uint256 tokenId) public view returns (string memory)'
    ], defaultProvider)
    const uri = await contract.tokenURI(tokenId)
    return decodeTokenURI(uri)
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(e)
    }
    return
  }

}

async function fetchTokenDataV2(tokenId: string): Promise<SettlementData | undefined> {
  try {
    const contract = new Contract(SETTLEMENT_V2_CONTRACT_ADDRESS, SettlementV2Abi, defaultProvider)
    const uri = await contract.tokenURI(tokenId)
    return decodeTokenURI(uri)
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(e)
    }
    return
  }
}

export const contractService = {
  fetchTokenData,
  fetchTokenDataV2
}
