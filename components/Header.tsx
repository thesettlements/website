import React, {useState} from 'react';
import styles from 'styles/Header.module.scss';
import {useWalletButton} from "@zoralabs/simple-wallet-provider";
import {useWeb3React} from "@web3-react/core";
import Link from 'next/link'

export function Header() {
  const {deactivate} = useWeb3React()
  const {buttonAction, actionText, connectedInfo, account} = useWalletButton();
  const [hover, setHover] = useState(false)


  return (
    <nav className={styles.container}>
      <Link href="/" passHref>
        <a>
          <h4>
            The Settlements
          </h4>
        </a>
      </Link>
      {connectedInfo || account ?
        <div
          className={styles.account}
          onClick={hover ? deactivate : undefined}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <h4>{hover ? "Disconnect" : account?.addressShortened}</h4>
        </div> :
        <button role="button" onClick={() => {
          setHover(false)
          buttonAction()
        }}>
          {actionText}
        </button>
      }
    </nav>
  )
}
