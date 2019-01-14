'use strict';
var crypto = require('crypto');
var should = require('chai').should();
var BitId = require('../../lib/UuidUtils');
var path = require('path');

describe('Block', function(){

    it('should test default Block constructor', function() {
        (BitId.UuidUtils.generateUUID().length).should.equal(36);
    });

});
