"use client"
import Footer from '@/components/Cart/Footer'
import Dresses from '@/components/shared/Dresses'
import Electronics from '@/components/shared/Electronics'
import HeadPhones from '@/components/shared/HeadPhones'
import HomeItems from '@/components/shared/HomeItems'
import HomeMaps from '@/components/shared/HomeMaps'
import ImgsPage from '@/components/shared/ImgsPage'
import RecentlyViewed from '@/components/shared/RecentlyViewed'

const HomePage =() => {
 

  return (
    <div className=' w-full h-full overflow-hidden flex flex-col bg-slate-50'>
      <div className=' pb-20'>
        <div className=' flex flex-col gap-1'>
          <HomeMaps />
          <ImgsPage />
          <div className=' flex flex-col pt-4 gap-2 max-w-[1400px] w-full mx-auto'>
            <Electronics />
            <Dresses />
            <HeadPhones />
            <HomeItems />
            <RecentlyViewed />
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

export default HomePage
