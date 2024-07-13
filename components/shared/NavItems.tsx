import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '../ui/button'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"  
import SignIn from '../Auth/SignIn'
import SignUp from '../Auth/SignUp'

const NavItems = () => {
    const [isSignIn, setIsSignIn] = useState(false);

  return (
            <div className=''>
                <div className=' max-sm:hidden'>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button 
                                className=' rounded-full px-6 bg-blue-500/100 text-white max-sm:bg-blue-500/100' variant={null}
                            >
                                Login
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle  className=' mx-auto'>{isSignIn ? 'Sign In':'Sign Up'}</DialogTitle>
                            <DialogDescription>
                                {isSignIn ? (
                                    <SignIn setIsSignIn={setIsSignIn} />
                                ):(
                                    <SignUp setIsSignIn={setIsSignIn} />
                                )}
                            </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className=' sm:hidden'>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button 
                                className=' rounded-full px-6'
                            >
                                Login
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                            <DrawerTitle  className=' mx-auto'>{isSignIn ? 'Sign In':'Sign Up'}</DrawerTitle>
                            <DrawerDescription>
                                {isSignIn ? (
                                    <SignIn setIsSignIn={setIsSignIn} />
                                ):(
                                    <SignUp setIsSignIn={setIsSignIn} />
                                )}
                            </DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter>
                            {/* <Button>Submit</Button>
                            <DrawerClose>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose> */}
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
  )
}

export default NavItems