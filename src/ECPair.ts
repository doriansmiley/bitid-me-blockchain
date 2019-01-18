/**
 * Created by dsmiley on 1/17/19.
 */
import {Wallet, Network} from './Wallet'
const ecc = require('tiny-secp256k1')
const wif = require('wif')
const types = require('./types')
const randomBytes = require('randombytes')
const typeforce = require('typeforce')

export type ECPairOptions = {compressed:boolean, network:Network};

export class ECPair {

    private _privateKey:string;
    private _publicKey:string;
    private _network: Network;
    private _compressed:boolean;
    private readonly isOptions = typeforce.maybe(typeforce.compile({
        compressed: types.maybe(types.Boolean),
        network: types.maybe(types.Network)
    }))

    constructor(d, Q, options:ECPairOptions) {
        options = options || {compressed:false, network:Wallet.DEFAULT_NETWORK}

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

    public toWIF():string {
        if (!this.privateKey) throw new Error('Missing private key')
        return wif.encode(this.network.wif, this.privateKey, this._compressed)
    }

    public sign(hash:string):string {
        if (!this.privateKey) throw new Error('Missing private key')
        return ecc.sign(hash, this.privateKey)
    }

    public verify(hash:string, signature:string) {
        return ecc.verify(hash, this.privateKey, signature)
    }

    public fromPrivateKey(buffer:Buffer, options:ECPairOptions):ECPair {
        typeforce(types.Buffer256bit, buffer)
        if (!ecc.isPrivate(buffer)) throw new TypeError('Private key not in range [1, n)')
        typeforce(this.isOptions, options)

        return new ECPair(buffer, null, options)
    }

    public fromPublicKey(buffer:Buffer, options:ECPairOptions):ECPair {
        typeforce(ecc.isPoint, buffer)
        typeforce(this.isOptions, options)
        return new ECPair(null, buffer, options)
    }

    public fromWIF(wiffy:string, network:any) {
        const decoded = wif.decode(wiffy)
        const version = decoded.version

        // list of networks?
        if (types.Array(network)) {
            network = network.filter(function (x) {
                return version === x.wif
            }).pop()

            if (!network) throw new Error('Unknown network version')

            // otherwise, assume a network object (or default to bitcoin)
        } else {
            network = network || Wallet.DEFAULT_NETWORK

            if (version !== network.wif) throw new Error('Invalid network version')
        }

        return this.fromPrivateKey(decoded.privateKey, {
            compressed: decoded.compressed,
            network: network
        })
    }

    public makeRandom(options):ECPair {
        typeforce(this.isOptions, options)
        options = options || {}
        const rng = options.rng || randomBytes

        let d
        do {
            d = rng(32)
            typeforce(types.Buffer256bit, d)
        } while (!ecc.isPrivate(d))

        return this.fromPrivateKey(d, options)
    }
}
