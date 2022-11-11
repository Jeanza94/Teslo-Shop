
import type { NextApiRequest, NextApiResponse } from 'next'
import { Order, Product, User } from '../../../models';
import { IOrder, IProduct, IUser } from '../../../interfaces';
import { db } from '../../../database';


type Data =
    | { message: string }
    | {
        numberOfOrders: number;
        payOrders: number;
        notPaidOrders: number;
        numberOfClients: number
        numberOfProducts: number;
        productsWithNoInventory: number;
        lowInventory: number;
    }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {



    await db.connect();
    try {

        // const orders: IOrder[] = await Order.find().lean();
        // const clients: IUser[] = await User.find({ role: 'client' }).lean();
        // const products: IProduct[] = await Product.find().lean();

        const [orders, clients, products] = await Promise.all([
            await Order.find().lean(),
            await User.find({ role: 'client' }).lean(),
            await Product.find().lean(),
        ])

        await db.disconnect();

        const payOrders = orders.filter(order => order.isPaid === true).length;
        const notPaidOrders = orders.filter(order => order.isPaid === false).length;
        const productsWithNoInventory = products.filter(product => product.inStock === 0).length;
        const lowInventory = products.filter(product => product.inStock <= 10).length;

        return res.status(200).json({
            numberOfOrders: orders.length,
            payOrders,
            notPaidOrders,
            numberOfClients: clients.length,
            numberOfProducts: products.length,
            productsWithNoInventory,
            lowInventory,
        })
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Bad Request' })
    }
}