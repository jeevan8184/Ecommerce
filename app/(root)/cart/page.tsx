"use client"
import { UserContext } from '@/components/Auth/UserProvider'
import CartFile from '@/components/Cart/CartFile';
import Footer from '@/components/Cart/Footer';
import Loader from '@/components/Cart/Loader';
import RelatedCarts from '@/components/Cart/RelatedCarts';
import SavedFile from '@/components/Cart/SavedFile';
import { getAllCarts, getAllSaved, getRelatedCart } from '@/lib/redux/actions';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { Suspense, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const CartSuspense = () => {
  const {currUser}=useContext(UserContext);
  const dispatch=useDispatch();
  const pathname=usePathname();
  const allCarts=useSelector((state:any)=> state.address.allCarts);
  const allSaved=useSelector((state:any)=> state.address.allSaved);
  const searchParams=useSearchParams();
  const success=searchParams.get("success");

  useEffect(()=> {
    if(currUser || success) {
      dispatch(getAllSaved(currUser?._id,pathname));
      setTimeout(()=> {
        dispatch(getAllCarts(currUser?._id,pathname));
      },100)
      setTimeout(()=> {
        dispatch(getRelatedCart(currUser?._id,pathname));
      },200);

      console.log("success",success);
    }
  },[currUser,success]);

  return (
    <div className=' w-full'>
      <div className=' max-w-7xl mx-auto pb-24 flex flex-col gap-6'>
        <div className=' flex flex-col'>
        <CartFile 
          allCarts={allCarts}
        />
        <SavedFile
          allSaved={allSaved}
        />
        </div>
        <div className=''>
          <RelatedCarts />
        </div>
      </div>
      <div className=' text-white w-full flex flex-col'>
        <div className=' flex-center px-4 py-2 bg-slate-700 cursor-pointer' 
          onClick={()=> window.scrollTo({top:0,behavior:"smooth"})}
        >
          <p className=''>Back to top</p>
        </div>
        <Footer />
      </div>
    </div>
  )
}

const Cart=()=>{
  return(
    <Suspense fallback={<Loader />}>
      <CartSuspense />
    </Suspense>
  )
}

export default Cart

