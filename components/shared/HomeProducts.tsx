import { IProduct } from '@/lib/database/models/product.model'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface HomeProductsParams {
    product:IProduct
}
const HomeProducts = ({product}:HomeProductsParams) => {
    const [selectedImg, setSelectedImg] = useState(product.productImgs[0].images[0]);
    const router=useRouter();

  return (
        <div className=' flex flex-col items-center gap-1 group p-1 rounded-md w-full'>
            <div className=' flex gap-2'>
                <div className=' relative h-40 w-40 max-sm:h-32 max-sm:w-24 max-md:h-40 max-md:w-32 cursor-pointer'
                    onClick={()=> router.push(`/product/${product._id}`)}
                >
                    <Image
                        src={selectedImg}
                        alt='image'
                        layout='fill'
                        className=' group-hover:scale-105'
                    />
                </div>
                <div className=' flex flex-col py-4 gap-2'>
                    {product.productImgs.map((item,i)=> (
                        <div 
                            className={`relative h-10 w-10 border-2 overflow-hidden rounded-md cursor-pointer ${selectedImg===item.images[0] ? " border-blue-500":" border-gray-500"}`}
                            onClick={()=> setSelectedImg(item.images[0])}
                        >
                            <Image
                                src={item.images[0]}
                                alt='image'
                                layout='fill'
                                className=' group-hover:scale-105'
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className=' flex-center flex-col gap-0 px-4 max-sm:px-3'>
                <p 
                    className=' text-center line-clamp-1 text-sm text-teal-500 cursor-pointer'
                    onClick={()=> router.push(`/product/${product._id}`)}
                >
                    {product.title}
                </p>
                <div className=' flex gap-1 flex-center text-sm'>
                    <div className=' relative text-center'>
                        <p className=''>{formatCurrency(product?.price)}</p>
                        <span className=' absolute top-1/2 transform -translate-x-1/2 w-full h-[0.5px] bg-gray-500'></span>
                    </div>
                    <p className=' text-center'>{formatCurrency(product?.price - Number(product?.price * Number(product?.discount) / 100))}</p>
                </div>
            </div>
        </div>
  )
}

export default HomeProducts
