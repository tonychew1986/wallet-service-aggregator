const crypto = require('crypto');

require('dotenv').config()

const config = require('config');

const ethAPI = process.env.ETH_API || config.get('eth-api'); // 'http://localhost:3000'
const atomAPI = process.env.ATOM_API || config.get('atom-api'); // 'http://localhost:3002'
const btcAPI = process.env.BTC_API || config.get('btc-api'); // 'http://localhost:3004'
const iotexAPI = process.env.IOTEX_API || config.get('iotex-api'); // 'http://localhost:3006'

const ethTestnet = process.env.ETH_TESTNET || config.get('eth-testnet'); // 'ropsten'
const atomTestnet = process.env.ATOM_TESTNET || config.get('atom-testnet'); // 'gaia-13006'
const btcTestnet = process.env.BTC_TESTNET || config.get('btc-testnet'); // 'testnet3'
const iotexTestnet = process.env.IOTEX_TESTNET || config.get('iotex-testnet'); // 'testnet'

const ethTestnetAvailable = process.env.ETH_TESTNET_AVAILABLE || config.get('eth-testnet-available'); // true
const atomTestnetAvailable = process.env.ATOM_TESTNET_AVAILABLE || config.get('atom-testnet-available'); // false
const btcTestnetAvailable = process.env.BTC_TESTNET_AVAILABLE || config.get('btc-testnet-available'); // true
const iotexTestnetAvailable = process.env.IOTEX_TESTNET_AVAILABLE || config.get('iotex-testnet-available'); // true

var chainMap = require('../settings/token-chain-mapping.js').getChainMapping;

let getChainData = async function(network, chainType) {
  var promise = new Promise(async function(resolve, reject){
    var testnetAvailable = false;
    var networkName = "";
    let chainURL = "";

    if(chainType == "ETH"){
      chainURL = ethAPI;

      if(network == "mainnet"){
        networkName = "";
      }else{
        networkName = ethTestnet;
        testnetAvailable = JSON.parse(ethTestnetAvailable);
      }
    }else if(chainType == "BTC"){
      chainURL = btcAPI;

      if(network == "mainnet"){
        networkName = "";
      }else{
        networkName = btcTestnet;
        testnetAvailable = JSON.parse(btcTestnetAvailable);
      }
    }else if(chainType == "ATOM"){
      chainURL = atomAPI;

      if(network == "mainnet"){
        networkName = "";
      }else{
        networkName = atomTestnet;
        testnetAvailable = JSON.parse(atomTestnetAvailable);
      }
    }else if(chainType == "IOTEX"){
      chainURL = iotexAPI;

      if(network == "mainnet"){
        networkName = "";
      }else{
        networkName = iotexTestnet;
        testnetAvailable = JSON.parse(iotexTestnetAvailable);
      }
    }

    resolve({"networkName": networkName, chainURL: chainURL, testnetAvailable: testnetAvailable})
  });

  return promise;
}


let getChainMap = async function(symbol) {
  var promise = new Promise(async function(resolve, reject){
    symbol = symbol.toUpperCase();

    var resolvedSymbol = symbol;

    if(chainMap[symbol]){
      resolvedSymbol = chainMap[symbol]
    }

    console.log("resolvedSymbol", resolvedSymbol)
    resolve(resolvedSymbol)
  });

  return promise;
}
let checkChainValidity = async function(chain, defaults) {
  var promise = new Promise(async function(resolve, reject){
    let chains = defaults["chain"];

    for(var i = 0; i < chains.length; i++){
      if(chain == chains[i]){
        resolve(true)
        break;
      }
    }

    resolve(false)
  });

  return promise;
}

let getWarmWallet = async function(chain, num) {
  var promise = new Promise(async function(resolve, reject){

    if(chain == "ATOM"){
      resolve("cosmos1c0nsetrn3pfgz8ejq0kpvh97j8lt4vxzypqjz3")
    }else if(chain == "ETH"){
      resolve("0x9E013304072C0B919e64721cB550B280a1F021f6")
    }

  });

  return promise;
}

let getValidator = async function(chain, num) {
  var promise = new Promise(async function(resolve, reject){

    if(chain == "ATOM"){
      resolve("cosmosvaloper13ce7hhqa0z3tpc2l7jm0lcvwe073hdkkpp2nst")
    }else if(chain == "ETH"){
      resolve("0x9E013304072C0B919e64721cB550B280a1F021f6")
    }
  });

  return promise;
}

exports.checkChainValidity = checkChainValidity;
exports.getChainMap = getChainMap;
exports.getChainData = getChainData;
exports.getWarmWallet = getWarmWallet;
exports.getValidator = getValidator;
