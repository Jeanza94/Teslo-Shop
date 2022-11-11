

import { createContext } from 'react';
import { ICartProduct, ShippingAddress } from '../../interfaces';

interface ContextProps {
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    taxRate: number;
    total: number;
    isLoaded: boolean;

    shippingAddress?: ShippingAddress;

    addProductAtCart: (cartProduct: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeProductCart: (product: ICartProduct) => void;
    updateAddress: (address: ShippingAddress) => void;

    createOrder: () => Promise<{ hasError: boolean; message: string; }>
}

export const CartContext = createContext({} as ContextProps)