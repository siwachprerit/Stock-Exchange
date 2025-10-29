class OrderBook{
    constructor(symbol="BTCUSD"){
        this.bids=[],
        this.ask=[],
        this._nextId=1,
        this.lastTradePrice=null
    }

    _getOrderId(){
        return this._nextId++;
    }

    _sort(sides){
        if(sides==="BUY"){
            this.bids.sort((a,b)=>{
                if(a.price!=b.price){
                    return b.price-a.price;
                }
                return a.timestamp-b.timestamp;
            })
        }else{
            
        }
    }
}

let BTCUSDOrderbook=new OrderBook()

BTCUSDOrderbook.bids.push({orderId:1,side:"BUY",type:"MARKET",price:100,quantity:10,timestamp:Date.now(),user:"Sharma"})
BTCUSDOrderbook.bids.push({orderId:2,side:"BUY",type:"MARKET",price:98,quantity:10,timestamp:Date.now(),user:"Jindal"})
BTCUSDOrderbook.bids.push({orderId:3,side:"BUY",type:"MARKET",price:93,quantity:10,timestamp:Date.now(),user:"Pakhala"})

BTCUSDOrderbook._sort("Book")
console.log(BTCUSDOrderbook.bids);