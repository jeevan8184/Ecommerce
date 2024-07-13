
import mongoose, { model, models, Schema } from "mongoose";
import { IUser } from "./user.model";
import { IProduct } from "./product.model";

export interface IRecentView extends Document {
    user:IUser,
    products:IProduct[],
    createdAt:Date,
    updatedAt:Date
}

const RecentViewSchema=new Schema({
        user:{type:Schema.Types.ObjectId,ref:"User"},
        products:[{type:Schema.Types.ObjectId,ref:"Product",required:true}],
        createdAt:{type:Date,default:Date.now()},
        updatedAt:{type:Date,default:Date.now()}
    },
    {
        timestamps:true
    }
)

const RecentView=models.RecentView || model("RecentView",RecentViewSchema);

export default RecentView;
