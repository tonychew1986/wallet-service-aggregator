 let transactionCost = {
  "BTC": {
    "min-withdraw": 0.001,
    "tx-fee": 0.0005
  },
  "ETH": {
    "min-withdraw": 0.02,
    "tx-fee": 0.01
  },
  "ATOM": {
    "min-withdraw": 0.002,
    "tx-fee": 0.001
  },
  "USDT": {
    "min-withdraw": 8,
    "tx-fee": 5
  },
  "IOTEX": {
    "min-withdraw": 2, //240,
    "tx-fee": 1//120
  },
}

exports.transactionCost = transactionCost;
