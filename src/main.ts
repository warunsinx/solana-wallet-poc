import { Keypair } from "@solana/web3.js";
import { encodeBase58, ethers } from "ethers";
import * as bip39 from "bip39";
import { HDKey } from "micro-ed25519-hdkey";

const main = async () => {
  const mnemonic = ethers.Wallet.createRandom().mnemonic;
  const phrase = mnemonic?.phrase || "";

  const seed = await bip39.mnemonicToSeed(phrase);
  const keypair = Keypair.fromSeed(seed.slice(0, 32));
  const hd = HDKey.fromMasterSeed(seed.toString("hex"));

  console.log("Phrase:", phrase);
  console.log("PublicKey:", keypair.publicKey.toBase58());
  console.log("SecretKey:", encodeBase58(keypair.secretKey));

  for (let i = 0; i < 3; i++) {
    const solPath = `m/44'/501'/${i}'/0'`;
    const keypair = Keypair.fromSeed(hd.derive(solPath).privateKey);
    console.log(`${solPath} => ${keypair.publicKey.toBase58()}`);

    const ethPath = `m/44'/60'/0'/0/${i}`;
    const wallet = ethers.Wallet.fromPhrase(phrase).derivePath(ethPath);
    console.log(`${ethPath} => ${wallet.address}`);
  }
};

main();
