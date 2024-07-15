"use client"
import React, { useContext, useEffect } from 'react'
import {LogOutIcon,SearchIcon,ShoppingCart, TruckIcon} from 'lucide-react'
import { GiShoppingBag } from "react-icons/gi";
import { usePathname, useRouter } from 'next/navigation';
import NavItems from './NavItems';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
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
  
import Image from 'next/image';
import { UserContext } from '../Auth/UserProvider';
import { deleteUSer, getUser } from '@/lib/database/actions/user.actions';
import { Input } from '../ui/input';
import { useDispatch } from 'react-redux';
import { getRecentView } from '@/lib/redux/actions';
import SearchProducts from '../ProductDetails/SearchProducts';
import {toast} from 'react-hot-toast';

const Navbar = () => {
    const router=useRouter();
    const {currUser,setCurrUser}=useContext(UserContext);
    const dispatch=useDispatch();
    const pathname=usePathname();

    const isProducts=pathname.includes("products");

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

    const allCarts=currUser?.cartItems.reduce((acc:any,cart:any)=> {
        return acc+cart.quantity;
    },0);

    console.log("currUser",currUser);
    
  return (
    <div className=' w-full bg-white shadow-md fixed top-0 px-2 py-1.5 max-sm:p-1 max-sm:px-4 xl:px-20 z-50'>
        <div className=' flex-between'>
            <div className=' flex-center gap-1 px-2 rounded-xl -left-px -ml-4 cursor-pointer' onClick={()=> router.push('/')}>
                <GiShoppingBag className=' text-5xl text-orange-500' />
                <h1 className=' text-4xl text-orange-500/75 opacity-90 underline-offset-8 font-bold rounded-full capitalize'>Shopify</h1>
            </div>
            <SearchProducts />
            <div className=' flex gap-6 max-sm:gap-4 items-center'>
                {!currUser ? (
                    <NavItems />
                ):(
                    <div className=''>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className=' flex items-center flex-col -mt-1'>
                                    <div className=' relative h-11 w-11 cursor-pointer rounded-full'>
                                        <Image
                                            src={currUser?.photo}
                                            className='rounded-full bg-white'
                                            layout='fill'
                                            alt='image'
                                        />
                                    </div>
                                    <p className={` text-[13px] font-medium max-sm:hidden leading-none ${isProducts ? " max-sm:hidden":" flex"}`}>{currUser?.username}</p>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={()=> currUser && router.push('/profile')} className=' cursor-pointer'>Profile</DropdownMenuItem>
                                <DropdownMenuItem onClick={()=> currUser && router.push("/orders")} className=' cursor-pointer sm:hidden'>Orders</DropdownMenuItem>
                                <DropdownMenuItem className=' h-full w-full' asChild>
                                    <AlertDialog>
                                        <AlertDialogTrigger className=' w-full h-full px-2 py-1 rounded-sm active:bg-red-500/10 hover:bg-red-500/10 '>
                                            <div className='  flex gap-2 items-center'>
                                                <LogOutIcon className=' size-5' />
                                                <p className=' text-red-500'>logout</p>
                                            </div>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className=' alert'>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure you want to logout ? </AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className=' flex-end flex-row gap-4'>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction 
                                                className=' bg-red-500 text-white hover:bg-red-600 px-5 py-0 rounded'
                                                onClick={()=> {
                                                    deleteUSer();
                                                    setCurrUser(null);
                                                    dispatch(getRecentView("",pathname));
                                                    router.push("/");
                                                }}
                                            >
                                                Logout
                                            </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
                <div className=' flex gap-6 items-center py-1 mr-2'>
                    <div className=' max-sm:hidden flex flex-col gap-0 items-center cursor-pointer'>
                        <TruckIcon className='font-normal text-black h-7 w-7' onClick={()=> currUser && router.push('/orders')} />
                        <span className=' text-[13px]'>Orders</span>
                    </div>
                    <div className=' flex flex-col gap-0 items-center cursor-pointer'>
                        <div className=' relative' onClick={()=> currUser && router.push(`/cart?success=${true}`)} >
                            <ShoppingCart className=' text-black font-normal h-8 w-8' />
                            <p className='cart_number '>{allCarts !==0 && allCarts}</p>
                        </div>
                        <span className=' text-[13px]'>cart</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar
