/**
 * Created by dsmiley on 1/17/19.
 */
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');
import {ECPair, ECPairOptions} from './ECPair'
import * as crypto from 'crypto';
const ecc = require('tiny-secp256k1')
const wif = require('wif')
const types = require('./types')
const randomBytes = require('randombytes')
const typeforce = require('typeforce')

export type Network = {
    messagePrefix:string,
    bech32:string,
    bip32:{
        public:number,
        private:number,
    },
    pubKeyHash:number,
    scriptHash:number,
    wif:number,
    name:string
}

export class Wallet {

    private _password:string = null;
    private _wif:string = null;
    private _name:string = null;
    private _address:string = null;
    private _network:Network = null;
    private _utxos:Array<any> = [];

    public static DEFAULT_ENCRYPTION = 'aes-256-cbc';
    public static DEFAULT_PATH = "m/44'/0'/0'/0/0";
    public static DEFAULT_DB = "wallets";
    // TODO: get valid values for bitidme networks
    public static DEFAULT_NETWORK_TEST:Network = {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'tb',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef,
        name: 'deaultTest'
    };
    public static DEFAULT_NETWORK:Network = {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'bc',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80,
        name: 'default'
    };
    public static DEFAULTS = {
        Bitcoin: {
            Decimals: 8,
            Satoshis: 100000000,
        },
        Transactions: {
            AverageBytes: 255
        },
        Endpoints: {
            EllipticFees: 'https://someURL'
        },
        ReturnValues: {
            TransactionSubmitted: 'Transaction Submitted',
            NoFreeOutputs: 'No free outputs to spend',
            Fragments: {
                MinimumFeeNotMet: 'min relay fee not met',
            },
        },
        Messages: {
            Wallet: {
                Created: 'Your wallet has been created and saved!',
                Mnemonic: 'Store this sequence safely',
                Failed: 'A wallet could not be created at this moment',
            },
            Transactions: {
                NOTSent: 'Transaction could not be sent',
                Sent: 'Your transaction was sent'
            },
            Errors: {
                FeeNotMet: 'A fee to process this transaction was not provided'
            }
        }
    };

    public static generateMnemonic():string {
        return bip39.generateMnemonic();
    }

    public static create(name:string, mnemonic:string):Wallet {
        const seed = bip39.mnemonicToSeed(mnemonic);
        const master = bitcoin.HDNode.fromSeedBuffer(seed, Wallet.DEFAULT_NETWORK);
        const derived = master.derivePath({
            Encryption: Wallet.DEFAULT_ENCRYPTION,
            Path: Wallet.DEFAULT_PATH,
            DBFileName: Wallet.DEFAULT_DB,
        });
        const address = derived.getAddress();
        const wif = derived.keyPair.toWIF();
        return new Wallet(name, address, wif, Wallet.DEFAULT_NETWORK);

    }

    constructor(name:string, address:string, wif:string, network:Network, password:string = undefined) {
        this._name = name;
        this._address = address;
        this._wif = wif;
        this._network = network;
        this._password = password;
        //this.__utxos = [];

    }

    protected matches(password) {
        return password === this._password;
    }

    get password():string {
        return this._password;
    }

    get wif():string {
        return this._wif;
    }

    get name():string {
        return this._name;
    }

    get address():string {
        return this._address;
    }

    get network():Network {
        return this._network;
    }

    get utxos():Array<any> {
        return this._utxos;
    }

    /**
     * This is irreversible as there is not way to decrypt the wallet for good.
     * The only way to read the key is with the readDecrypted function
     */
    public encrypt(password:string):Wallet {
        if (this.password) throw new Error('Cannot re-encrypt an encrypted key');
        this._password = password;
        const cipher = crypto.createCipher(Wallet.DEFAULT_ENCRYPTION, password);
        this._wif = cipher.update(this._wif, 'utf8', 'hex') + cipher.final('hex');
        return this;
    }

    /**
     * This method will NOT decrypt the wallet but temporarily the key and return it to the calling code
     * This method is NOT symmetrical with the encrypt one.
     */
    public readDecrypted(password:string):string {
        if (!this.password) throw new Error('Cannot de-encrypt an key that was not encrypted');
        if (!password || !this.matches(password)) throw new Error('Passwords do not match');
        const cipher = crypto.createDecipher(Wallet.DEFAULT_ENCRYPTION, password);
        return cipher.update(this._wif, 'hex', 'utf8') + cipher.final('utf8');
    }

    public send(btc:number, address:string, fee:number, password:string): string {
        const satoshis = Math.round(btc * Wallet.DEFAULTS.Bitcoin.Satoshis);
        const network:Network = Wallet.DEFAULT_NETWORK;
        const txb = new bitcoin.TransactionBuilder(network);

        let current = 0;
        for (const utx of this.utxos) {

            txb.addInput(utx.tx_hash_big_endian, utx.tx_output_n);

            current += utx.value;
            if (current >= (satoshis + fee)) break;
        }

        txb.addOutput(address, satoshis);

        const change = current - (satoshis + fee);
        if (change) txb.addOutput(this.address, change);


        const wif = this.password ? this.readDecrypted(password) : this.wif;
        const key = bitcoin.ECPair.fromWIF(wif, network);

        txb.sign(0, key);

        return txb.build().toHex();
    }
}