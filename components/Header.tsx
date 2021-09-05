import React from 'react';
import styles from 'styles/Header.module.scss';
import {useWalletButton} from "@zoralabs/simple-wallet-provider";
import Avatar from 'boring-avatars';

export function Header() {
  const {buttonAction, actionText, connectedInfo, account} = useWalletButton();
  return (
    <nav className={styles.container}>
      <h4>
        The Settlements
      </h4>
      {connectedInfo || account ?
        <div className={styles.account}>
          <Avatar size={30} name={account?.address}/>
          <h4>{account?.addressShortened}</h4>
        </div> :
        <button role="button" onClick={buttonAction}>
          {actionText}
        </button>
      }
    </nav>
  )
}
