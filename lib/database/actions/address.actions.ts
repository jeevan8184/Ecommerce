"use server"

import mongoose from "mongoose"
import { connectToDB } from "..";
import { createAddressParams, updateAddressParams } from "@/lib/constants/types";
import Address from "../models/address.model";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { cache } from "react";

export const createAddress=async({userId,state,pinCode,city,area,houseNo,name,path}:createAddressParams)=>{

    console.log(userId,state,pinCode,city,area,houseNo,name,path);
    console.log(typeof(houseNo),houseNo);
    try {
        await connectToDB();
        const newAdd=await Address.create({
            user:userId,
            houseVal:houseNo,
            state,
            pinCode,
            city,
            area,
            name,
        })
        console.log("createAdd",newAdd);
        await User.updateOne({_id:userId},{userAddress:newAdd._id});

        revalidatePath(path);
        return JSON.parse(JSON.stringify(newAdd));
    } catch (error) {
        console.log(error);
    }
}

export const updateAddress=async({userId,state,pinCode,city,area,houseNo,name,path}:updateAddressParams)=>{

    try {
        await connectToDB();
        const existAdd=await Address.findOne({user:userId});

       if(!existAdd) throw new Error("Address does not exists.");

       const updatedAddress=await Address.findByIdAndUpdate(existAdd._id,
            {
                state,
                pinCode,
                city,
                area,
                houseVal:houseNo,
                name,
            },
            {new:true}
        )
        console.log("updatedAddress",updatedAddress);
        await User.updateOne({_id:userId},{userAddress:existAdd._id});

        revalidatePath(path);
        return JSON.parse(JSON.stringify(updatedAddress));
    } catch (error) {
        console.log(error);
    }
}

export const getUserAddress=cache(
    async(userId:string,path:string)=>{

        try {
            await connectToDB();
            const existAdd=await Address.findOne({user:userId});
    
            if(!existAdd) return null;
    
            revalidatePath(path);
            return JSON.parse(JSON.stringify(existAdd));
        } catch (error) {
            console.log(error);
        }
    }
)
