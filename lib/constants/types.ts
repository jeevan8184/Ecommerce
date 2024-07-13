import { ICateogory } from "../database/models/cateogory.model"
import { IProduct } from "../database/models/product.model"
import { IUser } from "../database/models/user.model"


export type AuthSignUpVals={
    username:string,
    password:string,
    cpassword:string,
    email:string
}

export type AuthSignInVals={
    email:string,
    password:string
}

export type SessionParams={
    authId:string,
    token:string,
    expiresAt:Date
}

export type createUserParams={
    username:string,
    authId:string
}

export type updateUserParams={
    photo?:string,
    id:string,
    path:string
}

export type updateMobileNoParams={
    path:string,
    mobileNo:string,
    id:string
}

export type AuthResetPassParams={
    password:string,
    cpassword:string,
    path:string,
    email:string
}

export type updateProfileParams={
    id:string,
    path:string,
    username:string,
    userType:string,
    email:string
}

export type createCateogoryParams={
    path:string,
    name:string,
}

export type createProductParams={
    title:string,
    cateogory:string,
    description:string,
    discount:string,
    price:string,
    tags?:string,
    productImgs:{ color: string; images: string[],stock?:string, }[],
    path:string,
    creator:string
}

export type createCartParams={
    productId:string,
    userId:string,
    quantity:string,
    color:string,
    cartImgs:string[],
    path:string
}

export type checkCartParams={
    color:string,
    productId:string,
    userId:string,
    path:string,
    quantity:string
}

export type createSaveParams={
    productId:string,
    userId:string,
    quantity:string,
    color:string,
    savedImsgs:string[],
    path:string,
    cartId:string
}

export type deleteCartParams={
    cartId:string,
    userId:string,
    path:string
}

export type cartQuantityParams={
    cartId:string,
    userId:string,
    path:string,
    quantity:string
}

export type deleteSavedParams={
    savedId:string,
    userId:string,
    path:string
}

export type moveToCartParams={
    userId:string,
    path:string,
    productId:string,
    color:string,
    savedId:string
}

export type createReviewParams={
    userId:string,
    productId:string,
    text:string,
    rating:number,
    path:string,
    photos:string[]
}

export type likeReviewParams={
    userId:string,
    path:string,
    reviewId:string
}

export type deleteReviewParams={
    reviewId:string,
    path:string,
    productId:string
}

export type getProductByColorParams={
    productId:string,
    color:string,
    path:string,
    quantity:string
}

export type IItems={
    allImgs:{ color: string, images: string[],stock: number },
    avgRating:number,
    cateogory:ICateogory,
    color:string,
    creator:IUser,
    product:IProduct,
    quantity:number,
    cartId?:string
}

export type createAddressParams={
    userId:string,
    state:string,
    pinCode:number,
    city:string,
    area:string,
    houseNo:string,
    name:string,
    path:string
}

export type updateAddressParams={
    userId:string,
    state:string,
    pinCode:number,
    city:string,
    area:string,
    houseNo:string,
    name:string,
    path:string
}

export type AddressParams={
    firstname:string,
    pincode:string,
    state:string,
    town:string,
    houseNo:string,
    area:string,
    mobileNo?:string
}

export type createNewOrderParams={
    userId:string,
    shippingInfo:{
        username:string,
        pinCode:number,
        state:string,
        city:string,
        houseVal:string,
        area:string,
        mobileNo:number
    },
    allItems:IItems[],
    cartIds?:(string | undefined)[],
    path:string
}

export type formUrlParams={
    params:string,
    key:string,
    value:string | null
}

export type RemoveUrlQueryParams={
    params:string,
    keysToRemove:string[]
}

export type searchParamsProps={
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

export type CheckoutItemsParams={
    photo:string,
    name:string,
    discount:number,
    price:number,
    quantity:number
}

export type createRecentViewParams={
    userId:string,
    productId:string,
    path:string
}

export type getCateogoryProductsParams={
    cateogory:string,
    path:string,
    pageno:number,
    limit?:number,
    sortPrice:number,
    discount:number,
    rating:number,
    price:number
}

export type getAllProductsParams={
    cateogory:string,
    path:string,
    sortPrice:number,
    discount:number,
    rating:number,
    price:number
}

export type getProductsParams={
    query:string,
    path:string,
    sortPrice:number,
    discount:number,
    rating:number,
    price:number
}

export type getSearchProductsParams={
    query:string,
    path:string,
    pageno:number,
    limit?:number,
    sortPrice:number,
    discount:number,
    rating:number,
    price:number
}
