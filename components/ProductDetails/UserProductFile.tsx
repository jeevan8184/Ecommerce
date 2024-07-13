
import { getAllUserProducts } from '@/lib/database/actions/product.actions';
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../Auth/UserProvider';
import { usePathname } from 'next/navigation';
import { IProduct } from '@/lib/database/models/product.model';
import UserProduct from './UserProduct';
import Loader from '../Cart/Loader';

const UserProductFile = () => {
    const [allProducts, setAllProducts] = useState<IProduct[]>([]);
    const {currUser}=useContext(UserContext);
    const pathname=usePathname();

    useEffect(()=> {
        const fetchData=async()=>{
            if(currUser) {

                try {
                    const data=await getAllUserProducts(currUser?._id,pathname);
                    setAllProducts(data);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        fetchData();
    },[currUser])
    
    if(!allProducts) return <Loader />

    console.log("allProducts",allProducts);

  return (
    <div className=' w-full flex flex-col pt-3 px-2 gap-6'>
        <h1 className=' font-medium text-2xl'>Your Products</h1>
        <div className=' flex flex-col gap-2'>
            {allProducts.map((product,i)=> (
                <UserProduct product={product} key={i} />
            ))}
        </div>
    </div>
  )
}

export default UserProductFile
