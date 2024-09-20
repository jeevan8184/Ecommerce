import { IReview } from '@/lib/database/models/review.model'
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useContext } from 'react'
import moment from 'moment';
import { UserContext } from '../Auth/UserProvider';
import { usePathname } from 'next/navigation';
import { deleteReview, likeReview } from '@/lib/database/actions/reviews.actions';
import { Trash2Icon } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { IProduct } from '@/lib/database/models/product.model';
  

interface ProductReviewProps {
    review:IReview,
    setAllReviews:Dispatch<SetStateAction<IReview[]>>,
    product:IProduct
}

const ProductReview = ({review,setAllReviews,product}:ProductReviewProps) => {
    const {currUser}=useContext(UserContext);
    const pathname=usePathname();

    const handleLike=async()=>{

        try {
            const data=await likeReview({
                userId:currUser?._id,
                path:pathname,
                reviewId:review?._id
            })
            if(data) {
                setAllReviews((prev)=> {
                    const newReviews=prev.map((r)=> r._id===data._id ? data : r);
                    return newReviews;
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete=async()=>{

        try {
            const data=await deleteReview({
                path:pathname,
                reviewId:review?._id,
                productId:product?._id
            });
            
            if(data) {
                setAllReviews((prev)=> {
                    const newReviews=prev.filter((r)=> r._id !==data._id);
                    return newReviews;
                })
            }
            
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className=' w-full pl-1'>
        <div className=' flex gap-2'>
            <div className=' flex-between gap-1 flex-col'>
                <div className=''>
                    <div className=' relative h-12 w-12 rounded-full'>
                        <Image
                            src={review?.reviewer?.photo}
                            className=' rounded-full'
                            alt='image'
                            layout='fill'
                        />
                    </div>
                </div>
                <div className=' h-full w-0.5 bg-gray-500 rounded-full' />
            </div>
            <div className=' flex flex-col gap-2 w-full'>
                <div className=' flex-between'>
                    <div className=' flex flex-col gap-0'>
                        <p className=''>{review?.reviewer?.username}</p>
                        <p className=' text-sm text-gray-500'>{moment(review?.createdAt).fromNow()}</p>
                    </div>
                    {review?.reviewer?._id===currUser?._id && (
                        <div className=' mr-4'>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Trash2Icon className=' size-5 text-red-500' />
                                </AlertDialogTrigger>
                                <AlertDialogContent className=''>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel className=' cancel'>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        className=' border-2 border-red-500 bg-red-500 hover:bg-red-600 text-white rounded-full px-8'
                                        onClick={()=> handleDelete()}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>
                <div className=' flex gap-2 -ml-2'>
                    {Array.from({length:5},(_,i)=> (
                        <div className='' key={i}>
                            {review?.rating >i ? (
                                <Image
                                    src="/used/star1.svg"
                                    className=''
                                    height={24}
                                    width={24}
                                    alt='image'
                                />
                            ):(
                                <Image
                                    src="/used/star2.svg"
                                    className=''
                                    height={24}
                                    width={24}
                                    alt='image'
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className='-ml-2'>
                    <p className=''>{review?.text}</p>
                </div>
                <div className='images px-2 -ml-2'>
                    <div className={`${review?.photos.length>0 ? " bg-white":""}  flex gap-4 relative snap-x snap-mandatory w-full overflow-x-auto no-scrollbar`}>
                        {review?.photos.length>0 && review?.photos.map((img,i)=> (
                            <div className=' snap-center shrink-0' key={i}>
                                <div className=' relative h-20 w-20'>
                                    <Image
                                        src={img}
                                        alt='image'
                                        className=''
                                        layout='fill'
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className=' flex gap-0'>
                    <div className='cursor-pointer' onClick={()=> handleLike()}>
                        {review?.likes.includes(currUser?._id) ? (
                            <Image
                                src="/used/heart-filled.svg"
                                alt='image'
                                height={24}
                                width={24}
                                className=''
                            />
                        ):(
                            <Image
                                src="/used/heart-gray.svg"
                                alt='image'
                                height={24}
                                width={24}
                                className=''
                            />
                        )}
                    </div>
                    <p className=' text-gray-600 text-sm'>{review?.likes.length}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductReview
