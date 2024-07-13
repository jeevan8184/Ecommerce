"use server"

import mongoose from "mongoose"
import { connectToDB } from "..";
import SaveItems from "../models/save.model";
import Product from "../models/product.model";
import Cateogory from "../models/cateogory.model";
import { createSaveParams, deleteSavedParams, moveToCartParams } from "@/lib/constants/types";
import Cart from "../models/cart.model";
import User from "../models/user.model";
import Auth from "../models/auth.model";
import { revalidatePath } from "next/cache";

export const createSave=async({productId,userId,quantity,color,savedImsgs,path,cartId}:createSaveParams)=>{

    try {
        await connectToDB();
        const existCart=await Cart.findById(cartId);
        const existSave=await SaveItems.findOne(
            {$and:[
                {user:userId},
                {product:productId},
                {color}
            ]}
        )
        if(existSave) {
            const movedCart=await SaveItems.findByIdAndUpdate(
                existSave._id,
                {quantity:Number(existSave.quantity)+existCart.quantity},
                {new:true}
            )
            const existUser=await User.findById(userId)
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
            await Cart.deleteOne({_id:existCart._id});
            revalidatePath(path);
            return JSON.parse(JSON.stringify(existUser));
        }else{
            const newSave=await SaveItems.create({
                product:productId,
                user:userId,
                color,
                quantity:Number(quantity),
                savedImsgs,
            })
            const deletedCart=await Cart.findByIdAndDelete(cartId);
            await User.updateOne({_id:userId},{$push:{savedItems:newSave._id}});
            const existUser=await User.findByIdAndUpdate(userId,{$pull:{cartItems:cartId}})
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
            return JSON.parse(JSON.stringify(existUser));
        }
        
    } catch (error) {
        console.log(error);
    }
}

 
export const moveToCart=async({userId,path,color,savedId,productId}:moveToCartParams)=> {

    try {
        await connectToDB();
        const savedItem=await SaveItems.findById(savedId);
        const existCart=await Cart.findOne(
            {$and:[
                {user:userId},
                {product:productId},
                {color}
            ]}
        )
        if(existCart) { 
            const movedCart=await Cart.findByIdAndUpdate(
                existCart._id,
                {quantity:Number(existCart.quantity)+savedItem.quantity},
                {new:true}
            )
            await User.updateOne({_id:userId},{$pull:{savedItems:savedItem._id}});
            const existUser=await User.findById(userId)
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
            await SaveItems.deleteOne({_id:savedItem._id});
            revalidatePath(path);
            return JSON.parse(JSON.stringify(existUser));
        }else{
            const newCart=await Cart.create({
                user:userId,
                product:productId,
                color:savedItem.color,
                cartImgs:savedItem.savedImsgs,
                quantity:Number(savedItem.quantity),
            });
            await User.updateOne({_id:userId},{$pull:{savedItems:savedItem._id}});
            const existUser=await User.findByIdAndUpdate(userId,{$push:{cartItems:newCart._id}},{new:true})
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
            await SaveItems.deleteOne({_id:savedItem._id});
            revalidatePath(path);
            return JSON.parse(JSON.stringify(existUser));
        }
    } catch (error) {
        console.log(error);
    }
}


export const getAllUserSave=async(userId:string,path:string)=>{

    try {
        await connectToDB();
        const allSaved=await SaveItems.find({user:userId})
            .populate({
                path:"product",
                model:Product,
                populate:{
                    path:"cateogory",
                    model:Cateogory,
                    select:"name"
                }
            })

        revalidatePath(path);
        return JSON.parse(JSON.stringify(allSaved));
    } catch (error) {
        console.log(error);
    }
}

export const deleteSaved=async({savedId,userId,path}:deleteSavedParams)=> {

    try {
        await connectToDB();
        const deletedSave=await SaveItems.findByIdAndDelete(savedId);
        await User.updateOne({_id:userId},{$pull:{savedItems:deletedSave._id}});

        revalidatePath(path);
        return JSON.parse(JSON.stringify(deletedSave));
    } catch (error) {
        console.log(error);
    }
}
