import React, { useContext } from 'react'
import Image from 'next/image'
import { HomeWatches } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { UserContext } from '../Auth/UserProvider'

const Electronics = () => {
   const router=useRouter();
   const {currUser,setIsPopup}=useContext(UserContext);


  return (
        <div className=' px-2 py-4 bg-white shadow w-full h-full border-t border-t-gray-100'>
            <div className=' flex flex-col gap-5 cursor-pointer'>
                <div className=' flex flex-col gap-1'>
                    <h1 className="text-2xl font-semibold text-center text-gray-800">Watches at Discount</h1>
                    <p className="text-center text-gray-700">
                        Discover the latest smartwatches at unbeatable prices. Limited time offers on top brands!
                    </p>
                </div>
                <div className=' grid grid-cols-4 max-sm:grid-cols-2 gap-8 w-full' onClick={()=> currUser ? router.push("/products/Watches") : setIsPopup(true)}>
                    {HomeWatches.map(({title,description,dec,img},i)=> (
                        <div className=' flex flex-col items-center gap-1 group'>
                            <div className=' relative h-60 w-52 max-sm:h-40 max-sm:w-32 max-lg:h-48 max-lg:w-40'>
                                <Image
                                    src={img}
                                    alt='image'
                                    layout='fill'
                                    className=' group-hover:scale-105'
                                />
                            </div>
                            <div className=' flex-center flex-col gap-1'>
                                <p className=' font-medium text-lg text-center'>{title}</p>
                                <p className=' text-rose-700'>{dec}</p>
                                <p className='text-center text-sm text-gray-700 line-clamp-2 max-sm:whitespace-normal max-sm:px-2'>{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
  )
}

export default Electronics