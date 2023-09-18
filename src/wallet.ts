import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";
import * as bip39 from "bip39";
import * as bs58 from "bs58";
import { HDKey } from "micro-ed25519-hdkey";

export const wallet = async () => {
  //Generate Solana Keypair from Ethers Mnemonic
  const mnemonic = ethers.Wallet.createRandom().mnemonic;
  const phrase = mnemonic?.phrase || "";
  const seed = await bip39.mnemonicToSeed(phrase);
  const keypair = Keypair.fromSeed(seed.slice(0, 32));
  console.log("Phrase:", phrase);
  console.log("PublicKey:", keypair.publicKey.toBase58());
  console.log("SecretKey:", bs58.encode(keypair.secretKey));

  const hd = HDKey.fromMasterSeed(seed.toString("hex"));
  for (let i = 0; i < 3; i++) {
    //Generate Multiple Solana Keypair from Seed
    const solPath = `m/44'/501'/${i}'/0'`;
    const keypair = Keypair.fromSeed(hd.derive(solPath).privateKey);
    console.log(`${solPath} => ${keypair.publicKey.toBase58()}`);

    //Generate Multiple Ethereum Wallet from Mnemonic
    const ethPath = `m/44'/60'/0'/0/${i}`;
    const wallet = ethers.Wallet.fromPhrase(phrase).derivePath(ethPath);
    console.log(`${ethPath} => ${wallet.address}`);
  }
};
