var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var houseSchema = new Schema({
    name: String,
    otherName: String,
    totalNum: Number,
    saleNum: Number,
    type: String,
    price: Number,
    imgUrl:String,
    location: String,
    tel: Array
});

module.exports = mongoose.model("House", houseSchema, "house");

