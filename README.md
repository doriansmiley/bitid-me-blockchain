=============

[![Build Status](https://travis-ci.org/doriansmiley/bitid-me-blockchain.svg?branch=develop)](https://travis-ci.org/doriansmiley/bitid-me-blockchain)

Open source Blockchain implementation for TypeScript. This is based on https://medium.com/@ssaurel/create-your-own-blockchain-in-30-minutes-dbde3293b390. Read the article before jumping into the code.

We have added some subclasses used in BitIdMe workflows to allow for request signing.

In order to append a block to a chain you need to have the transaction’s private key. This private key is created when the transaction is initiated by the requestor. Both users are required to be BitIdMe users and be logged in to initiate an exchange. Transaction keys are stored in the user’s KMS key store and linked via the transaction ID. These keys do not rotate. The requestor and requestee have different keys.

When a logged in user creates a new transaction the private key is sent back to the client and used to create the new blocks signature which is an hmac hex digest of the new blocks str() method.

When a request to append a block is received the service must

* Get the KMS key for this transaction for the logged in user
* Sign the incoming block’s data using the key
* Verify the signatures match. This way we can leave the route to append blocks public behaind AWS Cognito’s IAM authorizers.

# Set Up

- `npm install`
- `npm install grunt -g`

# To Build

Run `npm run build`

# Running Tests

Run `npm test`

