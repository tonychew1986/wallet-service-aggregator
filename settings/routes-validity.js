
let getRouteValidity = {
 {
   route: "/wallet",
   coins: [
     "BTC", "ETH", "ATOM", "IOTEX"
   ],
 },
 {
   route: "/wallet/query",
   coins: [
     "BTC", "ETH", "ATOM", "IOTEX"
   ],
 },
 {
   route: "/send",
   coins: [
     "BTC", "ETH", "ATOM"
   ],
 },
 {
   route: "/send/token",
   coins: [
     "ETH"
   ],
 },
 {
   route: "/send/all",
   coins: [
     "BTC"
   ],
 },
}

exports.getRouteValidity = getRouteValidity;
