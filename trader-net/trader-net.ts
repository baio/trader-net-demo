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

export interface ITraderNetAccount {
    ///Свободные средства
    availableAmount: number
    ///Валюта счёта
    currency: trader.CurrencyCodes
    ///Курс валюты счета
    currencyRate: number

    forecastIn: number
    forecastOut: number
}

export interface ITraderNetPosition {
    ///Тикер бумаги
    security: trader.TicketCodes
    ///Тип бумаги ???
    securityType: number
    ///Вид бумаги ???
    securityKind: number
    //Стоимость
    price: number
    ///Количество
    quantity: number
    ///Валюта
    currency: trader.CurrencyCodes
    ///Курс валюты
    currencyRate: number
    ///Наименование бумаги
    securityName: string
    ///Альтернативное наименование бумаги
    securityName2: string
    ///Цена открытия
    openPrice : number
    ///Рыночная цена
    marketPrice: number
    /*
    //???
    vm: string
    //???
    go: number
    //???
    profit_close: number
    //???
    acc_pos_id: number
    //???
    trade: Array<{}>
    */
}

export interface ITraderNetPortfolio {
    ///Ключ сообщений портфеля (логин, предварённый знаком процента)
    key: string
    ///Массив счётов клиента
    accounts: Array<ITraderNetAccount>
    ///Массив позиций клиента
    positions: Array<ITraderNetPosition>
}

export interface ITraderNetOpts {
    onPortfolio?: (portfolio: ITraderNetPortfolio) => void
    onOrders?: () => void
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

    constructor(private url:string, private opts: ITraderNetOpts){
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

    static  mapPortfolio(servicePortfolio: any) : ITraderNetPortfolio {
        return {
            key: servicePortfolio.key,
            accounts: servicePortfolio.acc.map(TraderNet.mapAccount),
            positions: servicePortfolio.pos.map(TraderNet.mapPosition)
        }
    }

    static  mapAccount(serviceAccount: any) : ITraderNetAccount {
        return {
            availableAmount: serviceAccount.s,
            currency: <any>trader.CurrencyCodes[serviceAccount.curr],
            currencyRate: serviceAccount.currval,
            forecastIn: serviceAccount.forecast_in,
            forecastOut: serviceAccount.forecast_out
        }
    }

    static  mapPosition(servicePos: any) : ITraderNetPosition {
        return {
            security: <any>trader.TicketCodes[servicePos.i],
            securityType: servicePos.t,
            securityKind: servicePos.k,
            price: servicePos.s,
            quantity: servicePos.q,
            currency: <any>trader.CurrencyCodes[servicePos.curr],
            currencyRate: servicePos.currval,
            securityName: servicePos.name,
            securityName2: servicePos.name2,
            openPrice : servicePos.open_bal,
            marketPrice: servicePos.mkt_price
        }
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
        }).then(res => {
            if (this.opts) {
                if (this.opts.onPortfolio) {
                    ws.on('portfolio', (portfolio) => {
                        this.opts.onPortfolio(TraderNet.mapPortfolio(portfolio[0].ps));
                    });
                }
            }
            return res;
        });
    }

    putOrder(data: trader.IPutOrderData): Promise<IPutOrderResult> {
        var formatted = TraderNet.formatPutOrder(data);
        return this.ws.emitAsync<IPutOrderResult>('putOrder', formatted);
    }

    notifyPortfolio = () => {
        this.ws.emit('notifyPortfolio');
    }

}

