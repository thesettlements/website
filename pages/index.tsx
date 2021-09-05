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
        <h3 className={styles.title}>
          The Settlements
        </h3>
        <h5 className={styles.subtitle}>
          A turn-based, on-chain, nft game where rarity can be discovered not determined.
        </h5>

        <div className={styles.links}>
          <h5 className={styles.subtitle}>Where are the Settlers</h5>
          <div className={styles.linkRow}>
            <a href="https://discord.gg/UCN8QBQB" target="_blank" rel="noopener noreferrer">
              Discord
            </a>
            <a href="https://etherscan.io/token/0xdEcC60000ba66700a009b8F9F7D82676B5cfA88A" target="_blank" rel="noopener noreferrer">
              Etherscan
            </a>
            <a href="https://twitter.com/the_settlements" target="_blank" rel="noopener noreferrer">
              Twitter
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

        <article className={styles.loreContainer}>
          <h3>Chapter One — The Beginning</h3>
          <p>
            In the beginning there was a song, quiet and sombre, barely noticeable and drowning in the sheer volume of
            Ur’s encompassing presence.
          </p>
          <p>
            Ur, the All-Mother, the All-Being, a goddess to the gods of gods, in whose lap all existence, all worlds are
            gently cradled until they are no more and have to be born anew. Older than the song, indifferent to its
            melody, but yet resonating in cosmic harmony with every single one of its eon long notes.
          </p>
          <p>
            Did the song awake The Builder or is The Builder the song itself? This question has been a point of debate,
            content and academic dispute in the stuffed, candle-lit studies of the academies of Keskella for hundreds of
            years, one that has led to wars, lost friendships and much philosophical ire and headache, but one that is
            not
            important to our story for now. All that matters is that The Builder rose and they began to build.
          </p>
          <p>
            The Builder’s thoughts manifested one plane of existence over and through one another, weaving them together
            like the ribs of the finest basket only the good people of Valhalla knew how to make, until they were whole.
            Mountains rose, formed valleys, valleys filled with waters, grinding the mountains down to dust and turning
            them into plains, only to repeat the cycle until it was perfect in The Builder’s eyes.
          </p>
          <p>
            Between the planes shadows formed, shadows so dark that no light would ever penetrate them or chase them
            away,
            slowly gnawing at the edges of the planes, but necessary in all of their evil and destruction. The Builder
            did
            not fear the shadows, because all things must come to an end, so they can be build anew and renewed.
          </p>
          <p>
            The Builder was awake and sleep turned into a faint memory, just like the passing notes of the song that
            woke
            them into the All-Being’s watchful eyes.
          </p>
          <p>
            There was so much to build.
          </p>
        </article>

        <article className={styles.loreContainer}>
          <h3> Chapter Two - Resources, Resources, Resources</h3>
          <p>👀</p>
        </article>

      </main>
    </div>
  )
}

export default Home
