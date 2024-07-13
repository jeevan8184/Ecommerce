"use client"
import ProductCreate from '@/components/Product/ProductCreate';
import Footer from '@/components/Cart/Footer';
import React from 'react';

const CreateProductPage = () => {
  
  return (
    <section className=' w-full'>
        <div className=' flex flex-col gap-1 w-full'>
            <div className=' w-full max-w-7xl mx-auto'>
              <ProductCreate />
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
    </section>
  )
}

export default CreateProductPage
