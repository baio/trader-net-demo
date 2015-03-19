///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/socket.io-client/socket.io-client.d.ts"/>
var trader = require("../trader");
var crypto = require("./trader-net-crypto");
var io = require('socket.io-client');
var Promise = require("bluebird");
var util = require("util");
var TraderNet = (function () {
    function TraderNet(url, opts) {
        var _this = this;
        this.url = url;
        this.opts = opts;
        this.notifyPortfolio = function () {
            _this.ws.emit('notifyPortfolio');
        };
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
    TraderNet.mapPortfolio = function (servicePortfolio) {
        return {
            key: servicePortfolio.key,
            accounts: servicePortfolio.acc.map(TraderNet.mapAccount),
            positions: servicePortfolio.pos.map(TraderNet.mapPosition)
        };
    };
    TraderNet.mapAccount = function (serviceAccount) {
        return {
            availableAmount: serviceAccount.s,
            currency: trader.CurrencyCodes[serviceAccount.curr],
            currencyRate: serviceAccount.currval,
            forecastIn: serviceAccount.forecast_in,
            forecastOut: serviceAccount.forecast_out
        };
    };
    TraderNet.mapPosition = function (servicePos) {
        return {
            security: trader.TicketCodes[servicePos.i],
            securityType: servicePos.t,
            securityKind: servicePos.k,
            price: servicePos.s,
            quantity: servicePos.q,
            currency: trader.CurrencyCodes[servicePos.curr],
            currencyRate: servicePos.currval,
            securityName: servicePos.name,
            securityName2: servicePos.name2,
            openPrice: servicePos.open_bal,
            marketPrice: servicePos.mkt_price
        };
    };
    TraderNet.prototype.connect = function (auth) {
        var _this = this;
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
        }).then(function (res) {
            if (_this.opts) {
                if (_this.opts.onPortfolio) {
                    ws.on('portfolio', function (portfolio) {
                        _this.opts.onPortfolio(TraderNet.mapPortfolio(portfolio[0].ps));
                    });
                }
            }
            return res;
        });
    };
    TraderNet.prototype.putOrder = function (data) {
        var formatted = TraderNet.formatPutOrder(data);
        return this.ws.emitAsync('putOrder', formatted);
    };
    return TraderNet;
})();
exports.TraderNet = TraderNet;
//# sourceMappingURL=trader-net.js.map