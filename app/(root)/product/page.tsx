"use client"
import UserProductFile from '@/components/ProductDetails/UserProductFile'
import Footer from '@/components/Cart/Footer'
import React from 'react'
   
const ProductPage = () => {
  return (
    <div className=' w-full h-full flex flex-col'>
        <div className=' w-full h-full max-w-5xl mx-auto pt-4 pb-20'>
            <UserProductFile />
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

export default ProductPage
