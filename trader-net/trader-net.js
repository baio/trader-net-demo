var crypto = require("./trader-net-crypto");
var io = require('socket.io-client');
var Promise = require("bluebird");
var TraderNet = (function () {
    function TraderNet(url) {
        this.url = url;
    }
    TraderNet.prototype.connect = function (auth) {
        var _ws = io(this.url, { transports: ['websocket'] });
        var ws = Promise.promisifyAll(_ws);
        this.ws = ws;
        return ws.onAsync("connect").then(function () {
            var data = { apiKey: auth.apiKey };
            cmd: 'getAuthInfo';
            nonce: Date.now();
            var sig = crypto.sign(data, auth.securityKey);
            return ws.emitAsync('auth', data, sig);
        });
    };
    TraderNet.prototype.BuyCurrentPrice = function (ticket, volume) {
        return false;
    };
    TraderNet.prototype.SellCurrentPrice = function (ticket, volume) {
        return false;
    };
    return TraderNet;
})();
exports.TraderNet = TraderNet;
//# sourceMappingURL=trader-net.js.map