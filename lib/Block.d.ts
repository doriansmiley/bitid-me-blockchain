export declare class Block {
    private index;
    private timestamp;
    private hash;
    private previousHash;
    private data;
    private nonce;
    private crypto;
    private algorithm;
    constructor(index: number, timestamp: number, previousHash: string, data: string, crypto: any, algorithm?: string);
    static calculateHash(block: Block, crypto: any, algorithm?: string): string;
}
