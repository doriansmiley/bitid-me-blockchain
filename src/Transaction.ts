import {UuidUtils} from "./UuidUtils";
import {Block} from "./Block";
import {BlockChain} from "./BlockChain";
/**
 * Created by dsmiley on 1/14/19.
 */
export class Transaction {

    private _hashOfPreviousTransactionBlock:string;
    private _locationOfPreviousTransactionBlock:string;
    private _transactionId:string;
    private _recipientPublicId:string;
    private _ownerPublicId:string;
    // signature must match the one on the previous block
    // this is used to verify ownership
    private _signature:string;
    private _newBlock:Block;
    private _chain:BlockChain;

    constructor(chain:BlockChain,
                hashOfPreviousTransactionBlock: string,
                locationOfPreviousTransactionBlock: string,
                newBlock: Block,
                signature: string,
                recipientPublicId: string,
                ownerPublicId: string) {
        this._chain = chain;
        this._hashOfPreviousTransactionBlock = hashOfPreviousTransactionBlock;
        this._locationOfPreviousTransactionBlock = locationOfPreviousTransactionBlock;
        this._chain = chain;
        this._transactionId = UuidUtils.generateUUID();
        this._signature = signature;
        this._recipientPublicId = recipientPublicId;
        this._ownerPublicId = ownerPublicId;
        this._newBlock = newBlock;
    }

    get hashOfPreviousTransactionBlock():string {
        return this._hashOfPreviousTransactionBlock;
    }

    get locationOfPreviousTransactionBlock():string {
        return this._locationOfPreviousTransactionBlock;
    }

    get chain():BlockChain {
        return this._chain;
    }

    get transactionId():string {
        return this._transactionId;
    }

    get recipientPublicId():string {
        return this._recipientPublicId;
    }

    get ownerPublicId():string {
        return this._ownerPublicId;
    }

    get signature():string {
        return this._signature;
    }

    get newBlock():Block {
        return this._newBlock;
    }

    public verifyOwnership():boolean {
        // TODO: use ECDSA to sign the latest block's hash and verify signature matches the one supplied for this transaction
        return null
    }

    public isValid():boolean {
        // TODO: add additional validation
        return null
    }
}