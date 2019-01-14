/**
 * Created by dsmiley on 1/13/19.
 */
import * as crypto from 'crypto';
import * as stream from 'stream';

export class Block {
    private _index:number;
    private _timestamp:number;
    private _hash:string;
    private _previousHash:string;
    private _data:string;
    private _nonce:number;
    private _createHash:(algorithm:string, options?:stream.TransformOptions) => crypto.Hash;
    private _algorithm:string;

    constructor(index:number, timestamp:number, previousHash:string, data:string, createHash:(algorithm:string, options?:stream.TransformOptions) => crypto.Hash, algorithm:string = 'sha256') {
        this._index = index;
        this._timestamp = timestamp;
        this._previousHash = previousHash;
        this._data = data;
        this._nonce = 0;
        this._createHash = createHash;
        this._algorithm = algorithm;
        this._hash = Block.calculateHash(this, this._createHash, this._algorithm);
    }

    public get index():number {
        return this._index;
    }

    public get timestamp():number {
        return this._timestamp;
    }

    public get hash():string {
        return this._hash;
    }

    public get previousHash():string {
        return this._previousHash;
    }

    public get data():string {
        return this._data;
    }

    public str():string {
        return this._index.toString() + this._timestamp.toString() + this._previousHash + this._data + this._nonce.toString();
    }

    public toString():string {
        return JSON.stringify({
            block: this._index,
            previousHash: this._previousHash,
            timestamp: this._timestamp,
            data: this._data,
            hash: this._hash,
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
        this._nonce = 0;

        while (this._hash.substring(0, difficulty) !== (Block.zeros(difficulty))) {
            this._nonce++;
            this._hash = Block.calculateHash(this, this._createHash, this._algorithm);
        }
    }
}