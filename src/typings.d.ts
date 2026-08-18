declare const process: {
  env: {
    /** 构建时通过 Umi define 注入的后端 API 基础地址，默认空（走 dev proxy） */
    API_BASE?: string;
    NODE_ENV?: string;
  };
};

declare module '*.css';
declare module '*.less';
declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';

/**
 * jsencrypt 无内置类型（@types/jsencrypt 在镜像源缺失），本地声明最小可用类型
 */
declare module 'jsencrypt' {
  interface JSEncryptOptions {
    default_key_size?: string;
    default_public_exponent?: string;
    log?: boolean;
  }
  class JSEncrypt {
    constructor(options?: JSEncryptOptions);
    setPublicKey(publicKey: string): void;
    setPrivateKey(privateKey: string): void;
    encrypt(plaintext: string): string | false;
    decrypt(ciphertext: string): string | false;
    getPublicKey(): string;
    getPrivateKey(): string;
  }
  export default JSEncrypt;
}
