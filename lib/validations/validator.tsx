
import {z} from "zod"

export const SignInForm=z.object({
    email:z.string().email().nonempty({message:"this field is required"}),
    password:z.string().min(8,{message:'password must contain 8 chars'}).max(16,{message:'password should be less than 16'}),
})

export const SignUpForm=z.object({
    username:z.string().min(4,{message:'must contain 4 chars'}),
    email:z.string().email().nonempty({message:"this field is required"}),
    password:z.string().min(8,{message:'password must contain 8 chars'}).max(16,{message:'password should be less than 16'}),
    cpassword:z.string().min(8,{message:'password must contain 8 chars'}).max(16,{message:'password should be less than 16'})
})

export const AddressFormValidy=z.object({
    firstname:z.string().max(15,{message:"must not exceed 15 chars"}),
    pincode:z.string().nonempty({message:"pincode is required"}),
    state:z.string().nonempty({message:"this field is required"}),
    town:z.string(),
    houseNo:z.string().nonempty({message:"house no is required"}),
    area:z.string().nonempty({message:"pincode is required"}),
})

export const ResetPassValidity=z.object({
    password:z.string().min(8,{message:'password must contain 8 chars'}).max(16,{message:'password should be less than 16'}),
    cpassword:z.string().min(8,{message:'password must contain 8 chars'}).max(16,{message:'password should be less than 16'})
})

export const updateValidity=z.object({
    username:z.string().min(4,{message:'must contain 4 chars'}),
    email:z.string().email().nonempty({message:"this field is required"}),
})

const productSchema = z.object({
    color: z.string().min(1, { message: "please select the color" }),
    images: z.array(z.string()).nonempty({ message: "must contain at least one image" }),
    stock: z.string().min(1, { message: "must contain at least one product" }),
});


export const productValidity=z.object({
    title: z.string().min(3, { message: "title must contain 3 chars" }).max(500, { message: "must not exceed 100 chars" }),
    description: z.string(),
    cateogory: z.string().min(1,{message:"please select the cateogory"}),
    price: z.string().nonempty({message:"this field is required"}),
    discount: z.string(),
    tags: z.string().optional(),
    product1:  z.object({
        color: z.string().min(1, { message: "please select the color" }),
        images: z.array(z.string()).nonempty({ message: "must contain at least one image" }),
        stock: z.string().min(1, { message: "must contain at least one product" }),
    }),
    product2: z.object({
        color: z.string(),
        images: z.array(z.string()),
        stock: z.string().optional()
    }).optional()
})
