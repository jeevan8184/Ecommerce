"use client"
import { HomeImgs } from '@/lib/constants'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import { UserContext } from '../Auth/UserProvider'

const HomeMaps = () => {
    const router=useRouter();
    const {currUser}=useContext(UserContext);


  return (
    <div className=' shadow-md bg-white px-8 py-1 w-full mx-auto mt-3 border-t border-t-gray-100'>
        <div className=' mx-auto flex-center'>
            <div className=' flex gap-20 max-sm:gap-5 max-md:gap-10'>
                {HomeImgs.map(({label,img,link},i)=> (
                    <div className=' flex flex-col gap-1 cursor-pointer items-center' onClick={()=> currUser && router.push(link)} key={i}>
                        <div className=' relative h-16 w-16 max-sm:h-10 max-sm:w-10'>
                            <Image
                                src={img}
                                alt='image'
                                layout='fill'
                                className=' bg-white'
                            />
                        </div>
                        <p className=' font-medium text-sm line-clamp-1'>{label}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default HomeMaps