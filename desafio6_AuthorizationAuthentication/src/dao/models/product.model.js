import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = "productos"

const productSchema = new mongoose.Schema({
    title: {type:String, required:true},
    description:{type:String, required:true},
    code:{type:String, required:true},
    price:{type:Number, required:true},
    status:{type:Boolean, required:true},
    stock:{type:Number, required:true},
    category: {type:String, required:true},
    thumbnail: {type:String, required:false}
})

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(productsCollection, productSchema)

export default productModel