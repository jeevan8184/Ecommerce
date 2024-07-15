import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { UserContext } from '../Auth/UserProvider'
import { IProduct } from '@/lib/database/models/product.model';
import ProductMap from './ProductMap';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Cart/Loader';
import { getAllProducts, getProducts } from '@/lib/redux/actions';

interface CartProductsParams {
    cateogory:string,
    selectItems:{discount:number[],rating:number[]},
    setSelectItems:Dispatch<SetStateAction<{discount:number[],rating:number[]}>>,
    value:number,
    allProducts:IProduct[],
    query?:string
}

const CatProducts = ({cateogory,selectItems,setSelectItems,value,allProducts,query}:CartProductsParams) => {
    const {currUser}=useContext(UserContext);
    const [activeState, setActiveState] = useState("");
    const pathname=usePathname();
    const dispatch=useDispatch();
   

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

      console.log("allProducts",allProducts);
    if(!allProducts) return <Loader />

  return (
    <div className=' px-4 py-2 bg-white shadow border-t border-t-gray-200 w-full'>
        <div className=' flex flex-col gap-4 max-sm:gap-2 pt-9 max-sm:pt-5 py-4'>
            <h1 className=' text-2xl font-semibold'>Watches</h1>
            <div className=' flex flex-col gap-0'>
                <div className=' flex gap-6 max-sm:gap-3 pb-3'>
                    <p className=' font-semibold text-gray-800'>sort by price</p>
                    <div 
                        className=' relative cursor-pointer' 
                        onClick={()=> {
                            setActiveState('1');
                            if(query) {
                                dispatch(getProducts({
                                    query,
                                    path:pathname,
                                    sortPrice:1,
                                    discount:Math.max(0,...selectItems.discount),
                                    rating:Math.max(0,...selectItems.rating),
                                    price:value
                                }));
                            }else{
                                dispatch(getAllProducts({
                                    cateogory,
                                    path:pathname,
                                    sortPrice:1,
                                    discount:Math.max(0,...selectItems.discount),
                                    rating:Math.max(0,...selectItems.rating),
                                    price:value
                                }));
                            }
                        }}
                    >
                        <p className={`font-medium ${activeState==='1' ? "text-orange-400":""}`}> low->high</p>
                        <span className={` ${activeState==='1' ? " flex":" hidden"} absolute bottom-0 rounded-full  h-[1px] w-full bg-orange-400`}></span>
                    </div>
                    <div 
                        className=' relative cursor-pointer' 
                        onClick={()=> {
                            setActiveState('2');
                            if(query) {
                                dispatch(getProducts({
                                    query,
                                    path:pathname,
                                    sortPrice:-1,
                                    discount:Math.max(0,...selectItems.discount),
                                    rating:Math.max(0,...selectItems.rating),
                                    price:value
                                }));
                            }else{
                                dispatch(getAllProducts({
                                    cateogory,
                                    path:pathname,
                                    sortPrice:-1,
                                    discount:Math.max(0,...selectItems.discount),
                                    rating:Math.max(0,...selectItems.rating),
                                    price:value
                                }));
                            }
                        }}
                    >
                        <p className={`font-medium ${activeState==='2' ? "text-orange-400":""}`}> high->low</p>
                        <span className={` ${activeState==='2' ? " flex":" hidden"} absolute bottom-0 rounded-full  h-[1px] w-full bg-orange-400`}></span>
                    </div>
                    <div 
                        className={` cursor-pointer ${activeState ? " flex":" hidden"}`} 
                        onClick={()=> {
                            setActiveState('');
                            if(query) {
                                dispatch(getProducts({
                                    query,
                                    path:pathname,
                                    sortPrice:0,
                                    discount:Math.max(0,...selectItems.discount),
                                    rating:Math.max(0,...selectItems.rating),
                                    price:value
                                }));
                            }else{
                                dispatch(getAllProducts({
                                    cateogory,
                                    path:pathname,
                                    sortPrice:0,
                                    discount:Math.max(0,...selectItems.discount),
                                    rating:Math.max(0,...selectItems.rating),
                                    price:value
                                }));
                            }
                        }}
                    >
                        <p className=" active:text-orange-400 font-normal">None</p>
                    </div>
                </div>
                <div className=' flex flex-col gap-1 pb-4 sm:hidden'>
                    <p className='font-semibold text-gray-800'>discount</p>
                    <div className=' w-full flex flex-col text-sm'>
                        <div className=' flex gap-2'>
                            {[50,40,30,20,10].map((d,i)=> (
                                <div 
                                className={`px-4 py-0.5 rounded-sm  w-fullcursor-pointer flex font-medium ${selectItems.discount.includes(d) ? " bg-blue-500/20 text-blue-500" :" bg-gray-300"}`} 
                                key={i}
                                onClick={()=> handleUpdate('discount',d)}
                                >
                                    <p className=' w-full'>{d} %</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className=' grid grid-cols-3 max-lg:grid-cols-2 gap-4'>
                {allProducts?.length>0 && allProducts?.map((product:IProduct,i:any)=>(
                    <ProductMap product={product} key={i} type="cateogory" />
                ))}
            </div>
        </div>
    </div>
  )
}

export default CatProducts
