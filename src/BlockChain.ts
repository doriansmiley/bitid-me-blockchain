import {Block} from "./Block";
import * as crypto from 'crypto';
import * as stream from 'stream';
import {UuidUtils} from "./UuidUtils";
/**
 * Created by dsmiley on 1/13/19.
 * In BitId BlockChains are constructed for every transaction, hence they need a private key to hash
 */
export class BlockChain {
    private _difficulty: number;
    private _algorithm: string;
    private _blocks:Array<Block>;
    private _createHash:(algorithm:string, options?:stream.TransformOptions) => crypto.Hash;

    constructor(difficulty: number, createHash:(algorithm:string, options?:stream.TransformOptions) => crypto.Hash, blocks:Array<Block> = [], algorithm:string = 'sha256') {
        this._difficulty = difficulty;
        this._createHash = createHash;
        this._algorithm = algorithm;
        // we allow blocks to be passed as systems such as BitId have multiple chains in the database, one for each transaction
        // passing blocks allows you to fetch all blocks for a given transaction and initialize the chain
        this._blocks = blocks;
        if (this._blocks.length === 0) {
            // create the fist block
            const block: Block = this.getNewBlock(UuidUtils.generateUUID());
            // in bitId mineBlock is empty since it's a centralized system.
            block.mineBlock(difficulty);
            blocks.push(block);
        }
    }

    private isValidNewBlock(newBlock: Block, previousBlock: Block): boolean {
        if (newBlock != null  &&  previousBlock != null) {
            if (previousBlock.index + 1 != newBlock.index) {
                return false;
            }

            if (newBlock.previousHash == null  ||
                newBlock.previousHash !== previousBlock.hash) {
                return false;
            }

            if (newBlock.hash == null  ||
                Block.calculateHash(newBlock, this._createHash, this.algorithm) !== newBlock.hash) {
                return false;
            }

            return true;
        }

        return false;
    }

    private isFirstBlockValid(): boolean {
        const firstBlock: Block = this.blocks[0];

        if (firstBlock.index != 0) {
            return false;
        }

        if (firstBlock.previousHash != null) {
            return false;
        }

        if (firstBlock.hash == null ||
            Block.calculateHash(firstBlock, this._createHash, this.algorithm) !== firstBlock.hash) {
            return false;
        }

        return true;
    }

    // TODO: override point, in bitId the transactionId of the first block is always assigned to the new block
    protected getNewBlock(data: string): Block {
        return new Block(this.latestBlock.index + 1, Date.now(), this.latestBlock.hash, data, this._createHash, this.algorithm);
    }

    get algorithm():string {
        return this._algorithm;
    }

    public get difficulty():number {
        return this._difficulty;
    }

    public get blocks():Array<Block> {
        return this._blocks;
    }

    public get latestBlock(): Block {
        return this.blocks[this.blocks.length-1];
    }

    public get firstBlock(): Block {
        return this.blocks[0];
    }

    public addBlock(block: Block): void {
        // verify the new block is valid
        if (block != null) {
            if (!this.isValidNewBlock(block, this.latestBlock)) {
                // TODO: generate custom exception so it can be handled
                // do this via an override
                return;
            }
            block.mineBlock(this.difficulty);
            this.blocks.push(block);
        }
    }

    // this method can be used to checking transaction status in the API and displahing in the UI
    public isBlockChainValid(): boolean {
        if (!this.isFirstBlockValid()) {
            return false;
        }

        for (var i = 1; i < this.blocks.length; i++) {
            const currentBlock: Block = this.blocks[i];
            const previousBlock: Block = this.blocks[i - 1];

            if (!this.isValidNewBlock(currentBlock, previousBlock)) {
                return false;
            }
        }

        return true;
    }
}