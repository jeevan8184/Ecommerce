import Image from 'next/image'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import MapStars from './MapStars'
import { useDispatch, useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'
import { getAllProducts, getProducts } from '@/lib/redux/actions'
import { X } from 'lucide-react';
import Slider from '@mui/material/Slider';

interface FilterPageprops {
  cateogory:string,
  selectItems:{discount:number[],rating:number[]},
  setSelectItems:Dispatch<SetStateAction<{discount:number[],rating:number[]}>>,
  value:number,
  setValue:Dispatch<SetStateAction<number>>,
  dataVals:{min:number,max:number},
  query?:string
}

const FiltersPage = ({cateogory,selectItems,setSelectItems,value,setValue,dataVals,query}:FilterPageprops) => {

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

  console.log("Value",value,dataVals);

  return (
    <div className=' lg:h-screen h-screen max-sm:hidden w-[350px] max-md:w-[250px] max-lg:w-[280px] sm:z-40 max-lg:z-50 bg-white shadow border-t-2 border-t-gray-200 px-4 max-lg:px-2 py-5 max-sm:w-full'>
      <div className=' flex flex-col gap-3'>
        <div className=' flex flex-col gap-1'>
          <h1 className=' text-lg font-medium'>Filters</h1>
          <div className=' flex flex-wrap gap-2'>
            {selectItems.rating.map((r,i)=> (
              <div className=' px-2 py-0.5 rounded-md bg-gray-200 text-sm flex gap-2 items-center'> 
                <p className=' text-sm font-medium'>{r} star</p>
                <X className=' size-4 font-normal cursor-pointer' onClick={()=> handleUpdate('rating',r)} />
              </div>
            ))}
          </div>
          <div className=' flex flex-wrap gap-2'>
            {selectItems.discount.map((d,i)=> (
              <div className=' px-2 py-0.5 rounded-md bg-gray-200 text-sm flex gap-2 items-center'> 
                <p className=' text-sm font-medium'>{d}% d</p>
                <X className=' size-4 font-normal cursor-pointer' onClick={()=> handleUpdate('discount',d)} />
              </div>
            ))}
          </div>
        </div>
        <div className=' w-full py-0'>
          <p className=' w-full h-[1px] bg-gray-400'></p>
        </div>

        <div className=' flex flex-col gap-1'>
          <p className=' uppercase text-sm font-medium'>price</p>
          <div className=' mx-2'>
            <Slider
              aria-label="price range"
              defaultValue={dataVals.max+100}
              valueLabelDisplay="auto"
              min={dataVals.min-90< 0 ? 0 : dataVals.min-90}
              max={dataVals.max+100}
              className=''
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

        <div className=' flex flex-col gap-2 w-full overflow-hidden'>
          <p className=' uppercase text-sm font-medium'>Discount</p>
          <div className=' w-full flex flex-col gap-2'>
            {[50,40,30,20,10].map((d)=> (
              <div className=' flex gap-4 items-center' key={d}>
                <input
                    type='checkbox'
                    placeholder='.'
                    className=' size-5 cursor-pointer'
                    checked={selectItems.discount.includes(d)}
                    onChange={(e:any)=> handleUpdate("discount",d)}
                  />
                <p className=' text-sm'>{d}% & above</p>
              </div>
            ))}
          </div>
        </div>

        <div className=' flex flex-col gap-1'>
          <p className=' uppercase text-sm font-medium'>rating</p>
          <div className=' flex flex-col gap-0'>
            {[4,3,2,1].map((r)=> (
              <div className='flex gap-3 max-lg:flex-between items-center' key={r}>
                <input
                  type='checkbox'
                  placeholder='.'
                  className=' size-5 cursor-pointer'
                  checked={selectItems.rating.includes(r)}
                  onChange={(e:any)=> handleUpdate("rating",r)}
                />
                <p className=' text-sm line-clamp-1'>{r} & above</p>
                <MapStars full={r} half={5-r} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default FiltersPage
