import { ISaveItems } from '@/lib/database/models/save.model'
import React, { Dispatch, SetStateAction } from 'react'
import SavedProduct from './SavedProduct'

interface SavedItemsProps {
  allSaved:ISaveItems[],
}

const SavedFile = ({allSaved}:SavedItemsProps) => {
  
  
  return (
          <div className=' flex flex-col gap-6 w-full h-full sm:px-2 py-6'>
            <div className=' w-full h-full shadow-md bg-white flex flex-col gap-0 border-t border-t-gray-100'>
                <h1 className=' text-2xl font-medium px-4 py-2'>Your Saved Items</h1>
                <div className=' px-6'>
                    <p className=' w-full h-[0.5px] bg-slate-400 rounded-full' />
                </div>
                {allSaved?.length>0 ? (
                  <div className=' pt-4 pb-1 px-2 lg:px-8'>
                    <div className=' flex flex-col gap-1'>
                      {allSaved?.map((savedItem,i)=> (
                          <SavedProduct 
                            key={i}
                            savedItem={savedItem}
                          />
                      ))}
                    </div>
                </div>
                ):(
                  <div className=' flex flex-col py-6 px-10'>
                    <h1 className=' text-xl font-medium'>No items saved for later</h1>
                  </div>
                )}

            </div>
          </div>
  )
}

export default SavedFile

{/* <p className=' w-full h-[0.5px] bg-slate-400 rounded-full' /> */}
