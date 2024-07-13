"use server"

import { createUserParams, updateMobileNoParams, updateProfileParams, updateUserParams } from "@/lib/constants/types";
import { connectToDB } from "..";
import User from "../models/user.model";
import { cache } from "react";
import { deleteSession, verifySession } from "@/lib/session";
import Auth from "../models/auth.model";
import { revalidatePath } from "next/cache";
import Cart from "../models/cart.model";

export const createUser=cache(async({username,authId}:createUserParams)=>{

    try {
        await connectToDB();
        const newUser=await User.create({username,authId});
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.log(error);
    }
})

export const getUser=cache(async()=>{
    const session=await verifySession();

    try {
        await connectToDB();
        if(!session?.authId) return null;
        const existUser=await User.findOne({authId:session?.authId})
            .populate({
                path:'authId',
                model:Auth,
                select:'username email'
            })
            .populate({
                path:"cartItems",
                model:Cart,
                select:"quantity"
            })

        return JSON.parse(JSON.stringify(existUser));    
    } catch (error) {
        console.log(error);
    }
})

export const deleteUSer=()=>{
    deleteSession();
}

export const updateUser=cache(async({photo,id,path}:updateUserParams)=>{

    try {
        await connectToDB();
        const existUser=await User.findById(id);
        if(!existUser) throw Error("User does not exists");
        
        if(photo) {
            const newUser=await User.findByIdAndUpdate(id,{photo},{new:true})
                .populate({
                    path:'authId',
                    model:Auth,
                    select:'username email'
                })
                .populate({
                    path:"cartItems",
                    model:Cart,
                    select:"quantity"
                })
            revalidatePath(path);
            return JSON.parse(JSON.stringify(newUser));
        }
        return JSON.parse(JSON.stringify(existUser));
    } catch (error) {
        console.log(error);
    }
})

export const updateMobileNo=async({path,id,mobileNo}:updateMobileNoParams)=>{

    try {
        await connectToDB();
        const existUser=await User.findById(id);
        if(!existUser) throw Error("User does not exists");
        
        const newUser=await User.findByIdAndUpdate(id,{mobileNo},{new:true})
            .populate({
                path:'authId',
                model:Auth,
                select:'username email'
            })
            .populate({
                path:"cartItems",
                model:Cart,
                select:"quantity"
            })
        
        revalidatePath(path);
        console.log('moileNo',newUser);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile=async({path,id,username,email,userType}:updateProfileParams)=>{

    try {
        await connectToDB();
        const existUser=await User.findById(id);
        if(!existUser) throw Error("User does not exists");
            
        const newType=userType ? userType : existUser.userType
        await Auth.updateOne({_id:existUser.authId},{email});
        const newUser=await User.findByIdAndUpdate(id,{
            username,
            userType:newType
        },{new:true})
            .populate({
                path:'authId',
                model:Auth,
                select:'username email'
            })
            .populate({
                path:"cartItems",
                model:Cart,
                select:"quantity"
            })
        
        console.log(newUser,id,email,userType,username);
        revalidatePath(path);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.log(error);
    }
}
