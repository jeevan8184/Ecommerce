"use client"
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../ui/button';
import { CloudUpload, FileText, ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

interface ImagesUploadParams {
    value:string[],
    handleChange:(images:string[])=>void
}

const ImagesUpload = ({value,handleChange}:ImagesUploadParams) => {

    const [isUploading, setIsUploading] = useState(false);
    const [newImg, setNewImg] = useState(false);

    const scroll=useRef<HTMLDivElement>(null)

    useEffect(()=> {
        if(newImg && scroll?.current) {
            scroll?.current.scrollIntoView({ behavior: "smooth" });
        }
        return ()=>setNewImg(false);
    },[newImg]);

    const onDrop=useCallback(async(acceptedFiles:any)=>{
        let newImages = [...value];

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
                    newImages.push(data);
                    handleChange(newImages);

                    setNewImg(true);

                } catch (error) {
                    console.log(error);
                }finally{
                    setIsUploading(false);
                }
            }
            reader.readAsDataURL(acceptedFiles[i]);
        }
    },[value,handleChange])

    const {getRootProps,getInputProps}=useDropzone({
        onDrop,
        accept:{"image/*":[]},
        multiple:true,
        maxFiles:8
    })

    const handleRemoveImage = (index: number) => {
        const newImages = [...value];
        newImages.splice(index, 1);
        handleChange(newImages);
    };

  return (
    <div className=' flex max-md:flex-col gap-8'>
        <div className=' max-w-xl lg:w-1/2  bg-slate-50 rounded-xl px-4 py-10 flex-center border-2 border-dashed border-slate-300'>
            <div {...getRootProps()} className=' w-96'>
                <input {...getInputProps()} />
                <div className=''>
                    <div className=' text-gray-500 font-medium flex-center flex-col gap-2 text-sm'>
                        <CloudUpload className='font-semibold font-serif text-xl size-12' />
                        <h1 className=' text-base'>Upload an Image</h1>
                        <Button 
                            onClick={(e)=> e.preventDefault() } 
                            className='submit hover:bg-blue-500 flex gap-1'
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <ImageIcon className=' size-5' />
                                    uploading..
                                </>
                                ):(
                                    <>
                                        <ImageIcon className=' size-5' />
                                        upload
                                    </>
                                )
                            }
                        </Button>
                        <div className=' flex-center flex-col gap-3 py-3'>
                            <p className=''>upload an image of SVG,JPG or PNG format</p>
                            <p className=''>drag and drop an image here or click to select a file</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className={`images ${value?.length>0 ? "bg-gray-100":""}`}>
            <div className='relative w-full snap-x overflow-x-auto flex gap-10 flex-row no-scrollbar'>
                {value?.length>0 && value.map((url,i)=> (
                    <div className=' snap-center shrink-0' key={i}>
                        <div className=' relative h-72 w-72'>
                            <Image
                                src={url}
                                alt='image'
                                className=' h-full w-full rounded-xl bg-center bg-contain'
                                layout='fill'
                            />
                            <div 
                                className=' absolute top-0 right-0 p-1 rounded-full bg-gray-100 cursor-pointer' 
                                onClick={()=> handleRemoveImage(i)}
                            >
                                <X className=' size-5 font-semibold' />
                            </div>
                        </div>
                    </div>
                )) }
                <div ref={scroll} />
            </div>
        </div>
    </div>
  )
}

export default ImagesUpload
