"use server"

import { createProductParams, getCateogoryProductsParams, getProductByColorParams, getSearchProductsParams } from "@/lib/constants/types";
import { connectToDB } from "..";
import Product from "../models/product.model";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Cateogory from "../models/cateogory.model";
import mongoose from "mongoose";
import Cart from "../models/cart.model";
import SaveItems from "../models/save.model";

export const createProduct=async({
    title,
    description,
    cateogory,
    price,
    discount,
    tags,
    productImgs,
    path,
    creator
}:createProductParams)=>{

    try {
        await connectToDB();
        const newProduct=await Product.create({
            creator,
            title,
            description,
            cateogory,
            price,
            discount,
            tags:tags?.split(","),
            productImgs,
            createdAt:Date.now()
        })
        await User.updateOne({_id:creator},{$push:{products:newProduct._id}});
        console.log("newProduct",newProduct);
        revalidatePath(path);
        return JSON.parse(JSON.stringify(newProduct));
    } catch (error) {
        console.log(error);
    }
}

export const getAllProducts=async()=>{

    try {
        await connectToDB();
        const allProducts=await Product.find()
            .populate({
                path:"creator",
                model:User,
                select:"username photo"
            })
            .populate({
                path:"cateogory",
                model:Cateogory,
                select:"name"
            });

        return JSON.parse(JSON.stringify(allProducts));
    } catch (error) {
        console.log(error);
    }
}

export const getProductById=async(id:string)=>{

    try {
        await connectToDB();
        const existProduct=await Product.findById(id)
            .populate({
                path:"creator",
                model:User,
                select:"username photo"
            })
            .populate({
                path:"cateogory",
                model:Cateogory,
                select:"name"
            });
        
        console.log("getProductById",existProduct);
        return JSON.parse(JSON.stringify(existProduct));
    } catch (error) {
        console.log(error);
    }
}

export const getProductByColor=async({productId,color,path,quantity}:getProductByColorParams)=>{

    try {
        await connectToDB();

        const existProduct=await Product.aggregate([
            {$match:{_id:new mongoose.Types.ObjectId(productId)}},
            {
                $lookup:{
                    from:"reviews",
                    localField:"allReviews",
                    foreignField:"_id",
                    as:"Reviews"
                },
            },
            {
                $addFields:{
                    avgRating:{$avg:"$Reviews.rating"},
                    quantity,
                    color,
                    allImgs:{
                        $filter:{
                            input:"$productImgs",
                            as:"productImg",
                            cond:{$eq:["$$productImg.color",color]}
                        }
                    },
                    product:{
                        _id: "$_id",
                        title: "$title",
                        description: "$description",
                        price:"$price",
                        tags:"$tags",
                        discount:"$discount",
                        createdAt: "$createdAt",
                    },
                    cartImgs:"$allImgs"
                }
            },
            {$unwind:"$allImgs"},
            {
                $lookup:{
                    from:"users",
                    localField:"creator",
                    foreignField:"_id",
                    as:"creator"
                }
            },
            {$unwind:"$creator"},
            {
                $lookup:{
                    from:"cateogories",
                    localField:"cateogory",
                    foreignField:"_id",
                    as:"cateogory"
                }
            },
            {$unwind:"$cateogory"},
            {
                $project:{
                    allReviews:0,
                    Reviews:0,
                    "creator.cartItems":0,
                    "creator.products":0,
                    "creator.savedItems":0,
                    productImgs:0,
                    title:0,
                    description:0,
                    createdAt:0,
                    price:0,
                    discount:0,
                    tags:0,
                    _id:0
                }
            }
        ])
        
        revalidatePath(path);
        return JSON.parse(JSON.stringify(existProduct));
    } catch (error) {
        console.log(error);
    }
}

export const getAllUserProducts=async(userId:string,path:string)=>{

    try {
        await connectToDB();
        const allProducts=await Product.aggregate([
            {$match:{creator:new mongoose.Types.ObjectId(userId)}},
            {
                $lookup:{
                    from:"users",
                    localField:"creator",
                    foreignField:"_id",
                    as:"creator"
                }
            },
            {$unwind:"$creator"},
            {
                $lookup:{
                    from:"cateogories",
                    localField:"cateogory",
                    foreignField:"_id",
                    as:"cateogory"
                }
            },
            {$unwind:"$cateogory"},
            {
                $lookup:{
                    from:"reviews",
                    localField:"allReviews",
                    foreignField:"_id",
                    as:"Reviews"
                }
            },
            {
                $addFields:{
                    avgRating:{$avg:"$Reviews.rating"},
                }
            },
            {
                $project:{
                    Reviews:0
                }
            },
            {$sort:{createdAt:-1}}
        ])

        revalidatePath(path);
        return JSON.parse(JSON.stringify(allProducts));
    } catch (error) {
        console.log(error);
    }
}

export const getProductsData=async(cateogory:string,path:string)=>{
    
    try {
        await connectToDB();
        const existProduct=await Product.aggregate([
            {
                $lookup:{
                    from:"cateogories",
                    localField:"cateogory",
                    foreignField:"_id",
                    as:"cateogory"
                }
            },
            {$unwind:"$cateogory"},
            {$match:{"cateogory.name":cateogory}},
            {
                $addFields:{
                    newPrice:{
                        $subtract:["$price",{$multiply:["$price",{$divide:[{$toDouble:"$discount"},100]}]}]
                    }
                }
            },
            {$unwind:"$newPrice"},
            {
                $project:{
                    newPrice:1,
                    _id:0
                }
            }
        ])

        revalidatePath(path);
        return JSON.parse(JSON.stringify(existProduct));
    } catch (error) {
        console.log(error);
    }
}


export const getCateogoryProducts=async({
    cateogory,
    path,
    pageno=1,
    limit=10,
    sortPrice,
    discount,
    rating,
    price
}:getCateogoryProductsParams)=>{

    try {
        await connectToDB();
        const skipAmt=(pageno-1)*limit;

        const totalDocs=await Product.countDocuments({"cateogory.name":cateogory});

        const allProducts=await Product.aggregate([
            {
                $lookup:{
                    from:"cateogories",
                    localField:"cateogory",
                    foreignField:"_id",
                    as:"cateogory"
                }
            },
            {$unwind:"$cateogory"},
            {$match:{"cateogory.name":cateogory}},
            {
                $lookup:{
                    from:"reviews",
                    localField:"allReviews",
                    foreignField:"_id",
                    as:"allReviews"
                }
            },
            {
                $addFields:{
                    avgRating:{$ifNull:[{$avg:"$allReviews.rating"},0]},
                    newPrice:{
                        $subtract:["$price",{$multiply:["$price",{$divide:[{$toDouble:"$discount"},100]}]}]
                    }
                }
            },
            {
                $project:{
                    allReviews:0
                }
            },
            {
               $match:{
                "discount":{$gte:discount.toString()},
                avgRating:{$gte:rating},
                newPrice: { $lte: price }
               }
            },
            {
                $sort:{
                    ...(rating !==0 && {avgRatin:-1}),
                    ...(discount !==0 && {discount:-1}),
                    ...(sortPrice !==0 && {newPrice:sortPrice}),
                    createdAt:-1
                }
            },
            {$skip:skipAmt},
            {$limit:limit},
        ])

        // price - Number(price * Number(discount) / 100)}
        revalidatePath(path);
        console.log("price",price,"rating",rating,"discount",discount,"cateogory",cateogory,"sortPrice",sortPrice);
        const totalPages=Math.ceil(totalDocs/limit);
        return JSON.parse(JSON.stringify({allProducts,totalPages}));
    } catch (error) {
        console.log(error);
    }
}

export const getSearchProducts=async({
    query,
    path,
    pageno=1,
    limit=10,
    sortPrice,
    discount,
    rating,
    price
    
}:getSearchProductsParams)=>{

    try {
        await connectToDB();
        const newVals=query.split('/\s+/').filter(x=> x.trim() !=="");

        const newQuerys=newVals.map(((q)=> new RegExp(q,"i")));
        const skipAmt=(pageno-1)*limit;

        const allProducts=await Product.aggregate([
            {
                $lookup:{
                    from:"cateogories",
                    localField:"cateogory",
                    foreignField:"_id",
                    as:"cateogory"
                }
            },
            {$unwind:"$cateogory"},
            {
                $lookup:{
                    from:"reviews",
                    localField:"allReviews",
                    foreignField:"_id",
                    as:"allReviews"
                }
            },
            {
                $addFields:{
                    avgRating:{$ifNull:[{$avg:"$allReviews.rating"},0]},
                    newPrice:{
                        $subtract:["$price",{$multiply:["$price",{$divide:[{$toDouble:"$discount"},100]}]}]
                    }
                }
            },
            {
                $project:{
                    allReviews:0
                }
            },
            {
               $match:{
                    "discount":{$gte:discount.toString()},
                    avgRating:{$gte:rating},
                    newPrice: { $lte: price },
                    $or:[
                        {title:{$in:newQuerys}},
                        {description:{$in:newQuerys}},
                        {"cateogory.name":{$in:newQuerys}},
                        {tags:{$in:newQuerys}}
                    ]
               }
            },
            {
                $sort:{
                    ...(rating !==0 && {avgRatin:-1}),
                    ...(discount !==0 && {discount:-1}),
                    ...(sortPrice !==0 && {newPrice:sortPrice}),
                    createdAt:-1
                }
            },
            {$skip:skipAmt},
            {$limit:limit},
        ])
        
        console.log(query,allProducts.length,newQuerys,"price",price,"rating",rating,"discount",discount,"sortPrice",sortPrice);
        revalidatePath(path);
        return JSON.parse(JSON.stringify(allProducts));
    } catch (error) {
        console.log(error);
    }
}

export const getOneProduct=async(path:string)=>{

    try {
        await connectToDB();
        const existProduct=await Product.aggregate([
            {
                $lookup:{
                    from:"cateogories",
                    localField:"cateogory",
                    foreignField:"_id",
                    as:"cateogory"
                }
            },
            {$unwind:"$cateogory"},
            {$sample:{size:20}},
        ])

        revalidatePath(path);
        return JSON.parse(JSON.stringify(existProduct[0]));
    } catch (error) {
        console.log(error);
    }
}

export const getRelatedProducts=async(productId:string,path:string)=>{

    try {
        await connectToDB();
        const product=await Product.findById(productId)
            .populate({
                path:"cateogory",
                model:Cateogory,
                select:"_id name"
            })

        const existProducts=await Product.aggregate([
            {
                $lookup:{
                    from:"cateogories",
                    localField:"cateogory",
                    foreignField:"_id",
                    as:"cateogory"
                }
            },
            {$unwind:"$cateogory"},
            {
                $match:{
                    $and:[
                        {"cateogory.name":product.cateogory.name},
                        {_id:{$ne:product._id}}
                    ]
                }
            },
            {
                $lookup:{
                    from:"reviews",
                    localField:"allReviews",
                    foreignField:"_id",
                    as:"Reviews"
                }
            },
            {
                $addFields:{
                    avgRating:{$ifNull:[{$avg:"$Reviews.rating"},0]}
                }
            },
            {
                $project:{
                    Reviews:0
                }
            },
            {$limit:10}
        ])
        
        revalidatePath(path);
        return JSON.parse(JSON.stringify(existProducts));
    } catch (error) {
        console.log(error);
    }
}

export const getRelatedCarts=async(userId:string,path:string)=>{

    try {
        await connectToDB();
        const allCarts=await Cart.find({user:userId})
            .populate({
                path:"product",
                model:Product,
                populate:{
                    path:"cateogory",
                    model:Cateogory
                }
            })
        const allSaved=await SaveItems.find({user:userId})
            .populate({
                path:"product",
                model:Product,
                populate:{
                    path:"cateogory",
                    model:Cateogory
                }
            })

        const allCartsIds=allCarts.map((cart)=> cart.product._id);
        const allSavedIds=allSaved.map((save)=> save.product._id);

        const allCartsCat=allCarts.map((cart)=> cart.product.cateogory.name);
        const allSavedCat=allSaved.map((save)=> save.product.cateogory.name);
        
        if(allCartsIds.length<1 && allSavedIds.length<1) {
            const existProducts=await Product.aggregate([
                {
                    $lookup:{
                        from:"cateogories",
                        localField:"cateogory",
                        foreignField:"_id",
                        as:"cateogory"
                    }
                },
                {$unwind:"$cateogory"},
                {
                    $lookup:{
                        from:"reviews",
                        localField:"allReviews",
                        foreignField:"_id",
                        as:"Reviews"
                    }
                },
                {
                    $addFields:{
                        avgRating:{$ifNull:[{$avg:"$Reviews.rating"},0]}
                    }
                },
                { $sample: { size: 20 } },
                {$limit:12},
                {
                    $project:{
                        Reviews:0
                    }
                },
            ])
            
            revalidatePath(path);
            return JSON.parse(JSON.stringify(existProducts));
        }

        const existProducts=await Product.aggregate([
            {
                $lookup:{
                    from:"cateogories",
                    localField:"cateogory",
                    foreignField:"_id",
                    as:"cateogory"
                }
            },
            {$unwind:"$cateogory"},
            {
                $lookup:{
                    from:"reviews",
                    localField:"allReviews",
                    foreignField:"_id",
                    as:"Reviews"
                }
            },
            {
                $match:{
                    $and:[
                        {_id:{$nin:allCartsIds}},
                        {_id:{$nin:allSavedIds}},
                    ],
                    $or:[
                        {"cateogory.name":{$in:allCartsCat}},
                        {"cateogory.name":{$in:allSavedCat}}
                    ]
                }
            },
            {
                $addFields:{
                    avgRating:{$ifNull:[{$avg:"$Reviews.rating"},0]}
                }
            },
            { $sample: { size: 20 } },
            {$limit:12},
            {
                $project:{
                    Reviews:0
                }
            },
        ])
        
        revalidatePath(path);
        return JSON.parse(JSON.stringify(existProducts));
    } catch (error) {
        console.log(error);
    }
}
