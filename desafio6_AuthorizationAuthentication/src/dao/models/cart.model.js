import mongoose from "mongoose";

const cartsCollection = "carritos"

const cartSchema = new mongoose.Schema({
    products: [{
        productId: {type: mongoose.Schema.Types.ObjectId, ref:'productos', required: true},
        quantity: {type: Number, default: 1, required: true}
    }]
})

const cartModel = mongoose.model(cartsCollection, cartSchema)

export default cartModel