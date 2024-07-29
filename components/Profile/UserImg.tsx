import Image from 'next/image';
import { UserContext } from '@/components/Auth/UserProvider'
import { updateUser } from '@/lib/database/actions/user.actions';
import { SaveIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useContext, useState } from 'react'
import {useDropzone} from 'react-dropzone';

const UserImg = () => {

    const {currUser,setCurrUser}=useContext(UserContext);
    const [File, setFile] = useState<File[]>([]);
    const [picEdit, setPicEdit] = useState(false);
    const [imgUrl, setImgUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const pathname=usePathname();
    const router=useRouter();

    console.log("currUser",currUser);
  
    const onDrop=useCallback((acceptedFiles:any)=> {
      setFile(acceptedFiles);
      const reader=new FileReader();
      reader.onload=async()=>{
  
        try {
            setPicEdit(false);
            setIsUploading(true);
            const response=await fetch('/api/upload',{
                method:'POST',
                body:reader?.result
            })
            const data=await response.json();
            setImgUrl(data);
        } catch (error) {
            console.log(error);
        }finally{
            setIsUploading(false);
            setPicEdit(true);
        }
      }
      reader.readAsDataURL(acceptedFiles[0]);
    },[currUser]);
  
    const {getRootProps,getInputProps}=useDropzone({
      onDrop,
      accept:{'image/*':[]},
      multiple:false,
    })
  
    const handleChnage=async()=>{
  
      try {
        if(imgUrl) {
  
          const data=await updateUser({photo:imgUrl,path:pathname,id:currUser?._id});
          setCurrUser(data);
          setImgUrl('');
        }
      } catch (error) {
        console.log(error);
      }
    }
    
  return (
    <div className=' max-sm:px-16 flex-start max-md:flex-center '>
        <div className=' relative rounded-md py-2 pb-6 px-10 flex flex-col gap-2 md:bg-white md:shadow-2xl md:border md:border-gray-200 max-md:border-b'>
          <div className=' relative rounded-md flex-center px-4 py-6'>
            {File.length>0 ? (
              <div className='relative h-52 w-52 flex-center'>
               {isUploading ? (
                <div className=' animate-spin flex-center h-6 w-24 flex-center'>
                    <Image
                        src='/icons/loader.svg'
                        alt='loader'
                        layout='fill'
                        className=''
                    />
                </div>
               ):(
                <Image
                    src={URL.createObjectURL(File[0])}
                    className='rounded-full bg-white'
                    layout='fill'
                    alt='image'
                />
               )}
              </div>
            ):(
              <div className=''>
                {currUser?.photo ? (
                  <div className='relative h-52 w-52'>
                    <Image
                      src={currUser?.photo}
                      className='rounded-full bg-white'
                      layout='fill'
                      alt='image'
                    />
                  </div>
                ):(
                  <div className='relative h-52 w-52 '>
                    <Image
                      src="/assets/user1.png"
                      className='rounded-full bg-white bg-center cursor-pointer'
                      layout='fill'
                      alt='image'
                    />
                  </div>
                )}
              </div>
            )}
            <div className=' absolute bottom-4 flex-between gap-1 z-40 max-sm:bottom-2'>
              <div {...getRootProps()} className='edit'>
                <input {...getInputProps()} />
                  <div className=' flex gap-1'>
                    <Image
                      src="/icons/edit.svg"
                      alt='image'
                      height={18}
                      width={18}
                      className=''
                    />
                    <p className=' text-[#877EFF]'>Edit</p>
                </div>
              </div>
              {picEdit && (
                <div className='save' onClick={()=> {
                  handleChnage();
                  setPicEdit(false);
                }}>
                  <SaveIcon className=' size-5 max-sm:size-4' />
                  <p className=''>Save</p>
                </div>
              )}
            </div>
            
          </div>
          <div className=''>
            <div className=' flex flex-col gap-2'>
              <div className='  flex gap-1 items-center'>
                <strong>Username : </strong>
                <p className=' overflow-x-clip text-ellipsis whitespace-nowrap max-w-52 max-sm:max-w-36 text-sm'>{currUser?.username}</p>
              </div>
              <div className='  flex gap-1 items-center'>
                <strong>Email : </strong>
                <p className=' overflow-x-clip text-ellipsis whitespace-nowrap max-w-52 max-sm:max-w-36 text-sm'>{currUser?.authId?.email}</p>
              </div>
              <div className='  flex gap-1 items-center'>
                <strong>Type : </strong>
                <p className=' overflow-x-clip text-ellipsis whitespace-nowrap max-w-52 max-sm:max-w-36 text-sm'>{currUser?.userType}</p>
              </div>
              <p className=' font-semibold text-blue-500 cursor-pointer w-fit' onClick={()=> router.push(`/reset?email=${currUser?.authId.email}`)}>change password</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default UserImg;