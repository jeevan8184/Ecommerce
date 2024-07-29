import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import AddressForm from '../Profile/AddressForm'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {AddressParams, IItems } from '@/lib/constants/types';
import MapItems from './MapItems';
import PreviewPage from './Payment';
import Image from 'next/image';
import { IAddress } from '@/lib/database/models/address.model';
import { getUserAddress } from '@/lib/database/actions/address.actions';
import { UserContext } from '../Auth/UserProvider';
import { usePathname } from 'next/navigation';
import { Edit, PlusCircleIcon } from 'lucide-react';
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { checkoutOrder, createNewOrder } from '@/lib/database/actions/order.actions';
import Loader from '../Cart/Loader';

interface CreateOrderProps {
    allItems:IItems[],
    setAllItems:Dispatch<SetStateAction<IItems[]>>
}

const CreateOrder = ({allItems,setAllItems}:CreateOrderProps) => {
    const [isAddress, setIsAddress] = useState(false);
    const [address, setAddress] = useState<IAddress>();
    const {currUser}=useContext(UserContext);
    const [isRevalidate, setIsRevalidate] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [mobileNo, setMobileNo] = useState('');
    const [error, setError] = useState("");
    const pathname=usePathname();

    const InitVals={
        firstname:currUser?.username,
        pincode:"",
        state:"",
        town:"",
        area:"",
        houseNo:"",
        ...({mobileNo:currUser?.mobileNo})
    }
    const [AddressInitVals, setAddressInitVals] = useState<AddressParams>(InitVals);
    
    useEffect(()=>{
        if(isRevalidate) {
            handleAddress();
            setIsRevalidate(false);
        }
    },[isRevalidate]);

    const handleAddress=async()=>{
        try {
            const data=await getUserAddress(currUser?._id,pathname);
            setAddress(data);
            console.log("address",data);
        } catch (error) {
            console.log(error);
        } 
    }


    const handleSubmit=async()=>{

        try {
            const cartIds=allItems?.map((item)=> item?.cartId && item?.cartId);

            if(AddressInitVals.houseNo) {
                const data=await createNewOrder({
                    allItems,
                    userId:currUser?._id,
                    shippingInfo:{
                        username:AddressInitVals.firstname,
                        pinCode:Number(AddressInitVals.pincode),
                        state:AddressInitVals.state,
                        city:AddressInitVals.town,
                        houseVal:AddressInitVals.houseNo,
                        area:AddressInitVals.area,
                        mobileNo:Number(AddressInitVals.mobileNo)
                    }, 
                    cartIds:cartIds,
                    path:pathname
                })
                const CheckoutItems=allItems?.map((item)=> ({
                    photo:item.allImgs.images[0],
                    name:item.product.title,
                    price:Number(item.product.price),
                    discount:Number(item.product.discount),
                    quantity:Number(item.quantity)
                }))

                await checkoutOrder({CheckoutItems,orderId:data?._id});
            }else{
                const data= await createNewOrder({
                    allItems,
                    userId:currUser?._id,
                    shippingInfo:{
                        username:address?.name!,
                        pinCode:Number(address?.pinCode),
                        state:address?.state!,
                        city:address?.city!,
                        houseVal:address?.houseVal!,
                        area:address?.area!,
                        mobileNo:Number(currUser?.mobileNo)
                    },
                    cartIds:cartIds,
                    path:pathname
                })
                
                const CheckoutItems=allItems?.map((item)=> ({
                    photo:item.allImgs.images[0],
                    name:item.product.title,
                    price:Number(item.product.price),
                    discount:Number(item.product.discount),
                    quantity:Number(item.quantity)
                }))

                await checkoutOrder({CheckoutItems,orderId:data?._id});
            }
        } catch (error) {
            console.log(error);
        }
    }

    console.log("AddressInitVals",AddressInitVals);

  return (
    <div className=' max-w-3xl pb-20 max-md:pb-0 overflow-hidden'>
        <div className=' flex flex-col gap-2'>
            <h1 className=' text-3xl font-normal pr-4 sm:hidden flex-center'>Checkout</h1>
            <div className=' w-full gap-6 flex flex-col'>
                <div className=' flex flex-col w-full'>
                    <h1 className=' text-2xl max-sm:text-[21px] font-medium py-4  text-orange-500'>1. Add Your Address</h1>
                    <div className="flex flex-col gap-4 px-10 max-sm:px-2">
                        <div className=' w-full '>
                            <p className=' w-full h-[0.5px] pr-10 px-5 bg-gray-400' />
                        </div>
                        <div className=' flex flex-col gap-2'>
                            {address && (
                                <div className=' px-3 py-2 flex gap-2 border-2 rounded-xl border-orange-200 bg-orange-50/40'>
                                    <div className=' flex gap-3 items-start'>
                                            <Image
                                                src="/used/location.svg"
                                                alt='image'
                                                height={30}
                                                width={30}
                                            />
                                            <div className=' flex gap-3 max-sm:gap-1'>
                                                <div className=' flex flex-col'>
                                                    <p className=' whitespace-normal text-base'><strong> {address?.name} </strong>
                                                        {address?.houseVal}, {address?.area} , {address?.city.toUpperCase()} , {address?.state.toUpperCase()} , {address?.pinCode}
                                                    </p>
                                                    <p className=''><strong>Mobile No : </strong> {currUser?.mobileNo}</p>
                                                </div>
                                                <Input 
                                                    type='checkbox' 
                                                    id='check' 
                                                    className=' h-6 w-6 bg-white'
                                                    defaultChecked
                                                />
                                            </div>
                                    </div>
                                </div>
                            )}
                            {AddressInitVals.houseNo  ? (
                                <div className=' px-3 py-2 flex gap-2 border-2 rounded-xl border-orange-200 bg-orange-50/40'>
                                    <div className=' flex gap-3 items-start'>
                                            <Image
                                                src="/used/location.svg"
                                                alt='image'
                                                height={30}
                                                width={30}
                                            />
                                            <div className=' flex gap-3 max-sm:gap-1'>
                                                <div className=' flex flex-col'>
                                                    <p className=' whitespace-normal text-base'><strong> {AddressInitVals?.firstname} </strong>
                                                        {AddressInitVals?.houseNo}, {AddressInitVals?.area} , {AddressInitVals?.town.toUpperCase()} , {AddressInitVals?.state.toUpperCase()} , {AddressInitVals?.pincode}
                                                    </p>
                                                    {!isEdit ? (
                                                        <div className=' flex-between w-full pt-1'>
                                                            <p className=''><strong>Mobile No : </strong> {AddressInitVals.mobileNo}</p>
                                                            <Edit onClick={()=> {
                                                                    setMobileNo(AddressInitVals?.mobileNo!);
                                                                    setIsEdit((prev)=> !prev);
                                                                }} 
                                                                className=' size-5 font-normal text-violet-500 cursor-pointer' 
                                                            />
                                                        </div>
                                                    ):(
                                                        <div className=' flex'>
                                                            <div className=' flex flex-col'>
                                                                <div className=' w-full max-w-96'>
                                                                    <Input
                                                                        autoFocus
                                                                        type='number'
                                                                        placeholder=''
                                                                        value={mobileNo}
                                                                        onChange={(e)=> setMobileNo(e?.target?.value)}
                                                                        className=' flex-grow border-t-0 border-r-0 border-l-0 rounded-none border-b-2 border-b-slate-900 focus:border-b-accent-foreground focus-visible:ring-0 focus-visible:ring-offset-0'
                                                                    />
                                                                </div>
                                                                {error && (
                                                                    <p className=' pt-1 text-red-500 font-medium text-sm'>{error}</p>
                                                                )}
                                                            </div>
                                                            <button 
                                                                className='submit1 ml-2 w-fit h-fit' 
                                                                onClick={()=> {
                                                                    if(!mobileNo) return;
                                                                    if(parsePhoneNumberFromString(mobileNo.toString(),"IN")?.isValid()) {
                                                                        setAddressInitVals((prev)=> ({...prev,mobileNo}));
                                                                        setMobileNo('');
                                                                        setIsEdit((prev)=> !prev);
                                                                    }else{
                                                                        setError("please Enter a valid moileNo");
                                                                        setTimeout(()=> {
                                                                            setError("");
                                                                        },2000)
                                                                    }
                                                                }}
                                                            >
                                                                Add
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <Input 
                                                    type='checkbox' 
                                                    id='check' 
                                                    className=' h-6 w-6 bg-white'
                                                />
                                            </div>
                                    </div>
                                </div>
                            ):null}
                        </div>
                        <div className=''>
                            {isAddress ? (
                                <AddressForm 
                                    setIsAddress={setIsAddress}
                                    AddressInitVals={AddressInitVals}
                                    setAddressInitVals={setAddressInitVals}
                                    type='order'
                                />
                            ):(
                                <p  
                                    className='cursor-pointer text-blue-500 text-sm font-semibold w-fit flex gap-1 items-center'
                                    onClick={()=> setIsAddress((prev)=> !prev)}
                                >
                                    <PlusCircleIcon className=' size-5' />
                                    Add new address
                                </p>
                            )}
                        </div>
                        {/* {!isAddress && (
                            <Button 
                                className=' rounded-xl w-fit px-8 bg-yellow-400 text-black hover:bg-yellow-500'
                            >
                                use this address
                            </Button>
                        )} */}
                    </div>
                </div>
                <div className=' flex flex-col gap-4'>
                    <div className=' flex flex-col gap-0'>
                        <h1 className='max-sm:text-[21px] text-2xl font-medium py-2 text-orange-500'>2. Items and Delivery</h1>
                        <p className=' text-[17px] pl-3'>Checkout your order items</p>
                    </div>
                    <div className=' flex flex-col flex-1 rounded-xl border-2 px-2 py-3 ml-3'>
                        <div className=' flex flex-col gap-6 w-full'>
                            {allItems?.length>0 && allItems?.map((item,i)=> (
                                <MapItems item={item} key={i} setAllItems={setAllItems} />
                            ))}                  
                        </div>
                    </div>
                </div>
                <div className=' w-full'>
                    <h1 className=' text-2xl max-sm:text-[21px] font-medium py-4  text-orange-500'>3. Payment method</h1>
                    <PreviewPage handleSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateOrder