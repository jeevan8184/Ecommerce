import React, { useContext, useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '../ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import { UserContext } from '../Auth/UserProvider';

const NavItems = () => {
    const [isSignIn, setIsSignIn] = useState(false);
    const { currUser, setShowPopup, showPopup,isPopup,setIsPopup } = useContext(UserContext);

    useEffect(() => {
        if (!currUser) {
            setShowPopup(true);
        }
        const handleClick=(e:any)=>{
            const popup =document.querySelector('.popup');
            if(popup && !popup.contains(e.target)) {
                    setShowPopup(false);
            }
        }
        window.addEventListener('click',handleClick);

        return()=>{
            window.removeEventListener('click',handleClick);
        }
    }, [currUser, setShowPopup]);

    useEffect(()=> {
        if(isPopup) {
            setTimeout(()=> setIsPopup(false),2000);
        }
    },[isPopup]);


    return (
        <div className=''>
            <div className=' max-sm:hidden relative items-center'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className='rounded-full px-6 bg-blue-500 text-white max-sm:bg-blue-500'
                            variant={null}
                        >
                            Login
                        </Button>
                    </DialogTrigger>
                    {(showPopup || isPopup) && (
                        <div className="absolute mt-1 -left-3/4 w-full max-w-xl popup">
                            <div className="relative bg-orange-400 text-white w-60 rounded-md shadow-lg px-2 py-1 pb-2">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-4 h-4 bg-orange-400 rotate-45"></div>
                                </div>
                                <p className='text-center font-medium'>Welcome to Shopify</p>
                                <p className='text-center text-[15px]'>Please login or signup</p>
                            </div>
                        </div>
                    )}
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className='mx-auto'>{isSignIn ? 'Sign In' : 'Sign Up'}</DialogTitle>
                            <DialogDescription>
                                {isSignIn ? (
                                    <SignIn setIsSignIn={setIsSignIn} />
                                ) : (
                                    <SignUp setIsSignIn={setIsSignIn} />
                                )}
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='sm:hidden relative'>
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button className='rounded-full px-6'>
                            Login
                        </Button>
                    </DrawerTrigger>
                    {(showPopup || isPopup) && (
                        <div className="absolute mt-1 -left-1/2 w-full max-w-xl popup">
                            <div className="relative bg-orange-400 text-white w-40 rounded-md shadow-lg px-2 py-1 pb-2">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-4 h-4 bg-orange-400 rotate-45"></div>
                                </div>
                                {/* <p className='text-center font-medium'>Welcome to Shopify</p> */}
                                <p className='text-center text-[15px]'>Please login or signup</p>
                            </div>
                        </div>
                    )}
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle className='mx-auto'>{isSignIn ? 'Sign In' : 'Sign Up'}</DrawerTitle>
                            <DrawerDescription>
                                {isSignIn ? (
                                    <SignIn setIsSignIn={setIsSignIn} />
                                ) : (
                                    <SignUp setIsSignIn={setIsSignIn} />
                                )}
                            </DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    );
};

export default NavItems;
