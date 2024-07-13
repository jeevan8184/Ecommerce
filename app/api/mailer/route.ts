"use server"

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const POST=async(req:Request)=>{

    try {
        const {email,msg,subject}=await req.json();
        console.log("POST");   

        console.log(email,msg,subject);

        const transporter=nodemailer.createTransport({
            service:"gmail",
            port: 587,
            secure: false, 
            auth:{
                user:process.env.MY_EMAIL,
                pass:process.env.MY_PASS
            }
        })

        await transporter.sendMail({
            from:process.env.MY_EMAIL,
            to:email,
            subject:subject,
            text:msg
        });
        
        return NextResponse.json("msg sent successfully");
    } catch (error) {
        console.log(error);
    }
}
