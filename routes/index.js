var express = require('express')
var router = express.Router()

const axios = require('axios');

var auth = require('../core/auth.js');
var whitelist = require('../core/whitelist.js');
var chain = require('../core/chain.js');
var txCost = require('../settings/transaction-cost.js').transactionCost;
var defaults = require('../settings/defaults.js').getDefaults;

const asyncHandler = fn => (req, res, next) =>
  Promise
    .resolve(fn(req, res, next))
    .catch(next)


router.get('/test', (req, res) => {
  return res.json({
    "status": 200,
    "data": "test"
  });
});

router.get('/:chainType/test', asyncHandler(async (req, res, next) => {
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.query.network;

  if(network !== "mainnet"){
    network = "testnet"
  }

  var chainData = await chain.getChainData(network, chainType);

  let url = chainData["chainURL"] + '/test';

  console.log("url",url);

  axios.get(url)
  .then(function (response) {
    console.log("response", response["data"])
    if(response["data"] == "test"){
      return res.json({
        "status": 200,
        "data": "test"
      });
    }else{
      return res.json({
        "status": 400,
        "data": "fail"
      });
    }
  })
  .catch(function (error) {
    console.log(error);
    return "fail";
  });
}));


router.get('/:chainType/signature/test', asyncHandler(async (req, res, next) => {
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.query.network;

  if(network !== "mainnet"){
    network = "testnet"
  }

  var chainData = await chain.getChainData(network, chainType);

  let url = chainData["chainURL"] + '/signature/test';

  console.log("url",url);

  axios.get(url)
  .then(function (response) {
    console.log("response", response["data"])
    if(response["data"] == "test"){
      return res.json({
        "status": 200,
        "data": "test"
      });
    }else{
      return res.json({
        "status": 400,
        "data": "fail"
      });
    }
  })
  .catch(function (error) {
    console.log(error);
    return "fail";
  });
}));

router.get('/:chainType/nonce', asyncHandler(async (req, res, next) => {
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.query.network;

  if(network !== "mainnet"){
    network = "testnet"
  }

  if(await chain.checkChainValidity(chainType, defaults)){
  // if(chainType == "ETH" || chainType == "BTC" || chainType == "ATOM"){

    var chainData = await chain.getChainData(network, chainType);

    if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
      let url = chainData["chainURL"] + '/nonce/check' + '?network=' + network;

      console.log("url", url)

      axios.get(url)
      .then(function (response) {
        console.log("response", response["data"])
        return res.json({
          "status": 200,
          "data": response["data"],
          "action": "Get Nonce",
          "network": network,
          "network_name": chainData["networkName"]
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{
      return res.json({
        "status": 400,
        "message": "Testnet on selected chain is unavailable."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));


router.get('/:chainType/confirmations', asyncHandler(async (req, res, next) => {
  var txHash = req.query.txHash;

  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.query.network;

  if(network !== "mainnet"){
    network = "testnet"
  }

  if(await chain.checkChainValidity(chainType, defaults)){
  // if(chainType == "ETH" || chainType == "BTC" || chainType == "ATOM"){

    var chainData = await chain.getChainData(network, chainType);

    if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
      let url = chainData["chainURL"] + '/confirmations' + '?network=' + network + '&txHash=' + txHash;

      console.log("url", url)

      axios.get(url)
      .then(function (response) {
        console.log("response", response["data"])
        return res.json({
          "status": 200,
          "data": response["data"],
          "action": "Get Transaction Confirmations",
          "network": network,
          "network_name": chainData["networkName"]
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{
      return res.json({
        "status": 400,
        "message": "Testnet on selected chain is unavailable."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));

// API set nonce
router.get('/:chainType/wallet', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.query.signature;
  var apiKey = req.query.api_key;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.query.network;

  if(network !== "mainnet"){
    network = "testnet"
  }

  let walletName = req.query.wallet || "hot_wallet";

  if(await chain.checkChainValidity(chainType, defaults)){
  // if(chainType == "ETH" || chainType == "BTC" || chainType == "ATOM"){

    var chainData = await chain.getChainData(network, chainType);

    if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
      let url = chainData["chainURL"] + '/wallet' + '?network=' + network + '&signature=' + signature + '&api_key=' + apiKey + '&wallet=' + walletName;

      console.log("url", url)

      if(walletName == "hot_wallet"){

        axios.get(url)
        .then(function (response) {
          console.log("response", response["data"])
          return res.json({
            "status": 200,
            "data": response["data"],
            "action": "Get Address",
            "network": network,
            "network_name": chainData["networkName"]
          });
        })
        .catch(function (error) {
          console.log(error);
        });
      }else{
        return res.json({
          "status": 400,
          "message": "Wallet service requested is not identified as a hot wallet. This endpoint is not required for non hot wallet. Try using /wallet/query endpoint"
        });
      }
    }else{
      return res.json({
        "status": 400,
        "message": "Testnet on selected chain is unavailable."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));

router.get('/:chainType/balance', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.query.signature;
  var apiKey = req.query.api_key;
  var senderAdd = req.query.sender_add;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.query.network;

  if(network !== "mainnet"){
    network = "testnet"
  }

  if(await chain.checkChainValidity(chainType, defaults)){
  // if(chainType == "ETH" || chainType == "BTC" || chainType == "ATOM"){

    var chainData = await chain.getChainData(network, chainType);

    if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
      let url = chainData["chainURL"] + '/balance' + '?network=' + network + '&signature=' + signature + '&api_key=' + apiKey + '&sender_add=' + senderAdd;

      console.log("url", url)

      axios.get(url)
      .then(function (response) {
        console.log("response", response["data"])
        return res.json({
          "status": 200,
          "data": response["data"],
          "action": "Get Balance",
          "network": network,
          "network_name": chainData["networkName"]
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{
      return res.json({
        "status": 400,
        "message": "Testnet on selected chain is unavailable."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));

router.get('/:chainType/explorer/tx/hashInfo', asyncHandler(async (req, res, next) => {
  var txHash = req.query.txHash;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.query.network;

  if(network !== "mainnet"){
    network = "testnet"
  }

  if(await chain.checkChainValidity(chainType, defaults)){
  // if(chainType == "ETH" || chainType == "BTC" || chainType == "ATOM"){

    var chainData = await chain.getChainData(network, chainType);

    if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
      let url = chainData["chainURL"] + '/explorer/tx/hashInfo' + '?network=' + network + '&txHash=' + txHash;

      console.log("url", url)

      axios.get(url)
      .then(function (response) {
        console.log("response", response["data"])
        return res.json({
          "status": 200,
          "data": response["data"],
          "action": "Get Transaction Hash Info",
          "network": network,
          "network_name": chainData["networkName"]
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{
      return res.json({
        "status": 400,
        "message": "Testnet on selected chain is unavailable."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));

router.get('/:chainType/explorer/sync/status', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.query.signature;
  var apiKey = req.query.api_key;
  var address = req.query.address;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.query.network;

  if(network !== "mainnet"){
    network = "testnet"
  }

  if(await chain.checkChainValidity(chainType, defaults)){
  // if(chainType == "ETH" || chainType == "BTC" || chainType == "ATOM"){

    var chainData = await chain.getChainData(network, chainType);

    if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
      let url = chainData["chainURL"] + '/explorer/sync/status' + '?network=' + network + '&signature=' + signature + '&api_key=' + apiKey + '&address=' + address;

      console.log("url", url)

      axios.get(url)
      .then(function (response) {
        console.log("response", response["data"])
        return res.json({
          "status": 200,
          "data": response["data"],
          "action": "Get Address Sync Status",
          "network": network,
          "network_name": chainData["networkName"]
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{
      return res.json({
        "status": 400,
        "message": "Testnet on selected chain is unavailable."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));



router.post('/:chainType/explorer/address/add', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.body.signature;
  var apiKey = req.body.api_key;
  var address = req.body.address;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.body.network;

  if(network !== "mainnet"){
    network = "testnet"
  }

  if(await chain.checkChainValidity(chainType, defaults)){
  // if(chainType == "ETH" || chainType == "BTC" || chainType == "ATOM"){

    var chainData = await chain.getChainData(network, chainType);

    if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
      let url = chainData["chainURL"] + '/explorer/address/add';

      let data = {
        network: network,
        signature: signature,
        api_key: apiKey,
        address: address
      }

      console.log("data",data)

      axios.post(url)
      .then(function (response) {
        console.log("response", response["data"])
        return res.json({
          "status": 200,
          "data": response["data"],
          "action": "Add Address to Explorer Watch List",
          "network": network,
          "network_name": chainData["networkName"]
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{
      return res.json({
        "status": 400,
        "message": "Testnet on selected chain is unavailable."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));


router.get('/:chainType/utxo', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.query.signature;
  var apiKey = req.query.api_key;
  var senderAdd = req.query.sender_add;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.query.network;
  var spent = req.query.spent || "unspent";

  if(network !== "mainnet"){
    network = "testnet"
  }

  if(await chain.checkChainValidity(chainType, defaults)){
  // if(chainType == "ETH" || chainType == "BTC" || chainType == "ATOM"){

    var chainData = await chain.getChainData(network, chainType);

    if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
      let url = chainData["chainURL"] + '/utxo' + '?network=' + network + '&signature=' + signature + '&api_key=' + apiKey + '&sender_add=' + senderAdd + '&spent=' + spent;

      console.log("url", url)

      axios.get(url)
      .then(function (response) {
        console.log("response", response["data"])
        return res.json({
          "status": 200,
          "data": response["data"],
          "action": "Get UTXO",
          "network": network,
          "network_name": chainData["networkName"]
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{
      return res.json({
        "status": 400,
        "message": "Testnet on selected chain is unavailable."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));


router.get('/:chainType/balance/token', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.query.signature;
  var apiKey = req.query.api_key;
  var senderAdd = req.query.sender_add;
  var tokenType = req.query.token_type;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.query.network;

  if(network !== "mainnet"){
    network = "testnet"
  }

  if(await chain.checkChainValidity(chainType, defaults)){
  // if(chainType == "ETH" || chainType == "BTC" || chainType == "ATOM"){

    var chainData = await chain.getChainData(network, chainType);

    if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
      let url = chainData["chainURL"] + '/balance/token' + '?network=' + network + '&signature=' + signature + '&api_key=' + apiKey + '&sender_add=' + senderAdd + '&token_type=' + tokenType;

      console.log("url", url)

      axios.get(url)
      .then(function (response) {
        console.log("response", response["data"])
        return res.json({
          "status": 200,
          "data": response["data"],
          "action": "Get Token Balance",
          "network": network,
          "network_name": chainData["networkName"]
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{
      return res.json({
        "status": 400,
        "message": "Testnet on selected chain is unavailable."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));

router.get('/:chainType/wallet/query', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.query.signature;
  var apiKey = req.query.api_key;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.query.network;
  var nonce = req.query.nonce;

  if(network !== "mainnet"){
    network = "testnet"
  }

  let walletName = req.query.wallet || "hot_wallet";

  if(await chain.checkChainValidity(chainType, defaults)){

    var chainData = await chain.getChainData(network, chainType);

    if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
      let url = chainData["chainURL"] + '/wallet/query' + '?network=' + network + '&signature=' + signature + '&nonce=' + nonce + '&api_key=' + apiKey + '&wallet=' + walletName;

      axios.get(url)
      .then(function (response) {
        console.log("response", response["data"])
        return res.json({
          "status": 200,
          "data": response["data"],
          "action": "Query Address",
          "network": network,
          "network_name": chainData["networkName"]
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{
      return res.json({
        "status": 400,
        "message": "Testnet on selected chain is unavailable."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));

router.get('/:chainType/wallet/query/all', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.query.signature;
  var apiKey = req.query.api_key;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.query.network;
  var nonce = req.query.nonce;

  if(network !== "mainnet"){
    network = "testnet"
  }

  let walletName = req.query.wallet || "hot_wallet";

  if(await chain.checkChainValidity(chainType, defaults)){

    var chainData = await chain.getChainData(network, chainType);

    if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
      let url = chainData["chainURL"] + '/wallet/query/all' + '?network=' + network + '&signature=' + signature + '&nonce=' + nonce + '&api_key=' + apiKey + '&wallet=' + walletName;

      axios.get(url)
      .then(function (response) {
        console.log("response", response["data"])
        return res.json({
          "status": 200,
          "data": response["data"],
          "action": "Query Address All",
          "network": network,
          "network_name": chainData["networkName"]
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{
      return res.json({
        "status": 400,
        "message": "Testnet on selected chain is unavailable."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));

router.post('/:chainType/send/cold-wallet', auth.isAuthorised, asyncHandler(async (req, res, next) => {

}));

router.post('/:chainType/send/warm-wallet', auth.isAuthorised, asyncHandler(async (req, res, next) => {

}));

router.post('/:chainType/send/otc', auth.isAuthorised, asyncHandler(async (req, res, next) => {

}));

router.post('/:chainType/send/staking', auth.isAuthorised, asyncHandler(async (req, res, next) => {

}));

router.post('/:chainType/delegate', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.body.signature;
  var apiKey = req.body.api_key;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  let walletName = req.body.wallet || "hot_wallet";

  var user = req.body.user || "";

  var network = req.body.network;
  var warmWalletAdd = await chain.getWarmWallet(chainType, 0);
  var validatorAdd = await chain.getValidator(chainType, 0);

  if(network !== "mainnet"){
    network = "testnet"
  }

  if(await chain.checkChainValidity(chainType, defaults)){
    var amount = (req.body["amount_in_"+chainType.toLowerCase()]).toString();

    var chainData = await chain.getChainData(network, chainType);

    let addressWhitelisted = await whitelist.isWhitelisted(network, chainType, validatorAdd);

    if(addressWhitelisted){
      if(parseFloat(amount) >= txCost[chainType]["min-withdraw"]){
        if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
          let url = chainData["chainURL"] + '/delegate';

          let data = {
            network: network,
            signature: signature,
            api_key: apiKey,
            // amount: amount,
            sender_add: warmWalletAdd,
            receiver_add: validatorAdd,
            user: user,
            wallet: walletName
          }
          data["amount_in_"+chainType.toLowerCase()] = amount;

          console.log("data",data)

          axios.post(url, data)
          .then(async function (response) {
            console.log("response", response["data"])
            return res.json({
              "status": 200,
              "data": response["data"],
              "action": "Delegate",
              "network": network,
              "network_name": chainData["networkName"]
            });
          })
          .catch(function (error) {
            console.log(error);
          });
        }else{
          return res.json({
            "status": 400,
            "message": "Testnet on selected chain is unavailable."
          });
        }
      }else{
        return res.json({
          "status": 400,
          "message": "Sent amount is below minimum threshold."
        });
      }
    }else{
      return res.json({
        "status": 400,
        "message": "Destination address is not whitelisted."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));

router.get('/:chainType/network/fee', asyncHandler(async (req, res, next) => {
  var network = req.body.network;

  if(network !== "mainnet"){
    network = "testnet"
  }

  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  if(await chain.checkChainValidity(chainType, defaults)){

    var chainData = await chain.getChainData(network, chainType);

    let url = chainData["chainURL"] + '/network/fee';

    axios.get(url)
    .then(async function (response) {
      console.log("response", response["data"])
      return res.json({
        "status": 200,
        "data": response["data"],
        "action": "Get Network Fee",
        "network": network,
        "network_name": chainData["networkName"]
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));

router.post('/:chainType/send', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.body.signature;
  var apiKey = req.body.api_key;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  let walletName = req.body.wallet || "hot_wallet";

  var network = req.body.network;
  var senderAdd = req.body.sender_add;
  var receiverAdd = req.body.receiver_add;

  var user = req.body.user || "";

  if(network !== "mainnet"){
    network = "testnet"
  }

  if(await chain.checkChainValidity(chainType, defaults)){
    var amount = (req.body["amount_in_"+chainType.toLowerCase()]).toString();

    var chainData = await chain.getChainData(network, chainType);

    let addressWhitelisted = await whitelist.isWhitelisted(network, chainType, receiverAdd);

    if(addressWhitelisted){
      if(parseFloat(amount) >= txCost[chainType]["min-withdraw"]){
        if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
          let url = chainData["chainURL"] + '/send';

          let data = {
            network: network,
            signature: signature,
            api_key: apiKey,
            // amount: amount,
            sender_add: senderAdd,
            receiver_add: receiverAdd,
            user: user,
            wallet: walletName
          }
          data["amount_in_"+chainType.toLowerCase()] = amount;
          // data["sender_add"] = senderAdd;
          // data["receiver_add"] = receiverAdd;

          console.log("data",data)

          axios.post(url, data)
          .then(async function (response) {
            console.log("response", response["data"])
            return res.json({
              "status": 200,
              "data": response["data"],
              "action": "Send Coin",
              "network": network,
              "network_name": chainData["networkName"]
            });
          })
          .catch(function (error) {
            console.log(error);
          });
        }else{
          return res.json({
            "status": 400,
            "message": "Testnet on selected chain is unavailable."
          });
        }
      }else{
        return res.json({
          "status": 400,
          "message": "Sent amount is below minimum threshold."
        });
      }
    }else{
      return res.json({
        "status": 400,
        "message": "Destination address is not whitelisted."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));


router.post('/:chainType/stagger/send', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.body.signature;
  var apiKey = req.body.api_key;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.body.network;
  var senderAdd = req.body.sender_add;
  var receiverAdd = req.body.receiver_add;

  var useCase = req.body.use_case;

  var wallet = req.body.wallet || "hot_wallet";

  var user = req.body.user || "";

  if(network !== "mainnet"){
    network = "testnet"
  }

  if(await chain.checkChainValidity(chainType, defaults)){
    var amount = (req.body["amount_in_"+chainType.toLowerCase()]).toString();

    var chainData = await chain.getChainData(network, chainType);

    let addressWhitelisted = await whitelist.isWhitelisted(network, chainType, receiverAdd);

    if(addressWhitelisted){
      if(parseFloat(amount) >= txCost[chainType]["min-withdraw"]){
        if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
          let url = chainData["chainURL"] + '/stagger/send';

          let data = {
            network: network,
            signature: signature,
            api_key: apiKey,
            // amount: amount,
            sender_add: senderAdd,
            receiver_add: receiverAdd,
            user: user,
            use_case: useCase,
            wallet: wallet
          }
          data["amount_in_"+chainType.toLowerCase()] = amount;
          // data["sender_add"] = senderAdd;
          // data["receiver_add"] = receiverAdd;

          console.log("data",data)

          axios.post(url, data)
          .then(async function (response) {
            console.log("response", response["data"])
            return res.json({
              "status": 200,
              "data": response["data"],
              "action": "Send Coin added to holding area",
              "network": network,
              "network_name": chainData["networkName"]
            });
          })
          .catch(function (error) {
            console.log(error);
          });
        }else{
          return res.json({
            "status": 400,
            "message": "Testnet on selected chain is unavailable."
          });
        }
      }else{
        return res.json({
          "status": 400,
          "message": "Sent amount is below minimum threshold."
        });
      }
    }else{
      return res.json({
        "status": 400,
        "message": "Destination address is not whitelisted."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));

router.post('/:chainType/stagger/send/token', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.body.signature;
  var apiKey = req.body.api_key;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.body.network;
  var senderAdd = req.body.sender_add;
  var receiverAdd = req.body.receiver_add;
  var tokenType = req.body.token_type;

  var useCase = req.body.use_case;

  var user = req.body.user || "";

  if(network !== "mainnet"){
    network = "testnet"
  }

  if(await chain.checkChainValidity(chainType, defaults)){
    var amount = (req.body["amount_in_token"]).toString();

    var chainData = await chain.getChainData(network, chainType);

    let addressWhitelisted = await whitelist.isWhitelisted(network, chainType, receiverAdd);

    if(addressWhitelisted){
      // tokenType used here instead of chainType
      if(parseFloat(amount) >= txCost[tokenType.toUpperCase()]["min-withdraw"]){
        if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
          let url = chainData["chainURL"] + '/stagger/send/token';

          let data = {
            network: network,
            signature: signature,
            api_key: apiKey,
            // amount: amount,
            sender_add: senderAdd,
            receiver_add: receiverAdd,
            user: user,
            use_case: useCase,
            token_type: tokenType
          }
          data["amount_in_token"] = amount;
          // data["sender_add"] = senderAdd;
          // data["receiver_add"] = receiverAdd;

          console.log("data",data)

          axios.post(url, data)
          .then(async function (response) {
            console.log("response", response["data"])
            return res.json({
              "status": 200,
              "data": response["data"],
              "action": "Send Token added to holding area",
              "network": network,
              "network_name": chainData["networkName"]
            });
          })
          .catch(function (error) {
            console.log(error);
          });
        }else{
          return res.json({
            "status": 400,
            "message": "Testnet on selected chain is unavailable."
          });
        }
      }else{
        return res.json({
          "status": 400,
          "message": "Sent amount is below minimum threshold."
        });
      }
    }else{
      return res.json({
        "status": 400,
        "message": "Destination address is not whitelisted."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));


router.post('/:chainType/holding-area', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.body.signature;
  var apiKey = req.body.api_key;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.body.network;
  var pageSize = req.body.page_size;
  var pageNum = req.body.page_num;

  var filterProcessed = req.body.filter_processed || "0";
  var filterFlagged = req.body.filter_flagged || "0";

  if(network !== "mainnet"){
    network = "testnet"
  }

  var chainData = await chain.getChainData(network, chainType);

  let url = chainData["chainURL"] + '/holding-area';

  let data = {
    network: network,
    signature: signature,
    api_key: apiKey,
    page_size: pageSize,
    page_num: pageNum,
    filter_processed: filterProcessed,
    filter_flagged: filterFlagged
  }

  console.log("data",data)

  axios.post(url, data)
  .then(async function (response) {
    console.log("response", response["data"])
    return res.json({
      "status": 200,
      "data": response["data"],
      "action": "Check Coin in holding area",
      "network": network,
      "network_name": chainData["networkName"]
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}));


router.post('/:chainType/holding-area/flag', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.body.signature;
  var apiKey = req.body.api_key;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.body.network;

  var user = req.body.user || "";

  let id = req.body.id;
  let senderAdd = req.body.sender_addr;
  let receiverAdd = req.body.receiver_addr;
  let flagged = req.body.flagged;

  if(network !== "mainnet"){
    network = "testnet"
  }

  var chainData = await chain.getChainData(network, chainType);

  let url = chainData["chainURL"] + '/holding-area/flag';

  let data = {
    network: network,
    signature: signature,
    api_key: apiKey,
    user: user,
    id: id,
    sender_addr: senderAdd,
    receiver_addr: receiverAdd,
    flagged: flagged
  }

  console.log("data",data)

  axios.post(url, data)
  .then(async function (response) {
    console.log("response", response["data"])
    return res.json({
      "status": 200,
      "data": response["data"],
      "action": "Toggle flagging of transaction in holding area",
      "network": network,
      "network_name": chainData["networkName"]
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}));

router.post('/:chainType/holding-area/send', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.body.signature;
  var apiKey = req.body.api_key;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.body.network;

  let walletName = req.body.wallet || "hot_wallet";

  var user = req.body.user || "";

  if(network !== "mainnet"){
    network = "testnet"
  }

  var chainData = await chain.getChainData(network, chainType);

  let url = chainData["chainURL"] + '/holding-area/send';

  let data = {
    network: network,
    signature: signature,
    api_key: apiKey,
    user: user,
    wallet: walletName
  }

  console.log("data",data)

  axios.post(url, data)
  .then(async function (response) {
    console.log("response", response["data"])
    // return res.json({
    //   "status": 200,
    //   "data": response["data"],
    //   "action": "Send Coin from holding area",
    //   "network": network,
    //   "network_name": chainData["networkName"]
    // });
  })
  .catch(function (error) {
    console.log(error);
  });

  return res.json({
    "status": 200,
    "data": "Holding area coins are being processed. Please query the processed coin endpoint to get the complete transaction hash."
  });
}));

router.post('/:chainType/send/token', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.body.signature;
  var apiKey = req.body.api_key;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.body.network;
  var senderAdd = req.body.sender_add;
  var receiverAdd = req.body.receiver_add;
  var tokenType = req.body.token_type;

  let walletName = req.body.wallet || "hot_wallet";

  var user = req.body.user || "";

  if(network !== "mainnet"){
    network = "testnet"
  }

  if(await chain.checkChainValidity(chainType, defaults)){
    if(tokenType == "usdt"){
      console.log(req.body["amount_in_"+"token"])
      var amount = (req.body["amount_in_"+"token"]).toString();

      var chainData = await chain.getChainData(network, chainType);

      let addressWhitelisted = await whitelist.isWhitelisted(network, chainType, receiverAdd);

      if(addressWhitelisted){
        if(parseFloat(amount) >= txCost[tokenType.toUpperCase()]["min-withdraw"]){
          if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
            let url = chainData["chainURL"] + '/send/token';

            let data = {
              network: network,
              signature: signature,
              api_key: apiKey,
              // amount: amount,
              sender_add: senderAdd,
              receiver_add: receiverAdd,
              token_type: tokenType.toUpperCase(),
              user: user,
              wallet: walletName
            }
            data["amount_in_"+"token"] = amount;
            // data["sender_add"] = senderAdd;
            // data["receiver_add"] = receiverAdd;

            console.log("data",data)

            axios.post(url, data)
            .then(async function (response) {
              console.log("response", response["data"])
              return res.json({
                "status": 200,
                "data": response["data"],
                "action": "Send Token",
                "network": network,
                "network_name": chainData["networkName"]
              });
            })
            .catch(function (error) {
              console.log(error);
            });
          }else{
            return res.json({
              "status": 400,
              "message": "Testnet on selected chain is unavailable."
            });
          }
        }else{
          return res.json({
            "status": 400,
            "message": "Sent amount is below minimum threshold."
          });
        }
      }else{
        return res.json({
          "status": 400,
          "message": "Destination address is not whitelisted."
        });
      }
    }else{
      return res.json({
        "status": 400,
        "message": "Token parameters is invalid and not supported."
      });
    }
  }else{
    return res.json({
      "status": 400,
      "message": "Chain parameters is invalid and not supported."
    });
  }
}));




module.exports = router
