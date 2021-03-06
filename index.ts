/// <reference path="./typings/tsd.d.ts" />
import traderNet = require("./trader-net/trader-net");
import td = require("./trader");
import tdu = require("./trader-utils");

//var r = tdu.TraderUtils.getSecurity(td.TicketCodes.SBER);
//console.log(r);

var traderNetOpts: traderNet.ITraderNetOpts = {
    onPortfolio(portfolio: traderNet.ITraderNetPortfolio) {
        console.log(portfolio.positions[0].security);
        console.log(JSON.stringify(portfolio, null, 2));
    }
} ;

var trader = new traderNet.TraderNet(process.env.TN_URL, traderNetOpts);
trader.connect({apiKey: process.env.TN_API_KEY, securityKey: process.env.TN_SECURITY_KEY})
    .then((res) => {

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
    })
    .then((res) => {
        console.log("order complete", res);
    }
).error((err) => {
        console.log("error here", err)
    });
