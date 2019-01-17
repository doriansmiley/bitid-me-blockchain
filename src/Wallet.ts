/**
 * Created by dsmiley on 1/17/19.
 */
import bip39 from 'bip39';
import bitcoin from 'bitcoinjs-lib';
import {ECPair} from './ECPair'
import * as crypto from 'crypto';
const ecc = require('tiny-secp256k1')
const wif = require('wif')
const types = require('./types')
const randomBytes = require('randombytes')
const typeforce = require('typeforce')

export type Network = {
    messagePrefix: string, 
    bech32: string,
    bip32: {
        public: string,
        private: string, 
    },
    pubKeyHash: number,
    scriptHash: number,
    wif: number,
}

export class Wallet {

    private _password:string = null;
    private _wif:string = null;

    public static DEFAULT_ENCRYPTION = 'aes-256-cbc';
    public static DEFAULT_PATH = "m/44'/0'/0'/0/0";
    public static DEFAULT_DB = "wallets";
    // TODO: get valid values for bitidme networks
    public static DEFAULT_NETWORK = {
        bitcoin: {
            messagePrefix: '\x18Bitcoin Signed Message:\n',
            bech32: 'bc',
            bip32: {
                public: 0x0488b21e,
                private: 0x0488ade4
            },
            pubKeyHash: 0x00,
            scriptHash: 0x05,
            wif: 0x80
        },
        testnet: {
            messagePrefix: '\x18Bitcoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
                public: 0x043587cf,
                private: 0x04358394
            },
            pubKeyHash: 0x6f,
            scriptHash: 0xc4,
            wif: 0xef
        }
    };

    private isOptions = typeforce.maybe(typeforce.compile({
        compressed: types.maybe(types.Boolean),
        network: types.maybe(types.Network)
    }));

    protected matches(password) {
        return password === this._password;
    }

    protected fromWIF(string, network) {
        const decoded = wif.decode(string)
        const version = decoded.version

        // list of networks?
        if (network instanceof Array) {
            network = network.filter(function (x) {
                return version === x.wif
            }).pop()

            if (!network) throw new Error('Unknown network version')

            // otherwise, assume a network object (or default to bitcoin)
        } else {
            network = network || Wallet.DEFAULT_NETWORK.bitcoin

            if (version !== network.wif) throw new Error('Invalid network version')
        }

        return this.fromPrivateKey(decoded.privateKey, {
            compressed: decoded.compressed,
            network: network
        })
    }

    protected fromPrivateKey(buffer, options) {
        typeforce(types.Buffer256bit, buffer)
        if (!ecc.isPrivate(buffer)) throw new TypeError('Private key not in range [1, n)')
        typeforce(this.isOptions, options)

        return new ECPair(buffer, null, options)
    }

    /**
     * This is irreversible as there is not way to decrypt the wallet for good.
     * The only way to read the key is with the readDecrypted function
     * @param password Cleartext or hashed makes no difference
     * @returns {Wallet} It returns itself
     * @code const wallet = Wallet.create(name, mnemonic).encrypt(password);
     */
    public encrypt(password) {
        this._password = password;
        if (this._wif) throw new Error('Cannot re-encrypt an encrypted key');
        const cipher = crypto.createCipher(Wallet.DEFAULT_ENCRYPTION, password);
        this._wif = cipher.update(this._wif, 'utf8', 'hex') + cipher.final('hex');
        return this;
    }

    /**
     * This method will NOT decrypt the wallet but temporarily the key and return it to the calling code
     * This method is NOT symmetrical with the encrypt one.
     * @param password Hashed or not it will be used, it only needs to match the one used in encryption
     * @returns {string} It will not return the wallet itself like the encrypt
     */
    public readDecrypted(password) {
        if (!this._password) throw new Error('Cannot de-encrypt an key that was not encrypted');
        if (!password || !this.matches(password)) throw new Error('Passwords do not match');
        const cipher = crypto.createDecipher(Wallet.DEFAULT_ENCRYPTION, password);
        return cipher.update(this._wif, 'hex', 'utf8') + cipher.final('utf8');
    }
}