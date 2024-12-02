import crypto from 'crypto';
import { config } from 'dotenv';
config();

export const signResponsePayload = (payload: any, key: string, encode: string = "sha256") => {
    // Calling createHmac method
    // consider using sha512 later - though it comes with some computing power
    const hash = crypto.createHmac(encode, key)
        .update(JSON.stringify(payload)) // updating the data
        .digest('hex');// Encoding to be used
    return hash;
}

export const verifySignature = (payload: any, key: string, encode: string = "sha256") => {
    const hash = crypto.createHmac(encode, key)
        .update(JSON.stringify(payload)) // updating the data
        .digest('hex');// Encoding to be used
    return hash;
}
/** ==================== Alternative function to sign a payload ================ */
export const signResponsePayload_hash = (payload: any, encode: string = "sha256") => {
    // stringify the payload
    payload = JSON.stringify(payload);
    // prepare digest
    let hash: any = crypto.createHash(encode);
    hash.update(payload).digest("hex");
    return hash;
}

export const verify = (payload: any, encode: string = "sha256") => {
    // stringify the payload
    payload = JSON.stringify(payload);
    let hash = crypto.createHash(encode);
    hash.update(payload).digest("hex");
    // verify separately
    console.log(hash.toString());
    return hash;
}

export const signResponsePayload_SF = (payload: any, privateKey: string) => {
    payload = JSON.stringify(payload);
    // sign combined
    let sign = crypto.createSign('RSA-SHA256');
    sign.update(payload);
    let signature = sign.sign(privateKey, 'hex');

    console.log(signature);
    return signature
}

export const verifySFSignature = (signature: string, publicKey: string) => {
    // mainly interested in last 32 bytes (the actual hash) - the rest is asn.1 stuff
    // (ideally we should check that too)
    let result: any = crypto.publicDecrypt(publicKey, new Buffer(signature, 'hex')).slice(-32).toString('hex')
    console.log(result);
    return result;
}

export const signResponsePayload_PE = (payload: any, privateKey: string) => {
    // stringify the payload
    payload = JSON.stringify(payload);
    /** asn.1 prefix for SHA256 */
    // copied junk
    let bufferObj: any[] = [0x30, 0x31, 0x30, 0x0d, 0x06, 0x09, 0x60, 0x86, 0x48, 0x01, 0x65, 0x03, 0x04, 0x02, 0x01, 0x05, 0x00, 0x04, 0x20];
    // random val junk
    let _bufferObj: any[] = [0x04, 0x30, 0x60, 0x00, 0x31, 0x30, 0x0d, 0x06, 0x09, 0x86, 0x05, 0x20, 0x48, 0x01, 0x65, 0x03, 0x04, 0x02, 0x01];
    const asnGunk: any = Buffer.from(_bufferObj);

    // prepare digest
    let hash: any = crypto.createHash('sha256');
    hash.update(payload);
    let digest: any = hash.digest();

    // prefix the digest with the asn.1 stuff
    let encoded = Buffer.concat([asnGunk, digest]);
    // sign separately (using the encoded data, not just the raw hash)
    let signature: any = crypto.privateEncrypt(privateKey, encoded);
    return signature;

}

export const verifyPESignature = (payload: any, signature: string, publicKey: string, encode: string = "RSA-SHA256") => {
    let verify = crypto.createVerify(encode);
    verify.update(payload);
    let result = verify.verify(publicKey, signature);
    console.log(result);
    return result;
}
