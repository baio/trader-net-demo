/// <reference path="./typings/tsd.d.ts" />
var traderNet = require("./trader-net/trader-net");
var td = require("./trader");
var tdu = require("./trader-utils");
//var r = tdu.TraderUtils.getSecurity(td.TicketCodes.SBER);
//console.log(r);
var trader = new traderNet.TraderNet(process.env.TN_URL);
trader.connect({ apiKey: process.env.TN_API_KEY, securityKey: process.env.TN_SECURITY_KEY }).then(function (res) {
    var order = {
        ticket: 230 /* SBER */,
        action: 3 /* Sell */,
        orderType: 1 /* Market */,
        currency: 2 /* RUR */,
        quantity: 1 * tdu.TraderUtils.getSecurity(230 /* SBER */).lotSize
    };
    return trader.putOrder(order);
}).then(function (res) {
    console.log("order complete", res);
}).error(function (err) {
    console.log("error here", err);
});
//# sourceMappingURL=index.js.map