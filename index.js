/// <reference path="./typings/tsd.d.ts" />
var traderNet = require("./trader-net/trader-net");
//var r = tdu.TraderUtils.getSecurity(td.TicketCodes.SBER);
//console.log(r);
var traderNetOpts = {
    onPortfolio: function (portfolio) {
        console.log(portfolio.positions[0].security);
        console.log(JSON.stringify(portfolio, null, 2));
    }
};
var trader = new traderNet.TraderNet(process.env.TN_URL, traderNetOpts);
trader.connect({ apiKey: process.env.TN_API_KEY, securityKey: process.env.TN_SECURITY_KEY }).then(function (res) {
    /*
    var order: td.IPutOrderData = {
        ticket : td.TicketCodes.SBER,
        action: td.ActionTypes.Sell,
        orderType: td.OrderTypes.Market,
        currency: td.CurrencyCodes.RUR,
        quantity: 1 * tdu.TraderUtils.getSecurity(td.TicketCodes.SBER).lotSize
    };

    return trader.putOrder(order);
    */
    trader.notifyPortfolio();
    return null;
}).then(function (res) {
    console.log("order complete", res);
}).error(function (err) {
    console.log("error here", err);
});
//# sourceMappingURL=index.js.map