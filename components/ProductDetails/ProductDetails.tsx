import { IProduct } from '@/lib/database/models/product.model'
import { Star } from 'lucide-react'
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import { Button } from '../ui/button'
import { UserContext } from '../Auth/UserProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter } from 'next/navigation'
import { checkCart, createCart } from '@/lib/database/actions/cart.actions'
import { IReview } from '@/lib/database/models/review.model'
import { formatCurrency } from '@/lib/utils'
import { getAllCarts, getAllSaved } from '@/lib/redux/actions'
import { useDispatch } from 'react-redux'
import {toast} from 'react-hot-toast';

interface ProductDetailsProps {
  product:IProduct,
  setSelectedImg:Dispatch<SetStateAction<string>>,
  setSelectedProdImgs:Dispatch<SetStateAction<{ color: string, images: string[],stock: number } | undefined>>,
  selectedProdImgs:{ color: string, images: string[],stock: number } | undefined,
  allReviews:IReview[],
  selectedImg:string
}

const ProductDetails = ({product,setSelectedImg,setSelectedProdImgs,selectedProdImgs,allReviews,selectedImg}:ProductDetailsProps) => {
  
  const {currUser,setCurrUser}=useContext(UserContext);
  const [quantity, setQuantity] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const pathname=usePathname();
  const router=useRouter();
  const dispatch=useDispatch();

  if(!selectedProdImgs) return;

  const handleCart=async()=>{

    try {
      setIsLoading(true);
      const checkedCart=await checkCart({
        userId:currUser?._id,
        productId:product?._id,
        color:selectedProdImgs?.color,
        path:pathname,quantity
      });
      if(checkedCart !==null) {
        setCurrUser(checkedCart);
        console.log("checkedCart",checkedCart);
      }else{
        const data=await createCart({
          productId:product?._id,
          userId:currUser?._id,
          quantity,
          color:selectedProdImgs.color,
          cartImgs:selectedProdImgs?.images,
          path:pathname
        });
        if(data) {
          setCurrUser(data);
        }
      }

    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
      dispatch(getAllSaved(currUser?._id,pathname));
      dispatch(getAllCarts(currUser?._id,pathname));
      toast.success("added to cart");
    }
  }

  const cnt=allReviews?.reduce((acc:any,review:any)=>{
    return acc+review.rating
  },0);

  const stars=(cnt/allReviews.length);

  const filled=Math.floor(stars);
  const half=stars%1>=0.5 ? 1 : 0;
  const empty=5-filled-half;

  return (
    <div className=' w-full xl:pr-2 max-md:px-2 whitespace-nowrap'>
      <div className=' overflow-hidden'>
        <div className=' justify-center flex flex-col gap-4 text-wrap whitespace-normal'>
          <div className=' justify-center flex flex-col '>
            <h1 className=' font-medium leading-8 text-[22px] max-sm:text-[20px] max-sm:mr-4 line-clamp-0 max-sm:text-xl overflow-visible whitespace-wrap'>{product.title}</h1>
            <div className=' flex gap-2 items-center cursor-pointer'>
              <p className=' font-medium text-lg'>{ filled!==undefined || filled!==null && filled}</p>
              <div className=' flex gap-1 py-2'>
                {Array.from({length:filled},()=> (
                  <div className=''>
                    <Image
                      src="/used/star1.svg"
                      alt='image'
                      height={24}
                      width={24}
                      className=''
                    />
                  </div>
                ))}
                {Array.from({length:half},()=> (
                  <div className=''>
                    <Image
                      src="/used/star.svg"
                      alt='image'
                      height={24}
                      width={24}
                      className=''
                    />
                  </div>
                ))}
                {Array.from({length:empty},()=> (
                  <div className=''>
                    <Image
                      src="/used/star2.svg"
                      alt='image'
                      height={24}
                      width={24}
                      className=''
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className=' w-full mx-auto px-2'>
              <p className=' px-8 w-full h-[0.5px] bg-slate-400 rounded-full' />
            </div>
          </div>
          <div className=' flex flex-col'>
            <div className=' flex gap-4 items-center'>
              <p className=' font-medium text-rose-500 text-xl'>{product?.discount}% off</p>
              <p className=' text-3xl font-light'>{formatCurrency(Number(product?.price)-Number(product?.price*Number((product?.discount))/100))}</p>
            </div>
            <div className=' flex items-center gap-2'>
              <p className=' text-sm font-light text-gray-700'>M.R.P</p>
              <div className=' relative inline-block'>
                <p className=' text-sm'>{formatCurrency(Number(product?.price))}</p>
                <span className='absolute w-full h-[0.5px] bg-slate-700 rounded-full  transform top-1/2 -translate-y-1/2'></span>
              </div>
            </div>
          </div>
          <div className=' flex flex-col gap-4 w-full overflow-x-auto no-scrollbar'>
            {product?.productImgs.map((prod,i)=> (
              <div className=' flex flex-col gap-2 w-full' key={i}>
                <h2 className=''><strong>Color : </strong>{prod?.color}</h2>
                  <div className=' flex gap-2 ml-4 relative w-full overflow-x-auto snap-x no-scrollbar'>
                    {prod?.images?.map((img,j)=> (
                      <div key={j}
                        className={` snap-mandatory shrink-0 relative border-2 max-sm:border rounded-md aspect-square h-16 w-16 cursor-pointer ${selectedImg===img ? " border-blue-500":" border-gray-700/50"}`}
                        onClick={()=> {
                          setSelectedImg(img);
                          setSelectedProdImgs(product?.productImgs[i]);
                        }}
                        >
                        <Image
                            src={img}
                            className=' rounded-md'
                            alt='image'
                            layout='fill'
                        />
                      </div>
                    ))}
                  </div>
              </div>
            ))}
          </div>
          <div className=''>
            <Select onValueChange={(value)=> setQuantity(value)} defaultValue={quantity}>
              <SelectTrigger className=" w-[120px] focus:ring-0 focus:ring-offset-0 rounded-xl bg-slate-50 border-2 px-4 py-3 border-slate-400">
                <SelectValue placeholder="Quantity" />
              </SelectTrigger>
              <SelectContent className=''>
                {Array.from({length:Math.min(selectedProdImgs?.stock,5)},(_,i)=> (
                  <SelectItem value={`${i+1}`}>{i+1}</SelectItem>
                ))}
              
              </SelectContent>
            </Select>
          </div>
          <div className=' px-2 max-sm:-ml-2'>
            <div className=' flex gap-3 max-sm:flex-col w-full'>
              <Button 
                className='add_cart hover:bg-yellow-500 max-sm:w-[350px] ' 
                onClick={handleCart} 
                disabled={isLoading}
              >
                {isLoading ? "Adding to Cart":"Add to Cart"}
              </Button>
              <Button 
                className='buy_now hover:bg-orange-500 max-sm:w-[350px]' 
                onClick={() => router.push(`/buy/${product?._id}?color=${selectedProdImgs.color}&quantity=${quantity}`)}              >
                Buy Now
              </Button>
            </div>
          </div>
          <div className=' pr-1'>
            <div className=' flex flex-col gap-3'>
              <h2 className=' font-semibold text-lg'>About this item</h2>
              <div className=' flex flex-col gap-1 ml-4'>
                {product?.description?.split(".").map((item,i)=> (
                  <ul className=' font-normal list-disc'>
                    {item !=="" && (
                      <li className=' list-disc'>{item}</li>
                    )}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
