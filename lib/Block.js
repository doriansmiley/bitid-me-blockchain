"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Block {
    constructor(index, timestamp, previousHash, data, crypto, algorithm = 'sha256') {
        this.index = index;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.data = data;
        this.nonce = 0;
        this.crypto = crypto;
        this.algorithm = algorithm;
        this.hash = Block.calculateHash(this, this.crypto, this.algorithm);
    }
    static calculateHash(block, crypto, algorithm = 'sha256') {
        if (block != null) {
            let digest = null;
            try {
                digest = crypto.createHash('sha256').digest('hex');
            }
            catch (e) {
                // log error to std out
                console.error(e);
                return null;
            }
            return digest;
        }
        return null;
    }
}
exports.Block = Block;
//# sourceMappingURL=Block.js.map