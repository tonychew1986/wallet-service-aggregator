const request = require('supertest');
const app = require('../index');

var expect  = require('chai').expect;

describe('Basic endpoint to test if service is active', function () {
    it('GET /test', function (done) {
        request(app)
          .get('/test')
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             expect(res.text).to.be.equal('test');
             return done();
          });
    });
});

describe('Ethereum endpoint to test blockchain based functionality', function () {
    it('GET mainnet /eth/wallet success', function (done) {
        var signature = "eb6a7f72c8392b4ddc8702b51c434e7b5606fcee7f17973477ac01096fdf5745";
        var paramQuery = "?network=mainnet&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty";

        request(app)
          .get('/eth/wallet'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }

             var resBody = res["body"];
             var resAddr = resBody["data"]["address"];
             var resAddrHeaderCheck = resAddr.substring(0,2);
             var resAddrLengthCheck = resAddr.length;

             expect(resAddrHeaderCheck).to.be.equal('0x');
             expect(resAddrLengthCheck).to.be.equal(42);
             expect(resBody["network"]).to.be.equal('mainnet');
             expect(resBody["network_name"]).to.be.equal('');
             return done();
          });
    });

    it('GET testnet /eth/wallet success', function (done) {
        var signature = "a27f7cdf652afba3bac41d4519744ca0198148a79eaf931b2829da450b7347c6";
        var paramQuery = "?network=testnet&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty"

        request(app)
          .get('/eth/wallet'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }

             var resBody = res["body"];
             var resAddr = resBody["data"]["address"];
             var resAddrHeaderCheck = resAddr.substring(0,2);
             var resAddrLengthCheck = resAddr.length;

             expect(resAddrHeaderCheck).to.be.equal('0x');
             expect(resAddrLengthCheck).to.be.equal(42);
             expect(resBody["network"]).to.be.equal('testnet');
             expect(resBody["network_name"]).to.be.equal('ropsten');
             return done();
          });
    });

    it('GET testnet /eth/wallet fail', function (done) {
        var signature = "12345";
        var paramQuery = "?network=testnet&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty"

        request(app)
          .get('/eth/wallet'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }

             var resBody = res["body"];
             var resStatus = resBody["status"];
             var resMessage = resBody["message"];

             expect(resStatus).to.be.equal(400);
             expect(resMessage).to.be.equal('Unauthorised access');
             return done();
          });
    });

    it('GET mainnet /eth/wallet/query?network=mainnet success', function (done) {
        var signature = "c8331ba367ffa14008f55dc049974148dc82d5884917ca5d577e7e2c138206fb";
        var paramQuery = "?network=mainnet&nonce=3&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty"

        request(app)
          .get('/eth/wallet/query'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resAddr = resBody["data"]["address"];
             var resAddrHeaderCheck = resAddr.substring(0,2);
             var resAddrLengthCheck = resAddr.length;

             expect(resAddrHeaderCheck).to.be.equal('0x');
             expect(resAddrLengthCheck).to.be.equal(42);
             expect(resAddr).to.not.equal("0xfb01514cbe47a2cd94e606cd1ea744223784cdfe");
             expect(resBody["network"]).to.be.equal('mainnet');
             return done();
          });
    });

    it('GET testnet /eth/wallet/query?network=testnet success', function (done) {
        var signature = "70bce6c9d8bcdac93d046cce3bc8eefbef597e20a4109600068f6cf1f9ea1dc5";
        var paramQuery = "?network=testnet&nonce=3&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty"

        request(app)
          .get('/eth/wallet/query'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resAddr = resBody["data"]["address"];
             var resAddrHeaderCheck = resAddr.substring(0,2);
             var resAddrLengthCheck = resAddr.length;

             expect(resAddrHeaderCheck).to.be.equal('0x');
             expect(resAddrLengthCheck).to.be.equal(42);
             expect(resAddr).to.be.equal("0xfb01514cbe47a2cd94e606cd1ea744223784cdfe");
             expect(resBody["network"]).to.be.equal('testnet');
             expect(resBody["network_name"]).to.be.equal('ropsten');
             return done();
          });
    });
});

describe('Bitcoin endpoint to test blockchain based functionality', function () {
    it('GET mainnet /btc/wallet success', function (done) {
        var signature = "eb6a7f72c8392b4ddc8702b51c434e7b5606fcee7f17973477ac01096fdf5745";
        var paramQuery = "?network=mainnet&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty";

        request(app)
          .get('/btc/wallet'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resAddr = resBody["data"]["address"];
             var resAddrHeaderCheck = resAddr.substring(0,1);
             var resAddrLengthCheck = resAddr.length;

             expect(resAddrHeaderCheck).to.not.equal('n');
             expect(resAddrLengthCheck).to.be.above(32);
             expect(resAddrLengthCheck).to.be.below(35);
             expect(resBody["network"]).to.be.equal('mainnet');
             expect(resBody["network_name"]).to.be.equal('');
             return done();
          });
    });

    it('GET testnet /btc/wallet success', function (done) {
        var signature = "a27f7cdf652afba3bac41d4519744ca0198148a79eaf931b2829da450b7347c6";
        var paramQuery = "?network=testnet&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty";

        request(app)
          .get('/btc/wallet'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resAddr = resBody["data"]["address"];
             var resAddrHeaderCheck = resAddr.substring(0,1);
             var resAddrLengthCheck = resAddr.length;

             console.log(resBody)

             expect(resAddrHeaderCheck).to.not.equal('1');
             expect(resAddrLengthCheck).to.be.above(32);
             expect(resAddrLengthCheck).to.be.below(35);
             expect(resBody["network"]).to.be.equal('testnet');
             expect(resBody["network_name"]).to.be.equal('testnet3');
             return done();
          });
    });

    it('GET testnet /btc/wallet fail', function (done) {
        var signature = "12345";
        var paramQuery = "?network=testnet&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty"

        request(app)
          .get('/btc/wallet'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }

             var resBody = res["body"];
             var resStatus = resBody["status"];
             var resMessage = resBody["message"];

             expect(resStatus).to.be.equal(400);
             expect(resMessage).to.be.equal('Unauthorised access');
             return done();
          });
    });

    it('GET mainnet /btc/wallet/query?network=mainnet success', function (done) {
        var signature = "c8331ba367ffa14008f55dc049974148dc82d5884917ca5d577e7e2c138206fb";
        var paramQuery = "?network=mainnet&nonce=3&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty"

        request(app)
          .get('/btc/wallet/query'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resAddr = resBody["data"]["address"];
             var resAddrHeaderCheck = resAddr.substring(0,1);
             var resAddrLengthCheck = resAddr.length;

             expect(resAddrHeaderCheck).to.not.equal('n');
             expect(resAddrLengthCheck).to.be.above(32);
             expect(resAddrLengthCheck).to.be.below(35);
             expect(resAddr).to.be.equal("19e3y3uF2tAWR57DtsLoCDYPiTfFWZ5Xr6");
             expect(resBody["network"]).to.be.equal('mainnet');
             expect(resBody["network_name"]).to.be.equal('');
             return done();
          });
    });

    it('GET testnet /btc/wallet/query?network=testnet success', function (done) {
        var signature = "70bce6c9d8bcdac93d046cce3bc8eefbef597e20a4109600068f6cf1f9ea1dc5";
        var paramQuery = "?network=testnet&nonce=3&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty"

        request(app)
          .get('/btc/wallet/query'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resAddr = resBody["data"]["address"];
             var resAddrHeaderCheck = resAddr.substring(0,1);
             var resAddrLengthCheck = resAddr.length;

             expect(resAddrHeaderCheck).to.not.equal('1');
             expect(resAddrLengthCheck).to.be.above(32);
             expect(resAddrLengthCheck).to.be.below(35);
             expect(resAddr).to.be.equal("muADUVFf5rsDAvPNVJidof7kLzRTTm9wxE");
             expect(resBody["network"]).to.be.equal('testnet');
             expect(resBody["network_name"]).to.be.equal('testnet3');
             return done();
          });
    });
});


describe('Cosmos endpoint to test blockchain based functionality', function () {
    it('GET mainnet /atom/wallet success', function (done) {
        var signature = "eb6a7f72c8392b4ddc8702b51c434e7b5606fcee7f17973477ac01096fdf5745";
        var paramQuery = "?network=mainnet&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty";

        request(app)
          .get('/atom/wallet'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resAddr = resBody["data"]["address"];
             var resAddrHeaderCheck = resAddr.substring(0,6);
             var resAddrLengthCheck = resAddr.length;

             expect(resAddrHeaderCheck).to.be.equal('cosmos');
             expect(resAddrLengthCheck).to.be.equal(45);
             expect(resBody["network"]).to.be.equal('mainnet');

             return done();
          });
    });

    it('GET testnet /atom/wallet unsupported', function (done) {
        var signature = "a27f7cdf652afba3bac41d4519744ca0198148a79eaf931b2829da450b7347c6";
        var paramQuery = "?network=testnet&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty";

        request(app)
          .get('/atom/wallet'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resMessage = res["body"]["message"];

             expect(resMessage).to.be.equal("Testnet on selected chain is unavailable.");
             return done();
          });
    });

    it('GET testnet /atom/wallet fail', function (done) {
        var signature = "12345";
        var paramQuery = "?network=testnet&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty"

        request(app)
          .get('/atom/wallet'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }

             var resBody = res["body"];
             var resStatus = resBody["status"];
             var resMessage = resBody["message"];

             expect(resStatus).to.be.equal(400);
             expect(resMessage).to.be.equal('Unauthorised access');
             return done();
          });
    });

    it('GET mainnet /atom/wallet/query?network=mainnet success', function (done) {
        var signature = "c8331ba367ffa14008f55dc049974148dc82d5884917ca5d577e7e2c138206fb";
        var paramQuery = "?network=mainnet&nonce=3&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty"

        request(app)
          .get('/atom/wallet/query'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resAddr = resBody["data"]["address"];
             var resAddrHeaderCheck = resAddr.substring(0,6);
             var resAddrLengthCheck = resAddr.length;

             expect(resAddrHeaderCheck).to.be.equal('cosmos');
             expect(resAddrLengthCheck).to.be.equal(45);
             expect(resAddr).to.be.equal("cosmos1acrkt4sa578c04qalhl7tvsldke24ydmxlvf4j");
             expect(resBody["network"]).to.be.equal('mainnet');

             return done();
          });
    });

    it('GET testnet /atom/wallet/query?network=testnet success', function (done) {
        var signature = "70bce6c9d8bcdac93d046cce3bc8eefbef597e20a4109600068f6cf1f9ea1dc5";
        var paramQuery = "?network=testnet&nonce=3&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty"

        request(app)
          .get('/atom/wallet/query'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resMessage = res["body"]["message"];

             expect(resMessage).to.be.equal("Testnet on selected chain is unavailable.");
             return done();
          });
    });
});



describe('IOTEX endpoint to test blockchain based functionality', function () {
    it('GET mainnet /iotex/wallet success', function (done) {
        var signature = "eb6a7f72c8392b4ddc8702b51c434e7b5606fcee7f17973477ac01096fdf5745";
        var paramQuery = "?network=mainnet&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty";

        request(app)
          .get('/iotex/wallet'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resAddr = resBody["data"]["address"];
             var resAddrHeaderCheck = resAddr.substring(0,6);
             var resAddrLengthCheck = resAddr.length;

             expect(resAddrHeaderCheck).to.be.equal('cosmos');
             expect(resAddrLengthCheck).to.be.equal(45);
             expect(resBody["network"]).to.be.equal('mainnet');

             return done();
          });
    });

    it('GET testnet /iotex/wallet unsupported', function (done) {
        var signature = "a27f7cdf652afba3bac41d4519744ca0198148a79eaf931b2829da450b7347c6";
        var paramQuery = "?network=testnet&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty";

        request(app)
          .get('/iotex/wallet'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resMessage = res["body"]["message"];

             expect(resMessage).to.be.equal("Testnet on selected chain is unavailable.");
             return done();
          });
    });

    it('GET testnet /iotex/wallet fail', function (done) {
        var signature = "12345";
        var paramQuery = "?network=testnet&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty"

        request(app)
          .get('/iotex/wallet'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }

             var resBody = res["body"];
             var resStatus = resBody["status"];
             var resMessage = resBody["message"];

             expect(resStatus).to.be.equal(400);
             expect(resMessage).to.be.equal('Unauthorised access');
             return done();
          });
    });

    it('GET mainnet /iotex/wallet/query?network=mainnet success', function (done) {
        var signature = "c8331ba367ffa14008f55dc049974148dc82d5884917ca5d577e7e2c138206fb";
        var paramQuery = "?network=mainnet&nonce=3&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty"

        request(app)
          .get('/iotex/wallet/query'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resAddr = resBody["data"]["address"];
             var resAddrHeaderCheck = resAddr.substring(0,6);
             var resAddrLengthCheck = resAddr.length;

             expect(resAddrHeaderCheck).to.be.equal('cosmos');
             expect(resAddrLengthCheck).to.be.equal(45);
             expect(resAddr).to.be.equal("cosmos1acrkt4sa578c04qalhl7tvsldke24ydmxlvf4j");
             expect(resBody["network"]).to.be.equal('mainnet');

             return done();
          });
    });
});

describe('Checksum endpoint to whitelist address', function () {
    it('GET /checksum success', function (done) {
        var paramQuery = "?address=12345";

        request(app)
          .get('/checksum'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resChecksum = resBody["checksum"];

             expect(resChecksum).to.be.equal('d2130b6f42bdcbee3029cecfaddc1fe917f701f99e19c96b935d733520faec2b');

             return done();
          });
    });
});



describe('Balance endpoint to check account', function () {
    it('GET /btc/balance success', function (done) {
        var signature = "15d30af42890337ea6affd82ca9cb86df7ef98c2bf76187376334e292e125002"; //wrong
        var address = "19e3y3uF2tAWR57DtsLoCDYPiTfFWZ5Xr6";
        var paramQuery = "?network=mainnet&sender_add=" + address + "&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty"

        request(app)
          .get('/btc/balance'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resBalance = Number(resBody["data"]["balance"]);

             expect(resBalance).to.be.above(0);

             return done();
          });
    });

    it('GET /eth/balance success', function (done) {
        var signature = "15d30af42890337ea6affd82ca9cb86df7ef98c2bf76187376334e292e125002";
        var address = "0x9E013304072C0B919e64721cB550B280a1F021f6";
        var paramQuery = "?network=testnet&sender_add=" + address + "&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty"

        request(app)
          .get('/eth/balance'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resBalance = Number(resBody["data"]["balance"]);

             expect(resBalance).to.be.above(0);

             return done();
          });
    });

    it('GET /atom/balance success', function (done) {
        var signature = "15d30af42890337ea6affd82ca9cb86df7ef98c2bf76187376334e292e125002"; //wrong
        var address = "cosmos1c0nsetrn3pfgz8ejq0kpvh97j8lt4vxzypqjz3";
        var paramQuery = "?network=mainnet&sender_add=" + address + "&signature=" + signature + "&api_key=r0ckXApi_key12345qwerty"

        request(app)
          .get('/atom/balance'+paramQuery)
          .expect(200)
          .end((err, res) => {
             if (err) {
               return done(err);
             }
             var resBody = res["body"];
             var resBalance = Number(resBody["data"]["balance"]);

             expect(resBalance).to.be.above(0);

             return done();
          });
    });
});
