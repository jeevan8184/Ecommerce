
import mongoose, { Schema, model, models } from "mongoose";
import { IUser } from "./user.model";
import { IProduct } from "./product.model";

export interface IReview extends Document {
    _id:string,
    reviewer:IUser,
    product:IProduct,
    text:string,
    rating:number,
    createdAt:Date,
    likes:string[],
    photos:string[]
}

const ReviewSchema=new Schema({ 
    reviewer:{type:Schema.Types.ObjectId,ref:"User",required:true},
    product:{type:Schema.Types.ObjectId,ref:"Product",required:true},
    text:{type:String,trim:true},
    rating:{type:Number,min:1,max:5,required:true},
    createdAt:{type:Date,default:Date.now()},
    likes:[{
        type:Schema.Types.ObjectId,
        ref:"User",
    }],
    photos:[{type:String}]
})

const Review=models.Review || model("Review",ReviewSchema);

export default Review;
