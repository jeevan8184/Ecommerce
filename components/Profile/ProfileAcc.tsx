import React, { useContext, useEffect, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from '../ui/input';
import AddressForm from './AddressForm';
import { UserContext } from '../Auth/UserProvider';
import { updateMobileNo } from '@/lib/database/actions/user.actions';
import { usePathname } from 'next/navigation';
import UserUpdate from './UserUpdate';
import Image from 'next/image';
import { AddressParams } from '@/lib/constants/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { getAddress } from '@/lib/redux/actions';


const ProfileAcc = () => {
    const [mobileNo, setMobileNo] = useState('');
    const {currUser,setCurrUser}=useContext(UserContext);
    const [isUpdate, setIsUpdate] = useState(false);
    const pathname=usePathname();
    const dispatch=useDispatch();
    const address=useSelector((state:any)=> state.address.address);

    useEffect(()=>{
        if(currUser) {
            dispatch(getAddress(currUser?._id,pathname));
        }
    },[currUser,dispatch]);

    const InitVals={
        firstname:currUser?.username,
        pincode:"",
        state:"",
        town:"",
        house:"",
        area:"",
        houseNo:""
    }

    const [AddressInitVals, setAddressInitVals] = useState<AddressParams>(InitVals);

    const handleNumber=async()=>{

        try {
            if(mobileNo) {
                const data=await updateMobileNo({path:pathname,id:currUser?._id,mobileNo});
                setCurrUser(data);
                setMobileNo('');

            }
        } catch (error) {
            console.log(error);
        }
    }

    
  return (
    <div className=' bg-white shadow-md w-full h-fit'>
        <Accordion type="single" collapsible className='  w-full h-fit px-2 rounded-md'>
            <AccordionItem value="item-1" className=''>
                <AccordionTrigger className=' hover:no-underline' onClick={()=> {
                    setMobileNo(currUser?.mobileNo);
                }}>Add Mobile Number</AccordionTrigger>
                <AccordionContent id='acc' className=' w-full flex h-fit px-2'>
                        <div className=' w-96'>
                            <Input
                                autoFocus
                                type='number'
                                placeholder=''
                                value={mobileNo}
                                onChange={(e)=> setMobileNo(e?.target?.value)}
                                className=' flex-grow border-t-0 border-r-0 border-l-0 rounded-none border-b-2 border-b-slate-900 focus:border-b-accent-foreground focus-visible:ring-0 focus-visible:ring-offset-0'
                            />
                        </div>
                        <button 
                            className='active:bg-blue-600 mt-1 ml-2 hover:bg-blue-500 px-6 py-1 text-white border-2 border-blue-500 rounded-full bg-blue-500 ' 
                            onClick={()=> {
                                handleNumber();
                            }}
                        >
                            Add
                        </button>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className=''>
                <AccordionTrigger className=' hover:no-underline'>Add address</AccordionTrigger>
                <AccordionContent className=' w-full h-fit'>
                    <div className=''>
                        {address !==null && (
                            <div className=' flex flex-col gap-2 md:mx-6 max-w-2xl text-base'>
                                <div className=' flex gap-3 px-3 max-sm:px-1 pl-8 py-2 border-2 rounded-xl border-orange-200 bg-orange-50/40'>
                                    <Image
                                        src="/used/location.svg"
                                        alt='image'
                                        height={30}
                                        width={30}
                                    />
                                    <div className=' flex gap-0 items-center'>
                                        <p className=''><strong> {address?.name} </strong>
                                            {address?.houseVal}, {address?.area} , {address?.city.toUpperCase()} , {address?.state.toUpperCase()} , {address?.pinCode}
                                        </p>
                                    </div>
                                </div>
                                <p 
                                    className=' text-blue-500 font-medium cursor-pointer w-fit text-sm py-2' 
                                    onClick={()=> {
                                        setAddressInitVals({
                                            firstname:address?.name!,
                                            pincode:address?.pinCode.toString()!,
                                            state:address?.state!,
                                            town:address?.city!,
                                            houseNo:address?.houseVal!,
                                            area:address?.area!,
                                        });
                                        setIsUpdate(true);
                                    }}
                                >
                                    update address
                                </p>
                            </div>
                        )}
                        {(address===null || isUpdate) && (
                            <AddressForm 
                                AddressInitVals={AddressInitVals}
                                setIsUpdate={setIsUpdate}
                                isUpdate={isUpdate}
                                setAddressInitVals={setAddressInitVals}
                            /> 
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className=''>
                <AccordionTrigger className=' hover:no-underline'>Update user profile</AccordionTrigger>
                <AccordionContent className=' w-full h-fit'>
                    <UserUpdate />
                </AccordionContent>
            </AccordionItem>
        </Accordion>

    </div>
  )
}

export default ProfileAcc
