
import mongoose, { Schema, model, models } from "mongoose";
import { IUser } from "./user.model";
import { IProduct } from "./product.model";

export interface ISaveItems extends Document {
    _id:string,
    user:IUser,
    product:IProduct,
    quantity:number,
    createdAt:Date,
    color:string,
    savedImsgs:string[]
}

const SaveSchema=new Schema({
    product:{type:Schema.Types.ObjectId,ref:"Product",required:true},
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    createdAt:{type:Date,default:Date.now()},
    color:{type:String},
    savedImsgs:[{ type: String,required: true}],
    quantity:{type:Number,required:true},
})

const SaveItems=models.SaveItems || model("SaveItems",SaveSchema);

export default SaveItems;
