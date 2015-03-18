
misex board s
file:///C:/Users/max/Downloads/micex_developer_manuals_Markets_and_Boards.pdf
http://cenyibum.ru/otvety-na-ekzamenaczionnye-voprosy-qrynok-czennyx-bumagq/111-tipy-birzhevyx-prikazov.html
http://www.micex.ru/markets/stock/securities/current_list

/*
 //var r = tdu.TraderUtils.getSecurity("SBER");
 //console.log(r);

var trader = new traderNet.TraderNet(process.env.TN_URL);
trader.connect({apiKey: process.env.TN_API_KEY, securityKey: process.env.TN_SECURITY_KEY})
.then((res) => {
        var order: td.IPutOrderData = {
            ticket : td.TicketCodes.SBER,
            action: td.ActionTypes.Buy,
            orderType: td.OrderTypes.Market,
            currency: td.CurrencyCodes.RUR,
            quantity: 10
        };
        return trader.putOrder(order);
})
.then((res) => {
        console.log("order complete", res);
    }
).error((err) => {
    console.log("error here", err)
});
 */