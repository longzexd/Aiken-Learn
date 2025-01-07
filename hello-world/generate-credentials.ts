import { Lucid } from "lucid-cardano";
import * as fs from "fs";

// 生成凭证的主函数
async function generateCredentials() {
  try {
    // 初始化 Lucid
    const lucid = await Lucid.new(undefined, "Preview");

    // 生成私钥
    const privateKey = lucid.utils.generatePrivateKey();
    console.log("Generated private key:", privateKey);

    // 从私钥创建地址
    const address = await lucid
      .selectWalletFromPrivateKey(privateKey)
      .wallet.address();
    console.log("Generated address:", address);

    // 创建凭证对象
    const credentials = {
      privateKey,
      address,
      network: "Preview"
    };

    // 将凭证写入文件
    fs.writeFileSync(
      "credentials.json",
      JSON.stringify(credentials, null, 2)
    );

    console.log("Credentials saved to credentials.json");
  } catch (error) {
    console.error("Error generating credentials:", error);
    throw error;
  }
}

// 执行生成凭证
generateCredentials().catch((error) => {
  console.error("Failed to generate credentials:", error);
  process.exit(1);
});