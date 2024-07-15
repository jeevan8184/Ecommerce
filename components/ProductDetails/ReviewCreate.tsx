import React, { Dispatch, SetStateAction, useCallback, useContext, useState } from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import Image from 'next/image'
import { UserContext } from '../Auth/UserProvider'
import { ImageIcon, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { IProduct } from '@/lib/database/models/product.model'
import { createReview } from '@/lib/database/actions/reviews.actions'
import { usePathname } from 'next/navigation'
import { IReview } from '@/lib/database/models/review.model'

interface ProductReviewProps {
    product:IProduct,
    setAllReviews:Dispatch<SetStateAction<IReview[]>>
}

const ReviewCreate = ({product,setAllReviews}:ProductReviewProps) => {
    const {currUser}=useContext(UserContext);
    const [text, setText] = useState("");
    const [stars, setStars] = useState(0);
    const [uploadedImgs, setuploadedImgs] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const pathname=usePathname();

    const onDrop=useCallback((acceptedFiles:any)=> {

        for(let i=0;i<acceptedFiles.length;i++) {

            const reader=new FileReader();
            reader.onload=async()=>{

                try {
                    setIsUploading(true);
                    const response=await fetch("/api/upload",{
                        method:"POST",
                        body:reader?.result
                    })
                    const data=await response.json();
                    setuploadedImgs((prev)=> [...prev,data]);
                } catch (error) {
                    console.log(error);
                }finally{
                    setIsUploading(false);
                }
            }
            reader.readAsDataURL(acceptedFiles[0]);
        }
    },[])

    const {getRootProps,getInputProps}=useDropzone({
        onDrop,
        accept:{"image/*":[]}
    })

    const handleSubmit=async()=>{

        try {
            const data=await createReview({
                userId:currUser?._id,
                productId:product?._id,
                text:text.trim(),
                rating:stars,
                path:pathname,
                photos:uploadedImgs
            })
            if(data) {
                setAllReviews((prev)=> [...prev,data]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    console.log("uploadedImgs1",uploadedImgs);

  return (
    <div className=' flex flex-col gap-4 px-2 w-full md:px-4 overflow-hidden'>
        <div className=' flex flex-col gap-4'>
            <div className=' w-full mx-auto'>
                <Button className=' bg-slate-300 w-11/12 hover:bg-slate-300 text-black'>write product review</Button>
            </div>
            <div className=' flex flex-col gap-4 px-2 py-2 rounded-xl border-2 border-gray-200'>
                <div className=' flex gap-2'>
                    <div className=' flex-between gap-1 flex-col'>
                        <div className=''>
                            <div className=' relative h-12 w-12 rounded-full'>
                                <Image
                                    src={currUser?.photo}
                                    className=' rounded-full'
                                    alt='image'
                                    layout='fill'
                                />
                            </div>
                        </div>
                        <div className=' h-full w-0.5 bg-gray-500 rounded-full' />
                    </div>
                    <div className=' flex flex-col py-1 gap-3 w-full'>
                        <div className=' flex flex-col gap-0 leading-5'>
                            <p className=''>{currUser?.username}</p>
                            <p className=' text-gray-400 text-sm'>5 days ago</p>
                        </div>
                        <div className=' flex flex-1 flex-col gap-2 w-full'>
                            <div className=' flex gap-3'>
                                {Array.from({length:5},(_,i)=> (
                                    <div className=' cursor-pointer' key={i} onClick={()=> setStars(i+1)}>
                                        {stars>i ? (
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
                            <Textarea 
                                placeholder='add a review' 
                                rows={5}
                                value={text}
                                onChange={(e)=> setText(e.target.value)}
                                className=' border-none xl:w-[90%] w-full focus-visible:ring-0 focus-visible:ring-offset-0'
                            />
                            <div className=' flex flex-col gap-4 w-[85%]'>
                                <div {...getRootProps()} className=' cursor-pointer'>
                                    <input {...getInputProps()} />
                                    <Button 
                                        className='flex gap-1.5 bg-white border-2 border-blue-500 text-blue-500 hover:bg-white rounded-xl px-6'
                                        disabled={isUploading}
                                    >
                                        <ImageIcon />{isUploading ? "adding image":"add image"}
                                    </Button>
                                </div>
                                <div className='images'>
                                    <div className={`${uploadedImgs?.length>0 ? " bg-white":""}  flex gap-4 relative snap-x snap-mandatory w-full overflow-x-auto no-scrollbar`}>
                                        {uploadedImgs?.length>0 && uploadedImgs.map((img,i)=> (
                                            <div className=' snap-center shrink-0' key={i}>
                                                <div className=' relative h-40 w-40'>
                                                    <Image
                                                        src={img}
                                                        alt='image'
                                                        className=' rounded-xl'
                                                        layout='fill'
                                                    />
                                                    <div 
                                                        className=' absolute top-0 right-0 p-1 rounded-full bg-gray-100 cursor-pointer' 
                                                        onClick={()=> {
                                                            setuploadedImgs((prev)=> {
                                                                const newVals=prev?.filter((url)=> url !==img);
                                                                return newVals;
                                                            })
                                                        }}
                                                    >
                                                        <X className=' size-5 font-semibold' />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {text && stars !=0 && (
                    <div className=' flex-between px-6'>
                        <button className=' cancel1' onClick={(e)=> {
                            e.preventDefault();
                            setuploadedImgs([]);
                            setText("");
                            setStars(0);
                        }}>cancel</button>
                        <button className=' submit1' onClick={()=> {
                            handleSubmit();
                            setuploadedImgs([]);
                            setText("");
                            setStars(0);
                        }}>submit</button>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default ReviewCreate
