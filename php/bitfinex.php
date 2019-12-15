<?php

namespace ccxtpro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception; // a common import
use \ccxt\WebSocketTrait; // websocket functionality

class bitfinex extends \ccxt\bitfinex {

    use WebSocketTrait;

    public function describe () {
        return array_replace_recursive (parent::describe (), array (
            'has' => array (
                'watchTicker' => true,
                'watchOrderBook' => true,
            ),
            'urls' => array (
                'api' => array (
                    'ws' => array (
                        'public' => 'wss://api-pub.bitfinex.com/ws/2',
                        'private' => 'wss://api.bitfinex.com',
                    ),
                ),
            ),
            'options' => array (
                'subscriptionsByChannelId' => array(),
            ),
        ));
    }

    public function watch_order_book ($symbol, $limit = null, $params = array ()) {
        if ($limit !== null) {
            if (($limit !== 25) && ($limit !== 100)) {
                throw new ExchangeError($this->id . ' watchOrderBook $limit argument must be null, 25 or 100');
            }
        }
        $this->load_markets();
        $market = $this->market ($symbol);
        $marketId = $market['id'];
        $url = $this->urls['api']['ws']['public'];
        $channel = 'book';
        $request = array (
            'event' => 'subscribe',
            'channel' => $channel,
            'symbol' => $marketId,
            // 'prec' => 'P0', // string, level of price aggregation, 'P0', 'P1', 'P2', 'P3', 'P4', default P0
            // 'freq' => 'F0', // string, frequency of updates 'F0' = realtime, 'F1' = 2 seconds, default is 'F0'
            // 'len' => '25', // string, number of price points, '25', '100', default = '25'
        );
        if ($limit !== null) {
            $request['limit'] = (string) $limit;
        }
        $messageHash = $channel . ':' . $marketId;
        return $this->watch ($url, $messageHash, array_replace_recursive ($request, $params), $messageHash);
    }

    public function handle_order_book ($client, $message) {
        //
        // first $message (snapshot)
        //
        //     array (
        //         18691, // channel id
        //         array (
        //             array ( 7364.8, 10, 4.354802 ), // price, count, size > 0 = bid
        //             array ( 7364.7, 1, 0.00288831 ),
        //             array ( 7364.3, 12, 0.048 ),
        //             array ( 7364.9, 3, -0.42028976 ), // price, count, size < 0 = ask
        //             array ( 7365, 1, -0.25 ),
        //             array ( 7365.5, 1, -0.00371937 ),
        //         )
        //     )
        //
        // subsequent updates
        //
        //     array (
        //         39393, // channel id
        //         array ( 7138.9, 0, -1 ), // price, count, size, size > 0 = bid, size < 0 = ask
        //     )
        //
        $channelId = (string) $message[0];
        $subscription = $this->safe_value($this->options['subscriptionsByChannelId'], $channelId, array());
        //
        //     {
        //         event => 'subscribed',
        //         channel => 'book',
        //         chanId => 67473,
        //         $symbol => 'tBTCUSD', // v2 id
        //         prec => 'P0',
        //         freq => 'F0',
        //         len => '25',
        //         pair => 'BTCUSD', // v1 id
        //     }
        //
        $marketId = $this->safe_string($subscription, 'pair');
        $market = $this->markets_by_id[$marketId];
        $symbol = $market['symbol'];
        $messageHash = 'book:' . $marketId;
        // if it is an initial snapshot
        if (gettype ($message[1][0]) === 'array' && count (array_filter (array_keys ($message[1][0]), 'is_string')) == 0) {
            $limit = $this->safe_integer($subscription, 'len');
            $this->orderbooks[$symbol] = $this->limitedCountedOrderBook (array(), $limit);
            $orderbook = $this->orderbooks[$symbol];
            $deltas = $message[1];
            for ($i = 0; $i < count ($deltas); $i++) {
                $delta = $deltas[$i];
                $side = ($delta[2] < 0) ? 'asks' : 'bids';
                $bookside = $orderbook[$side];
                $this->handle_delta ($bookside, $delta);
            }
            // the .limit () operation will be moved to the watchOrderBook
            $client->resolve ($orderbook->limit (), $messageHash);
        } else {
            $orderbook = $this->orderbooks[$symbol];
            $side = ($message[1][2] < 0) ? 'asks' : 'bids';
            $bookside = $orderbook[$side];
            $this->handle_delta ($bookside, $message[1]);
            // the .limit () operation will be moved to the watchOrderBook
            $client->resolve ($orderbook->limit (), $messageHash);
        }
    }

    public function handle_delta ($bookside, $delta) {
        $price = $delta[0];
        $count = $delta[1];
        $amount = ($delta[2] < 0) ? -$delta[2] : $delta[2];
        $bookside->store ($price, $amount, $count);
    }

    public function handle_heartbeat ($client, $message) {
        //
        // every second (approx) if no other updates are sent
        //
        //     array( "$event" => "heartbeat" )
        //
        $event = $this->safe_string($message, 'event');
        $client->resolve ($message, $event);
    }

    public function handle_system_status ($client, $message) {
        //
        // todo => answer the question whether handleSystemStatus should be renamed
        // and unified as handleStatus for any usage pattern that
        // involves system status and maintenance updates
        //
        //     {
        //         event => 'info',
        //         version => 2,
        //         serverId => 'e293377e-7bb7-427e-b28c-5db045b2c1d1',
        //         platform => array( status => 1 ), // 1 for operative, 0 for maintenance
        //     }
        //
        return $message;
    }

    public function handle_subscription_status ($client, $message) {
        //
        // todo => answer the question whether handleSubscriptionStatus should be renamed
        // and unified as handleResponse for any usage pattern that
        // involves an identified request/response sequence
        //
        //     {
        //         event => 'subscribed',
        //         channel => 'book',
        //         chanId => 67473,
        //         symbol => 'tBTCUSD',
        //         prec => 'P0',
        //         freq => 'F0',
        //         len => '25',
        //         pair => 'BTCUSD'
        //     }
        //
        // --------------------------------------------------------------------
        //
        $channelId = $this->safe_string($message, 'chanId');
        $this->options['subscriptionsByChannelId'][$channelId] = $message;
        return $message;
    }

    public function sign_ws_message ($client, $messageHash, $message, $params = array ()) {
        // todo => bitfinex signWsMessage not implemented yet
        return $message;
    }

    public function handle_message ($client, $message) {
        // var_dump (new Date (), $message);
        if (gettype ($message) === 'array' && count (array_filter (array_keys ($message), 'is_string')) == 0) {
            $channelId = (string) $message[0];
            $subscription = $this->safe_value($this->options['subscriptionsByChannelId'], $channelId, array());
            $channel = $this->safe_string($subscription, 'channel');
            $methods = array (
                'book' => 'handleOrderBook',
                // 'ohlc' => 'handleOHLCV',
                // 'ticker' => 'handleTicker',
                // 'trade' => 'handleTrades',
            );
            $method = $this->safe_string($methods, $channel);
            if ($method === null) {
                return $message;
            } else {
                return $this->$method ($client, $message);
            }
        } else {
            // todo => add bitfinex handleErrors
            //
            //     {
            //         $event => 'info',
            //         version => 2,
            //         serverId => 'e293377e-7bb7-427e-b28c-5db045b2c1d1',
            //         platform => array( status => 1 ), // 1 for operative, 0 for maintenance
            //     }
            //
            $event = $this->safe_string($message, 'event');
            if ($event !== null) {
                $methods = array (
                    'info' => 'handleSystemStatus',
                    // 'book' => 'handleOrderBook',
                    'subscribed' => 'handleSubscriptionStatus',
                );
                $method = $this->safe_string($methods, $event);
                if ($method === null) {
                    return $message;
                } else {
                    return $this->$method ($client, $message);
                }
            }
        }
    }
}
