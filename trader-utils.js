/// <reference path="./typings/tsd.d.ts" />
var trader = require("./trader");
var TraderUtils = (function () {
    function TraderUtils() {
    }
    TraderUtils.getSecurity = function (code) {
        if (!TraderUtils.securities) {
            TraderUtils.securities = require("./data/MX-TQBR-190315.json");
        }
        var seq = TraderUtils.securities[trader.TicketCodes[code]];
        if (!seq)
            throw new Error("Code not found");
        return {
            ticket: code,
            code: trader.TicketCodes[code],
            lotSize: seq
        };
    };
    return TraderUtils;
})();
exports.TraderUtils = TraderUtils;
//# sourceMappingURL=trader-utils.js.map