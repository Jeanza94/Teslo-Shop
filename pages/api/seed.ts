

import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from '../../database'
import { Order, Product, User } from '../../models';


type Data = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if (process.env.NODE_ENV === 'production') {
        return
    }

    try {
        db.connect();

        await User.deleteMany();
        await User.insertMany(seedDatabase.initialData.users)

        await Product.deleteMany();
        await Product.insertMany(seedDatabase.initialData.products);

        await Order.deleteMany();
        db.disconnect();
        res.status(200).json({ message: 'Data en la base de datos de mongo' })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'No se pudo insertar la data en mongo' })
    }

}