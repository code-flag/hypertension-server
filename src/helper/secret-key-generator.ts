import crypto, { generateKeyPairSync } from "crypto";
import forge from "node-forge";
import { sha3_256, sha3_512 } from 'js-sha3';

/**
 * SHA-3 is considered highly secure and is published as official 
 * recommended crypto standard in the United States. 
 * @param salt - this could be user unique field or key
 */
export const generateSecureKey_256 = async (salt: any) => {
   salt = Buffer.from(salt, "utf-8");
    const secret: any = crypto.createSecretKey(salt);
    return await sha3_256(salt);
}


// var secretKey = crypto.createSecretKey({
//   encoding: encode.Encoding.UTF_8,
//   guid: '284CFB2D225B1D76FB94D150207E49DF'
//   });

/**
 * SHA-3 is considered highly secure and is published as official 
 * recommended crypto standard in the United States. 
 * 
 * @param salt - this could be user unique field or key
 */
export const generateSecureKey_512 = (salt: any) => {
    const secret: any = crypto.createSecretKey(salt);
    return sha3_512(salt);
}

/**
 * This method is based on nodejs crypto generatepublickey method 
 * @param salt 
 * @param encode 
 */
export const generatePublicKey = async (salt: string, encode: string = 'sha512') => {
  let key;
   await crypto.pbkdf2('secret', salt, 100000, 64, encode, (err: any, derivedKey: any) => {
        if (err) throw err;
        // Printing the derived key
        console.log("Key Derived: ", derivedKey);
        key =  derivedKey
    });
    return key;
}

export const generateHmacKey = async (salt: any) => {
    // const secret: any = crypto.createSecretKey(salt); // Creates SecretKeyObject

    const hmac = crypto.createHmac('sha256', salt).update('no secret is a secret if you don\'t have a secret').digest('hex');
    return hmac;
}

/**
 * This method can be used to sign a text or information by using the sk key to sign and pk to verify
 * @param encode - this could be rsa or ed25519
 * @returns 
 */
export const generateKeyPair = (encode: string = 'rsa', passphrase: string = 'top secret') => {
    const keyPair: any = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: passphrase
      }
    });
  
    return keyPair;
  }
  
  /**
   * @method generateSSHFromKeypair - this uses node-forge
   *  - The Forge software is a fully native implementation of the TLS protocol in JavaScript, a set of 
   * cryptography utilities, and a set of tools for developing Web 
   * Apps that utilize many network resources. node-forge is a JavaScript implementations of 
   * network transports, cryptography, ciphers, PKI, message digests, and various utilities
   * @param publicKey 
   * @param privateKey 
   * @returns 
   */
  export const generateSSHFromKeypair = (publicKey: string, privateKey: string) => {
    return {'publicKey' :forge.ssh.publicKeyToOpenSSH(forge.pki.publicKeyFromPem(publicKey)), 
    "privateKey": forge.ssh.privateKeyToOpenSSH(forge.pki.privateKeyFromPem(privateKey))};
  }
  
  /**
   * This is method is used to signed a payload or an information using keypair method
   * @param {string} payload - text or stringify data
   * @param {string} privateKey - private key of the keypair
   * @returns string - signed
   */
  export const signWithKeyPair = (payload: string, privateKey: string) => {
    return crypto.sign(null, Buffer.from(payload), privateKey)
  }
  
  /**
   * This is method is used to verify data signed using keypair sign method
   * @param payload - text or stringify data
   * @param publicKey - public key of the keypair
   * @param signature - signature to verify
   * @returns string - verified text or string data
   */
  export const verifyWithKeyPair = (payload: string, publicKey: string, signature: any) => {
    const verified = crypto.verify(null, Buffer.from(payload), publicKey, signature);
    // console.log(signature.toString('base64'))
    // console.log(verified)
    return verified;
  }