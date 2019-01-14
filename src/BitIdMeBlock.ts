import {Block} from "./Block";
import * as crypto from 'crypto';
import * as stream from 'stream';
import {UuidUtils} from "./UuidUtils";
/**
 * Created by dsmiley on 1/13/19.
 */
export class BitIdMeBlock extends Block {

    private _transactionId: string;

    constructor(index:number, timestamp:number, previousHash:string, data:string, createHash:(algorithm:string, options?:stream.TransformOptions) => crypto.Hash, algorithm:string = 'sha256', transactionId: string = UuidUtils.generateUUID()) {
        super(index, timestamp, previousHash, data, createHash, algorithm);
        this._transactionId = transactionId;
    }

    get transactionId():string {
        return this._transactionId;
    }

    // BitIDMe is a centralized database, so we don't need to elect leaders using PoW or PoS
    public mineBlock(difficulty:number):void {

    }
}