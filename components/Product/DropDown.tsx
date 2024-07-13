"use client"
import React, { startTransition, useEffect,useState } from 'react'
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { ICateogory } from '@/lib/database/models/cateogory.model';
import { Input } from '../ui/input';
import { createCateogory, getAllCateogories } from '@/lib/database/actions/cateogory.actions';

interface DropdownProps {
  value?:string;
  handleChange?:()=>void;
}

const DropDown = ({value,handleChange}:DropdownProps) => {
  const [cateogories, setCateogories] = useState<ICateogory[]>([]);
  const [newCateogory, setNewCateogory] = useState('');

  const handleAdd=async()=> {


    if(newCateogory.trim() !=='') {
      const addedCat=await createCateogory({name:newCateogory.trim(),path:"/create"});
      
      setCateogories((prev)=> [...prev,addedCat]);
    }
  };

  useEffect(()=> {
    const newFunc=async()=> {
      const allCats=await getAllCateogories();
      setCateogories(allCats);
    }
    newFunc();
  },[]);
  
  return (
    <Select onValueChange={handleChange} defaultValue={value}>
      <SelectTrigger className="w-full focus:ring-0 focus:ring-offset-0 rounded-xl bg-slate-50 border-2 px-4 py-5 border-slate-300">
        <SelectValue placeholder="cateogory" />
      </SelectTrigger>
      <SelectContent className=''>
        {cateogories?.length>0 && cateogories?.map((cateogory,i)=> (
          <SelectItem value={cateogory?._id} key={i} className=''>
            {cateogory.name}
          </SelectItem>
        ))}
        <AlertDialog>
          <AlertDialogTrigger className=' text-blue-500 font-medium w-full text-base px-6 py-1 flex-start hover:bg-slate-100'>Add new cateogory</AlertDialogTrigger>
          <AlertDialogContent className=" bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Add new Cateogory</AlertDialogTitle>
              <AlertDialogDescription>
                <div className=' flex flex-col gap-4 text-black'>
                  <p className=''>Add a cateogory related to shopping like mens wear,watches</p>
                  <Input 
                    placeholder='eg:watches'
                    value={newCateogory}
                    onChange={(e)=>setNewCateogory(e.target.value)}
                    className=' focus-visible:ring-0 focus-visible:ring-offset-0 border-2 border-solid border-gray-500'
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className=' cancel'>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={()=> startTransition(handleAdd)} className='submit hover:bg-blue-500'>Add cateogory</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectContent>
    </Select>
  )
}

export default DropDown