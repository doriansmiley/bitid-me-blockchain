/**
 * Created by dsmiley on 1/17/19.
 */
import bip39 from 'bip39';
import bitcoin from 'bitcoinjs-lib';
import * as crypto from 'crypto';
import {Wallet, Network} from './Wallet'
const ecc = require('tiny-secp256k1')
const wif = require('wif')
const types = require('./types')
const randomBytes = require('randombytes')
const typeforce = require('typeforce')

export class ECPair {

    private _privateKey: string;
    private _publicKey: string;
    private _network: Network;
    private _compressed: boolean;

    constructor (d, Q, options) {
        options = options || {}

        this._compressed = options.compressed === undefined ? true : options.compressed
        this._network = options.network || Wallet.DEFAULT_NETWORK

        this._privateKey = d || null
        this._publicKey = null
        if (Q) this._publicKey = ecc.pointCompress(Q, this._compressed)
    }
    
    get network():Network {
        return this._network;
    }

    get privateKey():string {
        return this._privateKey;
    }
    get publicKey():string {
        if (!this._publicKey) this._publicKey = ecc.pointFromScalar(this._privateKey, this._compressed)
        return this._privateKey
    }

    public toWIF(): string {
        if (!this.privateKey) throw new Error('Missing private key')
        return wif.encode(this.network.wif, this.privateKey, this._compressed)
    }

    public sign(hash: string): string {
        if (!this.privateKey) throw new Error('Missing private key')
        return ecc.sign(hash, this.privateKey)
    }

    public verify(hash: string, signature: string) {
        return ecc.verify(hash, this.privateKey, signature)
    }
}
