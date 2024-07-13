
"use client"

import { UserContext } from '@/components/Auth/UserProvider';
import CatProducts from '@/components/Product/CatProducts';
import FiltersPage from '@/components/Product/FiltersPage';
import MobileFilter from '@/components/Product/MobileFilter';
import Footer from '@/components/Cart/Footer';
import Loader from '@/components/Cart/Loader';
import { getProductsData } from '@/lib/database/actions/product.actions';
import { getAllProducts } from '@/lib/redux/actions';
import { usePathname } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const ProductsPage = ({params:{cateogory}}:{params:{cateogory:string}}) => {
  const {currUser}=useContext(UserContext);
  const [selectItems, setSelectItems] = useState<{discount:number[],rating:number[]}>({discount:[],rating:[]});
  const [value, setValue] = useState<number>(100000);
  const pathname=usePathname();
  const [dataVals, setDataVals] = useState<{min:number,max:number}>({min:0,max:0});
  const allProducts=useSelector((state:any)=> state.address.allProducts);

  console.log("cateogoryPage",allProducts);

  console.log("cateogory",decodeURIComponent(cateogory));
  const newCat=decodeURIComponent(cateogory);
  const dispatch=useDispatch();


  useEffect(()=> {
    const fetchData=async()=>{
      if(newCat) {
        
        try {
          const data=await getProductsData(newCat.toLowerCase(),pathname);
          console.log("getProductsData",data);

          const min=data?.reduce((acc:any,item:any)=> {
            return Math.round(Math.min(acc,item.newPrice));
          },data[0]?.newPrice);

          const max=data?.reduce((acc:any,item:any)=> {
            return Math.round(Math.max(acc,item.newPrice));
          },data[0]?.newPrice);

          setDataVals({min,max});
          setValue(max+100);

          dispatch(getAllProducts({
            cateogory:newCat,
            path:pathname,
            sortPrice:0,
            discount:0,
            rating:0,
            price:value
        }));
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  },[newCat])

  // if(!currUser) return <Loader />

  return (
    <div className=' flex flex-col gap-3 w-full h-full bg-gray-50'>
      <div className=' pb-20'>
        <div className=' w-full h-full mx-auto max-w-[1400px] pt-8 flex gap-3 max-lg:gap-1 max-sm:pt-2 max-sm:flex-col'>
          <FiltersPage 
            cateogory={newCat} 
            selectItems={selectItems} 
            setSelectItems={setSelectItems} 
            value={value}
            setValue={setValue}
            dataVals={dataVals}
          />
          <MobileFilter 
            cateogory={newCat} 
            selectItems={selectItems} 
            setSelectItems={setSelectItems} 
            value={value}
            setValue={setValue}
            dataVals={dataVals}
          />
          <CatProducts 
            cateogory={newCat} 
            selectItems={selectItems} 
            setSelectItems={setSelectItems} 
            value={value}
            allProducts={allProducts}
          />
        </div>
      </div>
      <div className=' text-white w-full flex flex-col'>
        <div className=' flex-center px-4 py-2 bg-slate-700 cursor-pointer' 
            onClick={()=> window.scrollTo({top:0,behavior:"smooth"})}
        >
            <p className=''>Back to top</p>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default ProductsPage
