"use server"

import Stripe from 'stripe'
import { redirect } from "next/navigation";
import { connectToDB } from "..";
import { CheckoutItemsParams, createNewOrderParams, IItems } from '@/lib/constants/types';
import Cart from '../models/cart.model';
import User from '../models/user.model';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import Product from '../models/product.model';
import Cateogory from '../models/cateogory.model';
import ProductOrder from '../models/order.model';

export const checkoutOrder = async ({ CheckoutItems, orderId }: { CheckoutItems: CheckoutItemsParams[], orderId: string }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  console.log("window",window.location.origin);
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: CheckoutItems?.map((item, i) => {
        const discount = Number(item?.price * Number(item?.discount) / 100);
        const tax = discount * (0.6 / 100);
        const unitAmount = Math.round((item?.price - discount + tax) * 100);

        return {
          price_data: {
            currency: "inr",
            unit_amount: unitAmount,
            product_data: {
              images: [item.photo],
              name: item.name,
            },
          },
          quantity: item.quantity,
        };
      }),
      mode: 'payment',
      success_url: `${window.location.origin}/orders?success=${true}&orderId=${orderId}`,
      cancel_url: `${window.location.origin}/orders?success=${false}`,
    });

    redirect(session.url!);
  } catch (error) {
    throw error;
  }
};
  
export const createNewOrder=async({userId,shippingInfo,allItems,cartIds,path}:createNewOrderParams)=>{

  try {
    await connectToDB();
    
    const tax = allItems.reduce((acc, item) => {
      const itemTax = Number(item?.product?.price * Number(item?.product?.discount) / 100) * (0.6 / 100);
      return acc + itemTax;
    }, 0);

    const price = allItems.reduce((acc, item) => {
      const discountedPrice = item.product?.price - Number(item?.product?.price * Number(item?.product?.discount) / 100);
      const itemTax = Number(item?.product?.price * Number(item?.product?.discount) / 100) * (0.6 / 100);
      return acc + discountedPrice + itemTax;
    }, 0);

    const newOrder=await ProductOrder.create({
      orderProducts:allItems.map((item)=> ({
        product:item?.product._id,
        photo:item?.allImgs?.images[0],
        quantity:item?.quantity,
        color:item?.allImgs?.color,
      })),
      user:userId,
      shippingInfo,
      createdAt:Date.now(),
      updatedAt:Date.now(),
      totalPrice:Math.round(price),
      taxPrice:Math.round(tax)
    })

    await Promise.all([
      cartIds?.map(async(id)=> {
        if(id !==undefined) {
          const existCart=await Cart.findByIdAndDelete(id);
          await User.updateOne({_id:existCart?.user},{$pull:{cartItems:existCart?._id}});
        }
      })
    ])

    await User.updateOne({_id:userId},{$push:{orderItems:newOrder._id}});

    console.log("newOrder",newOrder);
    revalidatePath(path);
    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    console.log(error);
  }
}

export const getAllUserOrders = async (userId: string, path: string) => {
  try {
    await connectToDB();

    const allOrders=await ProductOrder.find({user:userId})
      .populate({
        path:"orderProducts.product",
        model:Product,
        populate:{
          path:"cateogory",
          model:Cateogory,
          select:"_id name"
        }
      }).sort({updatedAt:"desc"});

    revalidatePath(path);
    return JSON.parse(JSON.stringify(allOrders));
  } catch (error) {
    console.log(error);
  }
};

export const updateOrderPayment=async(orderId:string,path:string)=>{

  try {
    console.log("payment",orderId);
    await connectToDB();
    const existOrder=await ProductOrder.findByIdAndUpdate(orderId,{
        isPaid:true,
        paidAt:Date.now(),
        orderStatus:"processing"
      },
      {new:true}
    )

    console.log("updateOrderpayment",existOrder);
    revalidatePath(path);
    return JSON.parse(JSON.stringify(existOrder));
  } catch (error) {
    console.log(error);
  }
}

export const updateOrderDelivery=async(orderId:string,path:string)=>{

  try {
    await connectToDB();
    const existOrder=await ProductOrder.findByIdAndUpdate(orderId,{
        isDelivered:true,
        orderStatus:"shipped",
        deliveredAt:Date.now(),
      },
      {new:true}
    )
    .populate({
      path:"orderProducts.product",
      model:Product,
      populate:{
        path:"cateogory",
        model:Cateogory,
        select:"_id name"
      }
    })
    
    console.log("updateOrderDelivery",existOrder);
    revalidatePath(path);
    return JSON.parse(JSON.stringify(existOrder));
  } catch (error) {
    console.log(error);
  }
}

export const deleteOrder=async(orderId:string,path:string)=>{

  try {
    await connectToDB();
    const existOrder=await ProductOrder.findByIdAndDelete(orderId);

    await User.updateOne({_id:existOrder.user},{$pull:{orderItems:existOrder._id}});

    revalidatePath(path);
    return JSON.parse(JSON.stringify(existOrder));
  } catch (error) {
    console.log(error);
  }
}

export const cancelOrder=async(orderId:string,path:string)=>{

  try {
    await connectToDB();
    
    const existOrder=await ProductOrder.findByIdAndUpdate(orderId,{
        isCancel:true
      },
      {new:true}
    )
    .populate({
      path:"orderProducts.product",
      model:Product,
      populate:{
        path:"cateogory",
        model:Cateogory,
        select:"_id name"
      }
    })

    console.log("cancelOrder",existOrder);
    revalidatePath(path);
    return JSON.parse(JSON.stringify(existOrder));
  } catch (error) {
    console.log(error);
  }
}


