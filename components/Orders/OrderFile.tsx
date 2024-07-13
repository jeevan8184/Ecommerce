import { IProductOrder } from '@/lib/database/models/order.model'
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OrderProduct from './OrderProduct'
import { usePathname, useSearchParams } from 'next/navigation'
import { UserContext } from '../Auth/UserProvider'
import { getAllUserOrders, updateOrderPayment } from '@/lib/database/actions/order.actions'
import Loader from '../Cart/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders } from '@/lib/redux/actions'

const OrderFileSuspense = () => {

  const searchParams=useSearchParams();
  const success=searchParams.get("success");
  const orderId=searchParams.get("orderId");
  const pathname=usePathname();
  const {currUser}=useContext(UserContext);
  const dispatch=useDispatch();
  const allOrders:IProductOrder[]=useSelector((state:any)=> state.address.allOrders);

  useEffect(()=> {
    const newFunc=async()=>{
      if(currUser) {
        if(orderId) {
          const data = await updateOrderPayment(orderId, pathname);
          if(data) console.log("payment",data);
        }
        dispatch(getAllOrders(currUser?._id,pathname));
      }
    }
    newFunc();
  },[currUser])

    if(!currUser || !allOrders) return <Loader />

    const paymentFailed=allOrders?.filter((order)=> !order.isPaid && !order?.isCancel);
    const cancelled=allOrders?.filter((order)=> order?.isCancel && !order?.isPaid);
    const newOrders=allOrders?.filter((order)=> !order?.isCancel);


  return (
    <div className=' w-full flex flex-col pt-3 px-2 gap-3'>
        <h1 className=' font-medium text-2xl'>Your Orders</h1>
        <div className=' flex flex-col flex-1'>
            <Tabs defaultValue="all" className=" w-full bg-transparent">
                <TabsList className=' w-full flex-start gap-4 bg-transparent shadow-none'>
                    <TabsTrigger 
                        value="all" 
                        className=' text-black data-[state=active]:shadow-none data-[state=active]:text-orange-500 data-[state=active]:underline data-[state=active]:underline-offset-4'
                    >
                        All Orders
                    </TabsTrigger>
                    <TabsTrigger 
                        value="cancel" 
                        className='text-black data-[state=active]:shadow-none data-[state=active]:text-orange-500 data-[state=active]:underline data-[state=active]:underline-offset-4'
                    >
                        Cancelled orders
                    </TabsTrigger>
                    <TabsTrigger 
                        value="success" 
                        className='text-black data-[state=active]:shadow-none data-[state=active]:text-orange-500 data-[state=active]:underline data-[state=active]:underline-offset-4'
                    >
                        payment failed
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <div className=' flex flex-col gap-5'>
                        {newOrders?.length>0 && newOrders?.map((order,i)=> (
                            <OrderProduct order={order} key={order._id}/>
                        ))}
                        {newOrders.length<=0 && (
                            <div className=' flex-center py-8 rounded-2xl mt-4 mx-4 bg-slate-50 border'>
                                <p className=' font-medium text-2xl'>There are no recent orders</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="cancel">
                    <div className=' flex flex-col gap-5'>
                        {cancelled?.length>0 && cancelled?.map((order,i)=> (
                            <OrderProduct order={order} key={order._id} type="cancel" />
                        ))}
                         {cancelled.length<=0 && (
                            <div className=' flex-center py-8 rounded-2xl mt-4 mx-4 bg-slate-50 border'>
                                <p className=' font-medium text-2xl'>There are no Cancelled orders</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="success">
                    <div className=' flex flex-col gap-5'>
                        {paymentFailed?.length>0 && paymentFailed?.map((order,i)=> (
                            <OrderProduct order={order} key={order._id} />
                        ))}
                        {paymentFailed.length<=0 && (
                            <div className=' flex-center py-8 rounded-2xl mt-4 mx-4 bg-slate-50 border'>
                                <p className=' font-medium text-2xl'>No Paymet failed Orders</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  )
}

const OrderFile=()=>{
  return <Suspense fallback={<Loader />}>
    <OrderFileSuspense />
  </Suspense>
}

export default OrderFile