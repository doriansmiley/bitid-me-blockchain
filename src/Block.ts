/**
 * Created by dsmiley on 1/13/19.
 */
import * as crypto from 'crypto';
import * as stream from 'stream';

export class Block {
    private index:number;
    private timestamp:number;
    private hash:string;
    private previousHash:string;
    private data:string;
    private nonce:number;
    private createHash:(algorithm:string, options?:stream.TransformOptions) => crypto.Hash;
    private algorithm:string;

    constructor(index:number, timestamp:number, previousHash:string, data:string, createHash:(algorithm:string, options?:stream.TransformOptions) => crypto.Hash, algorithm:string = 'sha256') {
        this.index = index;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.data = data;
        this.nonce = 0;
        this.createHash = createHash;
        this.algorithm = algorithm;
        this.hash = Block.calculateHash(this, this.createHash, this.algorithm);
    }

    public getIndex():number {
        return this.index;
    }

    public getTimestamp():number {
        return this.timestamp;
    }

    public getHash():string {
        return this.hash;
    }

    public getPreviousHash():string {
        return this.previousHash;
    }

    public getData():string {
        return this.data;
    }

    public str():string {
        return this.index.toString() + this.timestamp.toString() + this.previousHash + this.data + this.nonce.toString();
    }

    public toString():string {
        return JSON.stringify({
            block: this.index,
            previousHash: this.previousHash,
            timestamp: this.timestamp,
            data: this.data,
            hash: this.hash,
        })
    }

    public static zeros(difficulty:number):string {
        let returnValue:string = '';
        for (var i = 0; i < difficulty; i++) {
            returnValue += '0';
        }
        return returnValue;
    }

    public static calculateHash(block:Block, createHash:(algorithm:string, options?:stream.TransformOptions) => crypto.Hash, algorithm:string = 'sha256'):string {
        if (block != null) {
            let digest:string = null;
            try {
                digest = createHash('sha256').update(block.str()).digest('hex');
            } catch (e) {
                // log error to std out
                console.error(e);
                return null;
            }

            return digest;
        }
        return null;
    }

    public mineBlock(difficulty:number):void {
        this.nonce = 0;

        while (this.getHash().substring(0, difficulty) !== (Block.zeros(difficulty))) {
            this.nonce++;
            this.hash = Block.calculateHash(this, this.createHash, this.algorithm);
        }
    }
}