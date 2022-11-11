

import { ICartProduct, ShippingAddress } from '../../interfaces';
import { CartState } from './';

type CartActionType =
    | { type: '[Cart]-LoadCart from cookies | storage', payload: ICartProduct[] }
    | { type: '[Cart]-Updates products in cart', payload: ICartProduct[] }
    | { type: '[Cart]-Change cart quantity', payload: ICartProduct }
    | { type: '[Cart]-Remove product cart', payload: ICartProduct }
    | { type: '[Cart]-LoadAddress from cookies', payload: ShippingAddress }
    | { type: '[Cart]-updateAddress from cookies', payload: ShippingAddress }
    | {
        type: '[Cart]-Update order summary',
        payload: {
            numberOfItems: number;
            subTotal: number;
            taxRate: number;
            total: number;
        }
    }
    | { type: '[Cart]-Order Complete' }

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
    switch (action.type) {
        case '[Cart]-LoadCart from cookies | storage':
            return {
                ...state,
                cart: [...action.payload],
                isLoaded: true
            }

        case '[Cart]-Updates products in cart':

            return {
                ...state,
                cart: [...action.payload]
            }

        case '[Cart]-Change cart quantity':

            return {
                ...state,
                cart: state.cart.map(product => {
                    if (product._id !== action.payload._id) return product;
                    if (product.size !== action.payload.size) return product;

                    return action.payload;
                })
            }

        case '[Cart]-Remove product cart':
            return {
                ...state,
                cart: state.cart.filter(product => {
                    return !(product._id === action.payload._id && product.size === action.payload.size)
                })
            }

        case '[Cart]-Update order summary':
            return {
                ...state,
                ...action.payload
            }

        case '[Cart]-LoadAddress from cookies':
        case '[Cart]-updateAddress from cookies':
            return {
                ...state,
                shippingAddress: action.payload
            }

        case '[Cart]-Order Complete':
            return {
                ...state,
                cart: [],
                numberOfItems: 0,
                subTotal: 0,
                taxRate: 0,
                total: 0
            }




        default:
            return state;
    }
}