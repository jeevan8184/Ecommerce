"use client"
import Loader from '@/components/Cart/Loader';
import { UserContext } from '@/components/Auth/UserProvider';
import { useContext } from 'react';
import UserImg from '@/components/Profile/UserImg';
import ProfileAcc from '@/components/Profile/ProfileAcc';
import ProfileProducts from '@/components/Profile/ProfileProducts';

const Profile = () => {

  const {currUser}=useContext(UserContext);
  // if(!currUser) return <Loader />

  return (
    <div className='mt-1.5 max-sm:mt-0.5 mx-auto max-w-7xl py-4 px-3 xl:px-0 pb-20'>
      <div className=' flex gap-8 max-md:flex-col'>
        <UserImg />
        <div className=' flex flex-col gap-4 w-full'>
          <ProfileAcc />
          <ProfileProducts />
        </div>
      </div>
    </div>
  )
}

export default Profile;
