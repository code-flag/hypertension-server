import { customAlphabet, customRandom, nanoid } from "nanoid";
var seedrandom = require('seedrandom');
export const getUniqueId = (len: number = 8) => nanoid(len); //=> "V1StGXR8_Z5jdHi6B-myT"

 const rng = seedrandom("vspasswordregno")
export const customRandomId = async (len: any) => {
    return customRandom('ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789', len, size => {
        return new Uint8Array(size).map(() => 256 * rng())
      })
}

export const customAlphabetId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789', 10)
// model.id = customAlphabetId(5) //=> "f01a2"