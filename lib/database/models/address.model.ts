
import mongoose, { model, models, Schema } from "mongoose";
import { IUser } from "./user.model";

export interface IAddress extends Document {
    user:IUser,
    state:string,
    pinCode:number,
    city:string,
    createdAt:Date,
    area:string,
    houseVal:string,
    name:string
}

const AddressSchema=new Schema({
    user:{type:Schema.Types.ObjectId,ref:"User"},
    houseVal:{type:String,trim:true},
    state:{type:String,default:"Telangana",trim:true},
    pinCode:{type:Number,required:true},
    city:{type:String,trim:true},
    createdAt:{type:Date,default:Date.now()},
    area:{type:String,trim:true},
    name:{type:String},
})

const Address=models.Address || model("Address",AddressSchema);

export default Address;
