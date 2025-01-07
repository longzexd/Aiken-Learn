import fs from "node:fs";
import {
  BlockfrostProvider,
  MeshTxBuilder,
  MeshWallet,
  serializePlutusScript,
  UTxO,
} from "@meshsdk/core";
import { applyParamsToScript } from "@meshsdk/core-csl";
import blueprint from "./plutus.json";

import dotenv from 'dotenv';

// 加载 .env 文件
dotenv.config();

// 检查环境变量是否存在
if (!process.env.BLOCKFROST_PROJECT_ID) {
  throw new Error('BLOCKFROST_PROJECT_ID is not defined in .env file');
}

const blockchainProvider = new BlockfrostProvider(process.env.BLOCKFROST_PROJECT_ID);

export { blockchainProvider };
// wallet for signing transactions
export const wallet = new MeshWallet({
    networkId: 0,
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    key: {
      type: "root",
      bech32: fs.readFileSync("me.sk").toString(),
    },
  });

  export function getScript() {
    const scriptCbor = applyParamsToScript(
      blueprint.validators[0].compiledCode,
      []
    );
   
    const scriptAddr = serializePlutusScript(
      { code: scriptCbor, version: "V3" },
    ).address;
   
    return { scriptCbor, scriptAddr };
  }
   
  // reusable function to get a transaction builder
  export function getTxBuilder() {
    return new MeshTxBuilder({
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
    });
  }
   
  // reusable function to get a UTxO by transaction hash
  export async function getUtxoByTxHash(txHash: string): Promise<UTxO> {
    const utxos = await blockchainProvider.fetchUTxOs(txHash);
    if (utxos.length === 0) {
      throw new Error("UTxO not found");
    }
    return utxos[0];
  }