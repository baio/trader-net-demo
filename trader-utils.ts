/// <reference path="./typings/tsd.d.ts" />
import trader = require("./trader")


export class TraderUtils {
    private static securities : any

    static getSecurity(code: trader.TicketCodes): trader.ISecurity {
        if (!TraderUtils.securities) {
            TraderUtils.securities = require("./data/MX-TQBR-190315.json");
        }
        var seq = TraderUtils.securities[trader.TicketCodes[code]];
        if (!seq)
            throw new Error("Code not found");

        return {
            ticket: code, code: trader.TicketCodes[code], lotSize: seq
        };
    }
}
