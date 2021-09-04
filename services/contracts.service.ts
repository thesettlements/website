import {SETTLEMENT_CONTRACT_ADDRESS} from "constants/addresses";
import {Contract} from '@ethersproject/contracts';
import {defaultProvider} from "constants/providers";
import {decodeTokenURI} from "utils/decoder";

export interface SettlementData {
  name: string
  description: string;
  size: string
  spirit: string
  age: string
  resource: string
  image: string
}

async function fetchTokenData(tokenId: string): Promise<SettlementData> {
  const contract = new Contract(SETTLEMENT_CONTRACT_ADDRESS, [
    'function tokenURI(uint256 tokenId) public view returns (string memory)'
  ], defaultProvider)
  const uri = await contract.tokenURI(tokenId)
  return decodeTokenURI(uri)
}

export const contractService = {
  fetchTokenData
}
