import React, {  } from 'react'
import ProductMap from '../Product/ProductMap'
import { useSelector } from 'react-redux';
import { IProduct } from '@/lib/database/models/product.model';

const RelatedCarts = () => {

    const allRelated=useSelector((state:any)=> state.address.getRelatedCart);

  return (
    <div className=' w-full px-2 flex flex-col gap-4'>
        <h1 className=' text-2xl font-semibold'>Similar Products</h1>
        <div className=' grid grid-cols-5 gap-4 max-sm:grid-cols-2 max-md:grid-cols-3 max-xl:grid-cols-4'>
            {allRelated?.length>0 && allRelated?.map((product:IProduct,i:any)=>(
                <ProductMap product={product} key={i} type='related' />
            ))}
        </div>
    </div>
  )
}

export default RelatedCarts
