"use client"

import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
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
import { Input } from "@/components/ui/input"
import { AddressFormValidy } from '@/lib/validations/validator'
import { createAddress, updateAddress } from '@/lib/database/actions/address.actions'
import { UserContext } from '../Auth/UserProvider'
import { usePathname } from 'next/navigation'
import { AddressParams } from '@/lib/constants/types'
import { getAddress } from '@/lib/redux/actions'
import { useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'

interface AddressFormProps {
    setIsAddress?:Dispatch<SetStateAction<boolean>>,
    type?:"order",
    AddressInitVals:AddressParams,
    setAddressInitVals:Dispatch<SetStateAction<AddressParams>>,
    setIsUpdate?:Dispatch<SetStateAction<boolean>>,
    isUpdate?:boolean
}

const ShowMap=dynamic(()=> import("./ShowMap"),{
    ssr: false,
    loading: () => <p>Loading...</p>
})

const AddressForm = ({
    setIsAddress,
    type,
    AddressInitVals,
    setIsUpdate,
    isUpdate,
    setAddressInitVals
}:AddressFormProps) => {
      
    const {currUser}=useContext(UserContext);
    const pathname=usePathname();
    const dispatch=useDispatch();
    const [isClicked, setIsClicked] = useState(false);

    const form = useForm<z.infer<typeof AddressFormValidy>>({
        resolver: zodResolver(AddressFormValidy),
        defaultValues: AddressInitVals
    })

    useEffect(() => {
        form.reset(AddressInitVals);
    }, [AddressInitVals, form]);

    console.log("AddressInitVals",AddressInitVals);
   
    async function onSubmit(values: z.infer<typeof AddressFormValidy>) {

        console.log(values);

        try {
            if(type && type==="order") {

                setAddressInitVals && setAddressInitVals((prev)=> ({...prev,
                    firstname:values.firstname,
                    pincode:values.pincode,
                    state:values.state,
                    town:values.town,
                    houseNo:values.houseNo,
                    area:values.area}))
                setIsAddress && setIsAddress((prev)=> !prev);

            }else{
                if(isUpdate && isUpdate===true) {
                    const data=await updateAddress({
                        userId:currUser?._id,
                        state:values.state,
                        pinCode:Number(values.pincode),
                        area:values.area,
                        name:values.firstname,
                        path:pathname,
                        city:values.town,
                        houseNo:values.houseNo
                    })
                    if(data) {
                        dispatch(getAddress(currUser?._id,pathname));
                        setIsUpdate && setIsUpdate(false);
                    }
                }else{
                    const data=await createAddress({
                        userId:currUser?._id,
                        state:values.state,
                        pinCode:Number(values.pincode),
                        area:values.area,
                        name:values.firstname,
                        path:pathname,
                        city:values.town,
                        houseNo:values.houseNo
                    })
                    if(data) dispatch(getAddress(currUser?._id,pathname));
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-3 px-4 max-sm:px-2">
            <div className=' flex-between gap-6 '>
                <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                    <FormItem className=' w-full'>
                        <FormLabel className=' ml-1 text-black'>Name</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="name" 
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
                    name="state"
                    render={({ field }) => (
                    <FormItem className=' w-full'>
                        <FormLabel className=' ml-1 text-black'>State</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="Eg : Telangana" 
                                {...field} 
                                className=" border-2 border-orange-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <div className=' flex-between gap-6 max-md:flex-col max-md:gap-3'>
                <FormField
                    control={form.control}
                    name="town"
                    render={({ field }) => (
                    <FormItem className=' w-full'>
                        <FormLabel className=' ml-1 text-black'>Town/city</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="Eg : Hyderabad "
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
                    name="area"
                    render={({ field }) => (
                    <FormItem className=' w-full'>
                        <FormLabel className=' ml-1 text-black'>Area,Street,Sector</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="area" 
                                {...field} 
                                className=" border-2 border-orange-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <div className='flex-between gap-6  '>
                <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                    <FormItem className=' w-full'>
                        <FormLabel className=' ml-1 text-black'>Pincode</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="50001" 
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
                    name="houseNo"
                    render={({ field }) => (
                    <FormItem className=' w-full'>
                        <FormLabel className=' ml-1 text-black'>House No</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="house no" 
                                {...field} 
                                className=" border-2 border-orange-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <div className=' w-full pt-2 flex flex-col gap-4'>
                <Button 
                    className=' w-fit px-6 bg-yellow-400 cursor-pointer rounded-xl hover:bg-yellow-400 text-black' 
                    onClick={(e)=> {
                        e.preventDefault();
                        setIsClicked(true);
                    }}
                >
                    use current location
                </Button>
                {isClicked && (
                    <ShowMap setAddressInitVals={setAddressInitVals} />
                )}
            </div>
            <div className=' flex-between pt-3'>
                <button onClick={(e)=> {
                    e.preventDefault();
                    form.reset();
                    setIsUpdate && setIsUpdate(false);
                    setIsAddress && setIsAddress((prev)=> !prev);
                }} className='cancel'>cancel</button>
                <button 
                    className='submit' 
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    onClick={(e)=> {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                    }}
                >
                    {isUpdate && isUpdate===true ? form.formState.isSubmitting ? "updating address":"update address" :
                     form.formState.isSubmitting ? "adding address":"add address" 
                    }
                </button>
            </div>
        </form>
    </Form>
  )
}

export default AddressForm

// type!=="order" && 
