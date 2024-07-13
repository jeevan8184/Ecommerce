"use client"

import { UserContext } from '@/components/Auth/UserProvider'
import CreateOrder from '@/components/Orders/CreateOrder';
import Loader from '@/components/Cart/Loader';
import { Button } from '@/components/ui/button';
import { IItems } from '@/lib/constants/types';
import { getOrderProducts } from '@/lib/database/actions/cart.actions';
import { formatCurrency } from '@/lib/utils';
import React, { useContext, useEffect, useState } from 'react'
import { GiShoppingBag } from 'react-icons/gi';

const OrdersPage = () => {
    const {currUser}=useContext(UserContext);
    const [allItems, setAllItems] = useState<IItems[]>([]);

    useEffect(()=> {
        const newFunc=async()=>{
            if(currUser) {

                try {
                    const data=await getOrderProducts(currUser?._id);
                    console.log("data",data);
                    setAllItems(data);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        newFunc();
    },[currUser]);
    
    if(!currUser || !allItems) return <Loader />
    console.log("allItems",allItems);

    const items=allItems.reduce((acc,item)=> {
        return acc+item.quantity;
    },0);

    const tax = allItems.reduce((acc, item) => {
        const itemTax = Number(item?.product?.price * Number(item?.product?.discount) / 100) * (0.6 / 100);
        return acc + itemTax;
    }, 0);

    const price = allItems.reduce((acc, item) => {
        const discountedPrice = item.product?.price - Number(item?.product?.price * Number(item?.product?.discount) / 100);
        const itemTax = Number(item?.product?.price * Number(item?.product?.discount) / 100) * (0.6 / 100);
        return acc + discountedPrice + itemTax;
    }, 0);

  return (
        <div className=' w-full h-full'>
            <div className='flex w-full flex-col gap-1 border-b border-b-gray-300 bg-white z-50 fixed top-0 border shadow-sm py-3 max-sm:py-2'>
                <div className=' w-full flex gap-1 max-w-7xl mx-auto px-2'>
                <div className=' flex gap-40 max-lg:gap-60 lg:gap-80 items-center'>
                    <div className=' flex gap-1 items-center'>
                        <GiShoppingBag className=' text-5xl text-orange-500' />
                        <h1 className='shopify'>Shopify</h1>
                    </div>
                    <h1 className=' text-4xl font-normal pr-4 max-sm:hidden'>Checkout</h1>
                </div>
                </div>
            </div>
            <div className=' mx-auto max-w-7xl px-2 py-8 pt-20'>
                <div className='flex max-md:flex-col gap-6 max-md:gap-0'>
                    <CreateOrder 
                        allItems={allItems}
                        setAllItems={setAllItems}
                    />
                    <div className=' flex max-md:flex-center'>
                        <div className=' sticky top-24 px-4 py-6 bg-gray-50 border border-gray-300 rounded-lg max-w-md w-[320px] max-md:w-full h-fit'>
                            <div className=' flex flex-col gap-1'>
                                <Button className=' flex-center bg-yellow-400 hover:bg-yellow-400 rounded-full text-black px-12'>place your order</Button>
                                <p className=' w-full h-[1px] bg-gray-400' />
                                <div className=' flex flex-1 flex-col gap-1'>
                                    <h1 className=' text-[17px] pt-2 font-semibold'>Order summary</h1>
                                    <div className=' w-full text-[13px]'>
                                        <div className=' w-full flex-between'>
                                            <p className=''>items</p>
                                            <p className=''>{items}</p>
                                        </div>
                                        <div className=' w-full flex-between'>
                                            <p className=''>taxes</p>
                                            <p className=''>{formatCurrency(tax)}</p>
                                        </div>
                                        <div className=' w-full flex-between'>
                                            <p className=''>items price</p>
                                            <p className=''>{formatCurrency(price)}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className=' w-full h-[0.5px] mt-1 bg-gray-400' />
                                <div className=' w-full flex-between text-rose-700 text-lg'>
                                    <p className=''>Order total</p>
                                    <p className=''>{formatCurrency(Number(price+tax))}</p>
                                </div>
                                <p className=' w-full h-[0.5px] mt-1 bg-gray-400' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default OrdersPage
