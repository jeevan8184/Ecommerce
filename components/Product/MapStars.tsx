import Image from 'next/image'
import React from 'react'

const MapStars = ({full,half}:{full:number,half:number}) => {

  return (
    <div className=' flex py-1'>
        {Array.from({length:full},()=> (
        <div className=''>
            <Image
            src="/used/star1.svg"
            alt='image'
            height={20}
            width={20}
            className=''
            />
        </div>
        ))}
        {Array.from({length:half},()=> (
        <div className=''>
            <Image
            src="/used/star2.svg"
            alt='image'
            height={20}
            width={20}
            className=''
            />
        </div>
        ))}
    </div>
  )
}

export default MapStars