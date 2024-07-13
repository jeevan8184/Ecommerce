
import { 
    ADDRESS, 
    ALLPRODUCTS, 
    RECENTVIEW,
    SEARCHPRODUCTS,
    GETRELATED,
    GETRELATEDCART, 
    ALLCARTS,
    ALLSAVED,
    ALLORDERS
} from "@/lib/constants";
import { getUserAddress } from "../database/actions/address.actions";
import { Dispatch } from "redux";
import { getUserRecentView } from "../database/actions/recentView.actions";
import { getCateogoryProducts, getRelatedCarts, getRelatedProducts, getSearchProducts } from "../database/actions/product.actions";
import { getAllProductsParams, getProductsParams } from "../constants/types";
import { getAllUsercarts } from "../database/actions/cart.actions";
import { getAllUserSave } from "../database/actions/save.actions";
import { getAllUserOrders } from "../database/actions/order.actions";

interface AddressAction {
    type:typeof ADDRESS,
    payload:any
}

interface RecViewAction {
    type:typeof RECENTVIEW,
    payload:any
}

interface AllProductsAction {
    type:typeof ALLPRODUCTS,
    payload:any
}

interface GetProducts {
    type: typeof SEARCHPRODUCTS,
    payload:any
}

interface GetRelated {
    type:typeof GETRELATED,
    payload:any
}

interface GetRelatedCart {
    type:typeof GETRELATEDCART,
    payload:any
}

interface GetAllCart {
    type:typeof ALLCARTS,
    payload:any
}

interface GetAllSaved {
    type:typeof ALLSAVED,
    payload:any
}

interface GetAllOrders {
    type:typeof ALLORDERS,
    payload:any
}


export const getAddress=(userId:string,path:string):any=>async(dispatch:Dispatch<AddressAction>)=>{

    try {
        const data=await getUserAddress(userId,path);
        dispatch({type:ADDRESS,payload:data});
    } catch (error) {
        console.log(error);
    }
}

export const getRecentView=(userId:string,path:string):any=>async(dispatch:Dispatch<RecViewAction>)=>{

    try {
        const data=await getUserRecentView(userId,path);
        dispatch({type:RECENTVIEW,payload:data});
    } catch (error) {
        console.log(error);
    }
}

export const getAllProducts=({cateogory,path,sortPrice,discount,rating,price}:getAllProductsParams):any=>async(dispatch:Dispatch<AllProductsAction>)=>{

    try {
        console.log("trigerr");
        const data=await getCateogoryProducts({
            cateogory:cateogory.toLowerCase(),
            path,
            pageno:1,
            limit:10,
            sortPrice,
            discount,
            rating,
            price:price
        });
        console.log("data",data);
        dispatch({type:ALLPRODUCTS,payload:data.allProducts});
    } catch (error) {
        console.log(error);
    }
}

export const getProducts=({query,path,sortPrice,discount,rating,price}:getProductsParams):any=>async(dispatch:Dispatch<GetProducts>)=>{

    try {

        const data=await getSearchProducts({
            query,
            path,
            pageno:1,
            limit:10,
            sortPrice,
            discount,
            rating,
            price:price
        });
        dispatch({type:SEARCHPRODUCTS,payload:data});

        console.log("getSearchProducts",data);
    } catch (error) {
        console.log(error);
    }
}

export const getRelated=(productId:string,path:string):any=>async(dispatch:Dispatch<GetRelated>)=>{

    try {
        const data=await getRelatedProducts(productId,path);
        dispatch({type:GETRELATED,payload:data});
    } catch (error) {
        console.log(error);
    }
}

export const getRelatedCart=(userId:string,path:string):any=>async(dispatch:Dispatch<GetRelatedCart>)=>{

    try {
        const data=await getRelatedCarts(userId,path);
        dispatch({type:GETRELATEDCART,payload:data});
    } catch (error) {
        console.log(error);
    }
}

export const getAllCarts=(userId:string,path:string):any=>async(dispatch:Dispatch<GetAllCart>)=>{

    try {
        const data=await getAllUsercarts(userId,path);
        dispatch({type:ALLCARTS,payload:data});
    } catch (error) {
        console.log(error);
    }
}

export const getAllSaved=(userId:string,path:string):any=>async(dispatch:Dispatch<GetAllSaved>)=>{

    try {
        const data=await getAllUserSave(userId,path);
        dispatch({type:ALLSAVED,payload:data});
    } catch (error) {
        console.log(error);
    }
}

export const getAllOrders=(userId:string,path:string):any=>async(dispatch:Dispatch<GetAllOrders>)=>{

    try {
        const data=await getAllUserOrders(userId,path);
        dispatch({type:ALLORDERS,payload:data});
    } catch (error) {
        console.log(error);
    }
}
