'use strict';
var crypto = require('crypto');
var should = require('chai').should();
var BitId = require('../../lib/Block');
var path = require('path');

describe('Block', function(){

    it('should test default Block constructor', function() {
        let previousHash = crypto.createHash('sha256').update(Math.random().toString()).digest('hex');
        let index = 0;
        let timestamp = Date.now();
        let data = Math.random().toString();
        var block = new BitId.Block(index, timestamp, previousHash, data, crypto.createHash);
        (block instanceof BitId.Block).should.equal(true);
        (block.index).should.equal(0);
        (block.timestamp).should.equal(timestamp);
        (block.data).should.equal(data);
        (block.hash).should.equal( BitId.Block.calculateHash(block, crypto.createHash));
        ('00000').should.equal( BitId.Block.zeros(5));
        //this._index.toString() + this._timestamp.toString() + this._previousHash + this._data + this._nonce.toString();
        (index.toString() + timestamp.toString()+previousHash+data.toString()+block._nonce.toString()).should.equal(block.str());
        ('{"block":0,"previousHash":"'+previousHash+'","timestamp":'+timestamp+',"data":"'+data+'","hash":"'+block.hash+'"}').should.equal(block.toString());
    });

});
