import { ICart } from '@/lib/database/models/cart.model'
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Bookmark, Trash } from 'lucide-react'
import { createSave } from '@/lib/database/actions/save.actions'
import { UserContext } from '../Auth/UserProvider'
import { usePathname, useRouter } from 'next/navigation'
import { cartQuantity, deleteCart } from '@/lib/database/actions/cart.actions'
import { formatCurrency } from '@/lib/utils'
import { useDispatch } from 'react-redux'
import { getAllCarts, getAllSaved } from '@/lib/redux/actions'

interface CartProductProps {
    cart:ICart,
}

const CartProduct = ({cart}:CartProductProps) => {
    const [quantity, setQuantity] = useState(cart?.quantity.toString());
    const {currUser,setCurrUser}=useContext(UserContext);
    const pathname=usePathname();
    const router=useRouter();
    const dispatch=useDispatch();

    useEffect(()=> {
        if(cart) {
            setQuantity(cart?.quantity.toString());
        }
    },[cart]);

    const handleQuantity=async(value:string)=>{
        setQuantity(value);
        try {
            const data=await cartQuantity({
                cartId:cart?._id,
                userId:currUser?._id,
                path:pathname,
                quantity:value
            })
            if(data) {
                setCurrUser(data?.existUser);
                dispatch(getAllCarts(currUser?._id,pathname));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleTrash=async()=>{

        try {
            const data=await deleteCart({
                path:pathname,
                cartId:cart._id,
                userId:currUser._id
            })
            if(data) {
                setCurrUser(data?.existUser);
                dispatch(getAllCarts(currUser?._id,pathname));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSave=async()=>{

        try {
            const data=await createSave({
                productId:cart?.product._id,
                userId:currUser?._id,
                quantity,
                color:cart.color,
                savedImsgs:cart.cartImgs,
                path:pathname,
                cartId:cart._id
            });
            if(data) {
                setCurrUser(data);
                dispatch(getAllCarts(currUser?._id,pathname));
                dispatch(getAllSaved(currUser?._id,pathname));
            }
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className=' flex md:gap-10  max-sm:flex-col gap-1 w-full h-full py-3'>
        <div className=' flex-center'>
            <div className=' relative h-60 w-60 max-sm:h-40 max-sm:w-40 aspect-square' onClick={()=> router.push(`/product/${cart.product._id}`)}>
                <Image
                    src={cart.cartImgs[0]}
                    alt='image'
                    layout='fill'
                    className=' cursor-pointer'
                />
            </div>
        </div>
        <div className=' flex flex-1 flex-col gap-3 px-2'>
            <div className=' flex flex-col gap-1'>
                <h1 className=' max-w-3xl font-medium cursor-pointer max-sm:text-sm' onClick={()=> router.push(`/product/${cart.product._id}`)}>{cart?.product.title}</h1>
                <p className=' mx-1 w-full h-[0.5px] bg-slate-400 rounded-full' />
                <div className=' flex flex-col'>
                    <div className=' flex gap-4 items-center'>
                        <p className=' font-medium text-rose-500 text-xl'>{cart.product?.discount}% off</p>
                        <p className=' text-xl font-semibold'>{formatCurrency(Number(cart?.product?.price)-Number(cart?.product?.price*Number((cart?.product?.discount))/100))}</p>
                    </div>
                    <div className=' flex items-center gap-2'>
                        <p className=' text-sm font-light text-gray-700'>M.R.P</p>
                        <div className=' relative inline-block'>
                            <p className=' text-sm'>{formatCurrency(Number(cart?.product?.price))}</p>
                            <span className='absolute w-full h-[0.5px] bg-slate-700 rounded-full  transform top-1/2 -translate-y-1/2'></span>
                        </div>
                    </div>
                </div>
                <div className=' text-sm'><strong>color : </strong>{cart.color}</div>
                <p className=' text-sm text-teal-800 font-medium'>available in stcok</p>
                <div className='  rounded-tr-full rounded-es-full flex bg-teal-700 px-8 py-0.5 text-sm w-fit text-white'>
                    <p className=''>{cart.product.cateogory.name}</p>
                </div>
            </div>
            <div className=' flex gap-6 max-md:flex-col max-sm:gap-3 items-center max-md:flex-start'>
                <Select onValueChange={(value)=> handleQuantity(value)} value={quantity} defaultValue={cart?.quantity.toString()}>
                    <SelectTrigger className=" w-[70px] h-[30px] focus:ring-0 focus:ring-offset-0 rounded-xl bg-slate-50 border-2 border-slate-500">
                        <SelectValue placeholder="Quantity" />
                    </SelectTrigger>
                    <SelectContent className=' max-w-10'>
                        {Array.from({length:10},(_,i)=> (
                            <SelectItem value={`${i+1}`}>{i+1}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className=' w-full h-full'>
                    <div className=' flex gap-3'>
                        <div className=' flex gap-1'>
                            <button 
                                className=' flex gap-1 items-center px-4 py-1.5 h-fit rounded-[10px] bg-red-500 group hover:bg-white border-2 border-red-500'
                                onClick={handleTrash}
                            >
                                <Trash className=' text-white size-4 group-hover:text-red-500' />
                                <span className=' text-sm text-white group-hover:text-red-500'>Delete</span>
                            </button>
                        </div>
                        <div className=''>
                            <button 
                                className=' flex gap-1 items-center h-fit px-4 py-1.5 rounded-[10px] bg-slate-500 group hover:bg-white border-2 border-slate-500'
                                onClick={()=> handleSave()}
                            >
                                <Bookmark className='text-white size-5 font-semibold group-hover:text-slate-500' />
                                <span className=' text-sm text-white group-hover:text-slate-500'>save for later</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CartProduct
