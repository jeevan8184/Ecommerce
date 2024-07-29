"use client"

import ResetPass from '@/components/Auth/ResetPass';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { CheckEmail } from '@/lib/database/actions/auth.actions';
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { GiShoppingBag } from 'react-icons/gi';
import {toast} from 'react-hot-toast'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import { useSearchParams } from 'next/navigation';
import Loader from '@/components/Cart/Loader';

const ResetPasswordSuspense = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [Error, setError] = useState('');
    const [text, setText] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [wrongOtp, setWrongOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const searchParams=useSearchParams();
    const pVal=searchParams.get('email');

    useEffect(()=> {
        if(pVal) {
            setEmail(pVal);
        }
    })
    
    const scrollRef=useRef<HTMLDivElement>(null);
    const scroll=useRef<HTMLDivElement>(null);

    const handleSubmit=async()=>{

        try {
            setIsLoading(true);
            const data=await CheckEmail(email);
            if(data?.error) {
                setError(data?.error);
                toast.error(data?.error);
                setTimeout(()=> {
                    setError('');
                },2000);
            }else{
                let newText="";
                for(let i=0;i<6;i++) {
                    const char=Math.floor(Math.random()*10);
                    newText+=char.toString();
                }
                setText(newText);

                const response=await fetch('/api/mailer',{
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({email,subject:"One time share OTP",msg:`Your one time share OTP is ${newText}`})
                })
                const emailData=await response.json();
                
                if(emailData){
                    toast.success("OTP sent successfully");
                    scrollRef?.current.scrollIntoView({ behavior: 'smooth' });
                }
                setNewEmail(email);
                setEmail("");
            }
            
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }

    const handleVerify=async()=>{

        try {
            setIsVerifying(true);
            if(text===otp){
                scroll?.current.scrollIntoView({ behavior: 'smooth' });
            }else{
                setWrongOtp("wrong OTP please enter the correct OTP");
                setTimeout(()=> {
                    setWrongOtp("");
                },2000);
            }
        } catch (error) {
            console.log(error);
        }finally{
            setIsVerifying(false);
        }
    }
    
  return (
        <div className=' flex-center'>
            <div className=' relative snap-x snap-mandatory overflow-x-auto max-w-md no-scrollbar'>
                <div className=' flex gap-8'>
                    <div className=' snap-center shrink-0 w-full'>
                        <div className=' mx-auto mt-28 max-w-md max-md:px-8  max-sm:mx-2 border-2 pb-14 border-gray-200 bg-transparent rounded-xl px-10 py-8'>
                            <div className=' mx-auto flex flex-col gap-8'>
                                <div className=' flex flex-col flex-1 gap-4'>
                                    <div className=' flex-center gap-1 px-2 rounded-xl -left-px -ml-4'>
                                        <GiShoppingBag className=' text-5xl text-orange-500' />
                                        <h1 className=' text-4xl text-orange-500/75 opacity-90 underline-offset-8 font-bold rounded-full capitalize'>Shopify</h1>
                                    </div>
                                    <p className=' flex-center font-semibold text-lg'>Welcome to shopify</p>
                                    <p className=''>Enter your email address associated with shopify account</p>
                                </div>
                                <div className=' flex flex-col gap-6' >
                                    <div className=' flex flex-col gap-2'>
                                        <p className=' font-sans font-semibold'>Enter your Email</p>
                                        <Input
                                            className=' border-2 border-orange-500 focus-visible:ring-0 focus-visible:ring-offset-0'
                                            value={email}
                                            onChange={(e)=> setEmail(e.target?.value)}
                                            placeholder='Email'
                                        />
                                    </div>
                                    <Button 
                                        type='submit'
                                        disabled={isLoading}
                                        className=' bg-orange-500 hover:bg-orange-500'
                                        onClick={(e)=> {
                                            e.preventDefault();
                                            handleSubmit();
                                        }}
                                    >
                                        {isLoading ? "please wait...":"Enter"}
                                    </Button>
                                    <p className=' font text-red-500 text-sm flex-center'>{Error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=' snap-center shrink-0 w-full' ref={scrollRef}>
                        <div className=' mx-auto mt-28 max-w-md max-md:px-8  max-sm:mx-2 border-2 pb-14 border-gray-200 bg-transparent rounded-xl px-10 py-8'>
                            <div className=' mx-auto flex flex-col gap-8'>
                                <div className=' flex flex-col flex-1 gap-4'>
                                    <div className=' flex-center gap-1 px-2 rounded-xl -left-px -ml-4'>
                                        <GiShoppingBag className=' text-5xl text-orange-500' />
                                        <h1 className=' text-4xl text-orange-500/75 opacity-90 underline-offset-8 font-bold rounded-full capitalize'>Shopify</h1>
                                    </div>
                                    <p className=' flex-center font-semibold text-lg'>Welcome to shopify</p>
                                    <div className=' flex flex-col flex-1 gap-0'>
                                        <h1 className=' text-lg font-semibold'>Verification required</h1>
                                        <p className=' text-[15px] text-gray-800'>Enter your one time shared OTP</p>
                                    </div>
                                </div>
                                <form onSubmit={handleVerify} className=' flex flex-col gap-6' >
                                    <div className=' flex flex-col gap-2'>
                                        <p className=' font-sans font-semibold'>Enter OTP</p>
                                        <InputOTP maxLength={6}
                                            className='border-2 border-orange-500 focus-visible:ring-0 focus-visible:ring-offset-0'
                                            value={otp}
                                            onChange={(value)=> setOtp(value)}
                                        >
                                            <InputOTPGroup className=' rounded-lg'>
                                                {Array.from({length:6},(_,i)=> (
                                                    <InputOTPSlot index={i} className=' border border-orange-500' />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    <Button 
                                        type='submit'
                                        disabled={isVerifying}
                                        className=' bg-orange-500 hover:bg-orange-500'
                                        onClick={(e)=> {
                                            e.preventDefault();
                                            handleVerify();
                                        }}
                                    >
                                        {isVerifying ? "verifying...":"verify"}
                                    </Button>
                                    <p className=' font text-red-500 text-sm flex-center'>{wrongOtp}</p>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className=' snap-center shrink-0 w-full' ref={scroll}>
                        <ResetPass newEmail={newEmail} />
                    </div>
                </div>
            </div>
        </div>
  )
}

const ResetPassword=()=>{
    return(
        <Suspense fallback={<Loader />}>
            <ResetPasswordSuspense />
        </Suspense>
    )
}

export default ResetPassword
