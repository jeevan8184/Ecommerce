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
  import { SignUpForm } from '@/lib/validations/validator';
  import { SignUpInitVals } from '@/lib/constants';
import { Button } from '../ui/button';
import { AuthSignUp } from '@/lib/database/actions/auth.actions';
import { getUser } from '@/lib/database/actions/user.actions';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { UserContext } from './UserProvider';
import {toast} from 'react-hot-toast'

const SignUp = ({setIsSignIn}:{setIsSignIn:Dispatch<SetStateAction<boolean>>}) => {
    
    const {setCurrUser}=useContext(UserContext);
    const [newError, setNewError] = useState('');
    const [isShowPass, setIsShowPass] = useState(false);
    const [isShowPass1, setIsShowPass1] = useState(false);

    useEffect(()=> {
        if(newError) {
            toast.error(newError);
        }
    },[newError]);

    const form = useForm<z.infer<typeof SignUpForm>>({
        resolver: zodResolver(SignUpForm),
        defaultValues:SignUpInitVals
    })

    async function onSubmit(values:z.infer<typeof SignUpForm>) {

        const x=document.getElementById('check') as HTMLInputElement ;
        if(!x?.checked) return;
        console.log('values',values);
        
        const data=await AuthSignUp({
            email:values.email,
            password:values.password,
            cpassword:values.cpassword,
            username:values.username
        })
        if(data?.error) {
            setNewError(data.error);
            setTimeout(()=> {
                setNewError("");
            },2000);
        }else{
            const newUser=await getUser();
            setCurrUser(newUser);
            toast.success("signed up successfully");
        }
    }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-3 text-black">
            <p className=' flex-center text-red-500'>{newError}</p>
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem className='flex-start flex-col'>
                        <FormLabel className=' ml-1 text-black'>Username</FormLabel>
                        <FormControl>
                            <Input placeholder="Example" {...field} className=' border focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-600' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
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
                        <FormLabel className=' ml-1 text-black'>password</FormLabel>
                        <FormControl>
                            <div className=' flex-between w-full border border-gray-600 rounded-md pr-3'>
                                <Input 
                                    type={isShowPass ? 'text':'password'} 
                                    placeholder="eg : 1234" {...field} 
                                    className='focus-visible:ring-0 focus-visible:ring-offset-0 border-none' 
                                />
                                {isShowPass ? (
                                    <EyeIcon className=' cursor-pointer'  onClick={()=> setIsShowPass((prev)=> !prev)} />
                                ):(
                                    <EyeOffIcon className=' cursor-pointer'  onClick={()=> setIsShowPass((prev)=> !prev)}  />
                                )}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="cpassword"
                render={({ field }) => (
                    <FormItem className='flex-start flex-col'>
                        <FormLabel className=' ml-1 text-black'>confirm password</FormLabel>
                        <FormControl>
                            <div className=' flex-between w-full border border-gray-600 rounded-md pr-3'>
                                <Input 
                                    type={isShowPass1 ? 'text':'password'} 
                                    placeholder="eg : 1234" {...field} 
                                    className='focus-visible:ring-0 focus-visible:ring-offset-0 border-none' 
                                />
                                {isShowPass1 ? (
                                    <EyeIcon className=' cursor-pointer'  onClick={()=> setIsShowPass1((prev)=> !prev)} />
                                ):(
                                    <EyeOffIcon className=' cursor-pointer'  onClick={()=> setIsShowPass1((prev)=> !prev)}  />
                                )}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className=' flex gap-2 text-black ml-1 py-2 items-center'>
                <Input type='checkbox' id='check' className=' w-fit size-5' />
                <span className=''>Remember me</span>
            </div>
            <div className=' ml-1 text-black flex gap-1'>
                <p className=''>Already have an account ? </p>
                <span 
                    onClick={()=> setIsSignIn((prev)=> !prev)} 
                    className=' text-blue-500 font-semibold capitalize cursor-pointer'>
                        Sign in
                </span>
            </div>
            <Button 
                type="submit" 
                className=' flex-start px-8 rounded-xl text-white bg-blue-500/100 active:bg-blue-600/50' 
                variant={null}
                disabled={form.formState.isSubmitting}
            >
                {form.formState.isSubmitting ? "submitting":"submit"}
            </Button>        </form>
    </Form>
  )
}

export default SignUp
