"use server"

import { cartQuantityParams, checkCartParams, createCartParams, deleteCartParams } from "@/lib/constants/types";
import { connectToDB } from "..";
import Cart from "../models/cart.model";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Auth from "../models/auth.model";
import Product from "../models/product.model";
import Cateogory from "../models/cateogory.model";
import mongoose from "mongoose";
import SaveItems from "../models/save.model";


export const checkCart=async({color,productId,userId,path,quantity}:checkCartParams)=>{

    try {
        await connectToDB();
        const existCart=await Cart.findOne(
            {$and:[
                {user:userId},
                {product:productId},
                {color}
            ]}
        )
        console.log("checkCart",existCart);
        if(existCart) {
            await Cart.updateOne({_id:existCart._id},{quantity:existCart.quantity+Number(quantity)});
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
            revalidatePath(path);
            return JSON.parse(JSON.stringify(existUser));
        }else{
            revalidatePath(path);
            return null;
        }
    } catch (error) {
        console.log(error);
    }
}

export const createCart=async({productId,userId,quantity,color,cartImgs,path}:createCartParams)=>{

    try {
        await connectToDB();
        const newCart=await Cart.create({
            user:userId,
            product:productId,
            color,
            cartImgs,
            quantity:Number(quantity)
        });
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
        
        console.log("newCart",newCart);
        revalidatePath(path);
        return JSON.parse(JSON.stringify(existUser));
    } catch (error) {
        console.log(error);
    }
}

export const deleteCart=async({cartId,userId,path}:deleteCartParams)=>{

    try {
        await connectToDB();
        const deletedCart=await Cart.findByIdAndDelete(cartId);
        const existUser=await User.findByIdAndUpdate(userId,{$pull:{cartItems:deletedCart._id}})
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
        return JSON.parse(JSON.stringify({deletedCart,existUser}));
    } catch (error) {
        console.log(error);
    }
}

export const cartQuantity=async({cartId,userId,path,quantity}:cartQuantityParams)=>{

    try {
        await connectToDB();
        const updatedCart=await Cart.findByIdAndUpdate(
            cartId,
            { quantity: Number(quantity) },
            {new:true}
        )
            .populate({
                path:"product",
                model:Product,
                populate:{
                    path:"cateogory",
                    model:Cateogory,
                    select:"name"
                }
            })
            
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

        console.log("cartQuantity",updatedCart);
        revalidatePath(path);
        return JSON.parse(JSON.stringify({updatedCart,existUser}));
    } catch (error) {
        console.log(error);
    }
}

export const getAllUsercarts=async(userId:string,path:string)=>{

    try {
        await connectToDB();
        const allCarts=await Cart.find({user:userId})
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
        return JSON.parse(JSON.stringify(allCarts));
    } catch (error) {
        console.log(error);
    }
}

export const getOrderProducts=async(userId:string)=>{

    try {
        await connectToDB();
        console.log(userId);

        const existProducts=await Cart.aggregate([
            { $match :{user:new mongoose.Types.ObjectId(userId)}},
            {
                $lookup:{
                    from:"products",
                    localField:"product",
                    foreignField:"_id",
                    as:"product"
                }
            },
            {$unwind:"$product"},
            {
                $lookup:{
                    from:"users",
                    localField:"product.creator",
                    foreignField:"_id",
                    as:"creator"
                }
            },
            {$unwind:"$creator"},
            {
                $lookup:{
                    from:"cateogories",
                    localField:"product.cateogory",
                    foreignField:"_id",
                    as:"cateogory"
                }
            },
            {$unwind:"$cateogory"},
            {
                $lookup:{
                    from:"reviews",
                    localField:"product.allReviews",
                    foreignField:"_id",
                    as:"allReviews"
                }
            },
            {
                $addFields:{
                    avgRating:{$avg:"$allReviews.rating"},
                    allImgs:{
                        $filter:{
                            input:"$product.productImgs",
                            as:"productImg",
                            cond:{$eq:["$$productImg.color","$color"]}
                        }
                    },
                    cartId:"$_id"
                }
            },
            {$unwind:"$allImgs"},
            {
                $project:{
                    "product.allReviews":0,
                    "product.productImgs":0,
                    "creator.cartItems":0,
                    "creator.products":0,
                    "creator.savedItems":0,
                    "product.creator":0,
                    allReviews:0,
                    cartImgs:0,
                    _id:0
                }
            }
        ]).exec()

        return JSON.parse(JSON.stringify(existProducts));
    } catch (error) {
        console.log(error);
    }
}
