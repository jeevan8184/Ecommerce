"use server"
import {v2 as cloudinary} from 'cloudinary'
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name:'doxykd1yk',
    api_key:'626662762526426',
    api_secret:'GXJGOUMRsHH4_JDFRRQWuHeB3hE'
})

export const POST=async(req:Request)=>{

    try {
        const data=await req.text();
        const cupload=await cloudinary.uploader.upload(data,{folder:'Ecommerce'});
        
        return NextResponse.json(cupload.secure_url);
    } catch (error) {
        console.log(error);
    }
}
