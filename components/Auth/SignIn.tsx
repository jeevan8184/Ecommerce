"use client"
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
  import { useForm } from 'react-hook-form';
  import { zodResolver } from "@hookform/resolvers/zod"
  import { z } from "zod"
  import { SignInForm } from '@/lib/validations/validator';
  import { SignInInitVals } from '@/lib/constants';
import { Button } from '../ui/button';
import { AuthSignIn } from '@/lib/database/actions/auth.actions';
import { getUser } from '@/lib/database/actions/user.actions';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import {gapi} from 'gapi-script';
import { useRouter } from 'next/navigation';
import { UserContext } from './UserProvider';
import {toast} from 'react-hot-toast';

const SignIn = ({setIsSignIn}:{setIsSignIn:Dispatch<SetStateAction<boolean>>}) => {
    
    const {setCurrUser}=useContext(UserContext);
    const [newError, setNewError] = useState('');
    const [isShowPass, setIsShowPass] = useState(false);
    const router=useRouter();

    useEffect(()=> {
        if(newError) {
            toast.error(newError);
        }
    },[newError]);

    const form = useForm<z.infer<typeof SignInForm>>({
        resolver: zodResolver(SignInForm),
        defaultValues:SignInInitVals
    })

    async function onSubmit(values:z.infer<typeof SignInForm>) {

        const x=document.getElementById('check') as HTMLInputElement ;
        if(!x?.checked) return;
        console.log('values',values);

        const data=await AuthSignIn({
            email:values.email,
            password:values.password,
        })
        if(data?.error) {
            setNewError(data.error);
            setTimeout(()=> {
                setNewError("");
            },2000);
        }else{
            const newUser=await getUser();
            setCurrUser(newUser);
            toast.success("signed in successfully");
        }
    }

    const handleSuccess=(e:any)=>{
        console.log('e',e);
    }
    const handleError=(e: any)=>{
        console.log("error",e);
    }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-3 text-black">
            <p className=' flex-center text-red-500'>{newError}</p>
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem className='flex-start flex-col'>
                        <FormLabel className=' ml-1 text-black'>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="example@gmail.com" {...field} className=' border focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-600' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem className='flex-start flex-col'>
                    <FormLabel className=' ml-1 text-black'>Password</FormLabel>
                    <FormControl>
                        <div className=' flex-between w-full border border-gray-600 rounded-md pr-3'>
                        <Input
                            type={isShowPass ? 'text' : 'password'}
                            placeholder="eg : 1234"
                            {...field}
                            className='focus-visible:ring-0 focus-visible:ring-offset-0 border-none'
                        />
                        {isShowPass ? (
                            <Eye onClick={() => setIsShowPass((prev) => !prev)} className=' cursor-pointer' />
                        ) : (
                            <EyeOff onClick={() => setIsShowPass((prev) => !prev)} className=' cursor-pointer'  />
                        )}
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className=' flex-start'>
                <p 
                    className=' text-blue-500 font-semibold ml-1 hover:underline cursor-pointer'
                    onClick={()=> router.push('/reset')}
                >
                    Forgot password
                </p>
            </div>
            <div className=' flex gap-2 text-black ml-1 py-2 items-center'>
                <Input type='checkbox' id='check' className=' w-fit size-5' />
                <span className=''>Remember me</span>
            </div>
            <div className=' ml-1 text-black flex gap-1'>
                <p className=''>Already have an account ? </p>
                <span 
                    onClick={()=> setIsSignIn((prev)=> !prev)} 
                    className=' text-blue-500 font-semibold capitalize cursor-pointer'>
                        Sign up
                </span>
            </div>
            {/* <GoogleOAuthProvider clientId="40383703024-f97bohfh3f3g5crg1198oddg565hnjns.apps.googleusercontent.com">
                <GoogleLogin
                    onSuccess={handleSuccess}
                />
            </GoogleOAuthProvider> */}
            <Button 
                type="submit" 
                className=' flex-start px-8 rounded-xl text-white bg-blue-500/100 active:bg-blue-600/50' 
                variant={null}
                disabled={form.formState.isSubmitting}
            >
                {form.formState.isSubmitting ? "submitting":"submit"}
            </Button>
        </form>
    </Form>
  )
}

export default SignIn
