/**
 * Created by dsmiley on 1/13/19.
 */
export class Block {
    private index: number;
    private timestamp: number;
    private hash: string;
    private previousHash: string;
    private data: string;
    private nonce: number;
    private crypto: any;
    private algorithm: string;

    constructor (index: number, timestamp: number, previousHash: string, data: string, crypto:any, algorithm: string = 'sha256'){
        this.index = index;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.data = data;
        this.nonce = 0;
        this.crypto = crypto;
        this.algorithm = algorithm;
        this.hash = Block.calculateHash(this, this.crypto, this.algorithm);
    }

    public static calculateHash(block: Block, crypto:any, algorithm: string = 'sha256'): string {
        if (block != null) {
            let digest: string = null;
            try {
                digest = crypto.createHash('sha256').digest('hex');
            } catch (e) {
                // log error to std out
                console.error(e);
                return null;
            }

            return digest;
        }
        return null;
    }
}