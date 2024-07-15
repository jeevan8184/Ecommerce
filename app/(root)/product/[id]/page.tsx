"use client"
import { UserContext } from '@/components/Auth/UserProvider';
import ProductDetails from '@/components/ProductDetails/ProductDetails';
import ProductImages from '@/components/ProductDetails/ProductImages';
import ProductReview from '@/components/ProductDetails/ProductReview';
import RelProductFile from '@/components/ProductDetails/RelProductFile';
import ReviewCreate from '@/components/ProductDetails/ReviewCreate';
import Footer from '@/components/Cart/Footer';
import Loader from '@/components/Cart/Loader';
import { getProductById } from '@/lib/database/actions/product.actions';
import { createRecentView } from '@/lib/database/actions/recentView.actions';
import { getProductReviews } from '@/lib/database/actions/reviews.actions';
import { IProduct } from '@/lib/database/models/product.model';
import { IReview } from '@/lib/database/models/review.model';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getRecentView } from '@/lib/redux/actions';

const ProductPage = ({params:{id}}:{params:{id:string}}) => {
    const [product, setProduct] = useState<IProduct>();
    const [selectedImg, setSelectedImg] = useState("");
    const [selectedProdImgs, setSelectedProdImgs] = useState<{ color: string, images: string[],stock: number } | undefined>(undefined);
    const [allReviews, setAllReviews] = useState<IReview[]>([]);
    const pathname=usePathname();
    const {currUser}=useContext(UserContext);
    const dispatch=useDispatch();
    const searchParams=useSearchParams();

    const color=searchParams.get("color");

    console.log("color",color);

    useEffect(()=>{
        const newFunc=async()=>{
            if(id && currUser) {
                try {
                    const data=await getProductById(id);
                    setProduct(data);
                    setSelectedProdImgs(data?.productImgs[0]);

                    const allReviews=await getProductReviews(id);
                    setAllReviews(allReviews);

                    await createRecentView({userId:currUser?._id,productId:id,path:pathname});
                    dispatch(getRecentView(currUser?._id,pathname));

                    console.log("triggered");
                } catch (error) {
                    console.log(error);
                }
            }
        }
        newFunc();
    },[id,currUser]);

    useEffect(()=> {
        if(color && product) {
            
        }
    },[color,product]);

    console.log("id",id);

    if(!product || !selectedProdImgs) return <Loader />

    console.log("allReviews",allReviews);

  return (
    <div className=' w-full flex flex-col pt-4 gap-10 overflow-hidden'>
        <div className=' max-w-7xl py-3 mx-auto overflow-hidden flex flex-1 flex-col gap-10'>
            <div className='flex max-md:flex-col xl:gap-12 md:gap-0 max-sm:gap-8'>
                <ProductImages
                    setSelectedImg={setSelectedImg}
                    selectedImg={selectedImg}
                    selectedProdImgs={selectedProdImgs}
                />
                <ProductDetails 
                    product={product} 
                    setSelectedImg={setSelectedImg}
                    selectedImg={selectedImg}
                    selectedProdImgs={selectedProdImgs}
                    setSelectedProdImgs={setSelectedProdImgs} 
                    allReviews={allReviews}
                />
            </div>
            <div className=' pt-4'>
                <RelProductFile productId={id} />
            </div>
            <div className=' flex max-md:flex-col xl:gap-12 lg:gap-0 max-md:gap-8 lg:pt-8'>
                <ReviewCreate 
                    product={product} 
                    setAllReviews={setAllReviews}
                />
                <div className=' w-full flex flex-col gap-7'>
                    <div className=' px-2'>
                        {allReviews?.length>0 ? (
                            <h1 className=' text-xl font-medium'>Product Reviews</h1>
                        ):(
                            <h1 className='text-xl font-medium'>No Reviews of this products</h1>
                        )}
                    </div>
                    <div className=' w-full flex flex-col gap-4'>
                        {allReviews.map((review,i)=> (
                            <div className='' key={i}>
                                <ProductReview 
                                    review={review} 
                                    key={i} 
                                    setAllReviews={setAllReviews}
                                    product={product}
                                />
                            </div>
                        ))}
                    </div>
                </div>
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

export default ProductPage
