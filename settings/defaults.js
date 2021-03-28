
let getDefaults = {
 "chain": [ "BTC", "ETH", "ATOM", "IOTEX" ],
 "error_condition": [
   {
     "type": "TESTNET_UNAVAILABLE",
     "message": "Testnet on selected chain is unavailable.",
   },
   {
     "type": "CHAIN_UNAVAILABLE",
     "message": "Chain parameters is invalid and not supported.",
   },
   {
     "type": "BELOW_SPENDING_THRESHOLD",
     "message": "Sent amount is below minimum threshold.",
   },
   {
     "type": "ADDRESS_NOT_WHITELISTED",
     "message": "Destination address is not whitelisted.",
   },
   {
     "type": "TOKEN_UNAVAILABLE",
     "message": "Token parameters is invalid and not supported.",
   },
 ]
}

exports.getDefaults = getDefaults;
