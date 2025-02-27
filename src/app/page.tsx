'use client'
import { useState } from "react";
import styles from "./page.module.css";
import { signAdr36Message } from './signWithPrivatekey'
import { keplrSignMsg } from "./signByKeplr";

declare global {
  const keplr: any
  const okxwallet: {
    keplr: any
  }
}

export default function Home() {
  const [privKey, setPrivKey] = useState('');
  const [addr, setAddr] = useState('');
  const [msg, setMsg] = useState('123');
  const [chainId, setChainId] = useState('bbn-test-5');

  const [sigByKelpr, setSigByKelpr] = useState('')
  const [sigByPrivKey, setSigByPrivKey] = useState('')

  chainId

  return (
    <div className={styles.page}>
      <div>
        <label>msg  {'   '}
          <input value={msg} onChange={e => setMsg(e.target.value)} />
        </label>
      </div>
      <main className={styles.main}>
        <div>
          <label>chainId  {'   '}
            <input value={chainId} onChange={e => setChainId(e.target.value)} />
          </label>
          <button onClick={async () => {
            const rs = await keplrSignMsg(msg, chainId);
            setSigByKelpr(rs?.signature?.signature || 'null')
          }}>sign msg with keplr</button>
          <section>{sigByKelpr}</section>
        </div>
        <div>
          <label>private key {'   '}
            <input value={privKey} onChange={e => setPrivKey(e.target.value)} />
          </label>
          <label>bech32 address  {'   '}
            <input value={addr} onChange={e => setAddr(e.target.value)} />
          </label>
          <div>
            <button onClick={async () => {
              const rs = await signAdr36Message(addr, privKey, msg);
              setSigByPrivKey(rs?.signature?.signature || 'null')
            }}>sign with private key</button>
          </div>
          <section>{sigByPrivKey}</section>
        </div>
      </main>
    </div>
  );
}
