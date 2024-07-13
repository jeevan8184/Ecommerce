"use server"

import { createReviewParams, deleteReviewParams, likeReviewParams } from "@/lib/constants/types";
import { connectToDB } from "..";
import Review from "../models/review.model";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Product from "../models/product.model";

export const createReview=async({userId,productId,text,rating,path,photos}:createReviewParams)=>{

    try {
        await connectToDB();
        const newReview=await Review.create({
            reviewer:userId,
            product:productId,
            text,
            rating,
            createdAt:Date.now(),
            photos
        })
        await Product.updateOne({_id:productId},{$push:{allReviews:newReview._id}});
        revalidatePath(path);
        const existReview=await Review.findById(newReview._id)
            .populate({
                path:"reviewer",
                model:User,
                select:"username photo"
            })

        return JSON.parse(JSON.stringify(existReview));
    } catch (error) {
        console.log(error);
    }
}

export const getProductReviews=async(productId:string)=>{

    try {
        await connectToDB();
        const allReviews=await Review.find({product:productId})
            .populate({
                path:"reviewer",
                model:User,
                select:"username photo"
            })
        
        return JSON.parse(JSON.stringify(allReviews));
    } catch (error) {
        console.log(error);
    }
}

export const likeReview=async({userId,path,reviewId}:likeReviewParams)=>{

    try {
        await connectToDB();
        const existReview=await Review.findById(reviewId)
            .populate({
                path:"reviewer",
                model:User,
                select:"username photo"
            })
        
        if(existReview.likes.includes(userId)) {
            existReview.likes=existReview.likes.filter((l:string)=> l.toString()!==userId.toString());
            await existReview.save();
        }else{
            existReview.likes.push(userId);
            await existReview.save();
        }
        
        console.log("likeReview",existReview);
        revalidatePath(path);
        return JSON.parse(JSON.stringify(existReview));
    } catch (error) {
        console.log(error);
    }
}

export const deleteReview=async({reviewId,path,productId}:deleteReviewParams)=>{

    try {
        await connectToDB();
        const deletedReview=await Review.findByIdAndDelete(reviewId)
        await Product.updateOne({_id:productId},{$pull:{allReviews:deletedReview._id}});
        
        revalidatePath(path);
        return JSON.parse(JSON.stringify(deletedReview));
    } catch (error) {
        console.log(error);
    }
}
