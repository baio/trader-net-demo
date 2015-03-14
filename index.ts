/// <reference path="./typings/tsd.d.ts" />
var traderNet = require("./trader-net/trader-net");

var trader = new traderNet.TraderNet(process.env.TN_URL);
trader.connect({apiKey: process.env.TN_API_KEY, securityKey: process.env.TN_SECURITY_KEY})
.then((res) => {
    console.log("good day hunta!!!", res);
});