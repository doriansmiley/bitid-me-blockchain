import {Block} from "./Block";
import * as crypto from 'crypto';
import * as stream from 'stream';
import {UuidUtils} from "./UuidUtils";
/**
 * Created by dsmiley on 1/13/19.
 */
export class BitIdMeBlock extends Block {

    private _transactionId: string;
    private _signature: string;

    constructor(index:number, timestamp:number, previousHash:string, data:string, createHash:(algorithm:string, options?:stream.TransformOptions) => crypto.Hash, algorithm:string = 'sha256', transactionId: string = UuidUtils.generateUUID()) {
        super(index, timestamp, previousHash, data, createHash, algorithm);
        this._transactionId = transactionId;
        crypto.generateKeyPair
    }

    get transactionId():string {
        return this._transactionId;
    }

    get signature():string {
        return this._signature;
    }

    public mineBlock(difficulty:number):void {

    }
}