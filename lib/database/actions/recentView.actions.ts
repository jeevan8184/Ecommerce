"use server"

import { createRecentViewParams } from "@/lib/constants/types";
import { connectToDB } from "..";
import RecentView from "../models/recentView.model";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";


export const getUserRecentView=async(userId:string,path:string)=>{

    try {
        await connectToDB();
        const existRecView=await RecentView.aggregate([
            {$match:{user:new mongoose.Types.ObjectId(userId)}},
            {
                $lookup:{
                    from:"products",
                    localField:"products",
                    foreignField:"_id",
                    as:"products"
                }
            },
            {$sort:{updatedAt:1}}
        ])
        
        console.log("getUserRecentView",existRecView);
        revalidatePath(path);
        return JSON.parse(JSON.stringify(existRecView[0]));
    } catch (error) {
        console.log(error);
    }
}

export const createRecentView=async({userId,productId,path}:createRecentViewParams)=>{

    try {
        await connectToDB();
        const existRecView=await RecentView.findOne({user:userId});
        if(!existRecView) {
            const newRecView=await RecentView.create({user:userId,products:[productId]});

            revalidatePath(path);
            return JSON.parse(JSON.stringify(newRecView));
        }else{
            const idx=existRecView.products.indexOf(productId);

            if(idx>-1) {

                existRecView.products.splice(idx,1);
                existRecView.products.unshift(productId);
            }else{
                existRecView.products.unshift(productId);

                if(existRecView.products.length>11) {
                    existRecView.products.pop();
                }
            }

            existRecView.updatedAt=Date.now();
            await existRecView.save();
            revalidatePath(path);
            return JSON.parse(JSON.stringify(existRecView));
        }
    } catch (error) {
        console.log(error);
    }
}
