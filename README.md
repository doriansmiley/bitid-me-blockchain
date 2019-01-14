=============

[![Build Status](https://travis-ci.org/doriansmiley/bitid-me-blockchain.svg?branch=develop)](https://travis-ci.org/doriansmiley/bitid-me-blockchain)

Open source Blockchain implementation for TypeScript. This is based on https://medium.com/@ssaurel/create-your-own-blockchain-in-30-minutes-dbde3293b390. Read the article before jumping into the code.

We have added some subclasses used in BitIdMe workflows to allow for request signing.

# BitIdMe Exchanges

BitIdMe allows anonymous exchanges where neither party is a registered user.
In order to append a block to a chain you need to have the transaction’s private key.
This private key is created client side by the BitIdMe app and shown to the requestor.
The requestor must secure the key and give it to the requestee who also must secure the key.
BitIdMe persists the private key to KMS usng the transactionID as the identifier.
To append to the chain you must submit an hmac hex digest of the public transaction ID and the transaction's PWD.

When an anonymous request to append a block is received the service must

* Get the KMS key for this transaction using the transactionId from KMS. This key could in theory rotate but we won't be doing that.
* Sign the incoming block’s data using the key.
* Verify the new block signature match the newly created hex digest.

Registered users of BitId can enjoy the benefot of not having to enter the request PWD, or capture it if they intiate a request
Once the user logs in they are can retrieve the private key for a transaction using the API. The API validates the user has access to the transaction
using the transaction database.
The key is then used to sign the request. This all happens automatically without any need for the user to input anything

# Set Up

- `npm install`
- `npm install grunt -g`

# To Build

Run `npm run build`

# Running Tests

Run `npm test`

