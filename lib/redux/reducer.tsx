
import {AnyAction} from 'redux'
import { ADDRESS, ALLPRODUCTS, RECENTVIEW, SEARCHPRODUCTS,GETRELATED, GETRELATEDCART, ALLCARTS, ALLSAVED, ALLORDERS } from '@/lib/constants/index'
import {IAddress} from '@/lib/database/models/address.model'
import { IRecentView } from '../database/models/recentView.model'
import { IProduct } from '../database/models/product.model'
import { ICart } from '../database/models/cart.model'
import { ISaveItems } from '../database/models/save.model'
import { IProductOrder } from '../database/models/order.model'

interface InitialStateParams {
    address:IAddress | null,
    allRecent:IRecentView | null,
    allProducts:IProduct[] | null,
    searchProducts:IProduct[] | null,
    getRelated:IProduct[] | null,
    getRelatedCart:IProduct[] | null,
    allCarts:ICart[] | null,
    allSaved:ISaveItems[] | null,
    allOrders:IProductOrder[] | null
}

const InitialState:InitialStateParams={
    address:null,
    allRecent:null,
    allProducts:null,
    searchProducts:null,
    getRelated:null,
    getRelatedCart:null,
    allSaved:null,
    allCarts:null,
    allOrders:null
} 

const reducer=(state=InitialState,action:AnyAction)=>{

    switch (action.type) {
        case ADDRESS:
            return {...state,address:action?.payload}
        case RECENTVIEW:
            return {...state,allRecent:action?.payload}
        case ALLPRODUCTS:
            return {...state,allProducts:action?.payload}
        case SEARCHPRODUCTS:
            return {...state,searchProducts:action?.payload}
        case GETRELATED:
            return {...state,getRelated:action?.payload}
        case GETRELATEDCART:
            return {...state,getRelatedCart:action?.payload}
        case ALLCARTS:
            return {...state,allCarts:action?.payload}
        case ALLSAVED:
            return {...state,allSaved:action?.payload}
        case ALLORDERS:
            return {...state,allOrders:action?.payload}
        default:
            return state
    }
}

export default reducer;
