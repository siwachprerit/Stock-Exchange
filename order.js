class OrderBook {
    constructor(symbol = "BTCUSD") {
        this.symbol = symbol;
        this.bids = [];
        this.asks = [];
        this._nextId = 1;
        this.lastTradePrice = null;
    }

    _getOrderId() {
        return this._nextId++;
    }

    _sort(side) {
        if (side === "BUY") {
            this.bids.sort((a, b) => {
                if (a.price !== b.price) return b.price - a.price;
                return a.timestamp - b.timestamp;
            });
        } else if (side === "SELL") {
            this.asks.sort((a, b) => {
                if (a.price !== b.price) return a.price - b.price;
                return a.timestamp - b.timestamp;
            });
        }
    }

    placeOrder(symbol, side, type, price = null, quantity, user) {
        let order = {
            orderId: this._getOrderId(),
            symbol: this.symbol,
            side,
            type,
            price,
            orignQty: quantity,
            remaingQty: quantity,
            exectQty: 0,
            timestamp: Date.now(),
            user
        };

        if (type === "MARKET") {
            let result = this._marketMatch(order);
            if (result.remaingQty > 0) {
                console.log(`Order completed: ${result.exectQty} cancel order: ${result.remaingQty}`);
            }
        } else {
            this._limitMatch(order);
        }
    }

    _marketMatch(order) {
        if (order.side === "BUY") {
            let asksArr = this.asks;
            while (order.remaingQty > 0 && asksArr.length > 0) {
                let top = asksArr[0];
                let orderfill = Math.min(order.remaingQty, top.remaingQty);
                order.exectQty += orderfill;
                order.remaingQty -= orderfill;

                top.exectQty += orderfill;
                top.remaingQty -= orderfill;

                if (top.remaingQty === 0) {
                    asksArr.shift();
                }
            }
        }
        return order;
    }

    _limitMatch(order) {
        if (order.side === "BUY") {
            let opposite = this.asks;
            while (order.remaingQty > 0 && opposite.length > 0) {
                let top = opposite[0];
                if (order.price >= top.price) {
                    let filledOrder = Math.min(order.remaingQty, top.remaingQty);
                    order.remaingQty -= filledOrder;
                    order.exectQty += filledOrder;
                    top.remaingQty -= filledOrder;
                    top.exectQty += filledOrder;
                    if (top.remaingQty <= 0) opposite.shift();
                } else break;
            }
            if (order.remaingQty > 0) {
                this.bids.push(order);
                this._sort("BUY");
            }
        } else if (order.side === "SELL") {
            let opposite = this.bids;
            while (order.remaingQty > 0 && opposite.length > 0) {
                let top = opposite[0];
                if (order.price <= top.price) {
                    let filledOrder = Math.min(order.remaingQty, top.remaingQty);
                    order.remaingQty -= filledOrder;
                    order.exectQty += filledOrder;
                    top.remaingQty -= filledOrder;
                    top.exectQty += filledOrder;
                    if (top.remaingQty <= 0) opposite.shift();
                } else break;
            }
            if (order.remaingQty > 0) {
                this.asks.push(order);
                this._sort("SELL");
            }
        }
    }

    getBookSnapShot() {
        return {
            lastUpdated: Date.now(),
            bids: this.bids.map(o => [o.price, o.remaingQty, o.user]),
            asks: this.asks.map(o => [o.price, o.remaingQty, o.user]),
        };
    }
}

// Testing
let BTCUSDOrderbook = new OrderBook();

console.log(BTCUSDOrderbook.getBookSnapShot());

BTCUSDOrderbook.placeOrder("BTCUSD", "BUY", "LIMIT", 1500.00, 10, "Prerit");
BTCUSDOrderbook.placeOrder("BTCUSD", "BUY", "LIMIT", 1505.00, 20, "Pratham");
BTCUSDOrderbook.placeOrder("BTCUSD", "BUY", "LIMIT", 1506.00, 10, "Pranshu");

console.log("After BUY orders:", BTCUSDOrderbook.getBookSnapShot());

BTCUSDOrderbook.placeOrder("BTCUSD", "SELL", "LIMIT", 1507.00, 10, "Prerit");
BTCUSDOrderbook.placeOrder("BTCUSD", "SELL", "LIMIT", 1508.00, 10, "Pratham");
BTCUSDOrderbook.placeOrder("BTCUSD", "SELL", "LIMIT", 1509.00, 10, "Pranshu");

console.log("After SELL orders:", BTCUSDOrderbook.getBookSnapShot());
