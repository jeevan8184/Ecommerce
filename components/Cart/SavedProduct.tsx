import { ISaveItems } from '@/lib/database/models/save.model'
import { ShoppingCart, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useContext } from 'react'
import { UserContext } from '../Auth/UserProvider'
import { deleteSaved, moveToCart } from '@/lib/database/actions/save.actions'
import { usePathname, useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { useDispatch } from 'react-redux'
import { getAllCarts, getAllSaved } from '@/lib/redux/actions'

interface SavedProductProps {
    savedItem:ISaveItems,
}

const SavedProduct = ({savedItem}:SavedProductProps) => {
    const {currUser,setCurrUser}=useContext(UserContext);
    const pathname=usePathname();
    const router=useRouter();
    const dispatch=useDispatch();

    const handleDelete=async()=>{

        try {
            const data=await deleteSaved({
                savedId:savedItem._id,
                userId:currUser?._id,
                path:pathname
            });
            if(data) {
                dispatch(getAllSaved(currUser?._id,pathname));
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleCart=async()=>{

        try {
            const data=await moveToCart({
                userId:currUser?._id,
                path:pathname,
                productId:savedItem.product._id,
                color:savedItem.color,
                savedId:savedItem._id
            })
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
            <div className=' relative h-60 w-60 max-sm:h-40 max-sm:w-40 aspect-square' onClick={()=> router.push(`/product/${savedItem.product._id}`)}>
                <Image
                    src={savedItem.savedImsgs[0]}
                    alt='image'
                    layout='fill'
                    className=' cursor-pointer'
                />
            </div>
        </div> 
        <div className=' flex flex-col gap-8 px-2'>
            <div className=' flex flex-col gap-1'>
                <h1 className=' max-w-3xl font-medium cursor-pointer  max-sm:text-sm' onClick={()=> router.push(`/product/${savedItem.product._id}`)}>{savedItem?.product.title}</h1>
                <p className=' mx-1 w-full h-[0.5px] bg-slate-400 rounded-full' />
                <div className=' flex flex-col'>
                    <div className=' flex gap-4 items-center'>
                        <p className=' font-medium text-rose-500 text-xl'>{savedItem.product?.discount}% off</p>
                        <p className=' text-xl font-semibold'>{formatCurrency(Number(savedItem?.product?.price)-Number(savedItem?.product?.price*Number((savedItem?.product?.discount))/100))}</p>
                    </div>
                    <div className=' flex items-center gap-2'>
                        <p className=' text-sm font-light text-gray-700'>M.R.P</p>
                        <div className=' relative inline-block'>
                            <p className=' text-sm'>{formatCurrency(Number(savedItem.product?.price))}</p>
                            <span className='absolute w-full h-[0.5px] bg-slate-700 rounded-full  transform top-1/2 -translate-y-1/2'></span>
                        </div>
                    </div>
                </div>
                <div className=' text-sm'><strong>color : </strong>{savedItem.color}</div>
                <p className=' text-sm text-teal-800 font-medium'>available in stcok</p>
                <div className='  rounded-tr-full rounded-es-full flex bg-teal-700 px-8 py-0.5 text-sm w-fit text-white'>
                    <p className=''>{savedItem.product.cateogory.name}</p>
                </div>
            </div>
            <div className=''>
                <div className=' flex flex-1 gap-6'>
                    <button type='button'
                        className=' flex gap-1 items-center px-4 py-1.5 rounded-[10px] bg-red-500 group hover:bg-white border-2 border-red-500'
                        onClick={()=> handleDelete()}
                    >
                        <Trash2 className=' text-white size-4 group-hover:text-red-500' />
                        <span className=' text-sm text-white group-hover:text-red-500'>Delete</span>
                    </button>
                    <button type='button'
                        className=' flex gap-1.5 items-center px-4 py-1.5 rounded-[10px] bg-yellow-500 group hover:bg-white border-2 border-yellow-500'
                        onClick={()=>handleCart()}
                    >
                        <ShoppingCart className=' text-white size-5 group-hover:text-yellow-500' />
                        <span className=' text-sm text-white group-hover:text-yellow-500'>move to cart</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SavedProduct
