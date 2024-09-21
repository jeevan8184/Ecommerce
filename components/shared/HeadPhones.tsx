import { HomeBuds } from '@/lib/constants'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import { UserContext } from '../Auth/UserProvider'

const HeadPhones = () => {
    const router=useRouter();
    const {currUser,setIsPopup}=useContext(UserContext);
    
  return (
    <div className=' px-2 py-4 bg-white shadow w-full h-full border-t border-t-gray-100'>
        <div className=' flex flex-col gap-6 cursor-pointer'>
            <div className=' flex flex-col gap-1'>
                <h1 className=' text-xl font-semibold'>Discover Our Best Buds</h1>
                <p className=' text-base text-gray-700'>Top picks for immersive sound</p>
            </div>
            <div className=' grid md:grid-cols-6 max-sm:grid-cols-3 sm:grid-cols-3 gap-2 w-full no-scrollbar'>
                {HomeBuds.map(({title,desc,img},i)=> (
                    <div className=' flex flex-col items-center gap-1 hover:scale-105 border p-1 rounded-md' onClick={()=> currUser ? router.push("/products/headphones") : setIsPopup(true)}>
                        <div className=' relative h-40 w-32 max-sm:h-32 max-sm:w-24 max-md:h-40 max-md:w-32'>
                            <Image
                                src={img}
                                alt='image'
                                layout='fill'
                                className=''
                            />
                        </div>
                        <div className=' flex-center flex-col gap-1'>
                            <p className=' font-medium text text-center'>{title}</p>
                            <p className=' text-gray-500 text-center text-sm'>{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default HeadPhones
