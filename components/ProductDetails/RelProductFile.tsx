import { IProduct } from '@/lib/database/models/product.model';
import { getRelated } from '@/lib/redux/actions';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ProductMap from '../Product/ProductMap';

interface RelProductFileParams {
    productId:string
}

const RelProductFile = ({productId}:RelProductFileParams) => {

    const dispatch=useDispatch();
    const pathname=usePathname();
    const allRelated=useSelector((state:any)=> state.address.getRelated);

    useEffect(()=> {
        if(productId) {
            dispatch(getRelated(productId,pathname));
        }
    },[productId]);

    console.log("allRelated",allRelated);

  return (
    <div className=' w-full px-2 flex flex-col gap-2'>
        <h1 className=' text-2xl font-semibold'>Related Products</h1>
        <div className=' grid grid-cols-5 gap-4 max-sm:gap-1 max-sm:grid-cols-2 max-md:grid-cols-3 max-xl:grid-cols-4'>
            {allRelated?.length>0 && allRelated?.map((product:IProduct,i:any)=>(
                <ProductMap product={product} key={i} type='related' />
            ))}
        </div>
    </div>
  )
}

export default RelProductFile
