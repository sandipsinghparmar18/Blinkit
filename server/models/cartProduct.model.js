import mongoose from "mongoose";

const cartproductSchema= new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    quantity:{
        type:Number,
        default:1
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})

const CartProductModel = mongoose.model('CartProduct', cartproductSchema);

export default CartProductModel;