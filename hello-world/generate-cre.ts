import { MeshWallet } from '@meshsdk/core';
import fs from 'node:fs';

const secret_key = MeshWallet.brew(true) as string;

fs.writeFileSync('me.sk', secret_key);

const wallet = new MeshWallet({
  networkId: 0,
  key: {
    type: 'root',
    bech32: secret_key,
  },
});

// 使用 async IIFE 来处理 Promise
(async () => {
  const addresses = await wallet.getUnusedAddresses();
  fs.writeFileSync('me.addr', addresses[0]);
})();