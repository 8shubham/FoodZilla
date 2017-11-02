var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//Order Schema
var OrderSchema = mongoose.Schema({

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
                        type:Number

                 },

                 userEmail:
                 {
                     type : String
                 },

                 restaurantEmail:
                 {
                     type : String
                 },

                 
                 time : { 
                         type : Date,
                          default: Date.now 
                      },
                 
                 deliveryLocation :{
                     type: String
                 },

                 status :{

                    type:Boolean,
                    default:false
                 }

});

OrderSchema.index({ restaurantEmail: 1, userEmail: 1}, { unique: true })

var Order = module.exports = mongoose.model('Order', OrderSchema);

module.exports.getOrderByEmails = function(remail,email,status,callback){
    var query = {restaurantEmail: remail,userEmail:email,status:status};
    Order.findOne(query, callback);

}

module.exports.getOrderByUser = function(email,status,callback){
    var query = {userEmail:email,status:status};
    Order.find(query, callback);

}

module.exports.getOrderByUserJson = function(email,status,callback){
    var query = {userEmail:email,status:status};
     Order.find(query,callback).lean();

}

module.exports.updateOrder = function(remail,uemail,newItem,status,callback){
    var query = {restaurantEmail: remail,userEmail:uemail,status:status};
    
    var newItem= newItem;
    console.log(newItem);

    Order.update(
        query, 
        { $push: { Item: newItem } },
        callback
    );
}

module.exports.updateTotalCost = function(remail,uemail,totalCost,status,callback){
    var query = {restaurantEmail: remail,userEmail:uemail,status:status};
 //   console.log("total "+totalCost);
    Order.update(
        query, 
        { $set: { totalCost: parseInt(totalCost) } },
        callback
    );
}

module.exports.updateStatus=function(uemail,status,callback){
    var query={userEmail:uemail,status:false};

    Order.update(query,{$set:{status:true}},callback);
}


module.exports.addOrder = function(newOrder,callback){
    newOrder.save(callback);

    //console.log("heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
    
}
