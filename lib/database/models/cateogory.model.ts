

import mongoose, { Schema, model, models } from "mongoose";

export interface ICateogory extends Document {
    _id:string,
    name:string,
    createdAt:Date
}

const CateogorySchema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    createdAt:{type:Date,default:Date.now()}
})

const Cateogory=models.Cateogory || model('Cateogory',CateogorySchema);

export default Cateogory;
