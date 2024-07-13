"use client"
import { UserContext } from '@/components/Auth/UserProvider';
import CatProducts from '@/components/Product/CatProducts';
import FiltersPage from '@/components/Product/FiltersPage';
import MobileFilter from '@/components/Product/MobileFilter';
import Footer from '@/components/Cart/Footer';
import Loader from '@/components/Cart/Loader';
import { getSearchProducts } from '@/lib/database/actions/product.actions';
import { getProducts } from '@/lib/redux/actions';
import { usePathname, useSearchParams } from 'next/navigation'
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
 
const SearchPageSuspense = () => {
  const searchParams=useSearchParams();
  const query=searchParams.get('query');
  const {currUser}=useContext(UserContext);
  const [selectItems, setSelectItems] = useState<{discount:number[],rating:number[]}>({discount:[],rating:[]});
  const [value, setValue] = useState<number>(5000);
  const pathname=usePathname();
  const [dataVals, setDataVals] = useState<{min:number,max:number}>({min:200,max:5000});
  const allProducts=useSelector((state:any)=> state.address.searchProducts);
  const dispatch=useDispatch();

  console.log("searchPage",allProducts);

  useEffect(()=> {
    if(query) {
        dispatch(getProducts({
            query,
            path:pathname,
            sortPrice:0,
            discount:0,
            rating:0,
            price:value
        }));
        console.log("dispacthed");
      }
    },[query]);

  if(!currUser) return <Loader />

  if(!query) return;
  
  return (
    <div className=' flex flex-col gap-3 w-full h-full bg-gray-50'>
      <div className=' pb-20'>
        {allProducts?.length>0 ? (
          <div className=' w-full h-full mx-auto max-w-[1400px] pt-8 flex gap-3 max-lg:gap-1 max-sm:pt-2 max-sm:flex-col'>
            <FiltersPage 
              cateogory="" 
              selectItems={selectItems} 
              setSelectItems={setSelectItems} 
              value={value}
              setValue={setValue}
              dataVals={dataVals}
              query={query.trim()}
            />
            <MobileFilter 
              cateogory="" 
              selectItems={selectItems} 
              setSelectItems={setSelectItems} 
              value={value}
              setValue={setValue}
              dataVals={dataVals}
              query={query.trim()}
            />
            <CatProducts 
              cateogory=""
              selectItems={selectItems} 
              setSelectItems={setSelectItems} 
              value={value}
              allProducts={allProducts}
              query={query.trim()}
            />
          </div>
        ) : (
          <div className=' flex-center h-full w-full min-h-[60vh] flex-col gap-2'>
            <p className=' text-gray-600 text-2xl text-center'>No Search Results found!.</p>
          </div>
        )}
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

const SearchPage=()=>{
  return(
    <Suspense fallback={<Loader />}>
      <SearchPageSuspense />
    </Suspense>
  )
}

export default SearchPage

