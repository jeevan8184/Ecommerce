import { IItems } from '@/lib/constants/types';
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from '@/lib/utils';

interface MapItemsProps {
    item:IItems,
    setAllItems:Dispatch<SetStateAction<IItems[]>>
}

const MapItems = ({item,setAllItems}:MapItemsProps) => {
    const [quantity, setQuantity] = useState("");

    useEffect(()=> {
        if(item) {
            setQuantity(item?.quantity.toString());
        }
    },[item]);

    const handleQuantity=(value:string)=>{
        
        setAllItems((prev)=> {
            const newItems=prev.map((i)=>  
                i.color===item.color && i.product._id===item.product._id 
                ? {...i,quantity:Number(value)} 
                : i 
            );
            return newItems;
        })
        setQuantity(value);
    }

    const filled=Math.floor(item?.avgRating);
    const half=(item?.avgRating)%1>=0.5 ? 1 : 0;
    const empty=5-filled-half;

  return (
            <div className=' flex gap-4 w-full'>
                <div className=' relative h-56 w-60 max-sm:h-52 max-sm:w-56 aspect-square'>
                    <Image
                        src={item.allImgs.images[0]}
                        alt='image'
                        layout='fill'
                        className=''
                    />
                </div>
                <div className=' w-full flex flex-col'>
                    <div className=' w-full'>
                        <p className=' max-w-xl w-full text-[15px] leading-5'>{item.product.title}</p>
                        <div className=' flex gap-2 py-2 max-sm:py-0.5'>
                            <p className=' font-medium'>{item?.avgRating}</p>
                            <div className=' flex gap-0.5'>
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
                        </div>
                    </div>
                    <div className=' w-full px-2 max-w-lg'>
                        <p className=' px-8 w-full h-[0.5px] bg-slate-400 rounded-full' />
                    </div>
                    <div className=' flex flex-col gap-1 pt-1.5 max-sm:pt-0'>
                        <div className=' flex flex-col'>
                            <p className=' text-sm'><strong>color : </strong> {item.color}</p>
                        </div>
                        <p className=' font-medium text-rose-500 text-sm'>{item?.product?.discount}% off</p>
                        <div className=' flex text-sm gap-1'>
                            <div className=' relative inline-block'>
                                <p className=' text-sm'>{formatCurrency(Number(item?.product?.price))}</p>
                                <span className='absolute w-full h-[0.5px] bg-slate-700 rounded-full  transform top-1/2 -translate-y-1/2'></span>
                            </div>
                            <p className=''>{formatCurrency(item.product?.price-Number(item?.product?.price*Number((item.product?.discount))/100))}</p>
                        </div>
                        <div className='  rounded-tr-full rounded-es-full flex bg-teal-700 px-8 py-0.5 text-sm w-fit text-white'>
                            <p className=''>{item.cateogory.name}</p>
                        </div>
                        <div className=''>
                            <Select onValueChange={(value)=> handleQuantity(value)} value={quantity}>
                                <SelectTrigger className=" w-[65px] mt-1 h-7 focus:ring-0 focus:ring-offset-0 rounded-xl bg-slate-50 border-2 border-slate-500">
                                    <SelectValue placeholder="Quantity" />
                                </SelectTrigger>
                                <SelectContent className=' max-w-10'>
                                    {Array.from({length:10},(_,i)=> (
                                        <SelectItem value={`${i+1}`}>{i+1}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
  )
}

export default MapItems
