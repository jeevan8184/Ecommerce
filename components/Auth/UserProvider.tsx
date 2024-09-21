"use client"
import { getUser } from '@/lib/database/actions/user.actions';
import { IUser } from '@/lib/database/models/user.model';
import React, { createContext, useEffect, useState } from 'react'

export const UserContext=createContext<any>(null);

const UserProvider = ({children}:{children:React.ReactNode}) => {
    const [currUser, setCurrUser] = useState<IUser | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [isPopup, setIsPopup] = useState(false);

    useEffect(()=> {
        const newFunc=async()=>{

            try {
                const data=await getUser();
                setCurrUser(data);
            } catch (error) {
                console.log(error);
            }
        }
        newFunc();
    },[])

  return (
     <UserContext.Provider value={{
        currUser,
        setCurrUser,
        setShowPopup,
        showPopup,
        isPopup, setIsPopup
     }}>
        {children}
     </UserContext.Provider>
  )
}

export default UserProvider
