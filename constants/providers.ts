import { NETWORK_CHAIN_ID, NETWORK_URL } from 'constants/network'
import { JsonRpcProvider } from '@ethersproject/providers'

export const defaultProvider = new JsonRpcProvider(NETWORK_URL, NETWORK_CHAIN_ID)
