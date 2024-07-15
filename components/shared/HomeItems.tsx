import { HomeNewItems1, HomeNewItems2, ItemImgs } from '@/lib/constants'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getOneProduct } from '@/lib/database/actions/product.actions'
import { IProduct } from '@/lib/database/models/product.model'
import { usePathname } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../Auth/UserProvider'
import HomeProducts from './HomeProducts'

const HomeItems = () => {
    const router=useRouter();
     
    const [product1, setProduct1] = useState<IProduct>();
    const [product2, setProduct2] = useState<IProduct>();

    const pathname=usePathname();
    const {currUser}=useContext(UserContext);


    useEffect(()=> {
        const fetchData=async()=>{
          if(currUser) {
            try {
                const data1=await getOneProduct(pathname);
                const data2=await getOneProduct(pathname);
    
                setProduct1(data1);
                setProduct2(data2);

              } catch (error) {
                console.log(error);
              }
          }
        }
        fetchData();
    },[currUser])

  return (
    <div className=' w-full flex justify-between  max-md:flex-col gap-4'>
      <div className=' px-2 py-4 bg-white shadow w-full h-full border-t border-t-gray-100'>
        <div className=' flex flex-col gap-6'>
            <div className=' flex flex-col gap-1'>
                <h1 className=' text-xl font-semibold md:px-4'>Explore Our New Items</h1>
            </div>
            <div className=' grid gap-1 w-full grid-cols-4 max-sm:grid-cols-4'>
                {HomeNewItems1.map(({title,desc,img},i)=> (
                    <div className=' flex flex-col items-center gap-1 group p-1 rounded-md cursor-pointer' onClick={()=> currUser ? router.push("/products/normal use") : router.push("/")}>
                        <div className=' relative h-32 w-24 max-sm:h-32 max-sm:w-24 max-md:h-40 max-md:w-32'>
                            <Image
                                src={img}
                                alt='image'
                                layout='fill'
                                className=' group-hover:scale-105'
                            />
                        </div>
                        <div className=' flex-center flex-col gap-1'>
                            <p className=' font-medium text text-center'>{title}</p>
                            <p className=' text-rose-600 text-center text-sm'>{desc}</p>
                        </div>
                    </div>
                ))}
                  {HomeNewItems2.map(({title,desc,img},i)=> (
                    <div className=' flex flex-col items-center gap-1 group p-1 rounded-md cursor-pointer' onClick={()=> currUser ? router.push("/products/shoes") : router.push("/")}>
                        <div className=' relative h-32 w-24 max-sm:h-32 max-sm:w-24 max-md:h-40 max-md:w-32'>
                            <Image
                                src={img}
                                alt='image'
                                layout='fill'
                                className=' group-hover:scale-105'
                            />
                        </div>
                        <div className=' flex-center flex-col gap-1'>
                            <p className=' font-medium text text-center'>{title}</p>
                            <p className=' text-rose-600 text-center text-sm'>{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className=' px-2 py-3.5 bg-white shadow w-full h-full border-t border-t-gray-100'>
        <div className=' flex flex-col gap-1'>
            <div className=' flex flex-col gap-1'>
                <h1 className=' text-xl font-semibold md:px-4'>More products from shopify</h1>
            </div>
            <div className=''>
                {product1 && product2 ? (
                    <div className=' flex-between'>
                        {[product1,product2].map((product:IProduct,i)=> (
                            <HomeProducts product={product} key={i} />
                        ))}
                    </div>
                ) : (
                    <div className=' flex-between py-4 pt-5 gap-4'>
                        {ItemImgs.map((img,i)=> (
                            <div className=' w-full'>
                                <div className=' relative h-44 w-full'>
                                    <Image
                                        src={img}
                                        alt='image'
                                        layout='fill'
                                        className=' rounded'
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>

    </div>
  )
}

export default HomeItems
