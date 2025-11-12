const OrderBook = require("../service/order");
let ob=new OrderBook("BTCUSD"); //global object
const { publisher } = require("../../shared/index");

module.exports.postPlaceOrder=async (req,res)=>{
    let{side,type,price,quantity,user}=req.body;
    let response=ob.placeOrder(side,type,price,quantity,user);
    const book = ob.getBookSnapShot();
    // publisher is already connected in `shared/index.js`.
    // Do not call `connect()` again (raises "Socket already opened").
    // Use the Redis client's `publish` method to send the update.
    await publisher.publish("book_Update", JSON.stringify(book));
    res.json({
        event:"orderupdate",
        data:{
            orderReport:response, 
            book:book
        }
    })

}