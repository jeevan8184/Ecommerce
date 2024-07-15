import React, { useContext, useEffect } from 'react'
import { UserContext } from '../Auth/UserProvider';
import Link from 'next/link';
import { BadgePlusIcon, Package2, ShoppingBag } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Loader from '../Cart/Loader';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { getAddress } from '@/lib/redux/actions';

const ProfileProducts = () => {
    const {currUser}=useContext(UserContext);
    const pathname=usePathname();
    const dispatch=useDispatch();
    const address=useSelector((state:any)=> state.address.address);
    const router=useRouter();

    useEffect(()=> {
        if(currUser) {
            dispatch(getAddress(currUser?._id,pathname));

        }
    },[currUser]);

    // if(!address) return <Loader />

  return (
    <div className=' w-full h-full shadow-md border rounded bg-white'>
        <div className=' px-3 max-md:px-2 py-6 flex flex-col gap-4'>
            {address && (
                <div className=' flex flex-col gap-2'>
                    <h1 className=' text-lg font-medium'> Your Address : </h1>
                    <div className=' flex gap-3 px-3 max-sm:px-1 pl-8 py-2 border-2 rounded-xl border-orange-200 bg-orange-50/40 max-sm:flex-start'>
                        <Image
                            src="/used/location.svg"
                            alt='image'
                            height={30}
                            width={30}
                        />
                        <div className=' flex flex-col gap-1'>
                            <p className=''><strong> {address?.name} </strong>
                                {address?.houseVal}, {address?.area} , {address?.city.toUpperCase()} , {address?.state.toUpperCase()} , {address?.pinCode}
                            </p>
                            <p className=''><strong className=''>Mobile No : </strong> {currUser?.mobileNo}</p>
                        </div>
                    </div>
                </div>
            )}
            <div className=' flex flex-col'>
                <div className=' grid grid-cols-3 gap-4 max-lg:grid-cols-2 w-full'>
                    {currUser ?.products.length>0 ? (
                        <div 
                            className=' flex-center flex-col gap-2 border-2 border-orange-400 bg-orange-500/10 px-4 py-6 rounded-2xl cursor-pointer'
                            onClick={()=> router.push("/product")}
                        >
                            <p className=' text-xl font-medium text-center'>Your products</p>
                            <Package2 className='flex-center size-9 text-orange-400 font-medium' />
                            <p className=' flex gap-1'>
                                <span className=' font-medium max-sm:text-sm'>total products : </span>
                                {currUser?.products.length}
                            </p>
                        </div>
                    ):(
                        <div className=' flex-center flex-col gap-2 border-2 border-orange-400 bg-orange-500/10 px-4 py-6 rounded-2xl cursor-pointer'>
                            <h1 className=' text-lg font-semibold'>No products found</h1>
                            <p className=' text-center text-sm'>Select admin to create a product</p>
                        </div>
                    )}
                    {currUser?.userType==="Admin" && (
                        <div 
                            className='  flex-center flex-col gap-2 border-2 w-full border-red-400 bg-red-500/10 px-4 py-6 rounded-2xl cursor-pointer'
                            onClick={()=> router.push("/create")}
                        >
                            <p className=' text-xl font-medium max-lg:hidden text-center'>Create a New Product</p>
                            <p className=' text-xl font-medium lg:hidden text-center'>Create a Product</p>
                            <BadgePlusIcon className='flex-center size-9 text-red-500 font-medium' />
                            <Link
                                href="/create"
                                className=' text-blue-500 font-semibold hover:underline'
                            >
                                create product
                            </Link>
                        </div>
                    )}
                    <div 
                        className='  flex-center flex-col gap-2 border-2 bg-gradient-to-r border-yellow-500 bg-yellow-500/20 px-4 py-6 rounded-2xl cursor-pointer'
                        onClick={()=> router.push("/orders")}
                    >
                        <p className=' text-xl font-semibold text-center'>Your Orders</p>
                        <ShoppingBag className=' flex-center size-9 text-yellow-400 font-medium' />
                        <p className=' flex gap-1'>
                            <span className=' font-medium max-sm:text-sm'>total orders : </span>
                            {currUser?.orderItems.length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProfileProducts
