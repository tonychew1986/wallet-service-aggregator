Wallet Service Aggregator
=====================================

<URL>

How does this work?
----------------

Wallet Service Aggregator is used together with Wallet Service & Signature Service to obscure the implementation details for each blockchain. Wallet Aggregator always defaults to testnet if no network parameter is set

Application Flow
-------

Client UI <-> Wallet Aggregator <-> Wallet Service <-> Signature Service

Architecture
----------------

When catering to scenarios where multiple wallet types exist, a separate Wallet Service & Signature Service can be created for the specific blockchain. Those wallet's path can then be added as a separate route on Wallet Service Aggregator.

Deploying a new Wallet Service & Signature Service only requires changing the following:
- "MNEMONIC_MAINNET" within .env
- "PORT" within .env
- "SIGNATURE_API" within Wallet Service's .env to match Signature Service's port
- Database credential since new service will still require to store nonce

Security
----------------
"MNEMONIC_MAINNET" must be backed up before deployment. If seed is lost then funds would not be recoverable.

Operations
----------------
- To send out funds, checksum of destination address will need to be added to address-whitelist.js


Available End points
-------
- GET  /test
- GET  /:chain/wallet?network=<network>
- POST /:chain/send [network, amount, senderAdd, receiverAdd]

ENV parameters
-------
Available at ./instructions/env.md

## Instructions

1. Clone aggregator git repository on to local directory
2. npm install required libraries
3. Clone wallet & signature git repository for desired coin to test
4. npm install required libraries for wallet & signature services
5. node index.js for all 3 services (aggregator, wallet, signature)
6. For additional coins, git clone corresponding wallet & signature services


To test application:

```bash
$ npm test

```

Install NPM modules on fresh deployment:

```bash
$ npm install
```

To run in development mode:

```bash
$ node index.js
```

To run in production mode:

```bash
$ pm2 start wallet-svc-aggregator/index.js --name "wallet-aggregator"
```

variables that is generalised are stored in 'config'
variables that requires SECURITY are stored in '.env'

IP and Port number of individual services

Aggregator:
Wallet Service for Bitcoin:
Wallet Service for Ethereum:
Wallet Service for Cosmos:
Wallet Service for IOTEX:
Signature Service for Bitcoin:
Signature Service for Ethereum:
Signature Service for Cosmos:
Signature Service for IOTEX:
API Key Service:
Address Whitelist Service:
Fund Management Portal:
