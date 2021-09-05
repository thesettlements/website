import 'styles/globals.scss'
import type {AppProps} from 'next/app'
import {css} from '@emotion/css'
import {Web3ConfigProvider} from '@zoralabs/simple-wallet-provider'
import {NETWORK_CHAIN_ID, NETWORK_URL} from "constants/network";

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Web3ConfigProvider
        networkId={NETWORK_CHAIN_ID}
        rpcUrl={NETWORK_URL || undefined}
        theme={{
          walletOption: css`
            color: #000 !important;
            position: relative;
            width: 100%;
            padding: 20px;
            margin-bottom: 20px;
            cursor: pointer;

            &:last-child {
              margin-bottom: 0;
            }
          `,
        }}
      >
        <Component {...pageProps} />
      </Web3ConfigProvider>
    </>
  )
}

export default MyApp
