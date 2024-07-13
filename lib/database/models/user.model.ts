
import mongoose, { Schema, model, models } from "mongoose";
import { IAuth } from "./auth.model";
import { IProduct } from "./product.model";
import { ICart } from "./cart.model";
import { ISaveItems } from "./save.model";
import { IAddress } from "./address.model";
import { IProductOrder } from "./order.model";

export interface IUser extends Document {
    _id:string,
    authId:IAuth,
    username:string,
    photo:string,
    mobileNo:number,
    createdAt:Date,
    userType:string,
    products:IProduct[],
    cartItems:ICart[],
    savedItems:ISaveItems[],
    userAddress:IAddress,
    orderItems:IProductOrder
}

const UserSchema=new Schema({
    authId:{type:mongoose.Schema.Types.ObjectId,ref:"Auth",required:true},
    username:{type:String,required:true,trim:true},
    photo:{type:String,default:"/assets/user1.png"},
    mobileNo:{type:Number},
    createdAt:{type:Date,default:Date.now()},
    userType:{
        type:String,
        default:"user",
        enum:[
            "user",
            "admin"
        ]
    },
    products:[{type:Schema.Types.ObjectId,ref:"Product"}],
    cartItems:[{type:Schema.Types.ObjectId,ref:"Cart"}],
    savedItems:[{type:Schema.Types.ObjectId,ref:"SaveItems"}],
    userAddress:{type:Schema.Types.ObjectId,ref:"Address"},
    orderItems:[{type:Schema.Types.ObjectId,ref:"ProductOrder"}]
})

const User=models.User || model('User',UserSchema);

export default User;
