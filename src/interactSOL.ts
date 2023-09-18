import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { acc1, acc2 } from "./share/wallet";

export const interactSOL = async () => {
  // Create Connection
  const connection = new Connection("https://api.devnet.solana.com");

  // Request Airdrop
  (async () => {
    let txhash = await connection.requestAirdrop(acc1.publicKey, 1e9);
    console.log(`txhash: ${txhash}`);
  })();

  // Get Balance
  (async () => {
    let balance = await connection.getBalance(acc1.publicKey);
    console.log(`SOL Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  })();

  // Transfer SOL
  (async () => {
    let tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: acc1.publicKey,
        toPubkey: acc2.publicKey,
        lamports: 0.1 * LAMPORTS_PER_SOL,
      })
    );
    tx.feePayer = acc1.publicKey;
    let txhash = await connection.sendTransaction(tx, [acc1]);
    console.log(`txhash: ${txhash}`);
  })();
};
