import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react'

interface ProductImagesProps {
    setSelectedImg:Dispatch<SetStateAction<string>>,
    selectedImg:string,
    selectedProdImgs:{ color: string, images: string[] } | undefined
}

const ProductImages = ({selectedImg,setSelectedImg,selectedProdImgs}:ProductImagesProps) => {

    if(!selectedProdImgs) return;

  return (
    <div className=' flex px-2 max-lg:px-2 w-full mx-auto -ml-2'>
        <div className=' flex flex-col gap-3 w-full max-md:mx-auto'>
            <div className=' relative max-md:mx-auto aspect-square h-[550px] md:h-[300px] lg:h-[500px] max-md:h-[400px] max-md:w-[400px] max-sm:h-96 max-sm:w-96 max-sm:flex-center w-full border border-gray-200 rounded-md'>
                <Image
                    src={selectedImg ? selectedImg : selectedProdImgs?.images[0]}
                    className=' rounded-md'
                    alt='image'
                    layout='fill'
                /> 
            </div>
            <div className=' mr-4'>
                <div className=' flex items-center max-sm:justify-between gap-6 max-sm:gap-3 px-2 w-full'>
                    {selectedProdImgs?.images.map((img,i)=> (
                        <div 
                            className={`small_img ${selectedProdImgs.images.length<4 ? " h-24 w-24 max-md:h-20 max-md:w-20" : " h-full w-full"} ${selectedImg===img ? " border-blue-500":" border-slate-800/60"}`} 
                            key={i} 
                            onClick={()=> setSelectedImg(img)}
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
        </div>
    </div>
  )
}

export default ProductImages
