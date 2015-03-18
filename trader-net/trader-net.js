///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/socket.io-client/socket.io-client.d.ts"/>
var trader = require("../trader");
var crypto = require("./trader-net-crypto");
var io = require('socket.io-client');
var Promise = require("bluebird");
var util = require("util");
var TraderNet = (function () {
    function TraderNet(url) {
        this.url = url;
    }
    TraderNet.formatPutOrder = function (data) {
        return {
            instr_name: trader.TicketCodes[data.ticket],
            action_id: data.action,
            order_type_id: data.orderType,
            curr: trader.CurrencyCodes[data.currency],
            limit_price: data.limitPrice,
            stop_price: data.stopPrice,
            qty: data.quantity,
            aon: data.allOrNothing ? 1 : 0,
            expiration_id: data.expiration,
            submit_ch_c: 1,
            message_id: 0,
            replace_order_id: 0,
            groupPortfolioName: data.groupPortfolio,
            userOrderId: data.userOrderId
        };
    };
    TraderNet.prototype.connect = function (auth) {
        var _ws = io(this.url, { transports: ['websocket'] });
        var ws = Promise.promisifyAll(_ws);
        this.ws = ws;
        return ws.onAsync("connect").then(function () {
            var data = {
                apiKey: auth.apiKey,
                cmd: 'getAuthInfo',
                nonce: Date.now()
            };
            var sig = crypto.sign(data, auth.securityKey);
            return ws.emitAsync('auth', data, sig);
        });
    };
    TraderNet.prototype.putOrder = function (data) {
        var formatted = TraderNet.formatPutOrder(data);
        console.log(formatted);
        return this.ws.emitAsync('putOrder', formatted);
    };
    return TraderNet;
})();
exports.TraderNet = TraderNet;
//# sourceMappingURL=trader-net.js.map