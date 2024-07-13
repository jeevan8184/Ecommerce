"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
  
import { Input } from "@/components/ui/input"
import React, { useContext, useEffect, useState } from 'react'
import { updateValidity } from "@/lib/validations/validator"
import { UserContext } from "../Auth/UserProvider"
import { updateProfile } from "@/lib/database/actions/user.actions"
import { usePathname } from "next/navigation"

const UserUpdate = () => {
    const {currUser,setCurrUser}=useContext(UserContext);
    const [type, setType] = useState("");

    useEffect(()=> {
        if(currUser) {
            setType(currUser?.userType);
        }
    },[currUser]);

    const pathname=usePathname();

    const updateVals={
        username:currUser?.username,
        email:currUser?.authId?.email
    }

    const form = useForm<z.infer<typeof updateValidity>>({
        resolver: zodResolver(updateValidity),
        defaultValues:updateVals
    })
     
    async function onSubmit(values: z.infer<typeof updateValidity>) {
        console.log(values);

        try {
            const data=await updateProfile({
                path:pathname,
                id:currUser?._id,
                username:values?.username,
                email:values?.email,
                userType:type
            });
            if(data) {
                setCurrUser(data);
                setType(data?.userType);
            }
        } catch (error) {
            console.log(error);
        }
    }

  return ( 
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 px-4 max-sm:px-2 flex flex-col gap-3">
                <div className=' flex-between gap-6 max-md:flex-col max-md:gap-3'>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                        <FormItem className=' w-full'>
                            <FormLabel className=' ml-1 text-black'>Username</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder=""
                                    {...field} 
                                    className=" border-2 border-orange-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem className=' w-full'>
                            <FormLabel className=' ml-1 text-black'>Email</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="" 
                                    {...field} 
                                    className=" border-2 border-orange-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className=" flex flex-1 flex-col gap-2">
                    <span className=" ml-1 font-[500]">User Type</span>
                    <Select defaultValue={currUser?.userType} onValueChange={(value)=> setType(value)} value={type}>
                        <SelectTrigger className="w-1/3 max-lg:w-1/2  focus:ring-0 focus:ring-offset-0 border-2 border-orange-500 ">
                            <SelectValue placeholder="Select user type" className=" border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="User">User</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className=' flex-between'>
                    <button onClick={()=> form.reset()} className=' active:bg-gray-500/30 px-6 py-2 font-semibold border-2 border-gray-300 rounded-full bg-gray-500/20'>cancel</button>
                    <button 
                        className=' active:bg-blue-600 px-6 py-2 text-white border-2 border-blue-500 rounded-full bg-blue-500' 
                        type="submit"
                    >
                        {form.formState.isSubmitting ? "Submitting": "Submit"}
                    </button>
                </div>
            </form>
        </Form>
  )
}

export default UserUpdate
