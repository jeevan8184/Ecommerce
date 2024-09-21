"use client"
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';
import { ArrowUpRight, HandCoins, HandHeart, IndianRupee, TrendingUp, Undo2Icon } from 'lucide-react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ImgsPage = () => {
  return (
    <div className='mt-1.5 max-sm:mt-0.5'>
      <div className=' overflow-hidden'>
        <Carousel  
          showThumbs={false} 
          showStatus={false} 
          infiniteLoop
          useKeyboardArrows 
          autoPlay 
          interval={1500} 
          // stopOnHover 
          swipeable
          className='rounded-xl max-sm:-mb-3' 
          showIndicators={true}
          transitionTime={500}
          >
          <div className='  flex justify-center gap-10 max-sm:gap-1 py-8 bg-gradient-to-r from-teal-500/70 from-5% via-white/50 to-90% to-blue-500/50 '>
            <div className='pl-1.5 flex flex-col gap-1 text-xl max-sm:text-[16px] leading-8 max-sm:leading-6'>
              <h2 className='text-2xl font-bold max-sm:text-lg'>Starting at just ₹999</h2>
              <p className=''>Exciting launches from</p>
              <p className=' max-sm:flex-center'>top brands</p>
              {/* <br /> */}
              <p className=''>Bluetooth calling and</p>
              <p className=''><strong className='font-bold uppercase'>AMOLED</strong> display</p>
            </div>
            <div className='relative aspect-square h-56 w-96 max-sm:h-56 max-sm:w-56'>
              <Image
                src="/assets/watch.png"
                alt='image'
                layout='fill'
                className=' rounded-xl bg-blue-500/30'
              />
            </div>
          </div>
          
          <div className='flex-center gap-48 max-sm:gap-3 bg-gradient-to-r from-cyan-500/70 from-5% via-indigo-500/50 to-90% to-cyan-700/40'>
            <div className='pl-1.5 font-semibold flex flex-col gap-1 text-xl max-sm:text-[17px] leading-8 max-sm:leading-6 text-white'>
              <h2 className='text-2xl font-bold max-sm:text-xl'>New model dresses</h2>
              <p className=''>New collections from our top brands</p>
              <br />
              <p className=''>starting from ₹599</p>
              <p className='max-sm:hidden'>all types of womens wear</p>
              <div className='flex gap-4 text-[13px] pt-2'>
                <div className='flex flex-row gap-1'>
                  <HandCoins className='p-1 rounded-sm bg-white text-black' />
                  <div className='flex flex-col leading-none gap-1'>
                    <span className='uppercase'>pay on</span>
                    <span className='uppercase'>delivery</span>
                  </div>
                </div>
                <div className='w-0.5 rounded-full bg-white' />
                <div className='flex flex-row gap-1'>
                  <Undo2Icon className='p-1 gap-1 rounded-sm bg-white text-black' />
                  <div className='flex flex-col leading-none gap-1'>
                    <span className='uppercase'>easy</span>
                    <span className='uppercase'>returns</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='relative aspect-square h-72 w-40'>
              <Image
                src="/assets/dress1.jpg"
                alt='image'
                layout='fill'
                className=' rounded-xl bg-blue-500/30 bg-cover'
              />
            </div>
          </div>
          
          <div className='pl-1.5 py-6 max-sm:py-8 max-sm:pb-8 flex justify-center gap-32 max-sm:gap-3 bg-gradient-to-r from-white via-stone-400 to-charcoal-500'>
            <div className='flex flex-col gap-1 text-xl max-sm:text-[17px] leading-8 max-sm:leading-6'>
              <h2 className='text-2xl font-bold max-sm:text-xl'>Home appliances</h2>
              <p className=''>Experience the Next Generation</p>
              <p className='text-base font-bold'>Buy now from ₹1599</p>
              <p className='bg-white p-0.5 text-base max-sm:text-sm'>20% cashback on first <strong className=' max-sm:hidden'>order</strong></p>
              <div className=''>
                <p className='text-base max-sm:hidden'>table | remote</p>
              </div>
              <p className='pt-2 text-base'>BLDC Fans with remote control</p>
            </div>
            <div className='relative aspect-square h-60 w-96 max-sm:h-48 max-sm:w-72 rounded-xl'>
              <Image
                src="/assets/fan.png"
                alt='image'
                layout='fill'
                className=' rounded-xl bg-blue-500/30 bg-contain'
              />
            </div>
          </div>

          <div className='py-6 flex justify-center gap-48 max-sm:gap-3 bg-gradient-to-r from-yellow-300/30 from-40% via-yellow-300/80 to-orange-300/20 shadow-lg'>
            <div className='pl-1.5 flex flex-col gap-1 text-xl max-sm:text-[17px] leading-8 max-sm:leading-6'>
              <h2 className='text-2xl font-bold max-sm:text-xl'>Under ₹499</h2>
              <p className='text-lg'>Sport Shoes</p>
              <br />
              <div className='flex justify-between text-[13px] gap-4 pt-2 w-full'>
                <div className='flex flex-row gap-1'>
                  <HandHeart className='p-1 rounded-sm bg-white text-black' />
                  <div className='flex flex-col leading-none gap-1'>
                    <span className='uppercase'>wide</span>
                    <span className='uppercase'>selection</span>
                  </div>
                </div>
                <div className='w-0.5 rounded-full bg-black' />
                <div className='flex flex-row gap-1'>
                  <IndianRupee className='p-1 gap-1 rounded-sm bg-white text-black' />
                  <div className='flex flex-col leading-none gap-1'>
                    <span className='uppercase'>great</span>
                    <span className='uppercase'>prices</span>
                  </div>
                </div>
              </div>
              <p className='pt-2'>All brands of shoes available</p>
            </div>
            <div className='relative aspect-square h-60 w-60 rounded-xl'>
              <Image
                src="/assets/shoes.png"
                layout='fill'
                className='transform -rotate-12 max-sm:rotate-0 rounded-xl border-2 border-yellow-400'
                alt='image'
              />
            </div>
          </div>

          <div className='text-white py-6 flex justify-center gap-48 max-sm:gap-3 bg-gradient-to-r from-gray-900/40 via-gray-900/90 to-orange-500/30'>
            <div className='pl-1.5 flex flex-col gap-1 text-xl max-sm:text-[17px] leading-8 max-sm:leading-6'>
              <h2 className='text-2xl font-bold max-sm:text-xl'>Best wireless EarPods</h2>
              <p className='text-lg'>Starting from ₹799</p>
              <br />
              <div className='flex justify-between text-[13px] gap-4 pt-2 w-full'>
                <div className='flex flex-row gap-1'>
                  <ArrowUpRight className='p-1 rounded-sm bg-white text-black' />
                  <div className='flex flex-col leading-none gap-1'>
                    <span className='uppercase'>exchange</span>
                    <span className='uppercase'>offer</span>
                  </div>
                </div>
                <div className='w-0.5 rounded-full bg-black' />
                <div className='flex flex-row gap-1'>
                  <TrendingUp className='p-1 gap-1 rounded-sm bg-white text-black' />
                  <div className='flex flex-col leading-none gap-1'>
                    <span className='uppercase'>latest</span>
                    <span className='uppercase'>trends</span>
                  </div>
                </div>
              </div>
              <p className='pt-2'>From top companies like boat</p>
            </div>
            <div className='relative aspect-square h-60 w-60 rounded-xl'>
              <Image
                src="/assets/podes.png"
                alt='image'
                layout='fill'
                className=' rounded-xl bg-blue-500/30 bg-contain'
              />
            </div>
          </div>
        </Carousel>
        

      </div>
    </div>
  );
};

export default ImgsPage;
