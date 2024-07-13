
import mongoose, { Schema, model, models } from "mongoose";
import { IUser } from "./user.model";
import { IProduct } from "./product.model";

export interface IProductOrder extends Document {
    _id:string,
    orderProducts:{product:IProduct,photo:string,quantity:number,color:string}[],
    user:IUser,
    shippingInfo:{
        username:string,
        pinCode:number,
        state:string,
        city:string,
        houseVal:string,
        area:string,
        mobileNo:number
    },
    createdAt:Date,
    totalPrice:number,
    taxPrice:number,
    isPaid:boolean,
    isCancel:boolean,
    paidAt:Date,
    isDelivered:boolean,
    deliveredAt:Date,
    orderStatus:string
}

const ProductOrderSchema=new Schema({
    orderProducts:[{
        product:{
            type:Schema.Types.ObjectId,ref:"Product"
        },
        photo:{
            type:String,required:true
        },
        quantity:{
            type:Number,required:true,min:1
        },
        color:{
            type:String,required:true
        },
    }],
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    shippingInfo:{
        username:{type:String,trim:true},
        pinCode:{type:Number},
        state:{type:String},
        city:{type:String},
        houseVal:{type:String},
        area:{type:String},
        mobileNo:{type:Number,required:true}
    },
    createdAt:{type:Date,default:Date.now()},
    totalPrice:{
        type:Number,
        required:true
    },
    taxPrice:{
        type:Number,
        required:true,
        default:0
    },
    isCancel:{type:Boolean,default:false},
    isPaid:{type:Boolean,default:false},
    paidAt:{type:Date},
    isDelivered:{type:Boolean,default:false},
    deliveredAt:{type:Date},
    orderStatus:{
        type:String,
        default:"not processed",
        enum:[
            "not processed",
            "processing",
            "shipped"
        ]
    },
    },
    {
        timestamps:true
    }
)

const ProductOrder=models.ProductOrder || model('ProductOrder',ProductOrderSchema);

export default ProductOrder;
