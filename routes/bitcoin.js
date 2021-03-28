var express = require('express')
var router = express.Router()

const axios = require('axios');

//require('dotenv').config()

var auth = require('../core/auth.js');
var whitelist = require('../core/whitelist.js');
var chain = require('../core/chain.js');
var txCost = require('../settings/transaction-cost.js').transactionCost;

const asyncHandler = fn => (req, res, next) =>
  Promise
    .resolve(fn(req, res, next))
    .catch(next)

// , auth.checkRoutesValidity
router.post('/:chainType/send/all', auth.isAuthorised, asyncHandler(async (req, res, next) => {
  var signature = req.body.signature;
  var apiKey = req.body.api_key;
  var chainType = req.params.chainType.toUpperCase();
  chainType = await chain.getChainMap(chainType);

  var network = req.body.network;
  var senderAdd = req.body.sender_add;
  var receiverAdd = req.body.receiver_add;

  if(network !== "mainnet"){
    network = "testnet"
  }

  if(chainType == "ETH" || chainType == "BTC" || chainType == "ATOM"){
    var amount = (req.body["amount_in_"+chainType.toLowerCase()]).toString();

    var chainData = await chain.getChainData(network, chainType);

    let addressWhitelisted = await whitelist.isWhitelisted(network, chainType, receiverAdd);

    if(addressWhitelisted){
      if(parseFloat(amount) > txCost[chainType]["min-withdraw"]){
        if((network == "testnet" && chainData["testnetAvailable"] == true) || network == "mainnet"){
          let url = chainData["chainURL"] + '/send';

          let data = {
            network: network,
            signature: signature,
            api_key: apiKey,
            // amount: amount,
            sender_add: senderAdd,
            receiver_add: receiverAdd
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


module.exports = router
