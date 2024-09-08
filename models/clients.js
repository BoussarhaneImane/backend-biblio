const mongoose = require('mongoose');
const clientsSchema = new mongoose.Schema({
     name:String,
     email:String,
     password:String 
})
const clientsModel = mongoose.model("clients",clientsSchema)
module.exports = clientsModel
{/**creation data local */}