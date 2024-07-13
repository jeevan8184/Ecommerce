import { IProduct } from '@/lib/database/models/product.model'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface ProductMapParams {
    product:IProduct,
    type:"cateogory" | "related"
}
const ProductMap = ({product,type}:ProductMapParams) => {
    const router=useRouter();
    const [selectedImg, setSelectedImg] = useState("");

    useEffect(()=>{
        setSelectedImg(product.productImgs[0].images[0]);
    },[product]);

    const filled=Math.floor(product?.avgRating);
    const half=(product?.avgRating)%1>=0.5 ? 1 : 0;
    const empty=5-filled-half;

  return (
    <div className=' px-2 py-1 border-2 rounded-md hover:shadow hover:border-none'>
        <div className=' flex flex-col gap-4 group'>
            <div className=' flex-center'>
                <div 
                    className={`relative ${type==="related" ? " lg:h-52 lg:w-52 max-md:w-48 max-md:h-48 ":" lg:h-72 lg:w-72 max-md:w-56 max-md:h-56"} cursor-pointer max-lg:h-44 max-lg:w-44 max-sm:h-40 max-sm:w-40 aspect-square`} 
                    onClick={()=> router.push(`/product/${product._id}`)}
                >
                    <Image
                        src={selectedImg}
                        className=' rounded-md group-hover:scale-105'
                        alt='image'
                        layout='fill'
                    />
                </div>
            </div>
            <div className=' flex flex-col gap-1'>
                <p 
                    className={`font-medium max-sm:text-sm text-base cursor-pointer line-clamp-2 hover:text-teal-600 ${type==="related" ? " text-sm":""}`} 
                    onClick={()=> router.push(`/product/${product._id}`)}
                >
                    {product.title}
                </p>
                <div className=' flex px-4 gap-4 text-lg flex-center'>
                    <div className=' flex gap-1 text-gray-600'>
                        <p className=' text-sm'>M.R.P</p>
                        <div className=' relative'>
                            <p className=' text-base'>{formatCurrency(product?.price)}</p>
                            <span className=' h-[1px] w-full bg-gray-800 absolute top-1/2 transform -translate-y-1/2'></span>
                        </div>
                    </div>
                    <p className=' text-base font-medium max-lg:hidden'>({product?.discount}% off)</p>
                </div>
                <div className=' flex-center gap-2'>
                    <p className=' text-center text-xl max-lg:text-lg text-rose-700'>{formatCurrency(product?.price - Number(product?.price * Number(product?.discount) / 100))}</p>
                    <p className=' text-base font-medium lg:hidden'>({product?.discount}% off)</p>
                </div>

                <div className=' flex-between gap-1'>
                    <div className=' flex gap-2 items-center'>
                        <p className=''>{product?.avgRating && product?.avgRating}</p>
                        {product?.avgRating && (
                        <div className=' flex gap-0.5 py-2'>
                            {Array.from({length:filled},()=> (
                                <div className=''>
                                <Image
                                    src="/used/star1.svg"
                                    alt='image'
                                    height={20}
                                    width={20}
                                    className=''
                                />
                                </div>
                            ))}
                            {Array.from({length:half},()=> (
                                <div className=''>
                                <Image
                                    src="/used/star.svg"
                                    alt='image'
                                    height={20}
                                    width={20}
                                    className=''
                                />
                                </div>
                            ))}
                            {Array.from({length:empty},()=> (
                                <div className=''>
                                <Image
                                    src="/used/star2.svg"
                                    alt='image'
                                    height={20}
                                    width={20}
                                    className=''
                                />
                                </div>
                            ))}
                        </div>
                        )}
                    </div>

                    <div className=' flex gap-1'>
                        <div className=' flex gap-1'>
                            {product?.productImgs.map((item,i)=> (
                                <div 
                                    className={`relative h-10 w-10 max-lg:h-8 max-lg:w-8 cursor-pointer rounded border-2 overflow-hidden ${selectedImg===item.images[0] ? " group-hover:border-blue-500":""}`}
                                    onClick={()=> setSelectedImg(item.images[0])}
                                >
                                    <Image
                                        src={item.images[0]}
                                        alt='image'
                                        layout='fill'
                                        className=''
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default ProductMap
