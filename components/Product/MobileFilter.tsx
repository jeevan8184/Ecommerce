import { getAllProducts, getProducts } from '@/lib/redux/actions';
import { Slider } from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { useDispatch } from 'react-redux';

interface MobileFilterParams {
    cateogory:string,
    selectItems:{discount:number[],rating:number[]},
    setSelectItems:Dispatch<SetStateAction<{discount:number[],rating:number[]}>>,
    value:number,
    setValue:Dispatch<SetStateAction<number>>,
    dataVals:{min:number,max:number},
    query?:string

}

const MobileFilter = ({cateogory,selectItems,setSelectItems,value,setValue,dataVals,query}:MobileFilterParams) => {

    
  const dispatch=useDispatch();
  const pathname=usePathname();
  
  const handleUpdate = (type: 'rating' | 'discount', x: number) => {
    const updatedItems = { ...selectItems };
    if (type === 'rating') {
      if (updatedItems.rating.includes(x)) {
        updatedItems.rating = updatedItems.rating.filter(item => item !== x);
      } else {
        updatedItems.rating.push(x);
      }
    } else if (type === 'discount') {
      if (updatedItems.discount.includes(x)) {
        updatedItems.discount = updatedItems.discount.filter(item => item !== x);
      } else {
        updatedItems.discount.push(x);
      }
    }
    setSelectItems(updatedItems);
    if(query) {
      dispatch(getProducts({
        query,
        path:pathname,
        sortPrice:0,
        discount:Math.max(0,...updatedItems.discount),
        rating:Math.max(0,...updatedItems.rating),
        price:value
      }));
    }else{
      dispatch(getAllProducts({
        cateogory,
        path:pathname,
        sortPrice:0,
        discount:Math.max(0,...updatedItems.discount),
        rating:Math.max(0,...updatedItems.rating),
        price:value
      }));
    }
  }

  return (
    <div className='bg-white shadow border-t-2 border-t-gray-200 px-2 w-full sticky top-0 sm:hidden z-50'>
        <div className=' flex flex-col gap-0.5'>
            <div className=' flex items-center gap-2'>
                <div className=' flex flex-col gap-0 w-full'>
                    <p className=' text-sm font-medium'>price</p>
                    <div className=' mr-2'>
                        <Slider
                        aria-label="price range"
                        defaultValue={dataVals.max+100}
                        valueLabelDisplay="auto"
                        min={dataVals.min-90<0 ? 0 : dataVals.min-90}
                        max={dataVals.max+100}
                        size='small'
                        className=' size-4'
                        value={value}
                        onChange={(e:any)=> {
                            setValue(e?.target?.value as number);
                            if(query) {
                              dispatch(getProducts({
                                query,
                                path:pathname,
                                sortPrice:0,
                                discount:Math.max(0,...selectItems.discount),
                                rating:Math.max(0,...selectItems.rating),
                                price:e.target.value as number
                              }));
                            }else{
                              dispatch(getAllProducts({
                                cateogory,
                                path:pathname,
                                sortPrice:0,
                                discount:Math.max(0,...selectItems.discount),
                                rating:Math.max(0,...selectItems.rating),
                                price:e.target.value as number
                              }));
                            }
                        }}
                        />
                    </div>
                </div>
                <div className=' w-full flex flex-col text-sm -mt-1.5'>
                    <p className=''>ratings</p>
                    <div className=' flex-between'>
                        {[4,3,2,1].map((r,i)=> (
                            <div 
                              className={`px-3 py-0.5 rounded-sm cursor-pointer flex font-medium ${selectItems.rating.includes(r) ? " bg-blue-500/20 text-blue-500" :" bg-gray-300"}`} 
                              key={i}
                              onClick={()=> handleUpdate('rating',r)}
                            >
                                <p className=''>{r}</p>
                                <Image
                                    src="/used/star1.svg"
                                    alt='image'
                                    height={12}
                                    width={12}
                                    className=''
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MobileFilter
