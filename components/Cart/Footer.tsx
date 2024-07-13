import { AllRoutes } from '@/lib/constants'
import Link from 'next/link'
import React from 'react'
import { GiShoppingBag } from 'react-icons/gi'

const Footer = () => {

  return (
    <div className=' w-full bg-slate-800 text-white'>
      <div className=' max-w-7xl mx-auto flex-center pt-8 pb-3 px-2'>
          <div className=' flex flex-col gap-4'>
           <div className=' flex flex-col gap-2'>
            <div className=' flex-center gap-1 px-2 rounded-xl -left-px -ml-4'>
                <GiShoppingBag className=' text-5xl  text-orange-500' />
                <h1 className=' text-4xl text-orange-500 opacity-90 underline-offset-8 font-bold rounded-full capitalize'>Shopify</h1>
              </div>
              <p className=' flex-center text-lg font-medium'>Welcome to shopify</p>
           </div>
            <div className=' pt-5 flex max-md:flex-col max-md:flex-center gap-16 max-md:gap-6 w-full'>
              {AllRoutes.map((item,i)=> (
                
                <Link href={item.link} key={i} className=' hover:text-white text-blue-500/90 font-medium text-lg max-sm:text-base'>{item.label}</Link>
              ))}
            </div>
            <div className=' flex-center flex-col pt-8 text-sm leading-6'>
              <div className=' flex gap-3'>
                <p className=''>Conditions of Use & Sale</p>
                <p className=''>Privacy Notice</p>
              </div>
              <p className=''>© copyright 2024, Shopify, Inc. or its affiliates</p>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Footer
