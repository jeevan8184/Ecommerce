
import mongoose, { model, models } from "mongoose";
import { Schema } from "mongoose";
import { IUser } from "./user.model";
import { IProduct } from "./product.model";

export interface ICart extends Document {
    _id:string,
    user:IUser,
    product:IProduct,
    quantity:number,
    createdAt:Date,
    updatedAt:Date,
    color:string,
    cartImgs:string[]
}

const CartSchema=new Schema({
    user:{type:Schema.Types.ObjectId,ref:"User"},
    product:{type:Schema.Types.ObjectId,ref:"Product"},
    quantity:{type:Number,required:true},
    createdAt:{type:Date,default:Date.now()},
    updatedAt:{type:Date,default:Date.now()},
    color:{type:String},
    cartImgs:[{ type: String,required: true}],
})

const Cart=models.Cart || model("Cart",CartSchema);

export default Cart;
