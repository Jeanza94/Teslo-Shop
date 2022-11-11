

import { FC, PropsWithChildren, useReducer, useEffect, useState } from 'react';
import Cookie from 'js-cookie'

import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import { tesloApi } from '../../api';
import axios from 'axios';

export interface CartState {
    isLoaded: boolean
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    taxRate: number;
    total: number;
    shippingAddress?: ShippingAddress
}



const CART_INITIAL_STATE: CartState = {
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    taxRate: 0,
    total: 0,
    isLoaded: false,
    shippingAddress: undefined
}

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);



    useEffect(() => {
        try {

            const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []
            dispatch({ type: '[Cart]-LoadCart from cookies | storage', payload: cookieProducts })

        } catch (error) {
            dispatch({ type: '[Cart]-LoadCart from cookies | storage', payload: [] })
        }
    }, []);

    useEffect(() => {

        if (Cookie.get('firstName')) {
            const address = {
                firstName: Cookie.get('firstName') || '',
                lastName: Cookie.get('lastName') || '',
                address: Cookie.get('address') || '',
                address2: Cookie.get('address2') || '',
                zip: Cookie.get('zip') || '',
                city: Cookie.get('city') || '',
                country: Cookie.get('country') || '',
                phone: Cookie.get('phone') || '',
            }
            dispatch({ type: '[Cart]-LoadAddress from cookies', payload: address })
        }

    }, [])



    useEffect(() => {
        if (state.cart.length > 0) {
            Cookie.set('cart', JSON.stringify(state.cart))
        }
    }, [state.cart])

    useEffect(() => {

        const numberOfItems = state.cart.reduce((previous, current) => previous + current.quantity, 0)
        const subTotal = state.cart.reduce((previous, current) => previous + (current.quantity * current.price), 0)
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const orderSummary = {
            numberOfItems,
            subTotal,
            taxRate: subTotal * taxRate,
            total: subTotal * (taxRate + 1)
        }

        dispatch({ type: '[Cart]-Update order summary', payload: orderSummary });


    }, [state.cart])




    const addProductAtCart = (cartProduct: ICartProduct) => {

        const productInCart = state.cart.some(p => p._id === cartProduct._id);
        if (!productInCart) return dispatch({ type: '[Cart]-Updates products in cart', payload: [...state.cart, cartProduct] });

        const productInCartButDifferenceSize = state.cart.some(p => p._id === cartProduct._id && p.size === cartProduct.size);
        if (!productInCartButDifferenceSize) return dispatch({ type: '[Cart]-Updates products in cart', payload: [...state.cart, cartProduct] });

        //Acumular
        const updatedProducts = state.cart.map(p => {

            if (p._id !== cartProduct._id) return p;

            if (p.size !== cartProduct.size) return p;

            //actualizad la cantidad
            p.quantity += cartProduct.quantity;
            return p;
        })

        dispatch({ type: '[Cart]-Updates products in cart', payload: [...updatedProducts] })
    }

    const removeProductCart = (product: ICartProduct) => {
        dispatch({ type: '[Cart]-Remove product cart', payload: product })
    }

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({ type: '[Cart]-Change cart quantity', payload: product })
    }

    const updateAddress = (address: ShippingAddress) => {
        Cookie.set('firstName', address.firstName)
        Cookie.set('lastName', address.lastName)
        Cookie.set('address', address.address)
        Cookie.set('address2', address.address2 || '')
        Cookie.set('zip', address.zip)
        Cookie.set('city', address.city)
        Cookie.set('country', address.country)
        Cookie.set('phone', address.phone)
        dispatch({ type: '[Cart]-updateAddress from cookies', payload: address })
    }

    const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {

        if (!state.shippingAddress) {
            throw new Error('No hay dirección de entrega');
        }

        const body: IOrder = {
            orderItems: state.cart.map(product => ({
                ...product,
                size: product.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            taxRate: state.taxRate,
            total: state.total,
            isPaid: false
        }

        try {
            const { data } = await tesloApi.post<IOrder>('/orders', body);
            console.log({ data });

            //todo dispatch para vaciar el carrito y limpiar todo 
            dispatch({ type: '[Cart]-Order Complete' });
            return {
                hasError: false,
                message: data._id!
            }


        } catch (error) {
            console.log(error)

            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'Erron no controlado, hable con el administrador'
            }
        }
    }

    return (
        <CartContext.Provider value={{
            ...state,
            addProductAtCart,
            updateCartQuantity,
            removeProductCart,
            updateAddress,

            //orders
            createOrder,
        }}>
            {children}
        </CartContext.Provider>
    )
}