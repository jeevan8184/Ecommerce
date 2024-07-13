import { ICart } from '@/lib/database/models/cart.model'
import React, { Dispatch, SetStateAction } from 'react'
import CartProduct from './CartProduct'
import { Button } from '../ui/button';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface CartFileProps {
    allCarts:ICart[],
}

const CartFile = ({allCarts}:CartFileProps) => {

    const router=useRouter();

    const itemsCnt=allCarts?.reduce((acc:any,cart:any)=> {
        return acc+cart?.quantity
    },0);

    const itemsPrice=allCarts?.reduce((acc:any,cart:any)=> {
        return acc+(cart.quantity*(Number(cart?.product?.price)-Number(cart?.product?.price*Number((cart?.product?.discount))/100)));
    },0);


  return (
        <div className=' flex flex-col w-full h-full sm:px-2 py-8'>
            <div className=' w-full h-full shadow-md bg-white border-t border-t-gray-100 flex flex-col gap-0 border'>
                <div className=' flex-between'>
                    <h1 className=' text-2xl font-medium px-4 py-2'>Your Cart Items</h1>
                    {allCarts?.length>0 && (
                        <Button 
                            className=' bg-yellow-400 rounded-xl mr-4 hover:bg-yellow-500'
                            onClick={()=> router.push("/buy")}
                        >
                            proceed to buy
                        </Button>
                    )}
                </div>
                <div className=' px-6'>
                    <p className=' w-full h-[0.5px] bg-slate-400 rounded-full' />
                </div>
                {allCarts?.length>0 ? (
                    <>
                    <div className=' pt-1 pb-1 lg:px-8 px-2'>
                        <div className=' flex flex-col gap-1'>
                            {allCarts?.map((cart,i)=> (
                                <div className=' flex flex-col' key={i}>
                                    <CartProduct 
                                        cart={cart} 
                                    />
                                    <p className=' w-full h-[0.5px] bg-slate-400 rounded-full' />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className=' flex flex-col py-2 w-full flex-end float-end'>
                        <div className=' flex gap-4 px-16 max-sm:px-4 max-md:items-center'>
                            <Button className=' rounded-xl px-6 bg-orange-400 hover:bg-orange-500' onClick={()=> router.push("/buy")}>Buy {itemsCnt} items </Button>
                            <h1 className=' pb-4 text-xl font-normal'>Subtotal({itemsCnt} items) : <strong>{formatCurrency(itemsPrice)}</strong></h1>
                        </div>
                        <div className=' px-6'>
                            <p className=' w-full h-[0.5px] bg-slate-400 rounded-full' />
                        </div>
                    </div>
                    </>
                ):(
                    <div className=' w-full py-6 px-10'>
                        <h1 className=' text-xl font-medium'>No Items found in your cart</h1>
                    </div>
                )}
            </div>
        </div>
  )
}

export default CartFile
