///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/socket.io-client/socket.io-client.d.ts"/>
import trader = require("../trader");
var crypto = require("./trader-net-crypto");
var io = require('socket.io-client')
var Promise = require("bluebird")
var util = require("util")

export interface ITraderNetAuth {
    apiKey: string
    securityKey: string
}

export interface ITraderNetAuthResult {
    login: string
    mode: string
    trade: boolean
}

export interface IPutOrderResult {
    orderId: number
}

interface ISocketPromisifyed extends SocketIOClient.Socket {
    onAsync<T>(event: string): Promise<T>
    emitAsync<T>(event: string, prm1?: any, prm2?: any): Promise<T>
}

interface ITraderNetPutOrderData {
    instr_name: string
    action_id: number
    order_type_id: number
    curr: string
    limit_price: number
    stop_price: number
    qty: number
    aon: number
    expiration_id: number
    submit_ch_c: number
    message_id: number
    replace_order_id: number
    groupPortfolioName: number
    userOrderId: number
}

export class TraderNet implements trader.ITrader {

    private ws: ISocketPromisifyed;

    constructor(private url:string){
    }

    static formatPutOrder(data: trader.IPutOrderData) : ITraderNetPutOrderData {
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
    }

    connect(auth: ITraderNetAuth): Promise<ITraderNetAuthResult>{
        var _ws = io(this.url, {transports: [ 'websocket' ]});
        var ws = <ISocketPromisifyed>Promise.promisifyAll(_ws);
        this.ws = ws;

        return ws.onAsync<ITraderNetAuthResult>("connect").then(() => {
            var data = {
                apiKey: auth.apiKey,
                cmd: 'getAuthInfo',
                nonce: Date.now()
            };
            var sig = crypto.sign(data, auth.securityKey);
            return ws.emitAsync<ITraderNetAuthResult>('auth', data, sig);
        });
    }

    putOrder(data: trader.IPutOrderData): Promise<IPutOrderResult> {
        var formatted = TraderNet.formatPutOrder(data);
        console.log(formatted);
        return this.ws.emitAsync<IPutOrderResult>('putOrder', formatted);
    }
}

