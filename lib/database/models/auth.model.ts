
import mongoose, { Schema, model, models } from "mongoose";

export interface IAuth extends Document {
    _id:string,
    username:string,
    email:string,
    password:string
}

const AuthSchema=new Schema({
    username:{type:String,required:true},
    email:{type:String},
    password:{type:String,required:true},

})

const Auth=models.Auth || model('Auth',AuthSchema);

export default Auth;
