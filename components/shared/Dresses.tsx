import { HomeDresses1, HomeDresses2 } from '@/lib/constants'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import { UserContext } from '../Auth/UserProvider'

const Dresses = () => {
    const router=useRouter();
    const {currUser}=useContext(UserContext);

  return (
        <div className=' px-2 py-4 bg-white shadow w-full h-full border-t border-t-gray-100'>
            <div className=' flex flex-col gap-6'>
                <div className=' flex flex-col gap-1'>
                    <h1 className=' text-xl font-semibold'>Explore Our Latest Collection of Dresses</h1>
                    <p className=' text-base text-gray-700'>Discover the perfect attire for every occasion with our curated selection<span className=' max-sm:hidden'>of stylish and affordable dresses.</span> </p>
                </div>
                <div className=' grid md:grid-cols-4 max-sm:grid-cols-2 sm:grid-cols-3 gap-10 max-sm:gap-4 w-full no-scrollbar'>
                    {HomeDresses1.map(({title,desc,img},i)=> (
                        <div className=' flex flex-col items-center gap-1 hover:scale-105 border p-1 rounded-md cursor-pointer' onClick={()=> currUser && router.push("/products/mens wear")}>
                            <div className=' relative h-64 w-52 max-sm:h-40 max-sm:w-32 max-md:h-40 max-md:w-32'>
                                <Image
                                    src={img}
                                    alt='image'
                                    layout='fill'
                                    className=''
                                />
                            </div>
                            <div className=' flex-center flex-col gap-1'>
                                <p className=' font-medium text-lg text-center'>{title}</p>
                                <p className=' text-teal-600'>{desc}</p>
                            </div>
                        </div>
                    ))}
                    {HomeDresses2.map(({title,desc,img},i)=> (
                        <div className=' flex flex-col items-center gap-1 hover:scale-105 border p-1 rounded-md cursor-pointer' onClick={()=> currUser && router.push("/products/womens wear")}>
                            <div className=' relative h-72 w-44 max-sm:h-40 max-sm:w-32 max-md:h-40 max-md:w-32'>
                                <Image
                                    src={img}
                                    alt='image'
                                    layout='fill'
                                    className=''
                                />
                            </div>
                            <div className=' flex-center flex-col gap-1'>
                                <p className=' font-medium text-lg text-center'>{title}</p>
                                <p className=' text-teal-600'>{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
  )
}

export default Dresses