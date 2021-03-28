
const axios = require('axios');

require('dotenv').config()

const config = require('config');

const addressWhitelistIP = process.env.ADDRESS_WHITELIST_IP || config.get('address-whitelist-ip'); // "http://localhost";
const addressWhitelistPort = process.env.ADDRESS_WHITELIST_PORT || config.get('address-whitelist-port'); // "3889";

let isWhitelisted = async function(network, coin, address) {
  let urlParam = "?network=" + network + "&coin=" + coin + "&address=" + address;
  let url = addressWhitelistIP + ":" + addressWhitelistPort + '/address' + urlParam;

  console.log("url", url);

  var promise = new Promise(function(resolve, reject){
    axios.get(url)
    .then(function (response) {
      let result = response["data"]["result"];
      if(result == "success"){
        resolve(true);
      }else{
        resolve(false);
      }

    })
    .catch(function (error) {
      console.log(error);
    });
  });
  return promise;
}

exports.isWhitelisted = isWhitelisted;
