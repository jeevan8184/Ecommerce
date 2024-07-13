"use server"

import mongoose from "mongoose";
import { connectToDB } from "..";
import { createCateogoryParams } from "@/lib/constants/types";
import { revalidatePath } from "next/cache";
import Cateogory from "../models/cateogory.model";


export const createCateogory=async({path,name}:createCateogoryParams)=>{

    try {
        await connectToDB();
        const newCateogory=await Cateogory.create({name:name.toLowerCase(),createdAt:Date.now()});

        revalidatePath(path);
        return JSON.parse(JSON.stringify(newCateogory));
    } catch (error) {
        console.log(error);
    }
}

export const getAllCateogories=async()=>{

    try {
        await connectToDB();
        const allCateogories=await Cateogory.find({});

        revalidatePath("/create");
        return JSON.parse(JSON.stringify(allCateogories));
    } catch (error) {
        console.log(error);
    }
}

