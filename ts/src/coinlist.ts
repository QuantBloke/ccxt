import Exchange from './abstract/coinlist.js';
import { ArgumentsRequired, AuthenticationError } from './base/errors.js';
import { TICK_SIZE } from './base/functions/number.js';
import { Precise } from './base/Precise.js';
import { sha256 } from './static_dependencies/noble-hashes/sha256.js';
import { Int, OrderSide, OrderType } from './base/types.js';

/**
 * @class coinlist
 * @extends Exchange
 */
export default class coinlist extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'coinlist',
            'name': 'Coinlist',
            // todo: find out countries
            'countries': [ 'CO' ], // Columbia
            'version': 'v1',
            'rateLimit': 300, // 1000 per 5 minutes
            'certified': false,
            'pro': false,
            'has': {
                'CORS': undefined,
                'spot': false,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'addMargin': false,
                'borrowMargin': false,
                'cancelAllOrders': true,
                'cancelOrder': true,
                'cancelOrders': true,
                'createDepositAddress': false,
                'createOrder': true,
                'createPostOnlyOrder': true,
                'createReduceOnlyOrder': false,
                'createStopLimitOrder': true,
                'createStopMarketOrder': true,
                'createStopOrder': true,
                'deposit': false,
                'editOrder': false,
                'fetchAccounts': true,
                'fetchBalance': false,
                'fetchBidsAsks': false,
                'fetchBorrowInterest': false,
                'fetchBorrowRate': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchBorrowRates': false,
                'fetchBorrowRatesPerSymbol': false,
                'fetchCanceledOrders': true,
                'fetchClosedOrder': false,
                'fetchClosedOrders': true,
                'fetchCurrencies': true,
                'fetchDeposit': false,
                'fetchDepositAddress': false,
                'fetchDepositAddresses': false,
                'fetchDepositAddressesByNetwork': false,
                'fetchDeposits': false,
                'fetchDepositWithdrawFee': false,
                'fetchDepositWithdrawFees': false,
                'fetchFundingHistory': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchIndexOHLCV': false,
                'fetchL3OrderBook': false,
                'fetchLedger': false,
                'fetchLeverage': false,
                'fetchLeverageTiers': false,
                'fetchMarketLeverageTiers': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenInterestHistory': false,
                'fetchOpenOrder': false,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrderBooks': false,
                'fetchOrders': true,
                'fetchOrderTrades': true,
                'fetchPosition': false,
                'fetchPositions': false,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchStatus': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': true,
                'fetchTradingLimits': false,
                'fetchTransactionFee': false,
                'fetchTransactionFees': false,
                'fetchTransactions': false,
                'fetchTransfers': true,
                'fetchWithdrawal': false,
                'fetchWithdrawals': false,
                'fetchWithdrawalWhitelist': false,
                'reduceMargin': false,
                'repayMargin': false,
                'setLeverage': false,
                'setMargin': false,
                'setMarginMode': false,
                'setPositionMode': false,
                'signIn': false,
                'transfer': true,
                'withdraw': false,
                'ws': false,
            },
            'timeframes': {
                '1m': '1m',
                '5m': '5m',
                '30m': '30m',
            },
            'urls': {
                'logo': '',
                'api': {
                    'public': 'https://trade-api.coinlist.co',
                    'private': 'https://trade-api.coinlist.co',
                },
                'www': 'https://coinlist.co',
                'doc': [
                    'https://trade-docs.coinlist.co',
                ],
                'fees': '', // todo
            },
            'api': {
                'public': {
                    'get': {
                        'v1/time': { 'bulk': false },
                        'v1/symbols': { 'bulk': false },
                        'v1/assets': { 'bulk': false },
                        'v1/symbols/summary': { 'bulk': false },
                        'v1/symbols/{symbol}/summary': { 'bulk': false },
                        'v1/symbols/{symbol}/book': { 'bulk': false },
                        'v1/symbols/{symbol}/candles': { 'bulk': false },
                        'v1/symbols/{symbol}/auctions': { 'bulk': false },
                        // Not unified ----------------------------------
                        'v1/symbols/{symbol}': { 'bulk': false }, // returns one market
                        'v1/symbols/{symbol}/quote': { 'bulk': false }, // returns lv1 book (last trade and the best bid and ask)
                        'v1/symbols/{symbol}/auctions/{auction_code}': { 'bulk': false }, // retruns one trade by trade id
                        // ----------------------------------------------
                    },
                },
                'private': {
                    'get': {
                        'v1/fees': { 'bulk': false },
                        'v1/accounts': { 'bulk': false },
                        'v1/balances': { 'bulk': false },
                        'v1/fills': { 'bulk': false },
                        'v1/orders': { 'bulk': false },
                        'v1/orders/{order_id}': { 'bulk': false },
                        'v1/transfers': { 'bulk': false },
                        // Not unified ----------------------------------
                        'v1/accounts/{trader_id}': { 'bulk': false },
                        'v1/accounts/{trader_id}/ledger': { 'bulk': false },
                        'v1/accounts/{trader_id}/wallets': { 'bulk': false },
                        'v1/accounts/{trader_id}/wallet-ledger': { 'bulk': false },
                        'v1/accounts/{trader_id}/ledger-summary': { 'bulk': false },
                        'v1/keys': { 'bulk': false },
                        'v1/reports': { 'bulk': false },
                        'v1/user': { 'bulk': false },
                        'v1/credits': { 'bulk': false },
                        // ----------------------------------------------
                    },
                    'post': {
                        'v1/orders': { 'bulk': false },
                        'v1/transfers/internal-transfer': { 'bulk': false },
                        // Not unified ----------------------------------
                        'v1/transfers/to-wallet': { 'bulk': false }, // todo
                        'v1/transfers/from-wallet': { 'bulk': false }, // todo
                        'v1/transfers/withdrawal-request': { 'bulk': false }, // todo
                        'v1/keys': { 'bulk': false },
                        'v1/orders/cancel-all-after': { 'bulk': false },
                        'v1/orders/bulk': { 'bulk': true },
                        // ----------------------------------------------
                    },
                    'patch': {
                        'v1/orders/{order_id}': { 'bulk': false },
                        // Not unified ----------------------------------
                        'v1/orders/bulk': { 'bulk': true },
                        // ----------------------------------------------
                    },
                    'delete': {
                        'v1/orders': { 'bulk': false },
                        'v1/orders/{order_id}': { 'bulk': false },
                        'v1/orders/bulk': { 'bulk': true },
                        // Not unified ----------------------------------
                        'v1/keys/{key}': { 'bulk': false },
                        // ----------------------------------------------
                    },
                },
            },
            'fees': {
                // todo
            },
            'precisionMode': TICK_SIZE,
            // exchange-specific options
            'options': {
                // todo
            },
            'exceptions': {
                // https://trade-docs.coinlist.co/?javascript--nodejs#message-codes
                'exact': {
                    '400': AuthenticationError, // {"status":400,"message":"invalid signature","message_code":"AUTH_SIG_INVALID"}
                    '401': AuthenticationError, // Unauthorized
                    // to do: add
                },
                'broad': {
                    // to do: add
                },
            },
        });
    }

    calculateRateLimiterCost (api, method, path, params, config = {}) {
        if (config['bulk']) {
            const length = params.length;
            return Math.ceil (length / 2);
        }
        return 1;
    }

    async fetchTime (params = {}) {
        /**
         * @method
         * @name coinlist#fetchTime
         * @description fetches the current integer timestamp in milliseconds from the exchange server
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {int} the current integer timestamp in milliseconds from the exchange server
         */
        const response = await this.publicGetV1Time (params);
        //
        //     {
        //         "epoch": 1698087996.039,
        //         "iso": "2023-10-23T19:06:36.039Z"
        //     }
        //
        const string = this.safeString (response, 'iso');
        return this.parse8601 (string);
    }

    async fetchCurrencies (params = {}) {
        /**
         * @method
         * @name coinlist#fetchCurrencies
         * @description fetches all available currencies on an exchange
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object} an associative dictionary of currencies
         */
        const response = await this.publicGetV1Assets (params);
        //
        //     {
        //         "assets": [
        //             {
        //                 "asset": "AAVE",
        //                 "index_code": ".AAVEUSD",
        //                 "decimal_places": 18,
        //                 "min_withdrawal": "1.0000",
        //                 "is_transferable": true,
        //                 "is_visible": true
        //             },
        //             {
        //                 "asset": "ALGO",
        //                 "index_code": ".ALGOUSD",
        //                 "decimal_places": 6,
        //                 "min_withdrawal": "1.0000",
        //                 "is_transferable": true,
        //                 "is_visible": true
        //             }
        //         ]
        //     }
        //
        const currencies = this.safeValue (response, 'assets', []);
        const result = {};
        for (let i = 0; i < currencies.length; i++) {
            const currency = currencies[i];
            const id = this.safeString (currency, 'asset');
            const code = this.safeCurrencyCode (id);
            const isTransferable = this.safeValue (currency, 'is_transferable', false);
            const withdrawEnabled = isTransferable;
            const depositEnabled = isTransferable;
            const active = isTransferable;
            const minWithdrawal = this.safeString (currency, 'min_withdrawal', undefined);
            result[code] = {
                'id': id,
                'code': code,
                'name': undefined,
                'info': currency,
                'active': active,
                'deposit': depositEnabled,
                'withdraw': withdrawEnabled,
                'fee': undefined,
                'precision': undefined, // todo: check
                'limits': {
                    'amount': { 'min': undefined, 'max': undefined },
                    'withdraw': { 'min': minWithdrawal, 'max': undefined },
                },
            };
        }
        return result;
    }

    async fetchMarkets (params = {}) {
        /**
         * @method
         * @name coinlist#fetchMarkets
         * @description retrieves data on all markets for coinlist
         * @param {object} [params] extra parameters specific to the exchange api endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const response = await this.publicGetV1Symbols (params);
        //
        //     {
        //         symbols: [
        //             {
        //                 symbol: 'CQT-USDT',
        //                 base_currency: 'CQT',
        //                 is_trader_geofenced: false,
        //                 list_time: '2021-06-15T00:00:00.000Z',
        //                 type: 'spot',
        //                 series_code: 'CQT-USDT-SPOT',
        //                 long_name: 'Covalent',
        //                 asset_class: 'CRYPTO',
        //                 minimum_price_increment: '0.0001',
        //                 minimum_size_increment: '0.0001',
        //                 quote_currency: 'USDT',
        //                 index_code: null,
        //                 price_band_threshold_market: '0.05',
        //                 price_band_threshold_limit: '0.25',
        //                 last_price: '0.12160000',
        //                 fair_price: '0.12300000',
        //                 index_price: null
        //             },
        //         ]
        //     }
        //
        const markets = this.safeValue (response, 'symbols');
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            const market = markets[i];
            const id = this.safeString (market, 'symbol');
            const baseId = this.safeString (market, 'base_currency');
            const quoteId = this.safeString (market, 'quote_currency');
            const base = this.safeCurrencyCode (baseId);
            const quote = this.safeCurrencyCode (quoteId);
            const amountPrecision = this.safeString (market, 'minimum_size_increment');
            const pricePrecision = this.safeString (market, 'minimum_price_increment');
            const created = this.safeString (market, 'list_time');
            result.push ({
                'id': id,
                'symbol': base + '/' + quote,
                'base': base,
                'quote': quote,
                'settle': undefined,
                'baseId': baseId,
                'quoteId': quoteId,
                'settleId': undefined,
                'type': 'spot',
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'active': true, // todo: check
                'contract': false,
                'linear': undefined,
                'inverse': undefined,
                'taker': undefined,
                'maker': undefined,
                'contractSize': undefined,
                'expiry': undefined,
                'expiryDatetime': undefined,
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'amount': this.parseNumber (amountPrecision),
                    'price': this.parseNumber (pricePrecision),
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'amount': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'price': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'created': this.parse8601 (created),
                'info': market,
            });
        }
        this.setMarkets (result);
        return result;
    }

    async fetchTickers (symbols: string[] = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#fetchTickers
         * @description fetches price tickers for multiple markets, statistical calculations with the information calculated over the past 24 hours each market
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#ticker-structure}
         */
        await this.loadMarkets ();
        const request = {};
        const tickers = await this.publicGetV1SymbolsSummary (this.extend (request, params));
        //
        //     {
        //         "MATIC-USD": {
        //             "type":"spot",
        //             "last_price":"0.60990000",
        //             "lowest_ask":"0.61190000",
        //             "highest_bid":"0.60790000",
        //             "last_trade": {
        //                 "price":"0.60000000",
        //                 "volume":"2.0000",
        //                 "imbalance":"198.0000",
        //                 "logicalTime":"2023-10-22T23:02:25.000Z",
        //                 "auctionCode":"MATIC-USD-2023-10-22T23:02:25.000Z"
        //         },
        //             "volume_base_24h":"34.0555",
        //             "volume_quote_24h":"19.9282",
        //             "price_change_percent_24h":"7.50925436",
        //             "highest_price_24h":"0.68560000",
        //             "lowest_price_24h":"0.55500000"
        //         },
        //     }
        //
        return this.parseTickers (tickers, symbols, params);
    }

    async fetchTicker (symbol: string, params = {}) {
        /**
         * @method
         * @name coinlist#fetchTicker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object} a [ticker structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#ticker-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const ticker = await this.publicGetV1SymbolsSymbolSummary (this.extend (request, params));
        //
        //     {
        //         "type":"spot",
        //         "last_price":"31125.00000000",
        //         "lowest_ask":"31349.99000000",
        //         "highest_bid":"30900.00000000",
        //         "last_trade": {
        //             "price":"31000.00000000",
        //             "volume":"0.0003",
        //             "imbalance":"0.0000",
        //             "logicalTime":"2023-10-23T16:57:15.000Z",
        //             "auctionCode":"BTC-USDT-2023-10-23T16:57:15.000Z"
        //         },
        //         "volume_base_24h":"0.3752",
        //         "volume_quote_24h":"11382.7181",
        //         "price_change_percent_24h":"3.66264694",
        //         "highest_price_24h":"31225.12000000",
        //         "lowest_price_24h":"29792.81000000"
        //     }
        //
        return this.parseTicker (ticker, market);
    }

    parseTicker (ticker, market = undefined) {
        //
        //     {
        //         "type":"spot",
        //         "last_price":"0.60990000",
        //         "lowest_ask":"0.61190000",
        //         "highest_bid":"0.60790000",
        //         "last_trade": {
        //             "price":"0.60000000",
        //             "volume":"2.0000",
        //             "imbalance":"198.0000",
        //             "logicalTime":"2023-10-22T23:02:25.000Z",
        //             "auctionCode":"MATIC-USD-2023-10-22T23:02:25.000Z"
        //          },
        //         "volume_base_24h":"34.0555",
        //         "volume_quote_24h":"19.9282",
        //         "price_change_percent_24h":"7.50925436",
        //         "highest_price_24h":"0.68560000",
        //         "lowest_price_24h":"0.55500000"
        //     }
        //
        // todo: check for open price and volumes
        const lastTrade = this.safeValue (ticker, 'last_trade');
        const timestamp = this.parse8601 (this.safeString (lastTrade, 'logicalTime'));
        const bid = this.safeString (ticker, 'highest_bid');
        const ask = this.safeString (ticker, 'lowest_ask');
        const baseVolume = this.safeString (ticker, 'volume_base_24h');
        const quoteVolume = this.safeString (ticker, 'volume_quote_24h');
        const high = this.safeString (ticker, 'highest_price_24h');
        const low = this.safeString (ticker, 'lowest_price_24h');
        const close = this.safeString (ticker, 'last_price');
        const changePcnt = this.safeString (ticker, 'price_change_percent_24h');
        return this.safeTicker ({
            'symbol': market['symbol'],
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'open': undefined,
            'high': high,
            'low': low,
            'close': close,
            'bid': bid,
            'bidVolume': undefined,
            'ask': ask,
            'askVolume': undefined,
            'vwap': undefined,
            'previousClose': undefined,
            'change': undefined,
            'percentage': changePcnt,
            'average': undefined,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'info': ticker,
        }, market);
    }

    async fetchOrderBook (symbol: string, limit: Int = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#fetchOrderBook
         * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @param {string} symbol unified symbol of the market to fetch the order book for
         * @param {int} [limit] the maximum amount of order book entries to return (default 100, max 200)
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object} A dictionary of [order book structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-book-structure} indexed by market symbols
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.publicGetV1SymbolsSymbolBook (this.extend (request, params));
        //
        //     {
        //         "bids": [
        //             [ "30900.00000000", "0.0001" ],
        //             [ "30664.21000000", "0.0172" ],
        //             [ "30664.20000000", "0.0906" ],
        //         ],
        //         "asks": [
        //             [ "31349.99000000", "0.0003" ],
        //             [ "31350.00000000", "0.0023" ],
        //             [ "31359.33000000", "0.0583" ],
        //         ],
        //         "after_auction_code": "BTC-USDT-2023-10-23T18:40:51.000Z",
        //         "call_time": "2023-10-23T18:40:51.068Z",
        //         "logical_time": "2023-10-23T18:40:51.000Z"
        //     }
        //
        const logical_time = this.parse8601 (this.safeString (response, 'logical_time')); // todo: check what time to use
        const call_time = this.parse8601 (this.safeString (response, 'call_time'));
        const orderbook = this.parseOrderBook (response, symbol, logical_time);
        orderbook['nonce'] = call_time;
        return orderbook;
    }

    async fetchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#fetchOHLCV
         * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int} [since] timestamp in ms of the earliest candle to fetch
         * @param {int} [limit] the maximum amount of candles to fetch
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const granularity = this.safeString (this.timeframes, timeframe);
        const request = {
            'symbol': market['id'],
            'granularity': granularity,
        };
        if (since !== undefined) {
            request['start_time'] = this.iso8601 (since);
            if (limit !== undefined) {
                const duration = this.parseTimeframe (timeframe) * 1000;
                request['end_time'] = this.iso8601 (this.sum (since, duration * (limit)));
            } else {
                request['end_time'] = this.iso8601 (this.milliseconds ());
            }
        }
        const response = await this.publicGetV1SymbolsSymbolCandles (this.extend (request, params));
        //
        //     {
        //         "candles": [
        //             [
        //                 "2023-10-17T15:00:00.000Z",
        //                 "28522.96000000",
        //                 "28522.96000000",
        //                 "28522.96000000",
        //                 "28522.96000000",
        //                 "0.1881",
        //                 null
        //             ],
        //             [
        //                 "2023-10-17T15:30:00.000Z",
        //                 "28582.64000000",
        //                 "28582.64000000",
        //                 "28582.64000000",
        //                 "28582.64000000",
        //                 "0.0050",
        //                 null
        //             ]
        //         ]
        //     }
        //
        const candles = this.safeValue (response, 'candles', []);
        return this.parseOHLCVs (candles, market, timeframe, since, limit);
    }

    parseOHLCV (ohlcv, market = undefined) {
        //
        //     [
        //         "2023-10-17T15:30:00.000Z",
        //         "28582.64000000",
        //         "28582.64000000",
        //         "28582.64000000",
        //         "28582.64000000",
        //         "0.0050",
        //         null
        //     ]
        //
        return [
            this.parse8601 (this.safeString (ohlcv, 0)),
            this.safeNumber (ohlcv, 1),
            this.safeNumber (ohlcv, 2),
            this.safeNumber (ohlcv, 3),
            this.safeNumber (ohlcv, 4),
            this.safeNumber (ohlcv, 5),
        ];
    }

    async fetchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#fetchTrades
         * @description get the list of most recent trades for a particular symbol
         * @param {string} symbol unified symbol of the market to fetch trades for
         * @param {int} [since] timestamp in ms of the earliest trade to fetch
         * @param {int} [limit] the maximum amount of trades to fetch (default 200, max 500)
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {Trade[]} a list of [trade structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#public-trades}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        if (since !== undefined) {
            request['start_time'] = this.iso8601 (since);
        }
        if (limit !== undefined) {
            request['count'] = limit;
        }
        const response = await this.publicGetV1SymbolsSymbolAuctions (this.extend (request, params));
        //
        //     {
        //         "auctions": [
        //             {
        //                 "symbol":"BTC-USDT",
        //                 "auction_code":"BTC-USDT-2023-10-01T08:05:56.000Z",
        //                 "price":"27241.53000000",
        //                 "volume":"0.0052",
        //                 "imbalance":"-1.0983",
        //                 "logical_time":"2023-10-01T08:05:56.000Z",
        //                 "call_time":"2023-10-01T08:05:56.068Z"
        //             },
        //             {
        //                 "symbol":"BTC-USDT",
        //                 "auction_code":"BTC-USDT-2023-10-01T08:09:09.000Z",
        //                 "price":"27236.83000000",
        //                 "volume":"0.0283",
        //                 "imbalance":"-1.0754",
        //                 "logical_time":"2023-10-01T08:09:09.000Z",
        //                 "call_time":"2023-10-01T08:09:09.078Z"
        //             }
        //         ]
        //     }
        //
        const auctions = this.safeValue (response, 'auctions', []);
        return this.parseTrades (auctions, market, since, limit);
    }

    parseTrade (trade, market = undefined) {
        //
        // fetchTrades
        //     {
        //         "symbol": "BTC-USDT",
        //         "auction_code": "BTC-USDT-2023-10-01T08:05:56.000Z",
        //         "price": "27241.53000000",
        //         "volume": "0.0052",
        //         "imbalance": "-1.0983",
        //         "logical_time": "2023-10-01T08:05:56.000Z",
        //         "call_time": "2023-10-01T08:05:56.068Z"
        //     }
        //
        // fetchMyTrades
        //     {
        //         symbol: 'ETH-USDT',
        //         auction_code: 'ETH-USDT-2023-10-20T13:22:14.000Z',
        //         order_id: '83ed365f-497d-433b-96c1-9d08c1a12842',
        //         quantity: '0.0008',
        //         price: '1615.24000000',
        //         fee: '0.005815',
        //         fee_type: 'taker',
        //         fee_currency: 'USDT',
        //         logical_time: '2023-10-20T13:22:14.000Z'
        //     }
        //
        const marketId = this.safeString (trade, 'symbol');
        market = this.safeMarket (marketId, market);
        const symbol = market['symbol'];
        const id = this.safeString (trade, 'auction_code');
        const timestamp = this.parse8601 (this.safeString (trade, 'logical_time')); // todo: find out what time is good
        const priceString = this.safeString (trade, 'price');
        const amountString = this.safeString2 (trade, 'volume', 'quantity');
        const order = this.safeString (trade, 'order_id', undefined);
        let fee = undefined;
        let side = undefined;
        const feeCost = this.safeString (trade, 'fee', undefined);
        if (feeCost !== undefined) {
            // only in fetchMyTrades
            const amountIsPositive = Precise.stringGt (amountString, '0');
            if (amountIsPositive) {
                side = 'buy';
            } else {
                side = 'sell';
            }
            fee = {
                'cost': feeCost,
                'currency': this.safeString (trade, 'fee_currency', undefined),
            };
        }
        const takerOrMaker = this.safeString (trade, 'fee_type', undefined);
        return this.safeTrade ({
            'id': id,
            'order': order,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'type': undefined,
            'side': side,
            'takerOrMaker': takerOrMaker,
            'price': priceString,
            'amount': amountString,
            'cost': undefined,
            'fee': fee,
            'info': trade,
        }, market);
    }

    async fetchTradingFees (params = {}) {
        /**
         * @method
         * @name coinlist#fetchTradingFees
         * @description fetch the trading fees for multiple markets
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object} a dictionary of [fee structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#fee-structure} indexed by market symbols
         */
        await this.loadMarkets ();
        const response = await this.privateGetV1Fees (params);
        //
        //     {
        //         fees_by_symbols: {
        //             'BTC-USD,BTC-USDT,ETH-USD,ETH-USDT,ETH-BTC,AAVE-USD,AAVE-USDT,ALGO-USD,ALGO-USDT,AVAX-USD,AVAX-USDT,BICO-USD,BICO-USDT,BLD-USD,BLD-USDT,BTRST-USDT,BZZ-USDT,CELO-USD,CELO-BTC,CFG-USD,CFG-USDT,CLV-USDT,COMP-USD,COMP-USDT,CYBER-USDT,CQT-USDT,CSPR-USD,CSPR-USDT,CUSD-USD,CUSD-USDC,DOGE-USD,DOGE-USDT,DOT-USD,DOT-USDT,EFI-USDT,FIL-USD,FIL-USDT,FLOW-USD,FLOW-USDT,GAL-USD,GAL-USDT,GODS-USDT,GOG-USDT,HMT-USD,HMT-USDT,ICP-USD,ICP-USDT,IMX-USD,IMX-USDT,LINK-USD,LINK-USDT,MATIC-USD,MATIC-USDT,MINA-USD,MINA-USDT,MKR-USD,MKR-USDT,NEON-USDT,NYM-USD,NYM-USDT,OCEAN-USD,OXT-USD,ROSE-USD,ROSE-USDT,SKL-USD,SKL-USDT,SOL-USD,SOL-USDT,STX-USDT,SUI-USDT,T-USDT,UNI-USD,UNI-USDT,USDT-USD,VEGA-USDT,WAXL-USD,WAXL-USDT,WBTC-BTC,WCFG-USD,WCFG-USDT,XTZ-USD': {
        //                 base: {
        //                     fees: { maker: '0', taker: '0.0045', liquidation: '0' },
        //                     floors: { maker: null, taker: null }
        //                 },
        //                 volume_tier_1: {
        //                     fees: { maker: '0', taker: '0.003', liquidation: '0' },
        //                     floors: { maker: null, taker: null }
        //                 },
        //                 volume_tier_2: {
        //                     fees: { maker: '0', taker: '0.0025', liquidation: '0' },
        //                     floors: { maker: null, taker: null }
        //                 },
        //                 volume_tier_3: {
        //                     fees: { maker: '0', taker: '0.002', liquidation: '0' },
        //                     floors: { maker: null, taker: null }
        //                 },
        //                 volume_tier_4: {
        //                     fees: { maker: '0', taker: '0.0018', liquidation: '0' },
        //                     floors: { maker: null, taker: null }
        //                 },
        //                 volume_tier_5: {
        //                     fees: { maker: '0', taker: '0.0018', liquidation: '0' },
        //                     floors: { maker: null, taker: null }
        //                 },
        //                 volume_tier_6: {
        //                     fees: { maker: '0', taker: '0.0016', liquidation: '0' },
        //                     floors: { maker: null, taker: null }
        //                 },
        //                 volume_tier_7: {
        //                     fees: { maker: '0', taker: '0.0013', liquidation: '0' },
        //                     floors: { maker: null, taker: null }
        //                 },
        //                 volume_tier_8: {
        //                     fees: { maker: '0', taker: '0.0012', liquidation: '0' },
        //                     floors: { maker: null, taker: null }
        //                 },
        //                 volume_tier_9: {
        //                     fees: { maker: '0', taker: '0.001', liquidation: '0' },
        //                     floors: { maker: null, taker: null }
        //                 }
        //                 volume_tier_10: {
        //                     fees: { maker: '0', taker: '0.0005', liquidation: '0' },
        //                     floors: { maker: null, taker: null }
        //                 },
        //                 volume_tier_11: {
        //                     fees: { maker: '0', taker: '0.0005', liquidation: '0' },
        //                     floors: { maker: null, taker: null }
        //                 },
        //             }
        //         }
        //     }
        //
        // todo: parse the response
        return response;
    }

    async fetchAccounts (params = {}) {
        /**
         * @method
         * @name coinlist#fetchAccounts
         * @description fetch all the accounts associated with a profile
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object} a dictionary of [account structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#account-structure} indexed by the account type
         */
        await this.loadMarkets ();
        const response = await this.privateGetV1Accounts (params);
        //
        //     {
        //         "accounts": [
        //             {
        //                 "trader_id": "b18507ce-7d55-4bf1-b12a-0ccca5b90936",
        //                 "name": "string"
        //             }
        //         ]
        //     }
        //
        const accounts = this.safeValue (response, 'accounts', []);
        return this.parseAccounts (accounts, params);
    }

    parseAccount (account) {
        //
        //     {
        //         "trader_id": "b18507ce-7d55-4bf1-b12a-0ccca5b90936",
        //         "name": "string"
        //     }
        //
        return {
            'id': this.safeString (account, 'trader_id'),
            'type': undefined,
            'code': undefined,
            'info': account,
        };
    }

    async fetchBalance (params = {}) {
        /**
         * @method
         * @name coinlist#fetchBalance
         * @description query for balance and get the amount of funds available for trading or funds locked in orders
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object} a [balance structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#balance-structure}
         */
        await this.loadMarkets ();
        const response = await this.privateGetV1Balances (params);
        return this.parseBalance (response);
    }

    parseBalance (response) {
        //
        //     {
        //         "asset_balances": {
        //             "BTC": "0.00308696",
        //             "ETH": "20.000000000000000000"
        //         },
        //         "asset_holds": {
        //             "BTC": "0.00000000",
        //             "ETH": "1.000000000000000000"
        //         },
        //         "net_liquidation_value_usd": "string"
        //     }
        //
        const timestamp = this.milliseconds ();
        const result = {
            'info': response,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
        };
        const totalBalances = this.safeValue (response, 'asset_balances', {});
        const usedBalances = this.safeValue (response, 'asset_holds', {});
        const currencyIds = Object.keys (totalBalances);
        for (let i = 0; i < currencyIds.length; i++) {
            const currencyId = currencyIds[i];
            const code = this.safeCurrencyCode (currencyId);
            const account = this.account ();
            account['total'] = this.safeString (totalBalances, currencyId);
            account['used'] = this.safeString (usedBalances, currencyId, '0');
            result[code] = account;
        }
        return this.safeBalance (result);
    }

    async fetchMyTrades (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#fetchMyTrades
         * @description fetch all trades made by the user
         * @param {string} symbol unified market symbol
         * @param {int} [since] the earliest time in ms to fetch trades for
         * @param {int} [limit] the maximum number of trades structures to retrieve (default 200, max 500)
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {Trade[]} a list of [trade structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#trade-structure}
         */
        await this.loadMarkets ();
        const request = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['start_time'] = this.iso8601 (since);
        }
        if (limit !== undefined) {
            request['count'] = limit;
        }
        const response = await this.privateGetV1Fills (this.extend (request, params));
        //
        //     {
        //         fills: [
        //             {
        //                 symbol: 'ETH-USDT',
        //                 auction_code: 'ETH-USDT-2023-10-20T13:16:30.000Z',
        //                 order_id: '39911d5f-c789-4a7d-ad34-820a804d1da6',
        //                 quantity: '-0.0009',
        //                 price: '1608.83000000',
        //                 fee: '0.006516',
        //                 fee_type: 'taker',
        //                 fee_currency: 'USDT',
        //                 logical_time: '2023-10-20T13:16:30.000Z'
        //             },
        //             {
        //                 symbol: 'ETH-USDT',
        //                 auction_code: 'ETH-USDT-2023-10-20T13:22:14.000Z',
        //                 order_id: '83ed365f-497d-433b-96c1-9d08c1a12842',
        //                 quantity: '0.0008',
        //                 price: '1615.24000000',
        //                 fee: '0.005815',
        //                 fee_type: 'taker',
        //                 fee_currency: 'USDT',
        //                 logical_time: '2023-10-20T13:22:14.000Z'
        //             },
        //         ]
        //     }
        //
        const fills = this.safeValue (response, 'fills', []);
        return this.parseTrades (fills, market, since, limit);
    }

    async fetchOrderTrades (id: string, symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#fetchOrderTrades
         * @description fetch all the trades made from a single order
         * @param {string} id order id
         * @param {string} symbol unified market symbol
         * @param {int} [since] the earliest time in ms to fetch trades for
         * @param {int} [limit] the maximum number of trades to retrieve
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object[]} a list of [trade structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#trade-structure}
         */
        const request = {
            'order_id': id,
        };
        return await this.fetchMyTrades (symbol, since, limit, this.extend (request, params));
    }

    async fetchOrders (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#fetchOrders
         * @description fetches information on multiple orders made by the user
         * @param {string} symbol unified market symbol of the market orders were made in
         * @param {int} [since] the earliest time in ms to fetch orders for
         * @param {int} [limit] the maximum number of  orde structures to retrieve (default 200, max 500)
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {Order[]} a list of [order structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        await this.loadMarkets ();
        let status = this.safeString (params, 'status', undefined) as any;
        if (status === undefined) {
            status = [ 'accepted', 'done', 'canceled', 'rejected', 'pending' ];
        }
        const request = {
            'status': status,
        };
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['start_time'] = this.iso8601 (since);
        }
        if (limit !== undefined) {
            request['count'] = limit;
        }
        const response = await this.privateGetV1Orders (this.extend (request, params));
        //
        //     {
        //         "orders":[
        //             {
        //                 "order_id":"913ea6e7-9fc9-43fb-9db1-f195d3baa93f",
        //                 "price":"35800.00000000",
        //                 "stop_price":null,
        //                 "cost":"0.00000000",
        //                 "fill_fees":"0.00000000",
        //                 "trader_id":"9c6f737e-a829-4843-87b1-b1ce86f2853b",
        //                 "status":"accepted",
        //                 "epoch_timestamp":"2023-10-26T08:20:56.307Z",
        //                 "origin":"web",
        //                 "self_trade_prevention":null,
        //                 "client_id":null,
        //                 "created_at":"2023-10-26T08:20:56.307Z",
        //                 "symbol":"BTC-USDT",
        //                 "size":"0.0003",
        //                 "side":"sell",
        //                 "type":"limit",
        //                 "post_only":false,
        //                 "size_filled":"0.0000"
        //             }
        //         ]
        //     }
        //
        // todo: check params:
        // "stop_trigger": "last",
        // "average_fill_price": "string",
        // "peg_price_type": "trailing-stop",
        // "peg_offset_value": "string",
        const orders = this.safeValue (response, 'orders', []);
        return this.parseOrders (orders, market, since, limit);
    }

    async fetchOrder (id: string, symbol: string = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#fetchOrder
         * @description fetches information on an order made by the user
         * @param {int|string} id order id
         * @param {string} symbol not used by coinlist fetchOrder ()
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object} An [order structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        await this.loadMarkets ();
        const request = {
            'order_id': id,
        };
        const response = await this.privateGetV1OrdersOrderId (this.extend (request, params));
        //
        //     {
        //         "order_id": "93101167-9065-4b9c-b98b-5d789a3ed9fe",
        //         "client_id": "string",
        //         "symbol": "string",
        //         "type": "market",
        //         "side": "buy",
        //         "size": "string",
        //         "price": "string",
        //         "stop_price": "string",
        //         "stop_trigger": "last",
        //         "self_trade_prevention": "keep-newest",
        //         "average_fill_price": "string",
        //         "fill_fees": "string",
        //         "size_filled": "string",
        //         "created_at": "2019-08-24T14:15:22Z",
        //         "epoch_timestamp": "2019-08-24T14:15:22Z",
        //         "post_only": true,
        //         "peg_price_type": "trailing-stop",
        //         "peg_offset_value": "string",
        //         "origin": "web",
        //         "status": "pending"
        //     }
        //
        return this.parseOrder (response);
    }

    async fetchOpenOrders (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#fetchOpenOrders
         * @description fetch all unfilled currently open orders
         * @param {string} symbol unified market symbol
         * @param {int} [since] the earliest time in ms to fetch open orders for
         * @param {int} [limit] the maximum number of open order structures to retrieve (default 200, max 500)
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {Order[]} a list of [order structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        await this.loadMarkets ();
        const request = {
            'status': 'accepted',
        };
        return this.fetchOrders (symbol, since, limit, this.extend (request, params));
    }

    async fetchClosedOrders (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#fetchClosedOrders
         * @description fetches information on multiple closed orders made by the user
         * @param {string} symbol unified market symbol of the market orders were made in
         * @param {int} [since] the earliest time in ms to fetch orders for
         * @param {int} [limit] the maximum number of closed order structures to retrieve (default 200, max 500)
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {Order[]} a list of [order structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        await this.loadMarkets ();
        const request = {
            'status': 'done',
        };
        return this.fetchOrders (symbol, since, limit, this.extend (request, params));
    }

    async fetchCanceledOrders (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#fetchCanceledOrders
         * @description fetches information on multiple canceled orders made by the user
         * @param {string} symbol unified market symbol of the market orders were made in
         * @param {int} [since] the earliest time in ms to fetch orders for
         * @param {int} [limit] the maximum number of canceled order structures to retrieve (default 200, max 500)
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object} a list of [order structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        await this.loadMarkets ();
        const request = {
            'status': 'canceled',
        };
        return this.fetchOrders (symbol, since, limit, this.extend (request, params));
    }

    async cancelAllOrders (symbol: string = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#cancelAllOrders
         * @description cancel open orders of market
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object[]} a list of [order structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        await this.loadMarkets ();
        let market = undefined;
        const request = {};
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        const response = await this.privateDeleteV1Orders (this.extend (request, params));
        //
        //     {
        //         message: 'Order cancellation request received.',
        //         timestamp: '2023-10-26T10:29:28.652Z'
        //     }
        //
        return response; // todo: what should it return?
    }

    async cancelOrder (id: string, symbol: string = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#cancelOrder
         * @description cancels an open order
         * @param {string} id order id
         * @param {string} symbol not used by coinlist cancelOrder ()
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object} An [order structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        await this.loadMarkets ();
        const request = {
            'order_id': id,
        };
        const response = await this.privateDeleteV1OrdersOrderId (this.extend (request, params));
        //
        //     {
        //         message: 'Cancel order request received.',
        //         order_id: 'd36e7588-6525-485c-b768-8ad8b3f745f9',
        //         timestamp: '2023-10-26T14:36:37.559Z'
        //     }
        //
        // return this.parseOrder (response);
        return response; // todo: check it
    }

    async cancelOrders (ids, symbol: string = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#cancelOrders
         * @description cancel multiple orders
         * @param {string[]} ids order ids
         * @param {string} symbol not used by coinlist cancelOrders ()
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object} an list of [order structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        await this.loadMarkets ();
        params = ids; // todo: find the way to make bulk methods and implement this one
        const response = await this.privateDeleteV1OrdersBulk (params);
        return response;
    }

    async createOrder (symbol: string, type: OrderType, side: OrderSide, amount, price = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#createOrder
         * @description create a trade order
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit' or 'stop_market' or 'stop_limit' or 'take_market' or 'take_limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much of currency you want to trade in units of base currency
         * @param {float} [price] the price at which the order is to be fullfilled, in units of the quote currency, ignored in market orders
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object} an [order structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
            'type': type,
            'side': side,
            'size': this.numberToString (this.amountToPrecision (symbol, amount)),
        };
        if (type === 'limit' || type === 'stop_limit' || type === 'take_limit') {
            if (price === undefined) {
                throw new ArgumentsRequired (this.id + ' createOrder() requires a price argument for a ' + type + ' order');
            }
            request['price'] = this.numberToString (this.priceToPrecision (symbol, price));
        }
        const postOnly = this.safeValue (params, 'postOnly', false);
        if (postOnly) {
            params = this.omit (params, 'postOnly');
            request['post_only'] = true;
        }
        const stopPrice = this.safeNumber (params, 'stopPrice', undefined);
        if (stopPrice !== undefined) {
            params = this.omit (params, 'stopPrice');
            request['stop_price'] = stopPrice;
            if (type === 'market') {
                request['type'] = 'stop_market';
            } else if (type === 'limit') {
                request['type'] = 'stop_limit';
            }
        }
        const response = await this.privatePostV1Orders (this.extend (request, params));
        //
        //     {
        //         "message": "New order request received.",
        //         "order": {
        //             "symbol": "BTC-USDT",
        //             "type": "market",
        //             "side": "sell",
        //             "size": "0.0003",
        //             "order_id": "cad67c0f-9aec-4ac8-ac03-aaf5db299ff7",
        //             "trader_id": "9c6f737e-a829-4843-87b1-b1ce86f2853b"
        //         },
        //         "timestamp": "2023-10-26T11:30:55.376Z"
        //     }
        //
        const order = this.safeValue (response, 'order', {});
        return this.parseOrder (order, market);
    }

    async editOrder (id: string, symbol, type, side, amount = undefined, price = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#editOrder
         * @description create a trade order
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit' or 'stop_market' or 'stop_limit' or 'take_market' or 'take_limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much of currency you want to trade in units of base currency
         * @param {float} [price] the price at which the order is to be fullfilled, in units of the quote currency, ignored in market orders
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object} an [order structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        await this.loadMarkets ();
        if (amount === undefined) {
            throw new ArgumentsRequired (this.id + ' editOrder() requires an amount argument');
        }
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
            'type': type,
            'side': side,
            'size': this.numberToString (this.amountToPrecision (symbol, amount)),
        };
        if (price !== undefined) {
            request['price'] = this.numberToString (this.priceToPrecision (price, amount));
        }
        const response = await this.privatePatchV1OrdersOrderId (this.extend (request, params));
        return this.parseOrder (response, market);
    }

    parseOrder (order, market = undefined) {
        //
        // fetchOrder
        //     {
        //         "order_id": "913ea6e7-9fc9-43fb-9db1-f195d3baa93f",
        //         "price": "35800.00000000",
        //         "stop_price":null,
        //         "cost": "0.00000000",
        //         "fill_fees": "0.00000000",
        //         "trader_id": "9c6f737e-a829-4843-87b1-b1ce86f2853b",
        //         "status": "canceled",
        //         "epoch_timestamp": "2023-10-26T08:20:56.307Z",
        //         "origin": "web",
        //         "self_trade_prevention":null,
        //         "client_id":null,
        //         "symbol": "BTC-USDT",
        //         "size": "0.0003",
        //         "side": "sell",
        //         "type": "limit",
        //         "post_only":false,
        //         "size_filled": "0.0000"
        //     }
        //
        // fetchOrders
        //     {
        //         "order_id":"913ea6e7-9fc9-43fb-9db1-f195d3baa93f",
        //         "price":"35800.00000000",
        //         "stop_price":null,
        //         "cost":"0.00000000",
        //         "fill_fees":"0.00000000",
        //         "trader_id":"9c6f737e-a829-4843-87b1-b1ce86f2853b",
        //         "status":"accepted",
        //         "epoch_timestamp":"2023-10-26T08:20:56.307Z",
        //         "origin":"web",
        //         "self_trade_prevention":null,
        //         "client_id":null,
        //         "created_at":"2023-10-26T08:20:56.307Z",
        //         "symbol":"BTC-USDT",
        //         "size":"0.0003",
        //         "side":"sell",
        //         "type":"limit",
        //         "post_only":false,
        //         "size_filled":"0.0000"
        //     }
        //
        // createOrder
        //     {
        //         "symbol": "BTC-USDT",
        //         "type": "market",
        //         "side": "sell",
        //         "size": "0.0003",
        //         "order_id": "cad67c0f-9aec-4ac8-ac03-aaf5db299ff7",
        //         "trader_id": "9c6f737e-a829-4843-87b1-b1ce86f2853b"
        //     },
        //
        // cancelOrder
        //     {
        //         message: 'Cancel order request received.',
        //         order_id: 'd36e7588-6525-485c-b768-8ad8b3f745f9',
        //         timestamp: '2023-10-26T14:36:37.559Z'
        //     }
        //
        // cancelOrders
        //     {
        //         message: 'Order cancellation request received.',
        //         timestamp: '2023-10-26T10:29:28.652Z'
        //     }
        //
        const id = this.safeString (order, 'order_id');
        const marketId = this.safeString (order, 'symbol');
        market = this.safeMarket (marketId, market);
        const clientOrderId = this.safeString (order, 'client_id', undefined);
        let timestampString = this.safeString2 (order, 'created_at', 'epoch_timestamp', undefined);
        if (timestampString === undefined) {
            timestampString = this.safeString (order, 'timestamp', undefined);
        }
        const timestamp = this.parse8601 (timestampString);
        const status = this.parseOrderStatus (this.safeString (order, 'status'));
        const type = this.parseOrderType (this.safeString (order, 'type'));
        const side = this.safeString (order, 'side');
        const price = this.safeString (order, 'price', undefined);
        const stopPrice = this.safeString (order, 'stop_price', undefined);
        const average = this.safeString (order, 'average_fill_price');
        const amount = this.safeString (order, 'size');
        const filled = this.safeString (order, 'size_filled');
        const feeCost = this.safeString (order, 'fill_fees');
        const fee = {
            'currency': 'USD',
            'cost': feeCost,
            'rate': undefined,
        };
        return this.safeOrder ({
            'id': id,
            'clientOrderId': clientOrderId,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': undefined,
            'status': status,
            'symbol': market['symbol'],
            'type': type,
            'timeInForce': 'GTC',
            'side': side,
            'price': price,
            'stopPrice': stopPrice,
            'triggerPrice': stopPrice,
            'average': average,
            'amount': amount,
            'cost': undefined,
            'filled': filled,
            'remaining': undefined,
            'fee': fee,
            'trades': undefined,
            'info': order,
        }, market);
    }

    parseOrderStatus (status) {
        const statuses = {
            'pending': 'open', // todo: check
            'accepted': 'open',
            'rejected': 'rejected',
            'done': 'closed',
            'canceled': 'canceled',
        };
        return this.safeString (statuses, status, status);
    }

    parseOrderType (status) {
        const statuses = {
            'market': 'market',
            'limit': 'limit',
            'stop_market': 'market',
            'stop_limit': 'limit',
            'take_market': 'market',
            'take_limit': 'limit',
        };
        return this.safeString (statuses, status, status);
    }

    async transfer (code: string, amount, fromAccount, toAccount, params = {}) {
        /**
         * @method
         * @name coinlist#transfer
         * @description transfer currency internally between wallets on the same account
         * @param {string} code unified currency code
         * @param {float} amount amount to transfer
         * @param {string} fromAccount account to transfer from
         * @param {string} toAccount account to transfer to
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object} a [transfer structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#transfer-structure}
         */
        await this.loadMarkets ();
        const currency = this.currency (code);
        amount = this.currencyToPrecision (code, amount);
        const request = {
            'from_trader_id': fromAccount,
            'to_trader_id': toAccount,
            'asset': currency['id'],
            'amount': amount,
        };
        const response = await this.privatePostV1TransfersInternalTransfer (this.extend (request, params));
        //
        //     {
        //         "message": "string",
        //         "message_code": "string",
        //         "message_details": {}
        //     }
        //
        // todo: find out how to create additional account and check this method
        const transfer = this.parseTransfer (response, currency);
        return transfer;
    }

    async fetchTransfers (code: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        /**
         * @method
         * @name coinlist#fetchTransfers
         * @description fetch a history of internal transfers between CoinList.co and CoinList Pro. It does not return external deposits or withdrawals
         * @param {string} code unified currency code of the currency transferred
         * @param {int} [since] the earliest time in ms to fetch transfers for
         * @param {int} [limit] the maximum number of  transfers structures to retrieve (default 200, max 500)
         * @param {object} [params] extra parameters specific to the coinlist api endpoint
         * @returns {object[]} a list of [transfer structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#transfer-structure}
         */
        await this.loadMarkets ();
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
        }
        const request = {};
        if (since !== undefined) {
            request['start_time'] = this.iso8601 (since);
        }
        if (limit !== undefined) {
            request['count'] = limit;
        }
        const response = await this.privateGetV1Transfers (this.extend (request, params));
        //
        //     {
        //         "transfers": [
        //             {
        //                 "transfer_id": "2c02db25-e8f2-4271-8222-e110bfd0aa2a",
        //                 "created_at": "2023-10-20T13:15:37.000Z",
        //                 "confirmed_at": "2023-10-20T13:15:37.000Z",
        //                 "asset": "ETH",
        //                 "amount": "0.010000000000000000",
        //                 "status": "confirmed"
        //             },
        //             {
        //                 "transfer_id": "890694db-156c-4e93-a3ef-4db61685aca7",
        //                 "created_at": "2023-10-26T14:32:22.000Z",
        //                 "confirmed_at": "2023-10-26T14:32:22.000Z",
        //                 "asset": "USD",
        //                 "amount": "-3.00",
        //                 "status": "confirmed"
        //             }
        //         ]
        //     }
        //
        const transfers = this.safeValue (response, 'transfers', []);
        return this.parseTransfers (transfers, currency, since, limit);
    }

    parseTransfer (transfer, currency = undefined) {
        // fetchTransfers
        //     {
        //         "transfer_id": "890694db-156c-4e93-a3ef-4db61685aca7",
        //         "created_at": "2023-10-26T14:32:22.000Z",
        //         "confirmed_at": "2023-10-26T14:32:22.000Z",
        //         "asset": "USD",
        //         "amount": "-3.00",
        //         "status": "confirmed"
        //     }
        //
        // todo for transfer ()
        const currencyId = this.safeString (transfer, 'asset');
        const confirmedAt = this.safeString (transfer, 'confirmed_at');
        const timetstamp = this.parse8601 (confirmedAt);
        const status = this.safeString (transfer, 'status');
        return {
            'info': transfer,
            'id': this.safeString (transfer, 'transfer_id'),
            'timestamp': timetstamp,
            'datetime': this.iso8601 (timetstamp),
            'currency': this.safeCurrencyCode (currencyId, currency),
            'amount': this.safeNumber (transfer, 'amount'),
            'fromAccount': undefined,
            'toAccount': undefined,
            'status': this.parseTransferStatus (status),
        };
    }

    parseTransferStatus (status) {
        const statuses = {
            'confirmed': 'ok',
        };
        return this.safeString (statuses, status, status);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const request = this.omit (params, this.extractParams (path));
        const endpoint = '/' + this.implodeParams (path, params);
        let url = this.urls['api'][api] + endpoint;
        const query = this.urlencode (request);
        if (api === 'private') {
            this.checkRequiredCredentials ();
            const timestamp = this.seconds ().toString ();
            let auth = timestamp + method + endpoint;
            if (method === 'POST' || method === 'PATCH') {
                body = this.json (request);
                auth += body;
            } else if (query.length !== 0) {
                auth += '?' + query;
                url += '?' + query;
            }
            const signature = this.hmac (this.encode (auth), this.base64ToBinary (this.secret), sha256, 'base64');
            headers = {
                'CL-ACCESS-KEY': this.apiKey,
                'CL-ACCESS-SIG': signature,
                'CL-ACCESS-TIMESTAMP': timestamp,
                'Content-Type': 'application/json',
            };
        } else if (query.length !== 0) {
            url += '?' + query;
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}
