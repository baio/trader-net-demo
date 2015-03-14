///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/socket.io-client/socket.io-client.d.ts"/>
import trader = require("../trader.d");
var crypto = require("./trader-net-crypto");
var io = require('socket.io-client')
var Promise = require("bluebird")

export interface ITraderNetAuth {
    apiKey: string
    securityKey: string
}

export interface ITraderNetAuthResult {
    login: string
    mode: string
    trade: boolean
}

interface ISocketPromisifyed extends SocketIOClient.Socket {
    onAsync<T>(event: string): Promise<T>
    emitAsync<T>(event: string, prm1?: any, prm2?: any): Promise<T>
}

export class TraderNet implements trader.ITrader {

    private ws: ISocketPromisifyed;

    constructor(private url:string){
    }

    connect(auth: ITraderNetAuth): Promise<ITraderNetAuthResult>{
        var _ws = io(this.url, {transports: [ 'websocket' ]});
        var ws = <ISocketPromisifyed>Promise.promisifyAll(_ws);
        this.ws = ws;

        return ws.onAsync<ITraderNetAuthResult>("connect").then(() => {
            var data = { apiKey: auth.apiKey };
            cmd: 'getAuthInfo'
            nonce: Date.now()
            var sig = crypto.sign(data, auth.securityKey);
            return ws.emitAsync<ITraderNetAuthResult>('auth', data, sig);
        });
    }

    BuyCurrentPrice(ticket: trader.TicketTypes, volume: number): boolean {
        return false;
    }
    SellCurrentPrice(ticket: trader.TicketTypes, volume: number): boolean {
        return false;
    }
}

