var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//Order Schema
var PlacedOrderSchema = mongoose.Schema({

                Item:[
                         {
                            itemName: {
                                 type: String,
                                 trim: true
                             },
                
                             price: {
                                     type: String
                            //          required: true
                             },

                             noOfItems: {
                                        type:Number
                             }             
                         }
                     ],

                 totalCost:{
                        type:String

                 },

                 userEmail:
                 {
                     type : String
                 },

                 restaurantEmail:
                 {
                     type : String
                 },

                 status: { type: Number, 
                     default: 0 
                 },

                 time : { 
                         type : Date,
                          default: Date.now 
                      },
                 
                 deliveryLocation :{
                     type: String
                 }

});

PlacedOrderSchema.index({ restaurantEmail: 1, userEmail: 1}, { unique: true })

var PlacedOrder = module.exports = mongoose.model('PlacedOrder', PlacedOrderSchema);

module.exports.getOrderByEmails = function(remail,email,callback){
    var query = {restaurantEmail: remail,userEmail:email};
    PlacedOrder.findOne(query, callback);

}

module.exports.getOrderByUser = function(email,callback){
    var query = {userEmail:email};
    PlacedOrder.findOne(query, callback);

}

module.exports.getOrderByUserJson = function(email,callback){
    var query = {userEmail:email};
     PlacedOrder.find(query,callback).lean();

}

module.exports.updateOrder = function(remail,uemail,newItem,callback){
    var query = {restaurantEmail: remail,userEmail:uemail};
    
    var newItem= newItem;
    console.log(newItem);

    PlacedOrder.update(
        query, 
        { $push: { Item: newItem } },
        callback
    );
}

module.exports.updateTotalCost = function(remail,uemail,totalCost,callback){
    var query = {restaurantEmail: remail,userEmail:uemail};
    console.log("total "+totalCost);
    PlacedOrder.update(
        query, 
        { $set: { totalCost: totalCost } },
        callback
    );
}


module.exports.addOrder = function(newOrder,callback){
    newOrder.save(callback);

    //console.log("heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
    
}
