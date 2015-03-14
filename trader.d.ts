///<reference path="./typings/bluebird/bluebird.d.ts"/>
import Promise = require("bluebird");

export declare enum TicketTypes {
    SBER
}

export declare enum TraderEventType {
    connect
}

export interface ITrader {
    connect(authParams: any): Promise<any>
    BuyCurrentPrice(ticket: TicketTypes, volume: number): void
    SellCurrentPrice(ticket: TicketTypes, volume: number): void
}

