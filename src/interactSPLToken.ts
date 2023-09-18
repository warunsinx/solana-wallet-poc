import { Connection, PublicKey, Transaction } from "@solana/web3.js";

import {
  createTransferCheckedInstruction,
  getAccount,
} from "@solana/spl-token";

import { acc1, SHEEPTokenPK, acc1SHEEPTokenATA } from "./share/wallet";

export const interactSPLToken = async () => {
  // Create Connection
  const connection = new Connection("https://api.devnet.solana.com");
  const SHEEPToken = new PublicKey(SHEEPTokenPK);
  const acc1SHEEPata = new PublicKey(acc1SHEEPTokenATA);

  // get token account info
  let tokenAccount = await getAccount(
    connection,
    new PublicKey(acc1SHEEPTokenATA)
  );
  console.log(tokenAccount);

  // get token account balance
  let tokenAccountBalance = await connection.getTokenAccountBalance(
    acc1SHEEPata
  );
  console.log(
    `decimals: ${tokenAccountBalance.value.decimals}, amount: ${tokenAccountBalance.value.amount}`
  );

  //transfer token
  let tx = new Transaction();
  tx.add(
    createTransferCheckedInstruction(
      acc1SHEEPata, // from
      SHEEPToken, // mint
      new PublicKey(""), // to
      acc1.publicKey, // from's owner
      1, // amount
      0 // decimals
    )
  );
  console.log(`txhash: ${await connection.sendTransaction(tx, [acc1])}`);
};
