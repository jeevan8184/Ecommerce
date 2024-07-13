import { usePathname, useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'
import { UserContext } from '../Auth/UserProvider';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { getRecentView } from '@/lib/redux/actions';
import { IProduct } from '@/lib/database/models/product.model';

const RecentlyViewed = () => {
    const router=useRouter();
    const {currUser}=useContext(UserContext);
    const pathname=usePathname();
    const dispatch=useDispatch();
    const allRecent=useSelector((state:any)=> state.address.allRecent);

    useEffect(()=> {
        if(currUser) {
            dispatch(getRecentView(currUser?._id,pathname));
        }
    },[currUser]);

    if(!allRecent) return;

  return (
    <div className={`${allRecent?.products.length>0 ? "flex":"hidden"} px-2 py-4 bg-white shadow w-full h-full border-t border-t-gray-100`}>
        <div className=' flex flex-col gap-5 w-full'>
            <h1 className=' text-xl font-semibold md:px-3'>Recently Viewed Products</h1>
            <div className=' flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory relative w-full '>
                {allRecent?.products.map((product:IProduct,i:any)=> (
                    <div 
                        className=' cursor-pointer flex flex-col gap-1 snap-center shrink-0 border-2 rounded-xl overflow-hidden px-1.5 py-2 border-gray-300 h-full max-w-[200px]' 
                        key={i}
                        onClick={()=> router.push(`/product/${product._id}`)}
                    >
                        <div className=' relative h-40 w-40'>
                            <Image
                                src={product?.productImgs[0]?.images[0]}
                                alt='image'
                                layout='fill'
                                className=''
                            />
                        </div>
                        <div className=' flex flex-col gap-1'>
                            <p className=' text-clip overflow-clip line-clamp-2 max-sm:line-clamp-1 text-sm'>{product.title}</p>
                            <p className=' text-rose-700 text-[13px] text-center'>{product.discount}% off</p>
                            <div className=' flex gap-1 flex-center text-sm'>
                                <div className=' relative text-center'>
                                    <p className=''>{formatCurrency(product?.price)}</p>
                                    <span className=' absolute top-1/2 transform -translate-x-1/2 w-full h-[0.5px] bg-gray-500'></span>
                                </div>
                                <p className=' text-center'>{formatCurrency(product?.price - Number(product?.price * Number(product?.discount) / 100))}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default RecentlyViewed;
