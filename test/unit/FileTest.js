'use strict';
var crypto = require('crypto');
var should = require('chai').should();
var BitId = require('../../lib/Block');
var path = require('path');

describe('Block', function(){

    it('should test default Block constructor', function() {
        var bock = new BitId.Block();
        (bock instanceof BitId.Block).should.equal(true);
    });

});
