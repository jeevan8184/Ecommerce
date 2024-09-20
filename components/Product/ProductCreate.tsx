import React, { useContext, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { GiShoppingBag } from 'react-icons/gi'
import { Textarea } from '../ui/textarea'
import { productValidity } from '@/lib/validations/validator'
import { productInitVals } from '@/lib/constants'
import DropDown from './DropDown'
import ImagesUpload from './ImagesUpload'
import {ClipboardList, IndianRupee, MoveLeftIcon, Percent, TagsIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { createProduct } from '@/lib/database/actions/product.actions'
import { UserContext } from '../Auth/UserProvider';
import {toast} from 'react-hot-toast';

const ProductCreate = () => {

  const [anotherProd, setAnotherProd] = useState(false);
  const router=useRouter();
  const pathname=usePathname();
  const {currUser}=useContext(UserContext);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof productValidity>>({
    resolver: zodResolver(productValidity),
    defaultValues:productInitVals
  })
   
  async function onSubmit(values: z.infer<typeof productValidity>) {

    const productImgs=[]


    productImgs.push(values.product1);
    if(values?.product2?.images && values?.product2?.images.length>0 && values?.product2?.color) {
      console.log("values",values);
      productImgs.push(values?.product2);
    }

    try {
      const data=await createProduct({
        creator:currUser?._id,
        title:values.title,
        description:values.description,
        cateogory:values.cateogory,
        price:values.price,
        discount:values.discount,
        path:pathname,
        tags:values?.tags,
        productImgs
      })
      if(data) {
        toast.success("product created!.");
        form.reset();
        router.push("/product");
      }else{
        setError("Some Error occured please try again.");
        setTimeout(()=> {
          setError("");
        },2500);
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className=' flex flex-col flex-1 gap-8 px-2 pt-4'>
        <div className=' flex flex-col gap-3'>
          <div className=' flex flex-col gap-2'>
            <div className=' flex-center gap-1 px-2 rounded-xl -left-px -ml-4'>
              <GiShoppingBag className=' text-5xl text-orange-500' />
              <h1 className=' text-4xl text-orange-500/75 opacity-90 underline-offset-8 font-bold rounded-full capitalize'>Shopify</h1>
            </div>
            <p className=' flex-center font-medium text-lg'>Welcome to shopify</p>
          </div>
          <div className=' flex flex-col gap-1 flex-1'>
            <h1 className=' text-2xl font-semibold font-arial'>Create a Product</h1>
            <p className=' text-base font-medium text-[15px]'>You can create a product and you can sell in shopify with a good profit</p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-16">
            <div className=' flex-between items-center gap-6 max-sm:flex-col max-sm:gap-3'>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className=' w-full'>
                    <FormLabel className=' ml-1 font-medium text-base' >Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="title" 
                        {...field} 
                        className=' input_line focus-visible:ring-0 focus-visible:ring-offset-0'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cateogory"
                render={({ field }) => (
                  <FormItem className=' w-full'>
                    <FormLabel className=' ml-1 font-medium text-base' >Cateogory</FormLabel>
                    <FormControl>
                      <DropDown 
                        value={field.value} 
                        handleChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className=' flex-between gap-6 max-sm:flex-col max-sm:gap-3'>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className=' w-full'>
                    <FormLabel className=' ml-1 font-medium text-base' >description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="description" 
                        {...field} 
                        rows={8}
                        className=' input_line rounded-full focus-visible:ring-0 focus-visible:ring-offset-0'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className=' flex flex-col gap-4'>
              <p className=' font-semibold'>Add your product images and color of the product</p>
              <p className=''>1.</p>
              <div className='flex flex-col gap-4 ml-2 px-2'>
                <div className='flex-between items-center gap-6 max-sm:flex-col max-sm:gap-3'>
                  <FormField
                    control={form.control}
                    name="product1.color"
                    render={({ field }) => (
                      <FormItem className=' w-full'>
                        <FormLabel className=' ml-1 font-medium text-base' >Color of the product</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="color" 
                            {...field} 
                            className=' bg-slate-50 border-2 px-4 py-5 border-slate-300 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="product1.stock"
                    render={({ field }) => (
                      <FormItem className=' w-full'>
                        <FormLabel className=' ml-1 font-medium text-base' >Add product stock</FormLabel>
                        <FormControl>
                          <div className=' flex items-center gap-1 border-2 border-slate-300 bg-slate-50 rounded-full px-6'>
                            <ClipboardList />
                            <Input
                              placeholder="stock" 
                              type='number'
                              {...field} 
                              className=' bg-slate-50 border-none px-4 py-5 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0'
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="product1.images"
                  render={({ field }) => (
                    <FormItem className=' w-full'>
                      <FormLabel className=' ml-1 font-medium text-base' >Upload your product Images</FormLabel>
                      <FormControl>
                        <ImagesUpload 
                          value={field.value}
                          handleChange={(images:string[]) => field.onChange(images)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>
              {!anotherProd && (
                <p 
                  className=' font-semibold text-sm text-blue-500 cursor-pointer ml-3' 
                  onClick={()=> setAnotherProd(true)}
                >
                  Add product with another color
                </p>
              )}
            </div>
            {anotherProd && (
              <div className=' flex flex-col gap-4'>
                <p className=''>2.</p>
                <div className='flex flex-col gap-4 ml-2 px-2'>
                <div className='flex-between items-center gap-6 max-sm:flex-col max-sm:gap-3'>
                  <FormField
                    control={form.control}
                    name="product2.color"
                    render={({ field }) => (
                      <FormItem className=' w-full'>
                        <FormLabel className=' ml-1 font-medium text-base' >Color of the product</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="color" 
                            {...field} 
                            className=' bg-slate-50 border-2 px-4 py-5 border-slate-300 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="product2.stock"
                    render={({ field }) => (
                      <FormItem className=' w-full'>
                        <FormLabel className=' ml-1 font-medium text-base' >Add product stock</FormLabel>
                        <FormControl>
                          <div className=' flex items-center gap-1 border-2 border-slate-300 bg-slate-50 rounded-full px-6'>
                            <ClipboardList />
                            <Input
                              placeholder="stock" 
                              type='number'
                              {...field} 
                              className=' bg-slate-50 border-none px-4 py-5 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0'
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="product2.images"
                  render={({ field }) => (
                    <FormItem className=' w-full'>
                      <FormLabel className=' ml-1 font-medium text-base' >Upload your product Images</FormLabel>
                      <FormControl>
                        <ImagesUpload 
                          value={field.value}
                          handleChange={(images:string[]) => field.onChange(images)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <p 
                  className=' font-semibold text-sm text-blue-500 cursor-pointer ml-3' 
                  onClick={()=> setAnotherProd(false)}
                >
                  remove product with this color
                </p>
              </div>
            )}
            <div className=' flex-between items-center gap-6 max-sm:flex-col max-sm:gap-3'>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className=' w-full'>
                    <FormLabel className=' ml-1 font-medium text-base' >Add your product price</FormLabel>
                    <FormControl>
                      <div className=' flex items-center gap-1 border-2 border-slate-300 bg-slate-50 rounded-full px-4'>
                        <IndianRupee />
                        <Input
                          placeholder="price" 
                          type='number'
                          {...field} 
                          className=' bg-slate-50 border-none px-4 py-5 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0'
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className=' flex-between gap-6 max-sm:flex-col max-sm:gap-3'>
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem className=' w-full'>
                    <FormLabel className=' ml-1 font-medium text-base' >discount of the product in (%)</FormLabel>
                    <FormControl>
                      <div className=' flex items-center gap-1 border-2 border-slate-300 bg-slate-50 rounded-full px-4'>
                        <Percent />
                        <Input
                          placeholder="discount" 
                          type='number'
                          {...field} 
                          className=' bg-slate-50 border-none px-4 py-5 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0'
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className=' w-full'>
                    <FormLabel className=' ml-1 font-medium text-base' >Add tags to your product </FormLabel>
                    <FormControl>
                      <div className=' flex items-center gap-1 border-2 border-slate-300 bg-slate-50 rounded-full px-6'>
                        <TagsIcon />
                        <Input
                          placeholder="Eg : electronics,mobiles" 
                          {...field} 
                          className=' bg-slate-50 border-none px-4 py-5 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0'
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className=' flex-between pt-11'>
                <button onClick={(e)=> {
                  e.preventDefault();
                  form.reset();
                  router.back();
                }} 
                className=' cancel text-black'>cancel</button>
                <button 
                    className='submit' 
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    onClick={form.handleSubmit(onSubmit)}
                >
                    {form.formState.isSubmitting ? "Submitting": "Submit"}
                </button>
            </div>
            <div className=' font-medium text-red-500 flex-center'>{error}</div>
          </form>
        </Form>
    </div>
  )
}

export default ProductCreate
