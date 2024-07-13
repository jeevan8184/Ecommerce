"use server"

import { AuthResetPassParams, AuthSignInVals, AuthSignUpVals } from "@/lib/constants/types";
import mongoose from "mongoose";
import { connectToDB } from "..";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import Auth from "../models/auth.model";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { encrypt } from "@/lib/session/session";
import { createUser } from "./user.actions";

export const AuthResetPass=async({password,cpassword,email,path}:AuthResetPassParams)=>{

    try {
        await connectToDB();
        const existAuth=await Auth.findOne({email});
        if(password !==cpassword) return {error:'passwords does not macth'}
        const newPass=await bcrypt.hash(password,12);

        const newAuth=await Auth.findByIdAndUpdate(existAuth._id,{password:newPass});
        
        revalidatePath(path);
        return JSON.parse(JSON.stringify(newAuth));
    } catch (error) {
        console.log(error);
    }
}

export const AuthSignIn=async({email,password}:AuthSignInVals)=>{

    try {
        await connectToDB();
        const existAuth=await Auth.findOne({email})
        if(!existAuth) return {error:'User does not exists signUp'}
        const isPass=await bcrypt.compare(password,existAuth.password);
        if(!isPass) return {error:'incorrect password'}
        const secret=process.env.SECRET || "newSecret"
        const token=jwt.sign({email:existAuth.email,password:existAuth.password},secret,{expiresIn:"7d"});
        const expiresAt=new Date(Date.now()+24*60*60*1000*7);

        const session=await encrypt({token,expiresAt,authId:existAuth._id});

        cookies().set("session",session,{
            secure:true,
            httpOnly:true,
            expires:expiresAt
        })
        
        revalidatePath("/");
        return JSON.parse(JSON.stringify(existAuth));
    } catch (error) {
        console.log(error);
    }
}

export const AuthSignUp=async({email,password,username,cpassword}:AuthSignUpVals)=>{

    try {
        await connectToDB();
        const existAuth=await Auth.findOne({email})
        if(existAuth) return {error:' User already exists signIn'}
        if(password !==cpassword) return {error:'passwords does not macth'}
        const newPass=await bcrypt.hash(password,12);
        const newAuth=await Auth.create({email,username,password:newPass});
        const secret=process.env.SECRET || "newSecret"
        const token=jwt.sign({email:newAuth.email,password:newAuth.password},secret,{expiresIn:"1d"});
        const expiresAt=new Date(Date.now()+24*60*60*1000);

        const session=await encrypt({token,expiresAt,authId:newAuth._id});

        createUser({username:newAuth.username,authId:newAuth._id});
        cookies().set("session",session,{
            secure:true,
            httpOnly:true,
            expires:expiresAt
        })
        revalidatePath("/");
        return JSON.parse(JSON.stringify(newAuth));
    } catch (error) {
        console.log(error);
    }
}

export const CheckEmail=async(email:string)=>{

    try {
        await connectToDB();
        const existAuth=await Auth.findOne({email});

        if(!existAuth) {
            return {error:"User does not exists please SignUp"}
        }else{
            return JSON.parse(JSON.stringify(existAuth));
        }
    } catch (error) {
        console.log(error);
    }
}
