
import { Schema, model, Document, Model, models } from "mongoose";
import { ICateogory } from "./cateogory.model";
import { IUser } from "./user.model";
import { IReview } from "./review.model";

export interface IProduct extends Document {
    [x: string]: any;
    _id:string,
    creator:IUser,
    title: string;
    description?: string;
    cateogory: ICateogory;
    createdAt: Date;
    price: number;
    productImgs: { color: string, images: string[],stock: number }[],
    tags:string[],
    discount:string,
    allReviews:IReview[]
}

const ProductSchema = new Schema({
    creator:{type:Schema.Types.ObjectId,ref:"User",required:true},
    title: { type: String, required: true,trim:true },
    description: { type: String, trim: true },
    cateogory: { type: Schema.Types.ObjectId, ref: 'Cateogory', required: true },
    createdAt: { type: Date, default: Date.now()},
    price: { type: Number, required: true },
    productImgs: [{
        color:{
            type:String,
        },  
        images:[{ 
            type: String,
            required: true
        }],
        stock:{
            type:Number,
            required:true
        }
    }],
    tags:[{type:String}],
    discount:{type:String},
    allReviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }]
    },
    {
        timestamps:true
    }
);

const Product=models.Product || model("Product",ProductSchema);
export default Product;

