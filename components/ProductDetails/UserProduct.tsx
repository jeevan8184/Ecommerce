import { IProduct } from '@/lib/database/models/product.model'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface UserProductProps {
    product:IProduct
}

const UserProduct = ({product}:UserProductProps) => {
  const [selectedImg, setSelectedImg] = useState(product?.productImgs[0]?.images[0]);
  const router=useRouter();

  const filled=Math.floor(product?.avgRating);
  const half=(product?.avgRating)%1>=0.5 ? 1 : 0;
  const empty=5-filled-half;

  return (
    <div className=' flex flex-col gap-2 border-2 bg-white px-3 py-4 pb-6 rounded-xl'>
      <div className=' flex gap-2'>
        <div className=' flex'>
          <div className=' relative cursor-pointer h-72 h- w-72 max-sm:w-40 max-sm:h-40 aspect-square' onClick={()=> router.push(`/product/${product._id}`)}>
            <Image
              src={selectedImg}
              className=' rounded-md'
              alt='image'
              layout='fill'
            />
          </div>
        </div>
        <div className=' flex flex-col max-w-xl'>
          <div className=' flex flex-col'>
            <p className=' font-medium max-sm:text-sm cursor-pointer' onClick={()=> router.push(`/product/${product._id}`)}>{product.title}</p>
            <div className=' flex gap-1 items-center'>
              <p className=''>{product?.avgRating && product?.avgRating}</p>
              {product?.avgRating && (
                <div className=' flex gap-1 py-2'>
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
            <div className=' w-full mx-auto pr-2'>
              <p className=' w-full h-[0.5px] bg-slate-400 rounded-full' />
            </div>
            <div className=' text-sm py-1 flex flex-col gap-1'>
              <p className=''>
                <strong>price : </strong> {product?.price}
              </p>
              <p className=''>
                <strong>discount : </strong> {product?.discount}%
              </p>
            </div>
            <div className=' flex flex-1 flex-col gap-2 max-sm:hidden text-sm pt-2'>
              {product?.productImgs.map((item,i)=> (
                <div className=' flex flex-col gap-1' key={i}>
                  <div className=' flex flex-col gap-0'>
                    <p className=''>
                      <strong>color : </strong> {item?.color}
                    </p>
                    <p className=''>
                      <strong>quantity : </strong> {item?.stock}
                    </p>
                  </div>
                  <div className=' flex gap-1'>
                    {item?.images.map((img,j)=> (
                      <div 
                        className={`relative border rounded-md aspect-square h-10 w-10 cursor-pointer ${selectedImg===img ? " border-blue-500":"border-gray-700/50"}`} 
                        key={j}
                        onClick={()=> setSelectedImg(img)}
                      >
                        <Image
                          src={img}
                          alt='imgae'
                          layout='fill'
                          className=' rounded-md'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className=' flex flex-col gap-2'>
        <div className=' flex flex-1 flex-col px-3 gap-1 sm:hidden text-sm'>
          {product?.productImgs.map((item,i)=> (
            <div className=' flex flex-col gap-1' key={i}>
              <p className=''>
                <strong>color : </strong> {item?.color}
              </p>
              <div className=' flex gap-1'>
                {item?.images.map((img,j)=> (
                  <div 
                    className=' relative border border-gray-700/50 rounded-md aspect-square h-10 w-10 cursor-pointer' 
                    key={j}
                    onClick={()=> setSelectedImg(img)}
                  >
                    <Image
                      src={img}
                      alt='imgae'
                      layout='fill'
                      className=' rounded-md'
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className=' flex flex-col gap-1 px-1'>
          <p className=''>
            <strong>cateogory : </strong> {product?.cateogory.name}
          </p>
          <div className=' flex gap-2'>
            <p className=' font-semibold'> tags : </p>
            <div className=' flex gap-2'>
              {product?.tags.map((tag,i)=> (
                <p className='' key={i}>{tag} {i+1<product?.tags.length ? ",":""}</p>
              ))}
            </div>
          </div>
        </div>
        <div className=' max-w-[830px]'>
          <div className=' flex flex-col gap-3'>
            <h2 className=' font-semibold text-lg'>About this item</h2>
            <div className=' flex flex-col gap-1 ml-4'>
              {product?.description?.split(".").map((item,i)=> (
                <ul className=' font-normal list-disc'>
                  {item !=="" && (
                    <li className=' list-disc'>{item}</li>
                  )}
                </ul>
              ))}
            </div>
          </div>
        </div>
        <div className=' flex flex-col'>
          <p className=''>
            <strong> Reiews : </strong> {product?.allReviews.length} reviews
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserProduct
