import { IProductOrder } from '@/lib/database/models/order.model'
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import { formatCurrency, formatDateTimeOpt } from '@/lib/utils'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
  

import { usePathname, useRouter } from 'next/navigation'
import { cancelOrder, checkoutOrder, deleteOrder, updateOrderDelivery } from '@/lib/database/actions/order.actions'
import { useDispatch } from 'react-redux'
import { getAllOrders } from '@/lib/redux/actions'
import { UserContext } from '../Auth/UserProvider'
  

interface OrderProductProps {
    order:IProductOrder,
    type?:string
}

const OrderProduct = ({order,type}:OrderProductProps) => {

    const pathname=usePathname();
    const [selectedValue, setSelectedValue] = useState(order?.isDelivered ? 'shipped' : undefined);
    const router=useRouter();
    const dispatch=useDispatch();
    const {currUser}=useContext(UserContext);

    const handleDelivery=async()=>{
        try {
            const data=await updateOrderDelivery(order?._id,pathname);
            if(data) {
                dispatch(getAllOrders(currUser?._id,pathname));
                setSelectedValue("shipped");
            }
            console.log("handleDeliver",data);
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleDelete=async()=>{
        try {
            const data=await deleteOrder(order?._id,pathname);
            if(data) {
                dispatch(getAllOrders(currUser?._id,pathname));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleCancel=async()=>{

        try {
            const data=await cancelOrder(order._id,pathname);
            if(data) {
                dispatch(getAllOrders(currUser?._id,pathname));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handlePayment=async()=>{
        
        const CheckoutItems=order?.orderProducts?.map((item,i)=> ({
            photo:item.photo,
            name:item.product.title,
            discount:Number(item.product.discount),
            price:Number(item.product.price),
            quantity:Number(item.quantity)
        }))
        await checkoutOrder({CheckoutItems,orderId:order?._id});
    }


  return (
    <div className=' flex flex-col pt-4'>
        <div className=' w-full flex flex-col border-2 border-slate-400 rounded-xl overflow-hidden'>
            <div className=' flex flex-col gap-2'>
                <div className=' flex px-4 py-2 bg-slate-100 border-b flex-between'>
                    <div className=' flex flex-col gap-0'>
                        <p className=' font-medium'>{formatDateTimeOpt(order?.createdAt).dateTimeOnly}</p>
                        {order?.isPaid && (
                            <p className=' text-sm'>paid at : {formatDateTimeOpt(order?.paidAt).dateOnly}</p>
                        )}
                        {order?.isDelivered && (
                            <p className=' text-sm'> deliveredAt : {formatDateTimeOpt(order?.deliveredAt).dateOnly}</p>
                        )}
                    </div>
                    <div className=' flex flex-col gap-0'>
                        <p className=' font-medium text-xl flex gap-1'>Order total : 
                            <span className=' text-rose-700'> {formatCurrency(order?.totalPrice)}</span> 
                        </p>
                        <p className=' flex-end text-sm'> tax price : {formatCurrency(order?.taxPrice)}</p>
                    </div>
                </div>
                <div className=' flex max-md:flex-col gap-5 h-full'>
                    <div className=' flex flex-col gap-4 max-lg:gap-0 lg:gap-4 px-4 py-2'>
                        {order.orderProducts.map((productItem,i)=> (
                            <div className=' flex gap-3 w-full' key={i}>
                                <div className=' flex'>
                                    <div className=' relative h-32 w-32 aspect-square max-w-full' onClick={()=> router.push(`/product/${productItem?.product?._id}`)}>
                                        <Image
                                            src={productItem.photo}
                                            alt="Image"
                                            layout='fill'
                                            className=' cursor-pointer'
                                        />
                                    </div>
                                </div>
                                <div className=' flex flex-col max-w-lg pt-2 gap-1'>
                                    <p className=' font-medium text-sm cursor-pointer' onClick={()=> router.push(`/product/${productItem?.product?._id}`)}>{productItem.product.title}</p>
                                    <p className=' text-rose-500'>{formatCurrency(productItem.product?.price - Number(productItem?.product?.price * Number(productItem?.product?.discount) / 100))}</p>
                                    <p className=' flex text-sm'><strong>Color : </strong> {productItem?.color} </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className=' flex gap-4 max-sm:gap-10 md:flex-col h-full relative max-md:bg-slate-100 px-4 pb-3 pt-1 max-lg:px-1 max-md:px-6 lg:pr-8 max-md:border-t'>
                        {type && type==="cancel" ? (
                            <div className='flex gap-4'>
                                <button 
                                    className=' px-4 py-1.5 bg-yellow-500 rounded-xl text-sm font-medium max-sm:text-sm'
                                    onClick={handleDelete}
                                >
                                    Delete order
                                </button>
                                
                            </div>
                        ):(
                            <div className=''>
                            {order?.isPaid || order?.isDelivered ? (
                                <div className=' flex flex-col gap-1'>
                                    <h2 className=' text-green-500 font-semibold text-[22px] flex-center capitalize'>{order?.orderStatus}</h2>
                                    <div className=' flex flex-col gap-2 flex-center'>
                                        {order?.isDelivered ? (
                                            <p className=' text-base font-medium'>product delivered</p>
                                        ):(
                                            <Select onValueChange={handleDelivery} value={selectedValue}>
                                                <SelectTrigger className="w-[150px] h-8 focus:ring-0 focus:ring-offset-0 rounded-xl bg-slate-50 border-2 border-slate-500">
                                                    <SelectValue placeholder="cateogory" className=' text-sm flex-start' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="shipped">shipped</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                        {order?.orderStatus !=="processing" && (
                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                <button 
                                                    className=' px-4 py-1.5 bg-yellow-500 rounded-xl text-sm font-medium'
                                                >
                                                    Delete order
                                                </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel className='cancel1'>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction 
                                                        className=' rounded-full bg-red-500 px-6 hover:bg-red-500'
                                                        onClick={handleDelete}
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </div>
                            ):(
                                <div className=' flex flex-col gap-1'>
                                    <h2 className=' text-red-500 font-semibold text-[22px] flex-center'>Payment failed</h2>
                                    <div className=' flex flex-col gap-2'>
                                        <button 
                                            className=' px-4 py-1.5 bg-orange-400 hover:bg-orange-500 rounded-xl text-sm font-medium max-sm:text-sm'
                                            onClick={()=> handlePayment()}
                                        >
                                            Retry payment
                                        </button>
                                        <button 
                                            className=' px-4 py-1.5 bg-yellow-500 rounded-xl text-sm font-medium max-sm:text-sm'
                                            onClick={handleCancel}
                                        >
                                            cancel order
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        )}
                        {type!=="cancel" && (
                            <div className=' flex flex-col gap-1'>
                                <p className=' font-medium'>Shipping Address</p>
                                <div className=' flex flex-col text-sm font-normal'>
                                    <p className=''>{order?.shippingInfo?.username}</p>
                                    <p className=''>{order?.shippingInfo.houseVal}</p>
                                    <p className=''>{order?.shippingInfo?.area}</p>
                                    <p className=' uppercase'>{order?.shippingInfo?.state} , {order?.shippingInfo.city}</p>
                                    <p className=''>{order?.shippingInfo.pinCode}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
export default OrderProduct