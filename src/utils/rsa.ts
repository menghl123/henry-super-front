import JSEncrypt from 'jsencrypt';

/**
 * 若后端返回的公钥不带 PEM 头（如裸 base64 DER），则补上 SPKI 包裹，
 * 使 jsencrypt.setPublicKey 能正确解析。
 */
function wrapPem(publicKey: string): string {
  const key = publicKey.trim();
  if (key.includes('BEGIN')) return key;
  const body = key.replace(/\s+/g, '').replace(/(.{64})/g, '$1\n');
  return `-----BEGIN PUBLIC KEY-----\n${body}\n-----END PUBLIC KEY-----`;
}

/**
 * 使用后端下发的 RSA 公钥加密密码，返回 base64 密文，
 * 直接作为 LoginRequest.password / CreateUserRequest.password 提交，
 * 对应后端 passwordSupport.decrypt()。
 */
export function rsaEncryptPassword(password: string, publicKey: string): string {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(wrapPem(publicKey));
  const encrypted = encryptor.encrypt(password);
  if (!encrypted) {
    throw new Error('密码加密失败');
  }
  return encrypted;
}
