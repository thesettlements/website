import type {NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>The Settlements Game</title>
        <meta name="description" content="The Settlments"/>
        <link rel="icon" href="/favicon.jpg"/>
      </Head>

      <main className={styles.main}>
        <h2 className={styles.title}>
          The Settlements
        </h2>

        <p className={styles.description}>
          A turn-based, on-chain, nft game where rarity can be discovered not determined.
        </p>

        <div className={styles.links}>
          <h5 className={styles.subtitle}>Links</h5>
          <div className={styles.linkRow}>
            <a href="https://discord.gg/UCN8QBQB" target="_blank" rel="noopener noreferrer">
              Discord
            </a>
            <a href="https://etherscan.io/token/0xdEcC60000ba66700a009b8F9F7D82676B5cfA88A" target="_blank" rel="noopener noreferrer">
              Etherscan
            </a>
          </div>
          <h5 className={styles.subtitle}>Marketplaces</h5>
          <div className={styles.linkRow}>
            <a href="https://thegrand.exchange" target="_blank" rel="noopener noreferrer">
              The Grand Exchange
            </a>
            <a href="https://opensea.io/collection/settlements" target="_blank" rel="noopener noreferrer">
              Opensea
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
