import React, { Suspense, useContext, useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { HistoryIcon, SearchIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import Loader from '../Cart/Loader';
import { searchCats } from '@/lib/constants';

const SearchProductsSuspense = () => {
  
  const [text, setText] = useState("");
  const searchParams=useSearchParams();
  const router=useRouter();
  const [isFocused, setIsFocused] = useState(false);

  useEffect(()=> {
    const debounceFn=setTimeout(()=> {
      let newUrl="";
      if(text) {
        newUrl=formUrlQuery({
          params:searchParams.toString(),
          key:'query',
          value:text
        })
      }else{
        newUrl=removeKeysFromQuery({
          params:searchParams.toString(),
          keysToRemove:['query']
        })
      }
      router.push(newUrl,{scroll:false})
    },100)

    return ()=>clearTimeout(debounceFn);
  },[text,router,searchParams])

  const handleSearch=()=>{
    setIsFocused(false);
    const query=searchParams.get('query');
    if(query !==null) {
      router.push(`/search?query=${query}`);
    }else{
      router.push("/");
    }
  }
    
  return (
          <div className=' max-md:hidden mx-4 w-full'>
            <div className='border-2 focus:border-orange-400 rounded-full max-w-xl border-orange-400 flex items-center gap-0 relative'>
              <Input 
                  className='max-w-xl w-full focus-visible:ring-0 focus-visible:ring-offset-0 border-2 rounded-full pl-6 border-none'
                  placeholder='search product..'
                  value={text}
                  onChange={(e)=> setText(e.target.value)}
                  onKeyDown={(e)=> e.key==='Enter' && handleSearch()}
                  onFocus={()=> setIsFocused(true)}
                  onBlur={()=> setTimeout(()=> setIsFocused(false),500)}
              />
              {isFocused && (
                <div className=' w-full absolute -bottom-[195px] px-2'>
                  <div className=' bg-white shadow-md border-t border-t-gray-200 px-4 py-2 rounded-md'>
                    <div className=' flex flex-col gap-2'>
                      <p className=' text-[15px] font-medium'>search cateogories</p>
                      <div className=' flex flex-col gap-1'>
                        {searchCats.map(({label,link},i)=> (
                          <div 
                            className=' flex flex-col gap-1 cursor-pointer hover:bg-gray-100 px-1 py-0.5 rounded-sm' 
                            key={i}
                            onClick={(e)=> {
                              console.log("activating");
                              e.preventDefault();
                              setIsFocused(true);
                              router.push(`/products/${link}`);
                            }}
                          >
                            <div className=' flex gap-2'>
                              <HistoryIcon className=' font-normal' />
                              <p className=''>{label}</p>
                            </div>
                            <span className=' h-[1px] w-full bg-gray-300 rounded-full'></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div 
                className=' p-2 bg-orange-400 active:bg-orange-500 cursor-pointer rounded-t-full rounded-b-full rounded-l-none rounded-tl-none'
                onClick={()=> handleSearch() }
              >
                  <SearchIcon className=' text-white' />
              </div>

            </div>
          </div>
  )
}

const SearchProducts=()=>{
  return(
    <Suspense fallback={<Loader />}>
      <SearchProductsSuspense />
    </Suspense>
  )
}

export default SearchProducts
